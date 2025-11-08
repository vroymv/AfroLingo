# 🚀 Quick Start - Testing Authentication

## Running the App

```bash
cd Client
npm start
```

Then press:

- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code for physical device

## 🔐 Test Flow

### 1. First Launch

- App opens to **Login Screen**
- Beautiful gradient background with AfroLingo logo

### 2. Create Account

1. Tap "Sign Up" link at bottom
2. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "Test1234" (must have uppercase, lowercase, number)
   - Confirm Password: "Test1234"
3. Check "I agree to terms"
4. Tap "Create Account"
5. ✅ Auto-logged in!

### 3. Onboarding Flow

After signup, you'll see:

1. Welcome screen
2. Language selection
3. Path selection
4. Level selection
5. Personalization
6. Main app!

### 4. Test Login

To test login separately:

1. Logout (when backend is connected)
2. Or clear app data
3. Login with:
   - Email: "test@example.com"
   - Password: "Test1234"

### 5. Forgot Password

1. On login screen, tap "Forgot Password?"
2. Enter email: "test@example.com"
3. Tap "Send Reset Link"
4. See success screen with instructions

## 📱 Features to Test

### ✅ Login Screen

- [ ] Email validation (invalid format shows error)
- [ ] Password visibility toggle
- [ ] "Forgot Password" link works
- [ ] "Sign Up" link navigates correctly
- [ ] Loading state on submit
- [ ] Error handling

### ✅ Signup Screen

- [ ] All fields validate properly
- [ ] Password strength requirements work
- [ ] Passwords must match
- [ ] Terms checkbox required
- [ ] "Sign In" link works
- [ ] Account creation succeeds

### ✅ Forgot Password

- [ ] Email validation
- [ ] Success screen shows
- [ ] "Back to Sign In" works
- [ ] "Try Different Email" resets form

### ✅ Navigation Flow

- [ ] Login → Onboarding (first time)
- [ ] Login → Main App (returning user)
- [ ] Persistent login (close/reopen app)
- [ ] Logout redirects to login

## 🎨 UI/UX to Check

- ✨ Smooth animations
- 🎨 Beautiful gradients
- 📱 Keyboard handling (inputs scroll into view)
- 🔄 Loading states with spinners
- ⚠️ Error messages are clear
- 👁️ Password visibility toggle
- 📝 Placeholder text helpful
- ✅ Form validation instant feedback

## 🐛 Common Issues & Fixes

### Issue: App crashes on launch

```bash
# Clear metro cache
cd Client
npm start -- --clear
```

### Issue: AsyncStorage error

```bash
# Reinstall dependencies
cd Client
rm -rf node_modules
npm install
```

### Issue: Can't see login screen

- Check if `app/(auth)/login.tsx` exists
- Verify `AuthProvider` wraps app in `_layout.tsx`

### Issue: Stuck on loading screen

- Check console for errors
- Verify AsyncStorage permissions
- Try clearing app data

## 📊 Test Scenarios

### Happy Path

1. ✅ New user signs up
2. ✅ Completes onboarding
3. ✅ Closes app
4. ✅ Reopens app (stays logged in)
5. ✅ Uses the app
6. ✅ Logs out
7. ✅ Logs back in

### Error Handling

1. ❌ Invalid email format
2. ❌ Weak password
3. ❌ Passwords don't match
4. ❌ Missing required fields
5. ❌ Network error (when backend connected)

## 🔧 Development Tips

### Skip Auth During Development

Temporarily in `app/_layout.tsx`:

```typescript
// Comment out auth check
// if (!isAuthenticated) {
//   return <Redirect href="/(auth)/login" />;
// }
```

### Test Different States

1. **Not logged in**: Clear AsyncStorage
2. **Logged in, no onboarding**: Set auth, clear onboarding
3. **Full access**: Complete both

### Clear All Data

```bash
# iOS
xcrun simctl delete all

# Android
adb shell pm clear com.yourapp

# Or just reinstall the app
```

## 📸 Screenshots to Verify

Take screenshots of:

1. Login screen
2. Signup screen
3. Forgot password (both states)
4. Loading screen
5. Onboarding flow

## ✅ Ready for Backend?

Once testing is complete:

1. Set up your backend API
2. Update `AuthContext.tsx` with real endpoints
3. Configure environment variables
4. Test with real authentication
5. Add error handling for API failures

## 🎯 Next Steps

After authentication works:

1. Add email verification
2. Implement social login
3. Add biometric auth (Face ID/Touch ID)
4. Create profile management
5. Add logout functionality
6. Implement password change
7. Add account deletion

## 💡 Pro Tips

- Test on both iOS and Android
- Try different screen sizes
- Test with slow network (Network Link Conditioner)
- Verify accessibility features
- Check dark mode support
- Test keyboard navigation

---

**Need Help?** Check `docs/authentication-system.md` for detailed documentation!
