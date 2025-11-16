# Email Verification - User Experience Flow

## What Users See After Signup ✅

### Step 1: User Creates Account

User fills in the signup form with:

- Name: John Doe
- Email: john@example.com
- Password: ••••••••
- Taps "Create Account"

### Step 2: Alert Appears (Non-Blocking)

```
┌─────────────────────────────────────┐
│                                     │
│      📧 Check Your Email            │
│                                     │
│  We've sent a verification email   │
│  to john@example.com.               │
│                                     │
│  Please check your inbox (and      │
│  spam folder) to verify your       │
│  account.                          │
│                                     │
│  You can continue using the app    │
│  while we wait for verification!   │
│                                     │
│           ┌─────────────┐          │
│           │   Got it!   │          │
│           └─────────────┘          │
│                                     │
└─────────────────────────────────────┘
```

### Step 3: User Taps "Got it!"

- Alert dismisses
- User is redirected to the main app
- User can immediately start exploring

### Step 4: User Sees Banner in Profile

```
┌─────────────────────────────────────┐
│  📧 Verify Your Email               │
│  Please verify your email address   │
│  to access all features.            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Resend Verification Email   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Step 5: User Checks Email

Email inbox shows:

```
From: noreply@afrolingo-app.firebaseapp.com
Subject: Verify your email for AfroLingo

Hi John,

Thanks for creating an account with AfroLingo!

Please verify your email address by clicking the link below:

[Verify Email Address]

If you didn't create this account, you can safely ignore this email.

Best regards,
The AfroLingo Team
```

### Step 6: User Clicks Verification Link

- Browser opens
- Firebase verifies the email
- User sees success message
- User returns to app

### Step 7: Banner Disappears

- Next time user opens the profile
- Banner is gone (because email is verified)
- User has full access to all features

---

## Key Points

### ✅ Non-Blocking Experience

- User can explore the app immediately
- No forced waiting or locked features
- Gentle reminders instead of hard blocks

### ✅ Clear Communication

- Alert tells them what to do
- Mentions spam folder (important!)
- Shows their email address
- Reassures they can continue

### ✅ Multiple Touchpoints

1. **Immediate alert** after signup
2. **Persistent banner** in profile (until verified)
3. **Email in inbox** with verification link
4. **Resend option** if email not received

### ✅ User-Friendly

- Simple, clear language
- Emoji icons for visual appeal
- One-tap dismiss
- No intimidating error messages

---

## What Happens Behind the Scenes

1. **Account Created**

   ```
   Firebase creates user account
   ```

2. **Email Sent Automatically**

   ```
   Firebase sends verification email
   (No manual work needed!)
   ```

3. **Alert Shows**

   ```
   Alert.alert() displays the message
   ```

4. **User Dismissed Alert**

   ```
   User taps "Got it!" and continues
   ```

5. **Navigation Happens**

   ```
   AuthContext detects authenticated user
   Root layout redirects to main app
   ```

6. **User Explores App**

   ```
   Full access to app features
   EmailVerificationBanner shows in profile
   ```

7. **User Verifies Email**

   ```
   Clicks link → Firebase updates status
   user.emailVerified = true
   ```

8. **Banner Disappears**
   ```
   EmailVerificationBanner checks emailVerified
   Returns null if true
   ```

---

## Customization Options

### Change Alert Message

In `Client/app/(auth)/signup.tsx`:

```typescript
Alert.alert(
  "Welcome to AfroLingo! 🎉", // Change title
  "Check your email for verification...", // Change message
  [{ text: "Continue" }] // Change button text
);
```

### Change Alert Timing

Show after a delay:

```typescript
setTimeout(() => {
  Alert.alert(...);
}, 1000); // Wait 1 second
```

### Use Toast Instead

See `email-verification-notification.md` for toast implementation

### Combine Both

Show alert + toast for extra visibility:

```typescript
Alert.alert(...);
setShowToast(true);
```

---

## Testing Checklist

- [ ] Create new account
- [ ] Alert appears immediately after signup
- [ ] Alert shows correct email address
- [ ] Can tap "Got it!" to dismiss
- [ ] App navigation works after dismissing
- [ ] Email arrives in inbox (check spam)
- [ ] Email contains verification link
- [ ] Banner shows in profile when not verified
- [ ] Can resend verification email
- [ ] Banner disappears after verification

All working! ✅
