# Server Setup Guide

This guide will help you set up the AfroLingo backend server to work with user authentication.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Firebase project configured (for authentication)

## Quick Start

### 1. Install Dependencies

```bash
cd Server
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update it with your credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your database and Firebase credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/afrolingo"
PGHOST=localhost
PGDATABASE=afrolingo
PGUSER=your_username
PGPASSWORD=your_password
```

### 3. Set Up the Database

Generate Prisma Client:

```bash
npm run db:generate
```

Run database migrations:

```bash
npm run db:migrate
```

### 4. Start the Development Server

```bash
npm run dev
```

The server should start on `http://localhost:3000`

### 5. Verify Installation

Test the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "AfroLingo Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Testing User Creation

### 1. Start the Server

```bash
npm run dev
```

### 2. Start the Client App

In a new terminal:

```bash
cd Client
npm start
```

### 3. Sign Up a New User

1. Open the app on your device/emulator
2. Navigate to the Sign Up screen
3. Fill in the form and submit
4. Check the server logs - you should see:

```
POST /api/users 201 - User created successfully
```

### 4. Verify in Database

You can use Prisma Studio to view the database:

```bash
npm run db:studio
```

This will open a browser window where you can see the newly created user in the `users` table.

## API Endpoints

### User Endpoints

- `POST /api/users` - Create a new user (authenticated)
- `GET /api/users/:id` - Get user by Firebase UID
- `PATCH /api/users/:id` - Update user profile

See [USER_API.md](./USER_API.md) for detailed API documentation.

## Client Configuration

Make sure your client app has the correct API URL configured in `Client/config/env.ts`:

```typescript
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
```

For iOS simulator: `http://localhost:3000/api`  
For Android emulator: `http://10.0.2.2:3000/api`  
For physical device: `http://YOUR_COMPUTER_IP:3000/api`

## Troubleshooting

### Database Connection Issues

**Error:** `Cannot connect to PostgreSQL`

**Solution:**

1. Verify PostgreSQL is running: `pg_ctl status`
2. Check your database credentials in `.env`
3. Ensure the database exists: `createdb afrolingo`

### Prisma Issues

**Error:** `Prisma Client not found`

**Solution:**

```bash
npm run db:generate
```

**Error:** `Migration failed`

**Solution:**

```bash
# Reset the database (WARNING: This will delete all data)
npm run db:reset
```

### CORS Issues

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
The server is configured to allow all origins in development. For production, update the CORS configuration in `src/index.ts`.

### User Creation Fails

**Error:** `Failed to sync user with backend`

**Solution:**

1. This is a non-fatal error - the user is still created in Firebase
2. Check server logs for the actual error
3. Verify the server is running
4. Check the API endpoint URL in `Client/config/env.ts`

## Production Deployment

### Environment Variables

For production, set these additional variables:

```env
NODE_ENV=production
DATABASE_URL="your-production-database-url"
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email
```

### Security Considerations

1. **Enable Firebase Admin SDK** for proper token verification
2. **Configure CORS** to only allow your production domain
3. **Use environment-specific database credentials**
4. **Enable SSL/TLS** for database connections
5. **Set up proper logging and monitoring**

### Deploy to Vercel/Railway/Render

The server is ready to deploy to any Node.js hosting platform:

1. **Vercel:**

   ```bash
   npm i -g vercel
   vercel
   ```

2. **Railway:**

   - Connect your GitHub repo
   - Set environment variables
   - Deploy automatically

3. **Render:**
   - Create a new Web Service
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`

## Next Steps

1. ✅ User creation endpoint is set up
2. ✅ Database schema is ready
3. ✅ Client integration is complete

**Recommended Next Steps:**

1. **Add Firebase Admin SDK** for production-ready token verification
2. **Create endpoints for user progress tracking**
3. **Add endpoints for lessons and activities**
4. **Implement user profile updates**
5. **Add comprehensive error logging**

## Support

For more information, see:

- [User API Documentation](./USER_API.md)
- [Database Guide](../DATABASE_GUIDE.md)
- [Prisma Schema](../prisma/schema.prisma)
