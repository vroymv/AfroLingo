# 🎨 AfroLingo Authentication Flow - Visual Guide

## 📱 Screen Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     APP LAUNCH                              │
│                         ↓                                   │
│              ┌──────────────────┐                           │
│              │  Loading Screen  │  🌍 AfroLingo             │
│              │  (AuthContext)   │  Checking auth...         │
│              └──────────────────┘                           │
│                         ↓                                   │
│              ┌──────────────────┐                           │
│              │ Auth State Check │                           │
│              └──────────────────┘                           │
│                    /        \                               │
│                   /          \                              │
│        Not Authenticated    Authenticated                   │
│                 /              \                            │
│                ↓                ↓                           │
│    ┌──────────────────┐   ┌────────────────┐               │
│    │  LOGIN SCREEN    │   │ Onboarding?    │               │
│    │                  │   └────────────────┘               │
│    │  🌍 Welcome Back!│         /      \                   │
│    │                  │        /        \                  │
│    │  Email:  [____]  │   Not Done   Done                  │
│    │  Pass:   [____]  │      /          \                  │
│    │                  │     ↓            ↓                 │
│    │  [  Sign In  ]   │  Onboard      Main App             │
│    │                  │  Screens      (Tabs)               │
│    │  Forgot Password?│                                    │
│    │  Sign Up         │                                    │
│    └──────────────────┘                                    │
│            ↓                                                │
│         Sign Up?                                            │
│            ↓                                                │
│    ┌──────────────────┐                                    │
│    │  SIGNUP SCREEN   │                                    │
│    │                  │                                    │
│    │  🌍 Create Acct  │                                    │
│    │                  │                                    │
│    │  Name:   [____]  │                                    │
│    │  Email:  [____]  │                                    │
│    │  Pass:   [____]  │                                    │
│    │  Confirm:[____]  │                                    │
│    │  ☑ Terms         │                                    │
│    │                  │                                    │
│    │ [Create Account] │                                    │
│    │  Sign In         │                                    │
│    └──────────────────┘                                    │
│            ↓                                                │
│       Success! →  Auto Login  →  Onboarding                │
│                                                             │
│    Forgot Password?                                         │
│            ↓                                                │
│    ┌──────────────────┐                                    │
│    │ FORGOT PASSWORD  │                                    │
│    │                  │                                    │
│    │  🔒 Reset Pass   │                                    │
│    │                  │                                    │
│    │  Email:  [____]  │                                    │
│    │                  │                                    │
│    │ [Send Reset Link]│                                    │
│    │                  │                                    │
│    │  ← Back          │                                    │
│    └──────────────────┘                                    │
│            ↓                                                │
│    ┌──────────────────┐                                    │
│    │ SUCCESS STATE    │                                    │
│    │                  │                                    │
│    │  ✅ Check Email  │                                    │
│    │                  │                                    │
│    │  We sent reset   │                                    │
│    │  instructions to │                                    │
│    │  test@email.com  │                                    │
│    │                  │                                    │
│    │ [Back to Login]  │                                    │
│    └──────────────────┘                                    │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 State Management Flow

```
┌──────────────────────────────────────────────────────┐
│                   AuthContext                        │
│                                                      │
│  State:                                             │
│  ├─ user: User | null                               │
│  ├─ token: string | null                            │
│  ├─ isAuthenticated: boolean                        │
│  └─ isLoading: boolean                              │
│                                                      │
│  Actions:                                           │
│  ├─ login(email, password)                          │
│  ├─ signup(name, email, password)                   │
│  ├─ logout()                                        │
│  ├─ resetPassword(email)                            │
│  └─ updateProfile(updates)                          │
│                                                      │
│  Storage: AsyncStorage                              │
│  ├─ @afrolingo_auth     (user data)                │
│  └─ @afrolingo_token    (JWT token)                │
└──────────────────────────────────────────────────────┘
```

## 📁 File Structure

```
app/
│
├── (auth)/                    👈 Authentication Group
│   │
│   ├── _layout.tsx           Stack Navigator
│   │   ├─→ login
│   │   ├─→ signup
│   │   └─→ forgot-password
│   │
│   ├── login.tsx             🔑 Login Screen
│   │   ├─ Email validation
│   │   ├─ Password input
│   │   ├─ Error handling
│   │   └─ Navigation links
│   │
│   ├── signup.tsx            ✍️ Signup Screen
│   │   ├─ Full registration form
│   │   ├─ Password strength check
│   │   ├─ Terms checkbox
│   │   └─ Validation
│   │
│   └── forgot-password.tsx   🔒 Password Reset
│       ├─ Email input
│       ├─ Success state
│       └─ Instructions
│
├── (onboarding)/             👈 After Auth
│   └── welcome/
│
├── (tabs)/                   👈 Main App
│   └── ...
│
├── _layout.tsx               🎯 Root Layout
│   ├─ AuthProvider
│   ├─ RootNavigator (auth routing logic)
│   └─ Theme providers
│
└── index.tsx                 🚀 Entry Point
    └─ Redirects to login
```

## 🎨 UI Component Hierarchy

