# 🔥 Firebase Authentication Setup - Step by Step Guide

## 📋 Overview

We'll integrate Firebase Authentication to replace the mock auth system with real authentication, including:

- ✅ Email/Password authentication
- ✅ Google OAuth
- ✅ Apple Sign In
- ✅ Password reset
- ✅ User management

---

## STEP 1: Create Firebase Project (5 minutes)

### 1.1 Go to Firebase Console

```
👉 Visit: https://console.firebase.google.com/
```

### 1.2 Create New Project

1. Click **"Add project"** or **"Create a project"**
2. Enter project name: **`AfroLingo`** (or your preferred name)
3. Click **"Continue"**
4. **Google Analytics**: Enable (recommended) or Skip
5. If enabled, select/create Analytics account
6. Click **"Create project"**
7. Wait for project creation (30-60 seconds)
8. Click **"Continue"**

### 1.3 Project Created ✅

You should now see your Firebase project dashboard.

---

## STEP 2: Enable Authentication Methods (3 minutes)

### 2.1 Navigate to Authentication

1. In left sidebar, click **"Build"** → **"Authentication"**
2. Click **"Get started"** button

### 2.2 Enable Email/Password

1. Go to **"Sign-in method"** tab
2. Click **"Email/Password"**
3. Toggle **"Enable"** to ON
4. Click **"Save"**

### 2.3 Enable Google Sign-In

1. Still in **"Sign-in method"** tab
2. Click **"Google"**
3. Toggle **"Enable"** to ON
4. Enter **"Project support email"**: Your email
5. Click **"Save"**

### 2.4 Enable Apple Sign-In (iOS only)

1. Still in **"Sign-in method"** tab
2. Click **"Apple"**
3. Toggle **"Enable"** to ON
4. Click **"Save"**

