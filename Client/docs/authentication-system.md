# Authentication System - AfroLingo

## 📁 Structure

```
Client/
├── app/
│   ├── (auth)/                 # Auth screens group
│   │   ├── _layout.tsx        # Auth navigation
│   │   ├── login.tsx          # Login screen
│   │   ├── signup.tsx         # Signup screen
│   │   └── forgot-password.tsx # Password reset screen
│   ├── (onboarding)/          # Onboarding flow (after auth)
│   ├── (tabs)/                # Main app (after onboarding)
│   ├── _layout.tsx            # Root layout with auth logic
│   └── index.tsx              # Entry point redirect
└── contexts/
    └── AuthContext.tsx         # Auth state management
```

## 🔑 Features

### ✅ Authentication Screens

- **Login Screen** - Email/password with validation
- **Signup Screen** - Full registration with password strength requirements
- **Forgot Password** - Password reset flow with email confirmation

### ✅ Security Features

- Email validation
- Strong password requirements (8+ chars, uppercase, lowercase, numbers)
- Secure password visibility toggle
- Terms & conditions agreement
- Persistent auth state using AsyncStorage
- JWT token management (ready for backend integration)

### ✅ User Experience

- Beautiful gradient backgrounds
- Smooth animations
- Loading states
- Error handling with user-friendly messages
- Keyboard-aware scrolling
- Auto-focus on inputs
- Social login placeholders (Google, Facebook)

## 🔄 Flow

```
App Launch
    ↓
Auth Check (AuthContext)
    ↓
┌─────────────────┐
│ Not Logged In?  │ → Login/Signup Screens
└─────────────────┘
    ↓
┌─────────────────┐
│ Logged In?      │ → Check Onboarding Status
└─────────────────┘
    ↓
┌─────────────────┐
│ Onboarding Done?│ → Main App (Tabs)
└─────────────────┘
```

## 🛠 Backend Integration

### Current State (Mock)

The auth system currently uses mock API calls with simulated delays.

### To Connect to Your Backend

1. **Update AuthContext.tsx** - Replace mock API calls:

```typescript
// In login function
const response = await fetch("YOUR_API_URL/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const data = await response.json();

if (!response.ok) {
  throw new Error(data.message || "Login failed");
}

const { user, token } = data;
```

2. **Update signup function** similarly

3. **Add API base URL** in a config file:

```typescript
// config/api.ts
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
```

### Required Backend Endpoints

```
POST /auth/login
- Body: { email, password }
- Returns: { user: User, token: string }

POST /auth/signup
- Body: { name, email, password }
- Returns: { user: User, token: string }

POST /auth/logout
- Headers: Authorization: Bearer <token>
- Returns: { success: boolean }

POST /auth/reset-password
- Body: { email }
- Returns: { success: boolean, message: string }

GET /auth/me (optional - verify token)
- Headers: Authorization: Bearer <token>
- Returns: { user: User }
```

## 📦 Dependencies

Already installed:

- `@react-native-async-storage/async-storage` - Persistent storage
- `expo-router` - Navigation
- `expo-linear-gradient` - Gradients
- `@expo/vector-icons` - Icons

## 🎨 Customization

### Colors

Edit `Client/constants/Colors.ts` to change theme colors.

### Validation Rules

Edit validation functions in each screen file:

- `login.tsx` - Line ~35
- `signup.tsx` - Line ~42
- `forgot-password.tsx` - Line ~32

### Social Login

To implement Google/Facebook login:

1. Install: `expo install expo-auth-session expo-crypto`
2. Configure OAuth providers
3. Update social button handlers in login/signup screens

## 🔐 Security Best Practices

### ✅ Implemented

- Passwords never logged
- Secure storage for tokens
- Email validation
- Password strength requirements
- HTTPS only (configure in production)

### 📝 TODO (Backend)

- Rate limiting on auth endpoints
- Email verification
- 2FA support
- Session management
- Password reset token expiration
- Refresh token rotation

## 🧪 Testing

### Test Credentials (Mock Mode)

- Any email format works
- Any password ≥6 characters works

### To Test

1. Run: `npm start` in Client directory
2. Navigate to login screen
3. Try signup flow
4. Test forgot password
5. Check persistent login (close/reopen app)

## 🚀 Next Steps

1. **Connect to Backend**

   - Set up your API endpoints
   - Update AuthContext with real API calls
   - Configure environment variables

2. **Add Email Verification**

   - Create verification screen
   - Handle email confirmation flow

3. **Implement Social Login**

   - Set up OAuth providers
   - Add social auth handlers

4. **Add Profile Management**

   - Create profile edit screen
   - Add avatar upload
   - Allow email/password changes

5. **Security Enhancements**
   - Add 2FA
   - Implement biometric auth
   - Add session timeout

## 📚 Resources

- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
- [React Navigation](https://reactnavigation.org/)

## ❓ FAQ

**Q: Why do I see login screen on first launch?**
A: This is expected. Users must authenticate before accessing the app.

**Q: How do I skip auth during development?**
A: Temporarily comment out the auth check in `app/_layout.tsx`

**Q: Where is user data stored?**
A: In AsyncStorage (encrypted on device)

**Q: Can I use different storage?**
A: Yes! Replace AsyncStorage with SecureStore for sensitive data.

## 🐛 Troubleshooting

### Issue: Login doesn't work

- Check if AuthContext is properly wrapped in \_layout.tsx
- Verify AsyncStorage permissions
- Check console for errors

### Issue: Can't navigate after login

- Ensure onboarding state is set correctly
- Check redirect logic in RootNavigator

### Issue: Token not persisting

- Verify AsyncStorage is working
- Check if saveAuthData is called
- Clear app data and retry
