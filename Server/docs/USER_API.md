# User API Documentation

This document describes the API endpoints for user management in the AfroLingo application.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a Firebase authentication token in the Authorization header:

```
Authorization: Bearer <firebase_token>
```

## Endpoints

### Create User

Creates a new user in the database after Firebase authentication.

**Endpoint:** `POST /api/users`

**Authentication:** Required

**Request Body:**

```json
{
  "firebaseUid": "string (required)",
  "email": "string (required, valid email)",
  "name": "string (required, min 2 characters)",
  "createdAt": "string (optional, ISO 8601 datetime)"
}
```

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "firebase-uid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Success Response (200 OK) - User Already Exists:**

```json
{
  "success": true,
  "message": "User already exists",
  "data": {
    "id": "firebase-uid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Error Response (401 Unauthorized):**

```json
{
  "success": false,
  "message": "No authentication token provided"
}
```

### Get User by ID

Retrieves a user's details including their progress.

**Endpoint:** `GET /api/users/:id`

**Authentication:** Optional

**URL Parameters:**

- `id` - The Firebase UID of the user

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "firebase-uid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "progress": [],
    "lessonProgress": [],
    "activityProgress": []
  }
}
```

**Error Response (404 Not Found):**

```json
{
  "success": false,
  "message": "User not found"
}
```

### Update User

Updates a user's profile information.

**Endpoint:** `PATCH /api/users/:id`

**Authentication:** Optional (should be required in production)

**URL Parameters:**

- `id` - The Firebase UID of the user

**Request Body:**

```json
{
  "email": "string (optional, valid email)",
  "name": "string (optional, min 2 characters)"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "firebase-uid-here",
    "email": "newemail@example.com",
    "name": "Jane Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

## Client Integration

The client-side integration is already implemented in the `AuthContext.tsx` file. When a user signs up:

1. Firebase creates the authentication account
2. The client automatically sends user details to the server
3. The server creates a database record
4. If the server request fails, the user can still access the app (Firebase auth is the source of truth)
5. The backend sync can be retried later

### Example Client-Side Usage

The signup function in `AuthContext.tsx` already handles this:

```typescript
const signup = async (name: string, email: string, password: string) => {
  // 1. Create Firebase user
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // 2. Update Firebase profile
  await firebaseUpdateProfile(userCredential.user, { displayName: name });

  // 3. Send to backend
  const token = await userCredential.user.getIdToken();
  await fetch(ENV.API_ENDPOINTS.USERS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      firebaseUid: userCredential.user.uid,
      email: userCredential.user.email,
      name: name,
      createdAt: new Date().toISOString(),
    }),
  });
};
```

## Environment Variables

The server requires the following environment variables in `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/afrolingo"
PGHOST=localhost
PGDATABASE=afrolingo
PGUSER=your_username
PGPASSWORD=your_password

# Firebase Admin (Optional - for token verification)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

## Setup Instructions

1. **Install Dependencies:**

   ```bash
   cd Server
   npm install
   ```

2. **Set Up Database:**

   ```bash
   # Generate Prisma Client
   npm run db:generate

   # Run migrations
   npm run db:migrate
   ```

3. **Start Development Server:**

   ```bash
   npm run dev
   ```

4. **Test the API:**
   ```bash
   curl http://localhost:3000/health
   ```

## Testing the User Creation Flow

1. Start the server: `npm run dev`
2. Run the client app
3. Sign up a new user
4. Check the database to verify the user was created
5. Check the server logs to see the request

## Next Steps

### Firebase Admin SDK Integration (Recommended for Production)

To properly verify Firebase tokens, install Firebase Admin SDK:

```bash
npm install firebase-admin
```

Update `src/middleware/auth.ts` to verify tokens:

```typescript
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.substring(7);
  const decodedToken = await admin.auth().verifyIdToken(token);
  req.user = decodedToken;
  next();
};
```

### Additional Features to Consider

1. **User Profile Pictures:** Add support for uploading and storing avatars
2. **User Preferences:** Store language preferences, learning goals, etc.
3. **Social Features:** Friend connections, leaderboards
4. **Analytics:** Track user engagement and progress
5. **Notifications:** Email/push notification preferences

## Error Handling

The API follows a consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

HTTP Status Codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found
- `500` - Internal Server Error
