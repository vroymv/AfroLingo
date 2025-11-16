# Quick Start: Email Verification Setup

## ✅ What's Already Done

Your app now automatically sends email verification when users sign up!

## 🎨 Customize the Email (Optional)

1. Go to **[Firebase Console](https://console.firebase.google.com/)**
2. Select your **AfroLingo** project
3. Click **Authentication** in the left sidebar
4. Click the **Templates** tab
5. Select **Email address verification**
6. Customize:
   - **Subject**: "Verify your AfroLingo email address"
   - **Sender name**: "AfroLingo Team"
   - **Email body**: Add your custom message
   - **Action URL**: Add your app's deep link (optional)

## 🧪 Test It

1. Create a new account in your app
2. Check the email inbox for the verification email
3. Click the verification link
4. The user's `emailVerified` status will update to `true`

## 📱 Use the Verification Banner

Already added to the Profile screen! Add it to other screens:

```typescript
import EmailVerificationBanner from "@/components/auth/EmailVerificationBanner";

<EmailVerificationBanner />;
```

## 🔒 Require Email Verification (Optional)

To prevent unverified users from logging in, see the full guide:
`Client/docs/EMAIL_VERIFICATION_GUIDE.md`

## 🎯 Access Verification Status

```typescript
const { user } = useAuth();

if (user?.emailVerified) {
  // User has verified their email
} else {
  // User needs to verify
}
```

## 🔄 Resend Verification Email

```typescript
const { sendVerificationEmail } = useAuth();

await sendVerificationEmail();
```

That's it! 🎉
