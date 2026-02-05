# 🔥 Firebase Authentication - Setup Complete!

## ✅ What's Been Configured

### 1. Firebase Setup

- ✅ Firebase project created: `AfroLingo`
- ✅ Email/Password authentication enabled
- ✅ Google OAuth enabled
- ✅ iOS app registered with bundle ID: `com.afrolingo.app`
- ✅ Android app registered with package name: `com.afrolingo.app`
- ✅ Config files added to project

### 2. Code Integration

- ✅ Firebase SDK installed (`firebase` package)
- ✅ `config/firebase.ts` - Firebase initialization
- ✅ `config/env.ts` - Environment configuration
- ✅ `contexts/AuthContext.tsx` - Real Firebase auth implementation
- ✅ `.env` - Environment variables

---

## 🔌 Backend Integration

### API Endpoint Configuration

**Location:** `Client/.env`

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

**Update this to your actual backend URL:**

- Local development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

### User Signup Flow

When a user signs up, the app will:

1. **Create Firebase account** with email/password
2. **Update Firebase profile** with display name
3. **Send user data to your backend** at `POST /api/users`

**Request sent to backend:**

```json
POST /api/users
Headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer <firebase_token>"
}
Body: {
  "firebaseUid": "firebase_user_id",
  "email": "user@example.com",
  "name": "User Name",
  "createdAt": "2025-11-07T10:30:00.000Z"
}
```

### Backend Endpoint Requirements

Your backend should have this endpoint:

**Endpoint:** `POST /api/users`

**Expected behavior:**

- Verify the Firebase token in the `Authorization` header
- Create user record in your database
- Store the `firebaseUid` to link with Firebase
- Return success/error response

**Sample Node.js/Express endpoint:**

```javascript
const admin = require("firebase-admin");

app.post("/api/users", async (req, res) => {
  try {
    // Verify Firebase token
    const token = req.headers.authorization?.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    const { firebaseUid, email, name, createdAt } = req.body;

    // Verify the UID matches
    if (decodedToken.uid !== firebaseUid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Create user in your database
    const user = await db.users.create({
      firebaseUid,
      email,
      name,
      createdAt: new Date(createdAt),
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});
```

---

## 🧪 Testing Authentication

### Test Email/Password Signup

1. **Start your Expo app:**

   ```bash
   cd /Users/roy/Documents/AfroLingo/Client
   npm start
   ```

2. **Start your backend server** (if not already running):

   ```bash
   cd /Users/roy/Documents/AfroLingo/Server
   npm start
   ```

3. **In the app:**
   - Navigate to Sign Up screen
   - Enter name, email, password
   - Tap "Sign Up"
   - ✅ User created in Firebase
   - ✅ User data sent to your backend

4. **Verify in Firebase Console:**
   - Go to: https://console.firebase.google.com/
   - Select AfroLingo project
   - Click Authentication → Users
   - You should see the new user!

5. **Verify in your backend:**
   - Check your database
   - User should be created with `firebaseUid` matching Firebase

### Test Login

1. Use the same email/password you signed up with
2. Tap "Log In"
3. ✅ Should log you in successfully

### Test Password Reset

1. Tap "Forgot Password"
2. Enter your email
3. Check your email inbox
4. ✅ You'll receive a password reset email from Firebase

### Test Google Sign-In

1. Tap "Continue with Google"
2. Select your Google account
3. ✅ Should sign in with Google
4. **Note:** Google OAuth works on web. For mobile, you'll need additional setup.

---

## 🔐 Security Best Practices

### Environment Variables

**Never commit `.env` to Git!**

Add to `.gitignore`:

```
.env
.env.local
.env.*.local
```

### Firebase Token Verification

Your backend MUST verify Firebase tokens:

```javascript
const admin = require("firebase-admin");

// Initialize Firebase Admin (do this once at startup)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// Middleware to verify tokens
async function verifyFirebaseToken(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
}
```

---

## 📱 Platform-Specific Setup

### For iOS (Physical Device Testing)

Do **not** commit `GoogleService-Info.plist` to GitHub.

To test on a real iOS device, download `GoogleService-Info.plist` from the Firebase Console and place it at `ios/AfroLingo/GoogleService-Info.plist`, then:

1. Open Xcode project:

   ```bash
   cd ios
   open AfroLingo.xcworkspace
   ```

2. Select your development team
3. Connect your iPhone
4. Build and run

### For Android (When Ready)

Do **not** commit `google-services.json` to GitHub.

When you create a development build, download `google-services.json` from the Firebase Console and place it at `android/app/google-services.json`, then:

1. Run:

   ```bash
   npx expo run:android
   ```

2. For Google Sign-In, you'll need to add SHA-1 fingerprint to Firebase Console

---

## 🚀 Next Steps

### 1. Update Backend URL (Required!)

Edit `Client/.env`:

```env
EXPO_PUBLIC_API_BASE_URL=https://your-actual-backend.com/api
```

### 2. Set Up Firebase Admin SDK on Backend

Your backend needs Firebase Admin SDK to verify tokens:

```bash
cd /Users/roy/Documents/AfroLingo/Server
npm install firebase-admin
```

Download Service Account Key:

1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely (DON'T commit to Git!)

### 3. Test End-to-End

1. Start backend server
2. Start Expo app
3. Sign up a new user
4. Verify user appears in:
   - Firebase Console (Authentication → Users)
   - Your backend database

### 4. Handle Google OAuth on Mobile

For Google Sign-In on iOS/Android, you'll need:

- `expo-auth-session` (already installed)
- Additional OAuth configuration
- See: https://docs.expo.dev/guides/authentication/#google

### 5. Add Error Logging

Consider adding error tracking:

```bash
npm install @sentry/react-native
```

---

## 📚 Useful Resources

- **Firebase Console:** https://console.firebase.google.com/
- **Firebase Auth Docs:** https://firebase.google.com/docs/auth
- **Expo Auth Guide:** https://docs.expo.dev/guides/authentication/
- **Firebase Admin SDK:** https://firebase.google.com/docs/admin/setup

---

## 🐛 Troubleshooting

### "Failed to sync user with backend"

**Check:**

1. Is your backend server running?
2. Is the `EXPO_PUBLIC_API_BASE_URL` correct in `.env`?
3. Does your backend have a `POST /api/users` endpoint?
4. Is your backend accepting CORS requests from your app?

**Solution:**

- The app won't crash - Firebase user is still created
- User will be synced on next login attempt
- Or manually sync users using Firebase Admin SDK

### "Invalid Firebase token"

**Check:**

1. Is Firebase Admin SDK initialized on backend?
2. Are you using the correct service account key?
3. Is the token being sent in the `Authorization` header?

### "Google Sign-In not working on mobile"

**This is expected!**

- Google OAuth currently works on web only
- For mobile, you need to set up `expo-auth-session` properly
- Follow: https://docs.expo.dev/guides/authentication/#google

---

## ✅ Setup Checklist

- [x] Firebase project created
- [x] Authentication methods enabled
- [x] Firebase SDK installed
- [x] Config files in place
- [x] AuthContext using real Firebase
- [x] Backend integration configured
- [ ] Update `.env` with production backend URL
- [ ] Set up Firebase Admin SDK on backend
- [ ] Create `POST /api/users` endpoint
- [ ] Test end-to-end signup flow
- [ ] Test login flow
- [ ] Test password reset
- [ ] Configure Google OAuth for mobile (optional)

---

**🎉 Firebase Authentication is ready to use!**

Test it now by running:

```bash
npm start
```

Then try signing up with a new account!