**Note:** Apple Sign-In requires additional setup in Apple Developer Portal (we'll cover this later).

---

## STEP 3: Register Your Apps (10 minutes)

### 3.1 Register iOS App

#### A. Click iOS Icon

1. On Firebase project overview page
2. Click the **iOS icon** (</> or iOS logo)

#### B. Fill App Details

```
iOS bundle ID: com.yourcompany.afrolingo
App nickname: AfroLingo iOS (optional)
App Store ID: (leave blank for now)
```

#### C. Download Config File

1. Download **`GoogleService-Info.plist`**
2. Save it - we'll add it to the project soon

Important: **Do not commit this file to GitHub** (it is ignored by `.gitignore`).

#### D. Click "Next" through the remaining steps

- SDK setup (we'll do this via npm)
- Click "Continue to console"

### 3.2 Register Android App

#### A. Click Android Icon

1. Back on project overview
2. Click the **Android icon**

#### B. Fill App Details

```
Android package name: com.yourcompany.afrolingo
App nickname: AfroLingo Android (optional)
Debug signing certificate SHA-1: (we'll add this later)
```

#### C. Download Config File

1. Download **`google-services.json`**
2. Save it - we'll add it to the project soon

Important: **Do not commit this file to GitHub** (it is ignored by `.gitignore`).

#### D. Click "Next" through the remaining steps

- SDK setup (we'll do this via npm)
- Click "Continue to console"

### 3.3 Register Web App (Optional but recommended)

#### A. Click Web Icon

1. Back on project overview
2. Click the **</>** (web) icon

#### B. Fill Details

```
App nickname: AfroLingo Web
Firebase Hosting: No (uncheck)
```

#### C. Copy Firebase Config

You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "afrolingo-xxxxx.firebaseapp.com",
  projectId: "afrolingo-xxxxx",
  storageBucket: "afrolingo-xxxxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:xxxxx",
};
```

**📝 SAVE THIS!** We'll use it soon.

---

## STEP 4: Install Firebase SDK (2 minutes)

### 4.1 Open Terminal in Your Project

```bash
cd /Users/roy/Documents/AfroLingo/Client
```

### 4.2 Install Firebase Packages

```bash
npm install firebase @react-native-firebase/app @react-native-firebase/auth
```

**Wait for installation to complete...**

---

## STEP 5: Add Firebase Config Files (5 minutes)

### 5.1 For iOS

#### A. Add GoogleService-Info.plist

```bash
# Copy the downloaded file to iOS folder
cp ~/Downloads/GoogleService-Info.plist ./ios/AfroLingo/
```

Note: This file should stay local (not committed).

#### B. Update Podfile

File: `ios/Podfile`

Add at the top (after the platform line):

```ruby
# Add this line
$RNFirebaseAsStaticFramework = true
```

#### C. Install Pods

```bash
cd ios
pod install
cd ..
```

### 5.2 For Android

#### A. Add google-services.json

```bash
# Copy the downloaded file to Android folder
cp ~/Downloads/google-services.json ./android/app/
```

Note: This file should stay local (not committed).

#### B. Update build.gradle (Project level)

File: `android/build.gradle`

Add in dependencies:

```gradle
dependencies {
    classpath 'com.google.gms:google-services:4.3.15'
}
```

#### C. Update build.gradle (App level)

File: `android/app/build.gradle`

Add at the bottom:

```gradle
apply plugin: 'com.google.gms.google-services'
```

---

## STEP 6: Create Firebase Configuration (3 minutes)

### 6.1 Create Config File

**I'll create this file for you in the next step!**

File: `Client/config/firebase.ts`

This will contain:

- Firebase initialization
- Auth instance export
- All Firebase config

---

## STEP 7: Update Environment Variables (2 minutes)

### 7.1 Create .env file

**I'll create this for you!**

File: `Client/.env`

Add your Firebase config (from Step 3.3)

---

## STEP 8: Update AuthContext (5 minutes)

**I'll update this file for you!**

Changes:

- Replace mock login with Firebase auth
- Replace mock signup with Firebase createUser
- Replace mock OAuth with Firebase Google/Apple sign-in
- Add real password reset
- Add Firebase auth state listener

---

## STEP 9: Test Authentication (10 minutes)

### 9.1 Test Email/Password Signup

```
1. Run: npm start
2. Create account with real email
3. Check Firebase Console → Authentication → Users
4. You should see the new user!
```

### 9.2 Test Login

```
1. Login with the email/password you just created
2. Should work!
```

### 9.3 Test Password Reset

```
1. Tap "Forgot Password"
2. Enter your email
3. Check your email inbox
4. You'll receive a password reset link!
```

### 9.4 Test Google Sign-In

```
1. Tap "Google" button
2. Google OAuth flow opens
3. Select account
4. Sign in!
```

---

## STEP 10: Configure Google Sign-In (Android) (5 minutes)

### 10.1 Get SHA-1 Certificate

#### For Debug Build

```bash
cd android
./gradlew signingReport
```

Copy the SHA-1 fingerprint.

#### Add to Firebase

1. Go to Firebase Console
2. Project Settings → Your Android App
3. Add SHA-1 fingerprint
4. Save

### 10.2 Download Updated google-services.json

1. Download the updated file
2. Replace in `android/app/`

---

## STEP 11: Configure Apple Sign-In (iOS) (10 minutes)

### 11.1 Apple Developer Portal Setup

```
1. Go to: https://developer.apple.com/account/
2. Certificates, Identifiers & Profiles
3. Identifiers → App IDs
4. Find your app or create new
5. Enable "Sign in with Apple"
6. Save
```

### 11.2 Create Service ID

```
1. Identifiers → Services IDs
2. Click +
3. Description: AfroLingo Apple Sign In
4. Identifier: com.yourcompany.afrolingo.signin
5. Enable "Sign in with Apple"
6. Configure:
   - Primary App ID: Your app
   - Domains: Your Firebase authDomain
   - Return URLs: Your Firebase OAuth redirect
7. Save
```

### 11.3 Update Firebase

```
1. Firebase Console → Authentication → Sign-in method
2. Click Apple
3. Add your Service ID
4. Add Team ID (from Apple Developer)
5. Add Key ID and Private Key (from Apple Developer)
6. Save
```

---

## ✅ Checklist - What You Need

### Before We Start

- [ ] Firebase account (Google account)
- [ ] Apple Developer account ($99/year - for Apple Sign-In)
- [ ] Access to your email for testing

### Information to Collect

- [ ] Firebase Web Config (apiKey, authDomain, etc.)
- [ ] iOS Bundle ID (e.g., com.yourcompany.afrolingo)
- [ ] Android Package Name (same as iOS)
- [ ] SHA-1 fingerprint (Android debug)
- [ ] Apple Team ID (if using Apple Sign-In)

### Files You'll Download

- [ ] GoogleService-Info.plist (iOS)
- [ ] google-services.json (Android)

---

## 🎯 Let's Start!

**Ready to begin?** Tell me:

1. **Do you already have a Firebase account?**
   - Yes → Let's go to Step 1
   - No → Create one at https://firebase.google.com/

2. **What's your preferred bundle ID/package name?**
   - Example: `com.yourcompany.afrolingo`
   - Or: `com.afrolingo.app`

3. **Do you have an Apple Developer account?**
   - Yes → We can set up Apple Sign-In
   - No → We'll skip Apple for now (can add later)

Once you answer these, I'll guide you through each step and create all the necessary code files!

---

## 📝 What I'll Create For You

Once you complete Steps 1-5, I'll automatically create:

1. ✅ `Client/config/firebase.ts` - Firebase initialization
2. ✅ `Client/.env` - Environment variables
3. ✅ Updated `AuthContext.tsx` - Real Firebase auth
4. ✅ Updated auth screens - Better error handling
5. ✅ `docs/firebase-setup-complete.md` - Documentation

---

## 🚀 Time Estimate

- **Quick Setup** (Email/Password only): 20 minutes
- **Full Setup** (Email + Google + Apple): 45 minutes
- **First Time** (including account creation): 60 minutes

---

**Reply with your answers to the 3 questions above, and we'll get started!** 🔥
