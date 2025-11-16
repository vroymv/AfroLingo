# Email Verification Implementation Guide

## Overview

Email verification has been successfully implemented in the AfroLingo app using Firebase Authentication. This guide explains how it works and how to customize it.

## What Was Implemented

### 1. **Automatic Email Verification on Signup**

When a user creates an account, Firebase automatically sends a verification email to their registered email address.

### 2. **Email Verification Status Tracking**

The `User` interface now includes an `emailVerified` boolean property that tracks whether the user has verified their email.

### 3. **Resend Verification Email**

Users can request a new verification email through the `sendVerificationEmail()` function in the AuthContext.

### 4. **Email Verification Banner Component**

A reusable banner component (`EmailVerificationBanner`) displays on screens to remind users to verify their email.

## How It Works

### Firebase Configuration

The implementation uses Firebase Auth's built-in email verification:

```typescript
import { sendEmailVerification } from "firebase/auth";
```

### During Signup

When a user signs up, the following happens:

1. User account is created with `createUserWithEmailAndPassword`
2. Display name is updated with `updateProfile`
3. **Verification email is automatically sent** via `sendEmailVerification`
4. User can start using the app while email is unverified
5. Backend is notified of the new user

### User Interface

The `EmailVerificationBanner` component:

- ✅ Only shows if user is logged in AND email is not verified
- ✅ Displays a friendly message asking users to verify
- ✅ Provides a "Resend Verification Email" button
- ✅ Shows success/error messages
- ✅ Automatically hides once email is verified

## Customization Options

### 1. **Customize Email Template**

You can customize the verification email template in the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Templates**
4. Click on **Email address verification**
5. Customize:
   - Email subject
   - Sender name
   - Email body
   - Custom action URL (for redirecting after verification)

### 2. **Enforce Email Verification**

If you want to **require** email verification before users can access certain features:

#### Option A: Prevent Login Until Verified

Update the `login` function in `AuthContext.tsx`:

```typescript
const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Check if email is verified
    if (!userCredential.user.emailVerified) {
      await signOut(auth);
      throw new Error(
        "Please verify your email before logging in. Check your inbox."
      );
    }

    // Continue with normal login flow...
  } catch (error) {
    // Handle error...
  }
};
```

#### Option B: Restrict Specific Features

Create a wrapper component:

```typescript
// components/auth/RequireVerifiedEmail.tsx
import { useAuth } from "@/contexts/AuthContext";
import { View, Text } from "react-native";

export default function RequireVerifiedEmail({ children }) {
  const { user } = useAuth();

  if (!user?.emailVerified) {
    return (
      <View>
        <Text>Please verify your email to access this feature.</Text>
        <EmailVerificationBanner />
      </View>
    );
  }

  return children;
}
```

Then wrap protected features:

```typescript
<RequireVerifiedEmail>
  <PremiumFeature />
</RequireVerifiedEmail>
```

### 3. **Custom Verification URL**

To redirect users to your app after email verification:

1. In Firebase Console → Authentication → Settings
2. Add your app's deep link/URL scheme
3. Users will be redirected to your app after clicking the verification link

For React Native, you'll need to configure deep linking:

```typescript
// In your app configuration
const linking = {
  prefixes: ["afrolingo://", "https://afrolingo.app"],
  config: {
    screens: {
      EmailVerified: "verify-email",
    },
  },
};
```

### 4. **Add Verification Reminders**

You can show the banner on multiple screens:

```typescript
// In any screen component
import EmailVerificationBanner from "@/components/auth/EmailVerificationBanner";

export default function MyScreen() {
  return (
    <View>
      <EmailVerificationBanner />
      {/* Rest of your screen */}
    </View>
  );
}
```

**Recommended screens:**

- Profile screen ✅ (already added)
- Home/Dashboard screen
- Settings screen
- Before accessing premium features

### 5. **Verification Status Polling**

To automatically update verification status when users verify their email:

Add this to your `AuthContext.tsx`:

```typescript
// Add inside AuthProvider component
useEffect(() => {
  if (!auth.currentUser || auth.currentUser.emailVerified) return;

  // Check verification status every 10 seconds
  const interval = setInterval(async () => {
    await auth.currentUser?.reload();
    if (auth.currentUser?.emailVerified) {
      // Update state with verified status
      setState((prev) => ({
        ...prev,
        user: prev.user ? { ...prev.user, emailVerified: true } : null,
      }));
    }
  }, 10000);

  return () => clearInterval(interval);
}, []);
```

## Testing Email Verification

### 1. **Test Mode Setup**

For development, you can:

- Use a real email address you control
- Check spam/junk folder if email doesn't arrive
- Use email testing services like [Ethereal Email](https://ethereal.email/)

### 2. **Check Verification Status**

You can check if a user's email is verified:

```typescript
const { user } = useAuth();
console.log("Email verified:", user?.emailVerified);
```

### 3. **Manual Verification (Testing Only)**

In Firebase Console:

1. Go to Authentication → Users
2. Click on a user
3. Manually verify their email

## Common Issues & Solutions

### Issue: Emails Not Sending

**Solutions:**

1. Check Firebase Console → Authentication → Settings → Email enumeration protection
2. Verify SMTP settings in Firebase
3. Check email provider's spam filters
4. Ensure email address is valid

### Issue: Verification Link Expired

**Solution:**

- Email verification links expire after a certain time
- User can request a new email using the "Resend" button

### Issue: User Can't Find Email

**Solutions:**

1. Check spam/junk folder
2. Verify email address is correct
3. Resend verification email
4. Try a different email address

## Security Best Practices

1. ✅ **Don't store sensitive data** until email is verified
2. ✅ **Rate limit** verification email requests (Firebase handles this)
3. ✅ **Monitor** verification completion rates
4. ✅ **Consider** requiring verification for sensitive actions
5. ✅ **Provide** clear instructions in the verification email

## Backend Integration

If you need to track verification on your backend:

```typescript
// In your signup function in AuthContext.tsx
const response = await fetch(ENV.API_ENDPOINTS.USERS, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    firebaseUid: userCredential.user.uid,
    email: userCredential.user.email,
    name: name,
    emailVerified: userCredential.user.emailVerified, // Add this
    createdAt: new Date().toISOString(),
  }),
});
```

## Files Modified

1. **`Client/contexts/AuthContext.tsx`**

   - Added `sendEmailVerification` import
   - Added `emailVerified` to User interface
   - Updated `convertFirebaseUser` to include verification status
   - Modified `signup` function to send verification email
   - Added `sendVerificationEmail` function

2. **`Client/components/auth/EmailVerificationBanner.tsx`** (new file)

   - Reusable banner component for verification reminders

3. **`Client/app/(tabs)/profile.tsx`**
   - Added EmailVerificationBanner component as example

## Next Steps

Consider implementing:

- [ ] Email change verification
- [ ] Phone number verification
- [ ] Multi-factor authentication (MFA)
- [ ] Custom email templates with branding
- [ ] Analytics tracking for verification rates
- [ ] Automated reminder emails (via Firebase Cloud Functions)

## Support

For Firebase email verification documentation:

- [Firebase Email Verification Docs](https://firebase.google.com/docs/auth/web/manage-users#send_a_user_a_verification_email)
- [Customize Email Templates](https://firebase.google.com/docs/auth/custom-email-handler)