```
Login Screen
│
├── ThemedView (container)
│   ├── LinearGradient (background)
│   ├── SafeAreaView
│   │   └── KeyboardAvoidingView
│   │       └── ScrollView
│   │           ├── Header
│   │           │   ├── Logo Container
│   │           │   ├── Title
│   │           │   └── Subtitle
│   │           │
│   │           └── Form
│   │               ├── Email Input
│   │               │   ├── Label
│   │               │   ├── Input Container
│   │               │   │   ├── Icon
│   │               │   │   └── TextInput
│   │               │   └── Error Text
│   │               │
│   │               ├── Password Input
│   │               │   ├── Label
│   │               │   ├── Input Container
│   │               │   │   ├── Icon
│   │               │   │   ├── TextInput
│   │               │   │   └── Toggle Button
│   │               │   └── Error Text
│   │               │
│   │               ├── Forgot Password Link
│   │               ├── Login Button
│   │               ├── Divider (or)
│   │               ├── Social Buttons
│   │               └── Sign Up Link
```

## 🔐 Security Layers

```
┌─────────────────────────────────────┐
│        Frontend (Current)           │
│  ✅ Email validation                │
│  ✅ Password strength check         │
│  ✅ Secure input (hidden password)  │
│  ✅ Form validation                 │
│  ✅ Error handling                  │
│  ✅ Persistent storage              │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│      Backend (To Implement)         │
│  📝 Rate limiting                   │
│  📝 Password hashing (bcrypt)       │
│  📝 JWT token generation            │
│  📝 Email verification              │
│  📝 Password reset tokens           │
│  📝 2FA support                     │
│  📝 Session management              │
└─────────────────────────────────────┘
```

## 🎬 User Journey Examples

### New User Signup

```
1. Launch App
   ↓
2. See Login Screen
   ↓
3. Tap "Sign Up"
   ↓
4. Fill Form:
   - Name: "Sarah Lee"
   - Email: "sarah@example.com"
   - Password: "MyPass123"
   - Confirm: "MyPass123"
   - ☑ Terms
   ↓
5. Tap "Create Account"
   ↓
6. Loading... (1 second)
   ↓
7. ✅ Success!
   ↓
8. Redirect to Onboarding
   ↓
9. Complete Onboarding
   ↓
10. Main App Access!
```

### Returning User

```
1. Launch App
   ↓
2. Loading Screen (check storage)
   ↓
3. Found Token + User
   ↓
4. Check Onboarding Status
   ↓
5. Already Complete
   ↓
6. 🎉 Straight to Main App!
   (No login required)
```

### Forgot Password

```
1. On Login Screen
   ↓
2. Tap "Forgot Password?"
   ↓
3. Enter Email: "user@example.com"
   ↓
4. Tap "Send Reset Link"
   ↓
5. Loading...
   ↓
6. ✅ Success Screen
   ↓
7. Shows:
   - "Check Your Email"
   - Instructions
   - Sent to: user@example.com
   ↓
8. Options:
   - Back to Login
   - Try Different Email
```

## 📊 Validation Rules

```
┌─────────────────────────────────────┐
│           Email Rules               │
│  • Must have @ symbol               │
│  • Must have domain                 │
│  • Format: name@domain.com          │
│  • Case insensitive                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Password Rules              │
│  • Minimum 8 characters             │
│  • At least 1 uppercase (A-Z)       │
│  • At least 1 lowercase (a-z)       │
│  • At least 1 number (0-9)          │
│  • Must match confirmation          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│           Name Rules                │
│  • Minimum 2 characters             │
│  • No special validation            │
└─────────────────────────────────────┘
```

## 🎯 Navigation Guards

```typescript
// In _layout.tsx RootNavigator

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { state } = useOnboarding();

  // Guard 1: Loading
  if (isLoading) return <LoadingScreen />;

  // Guard 2: Not Authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Guard 3: Onboarding Incomplete
  if (!state.isCompleted) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  // All Good: Show Main App
  return <Stack>...</Stack>;
}
```

## 🧩 Component Reusability

```
Reusable Components Created:
│
├── LoadingScreen
│   └── Used in: _layout.tsx (auth check)
│
├── LogoutButton
│   └── Can use in:
│       ├─ Profile screen
│       ├─ Settings screen
│       └─ Header menu
│
└── Auth Screens (templates for other forms)
    ├─ Login → Template for other login flows
    ├─ Signup → Template for other registration forms
    └─ ForgotPassword → Template for other email flows
```

## 🌈 Design Tokens

```
Colors Used:
├─ tintColor (from theme)       - Primary actions
├─ backgroundColor (from theme) - Backgrounds
├─ textColor (from theme)       - Text
├─ #FF6B6B                      - Errors / Logout
├─ #4CAF50                      - Success
└─ rgba(*, *, *, 0.1)          - Subtle backgrounds

Spacing:
├─ 24px - Screen padding
├─ 20px - Input groups
├─ 12px - Small gaps
└─ 8px  - Tight spacing

Border Radius:
├─ 12px - Inputs, buttons
└─ 40px - Circular (logo)

Font Sizes:
├─ 32px - Page titles
├─ 16px - Body text, inputs
├─ 14px - Labels, links
└─ 12px - Error messages
```

---

**This visual guide helps you understand the complete authentication system at a glance!**
