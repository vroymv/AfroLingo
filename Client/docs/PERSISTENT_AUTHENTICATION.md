# Persistent Authentication Implementation

## Overview

The app now remembers authenticated users and their onboarding status, so they don't have to log in every time they open the app.

## What Changed

### 1. **Firebase Authentication Persistence**

Firebase Auth is configured with React Native AsyncStorage persistence in `config/firebase.ts`:

```typescript
auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
```

This ensures that Firebase automatically persists authentication tokens locally.

### 2. **Onboarding State Persistence**

Updated `contexts/OnboardingContext.tsx` to persist onboarding state:

- Added AsyncStorage imports and state management
- Loads onboarding state from storage on app start
- Saves onboarding state whenever it changes
- Added `isLoading` flag to prevent flickering during state restoration

### 3. **Smart Navigation**

Updated `app/index.tsx` to properly check authentication state:

- Waits for both auth and onboarding state to load
- Redirects to appropriate screen based on user state:
  - Not authenticated → Login screen
  - Authenticated but no onboarding → Onboarding flow
  - Authenticated and onboarded → Main app tabs

### 4. **Root Layout Updates**

Updated `app/_layout.tsx` to handle both loading states:

- Shows loading screen while checking auth and onboarding status
- Prevents navigation before state is fully restored

## How It Works

### First Time User Flow:

1. User opens app → Shows login screen
2. User signs up/logs in → Firebase stores auth token in AsyncStorage
3. User completes onboarding → Onboarding state stored in AsyncStorage
4. User navigates to main app

### Returning User Flow:

1. User opens app → Shows loading screen
2. Firebase automatically restores auth session from AsyncStorage
3. OnboardingContext restores onboarding state from AsyncStorage
4. User is automatically redirected to main app (no login required!)

### Logged Out User Flow:

1. User opens app → Shows loading screen
2. Firebase checks for stored auth token (none found)
3. User is redirected to login screen

## Storage Keys

The following keys are used in AsyncStorage:

- Firebase Auth: Managed automatically by Firebase (`firebase:authUser:[API_KEY]:[APP_NAME]`)
- Onboarding: `@afrolingo_onboarding_state`

## Testing

### Test Persistent Auth:

1. Log in to the app
2. Complete onboarding (if not already done)
3. Close the app completely
4. Reopen the app
5. ✅ You should be automatically logged in and see the main app

### Test Logout:

1. While logged in, use the logout button
2. ✅ You should be redirected to login screen
3. Close and reopen the app
4. ✅ You should still see the login screen (not auto-logged in)

### Test Onboarding Persistence:

1. Log in as a new user
2. Start onboarding but don't complete it
3. Close the app
4. Reopen the app
5. ✅ You should see the onboarding screen (not the login screen)

## Security Notes

- Auth tokens are securely stored by Firebase using platform-specific secure storage
- Tokens automatically refresh when needed
- Tokens are cleared on logout
- Email verification status is checked on each auth state change

## Troubleshooting

### Users still see login screen:

1. Check that `@react-native-async-storage/async-storage` is installed
2. Verify Firebase config in `.env` file
3. Check console for any AsyncStorage errors
4. Try clearing app data and logging in fresh

### App flickers between screens:

- This should be prevented by the `isLoading` flags
- If it persists, check that both `authLoading` and `onboardingLoading` are being checked

## Related Files

- `config/firebase.ts` - Firebase auth configuration with persistence
- `contexts/AuthContext.tsx` - Auth state management with Firebase listener
- `contexts/OnboardingContext.tsx` - Onboarding state persistence
- `app/index.tsx` - Entry point with smart navigation
- `app/_layout.tsx` - Root layout with loading states
