# Email Verification - Usage Examples

## Example 1: Basic Banner (Already Implemented)

The simplest way to remind users to verify their email:

```typescript
import EmailVerificationBanner from "@/components/auth/EmailVerificationBanner";

export default function ProfileScreen() {
  return (
    <View>
      <EmailVerificationBanner />
      {/* Rest of your screen */}
    </View>
  );
}
```

## Example 2: Using the Custom Hook

For more control over the verification UI:

```typescript
import { useEmailVerification } from "@/hooks/useEmailVerification";

export default function SettingsScreen() {
  const { isVerified, isLoading, message, resendEmail } =
    useEmailVerification();

  return (
    <View>
      {!isVerified && (
        <View style={styles.verificationSection}>
          <Text>Email Status: Unverified ⚠️</Text>

          <TouchableOpacity onPress={resendEmail} disabled={isLoading}>
            <Text>{isLoading ? "Sending..." : "Send Verification Email"}</Text>
          </TouchableOpacity>

          {message && (
            <Text
              style={{ color: message.type === "success" ? "green" : "red" }}
            >
              {message.text}
            </Text>
          )}
        </View>
      )}

      {isVerified && <Text>Email Status: Verified ✅</Text>}
    </View>
  );
}
```

## Example 3: Checking Verification Status

Before allowing certain actions:

```typescript
import { useAuth } from "@/contexts/AuthContext";

export default function PremiumFeatureScreen() {
  const { user } = useAuth();

  const handlePremiumAction = () => {
    if (!user?.emailVerified) {
      Alert.alert(
        "Email Verification Required",
        "Please verify your email to access premium features.",
        [
          { text: "OK", style: "cancel" },
          { text: "Resend Email", onPress: () => sendVerificationEmail() },
        ]
      );
      return;
    }

    // Continue with premium action
    performPremiumAction();
  };

  return (
    <TouchableOpacity onPress={handlePremiumAction}>
      <Text>Access Premium Feature</Text>
    </TouchableOpacity>
  );
}
```

## Example 4: Protected Route/Screen

Require verification before accessing a screen:

```typescript
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import EmailVerificationBanner from "@/components/auth/EmailVerificationBanner";

export default function ProtectedScreen() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.emailVerified) {
      // Optionally redirect unverified users
      Alert.alert(
        "Verification Required",
        "This feature requires email verification.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }
  }, [user]);

  if (!user?.emailVerified) {
    return (
      <View style={styles.container}>
        <Text>This feature requires email verification</Text>
        <EmailVerificationBanner />
      </View>
    );
  }

  return <View>{/* Protected content */}</View>;
}
```

## Example 5: Inline Verification Status

Show verification status in user profile:

```typescript
import { useAuth } from "@/contexts/AuthContext";
import { useEmailVerification } from "@/hooks/useEmailVerification";

export default function UserProfileCard() {
  const { user } = useAuth();
  const { resendEmail } = useEmailVerification();

  return (
    <View style={styles.card}>
      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>

      <View style={styles.verificationStatus}>
        {user?.emailVerified ? (
          <Text style={{ color: "green" }}>✅ Verified</Text>
        ) : (
          <View>
            <Text style={{ color: "orange" }}>⚠️ Unverified</Text>
            <TouchableOpacity onPress={resendEmail}>
              <Text style={{ color: "blue" }}>Verify Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
```

## Example 6: Conditional Feature Access

Show different content based on verification:

```typescript
import { useAuth } from "@/contexts/AuthContext";

export default function CommunityScreen() {
  const { user } = useAuth();

  return (
    <View>
      <EmailVerificationBanner />

      {user?.emailVerified ? (
        <>
          <CreatePostButton />
          <MessageUsersButton />
          <JoinGroupsButton />
        </>
      ) : (
        <View style={styles.lockedFeatures}>
          <Text>🔒 Verify your email to unlock community features:</Text>
          <Text>• Create posts</Text>
          <Text>• Message other users</Text>
          <Text>• Join groups</Text>
        </View>
      )}
    </View>
  );
}
```

## Example 7: Auto-Check After Login

Automatically check and notify about verification:

```typescript
// In your login screen or auth handler
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const { login, user } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);

      // Check verification status after login
      if (user && !user.emailVerified) {
        Alert.alert(
          "Email Not Verified",
          "Please verify your email to access all features. Check your inbox for the verification link.",
          [
            { text: "Later", style: "cancel" },
            {
              text: "Resend Email",
              onPress: async () => {
                try {
                  await sendVerificationEmail();
                  Alert.alert("Success", "Verification email sent!");
                } catch (error) {
                  Alert.alert("Error", "Failed to send email");
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      // Handle login error
    }
  };

  // Rest of login component
}
```

## Example 8: Require Verification Before Login

Prevent login if email is not verified:

```typescript
// Modify AuthContext.tsx login function:

const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Check if email is verified
    if (!userCredential.user.emailVerified) {
      // Sign out the user
      await signOut(auth);

      // Show error
      throw new Error(
        "Please verify your email before logging in. Check your inbox for the verification link."
      );
    }

    // Continue with normal login...
  } catch (error) {
    // Handle error...
  }
};
```

## Example 9: Verification Reminder Modal

Show a modal reminder periodically:

```typescript
import { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useEmailVerification } from "@/hooks/useEmailVerification";

export default function VerificationReminderModal() {
  const { user } = useAuth();
  const { resendEmail } = useEmailVerification();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Show modal every 24 hours if not verified
    if (user && !user.emailVerified) {
      const lastShown = localStorage.getItem("lastVerificationReminder");
      const now = Date.now();

      if (!lastShown || now - parseInt(lastShown) > 24 * 60 * 60 * 1000) {
        setShowModal(true);
        localStorage.setItem("lastVerificationReminder", now.toString());
      }
    }
  }, [user]);

  if (!showModal) return null;

  return (
    <Modal visible={showModal} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Verify Your Email</Text>
          <Text style={styles.modalText}>
            Please verify your email to unlock all features and secure your
            account.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={async () => {
              await resendEmail();
              setShowModal(false);
            }}
          >
            <Text>Send Verification Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setShowModal(false)}
          >
            <Text>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
```

## Example 10: Badge/Indicator Component

Small verification badge for any UI element:

```typescript
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "@/contexts/AuthContext";

export function VerificationBadge() {
  const { user } = useAuth();

  if (user?.emailVerified) {
    return (
      <View style={[styles.badge, styles.verified]}>
        <Text style={styles.badgeText}>✅</Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, styles.unverified]}>
      <Text style={styles.badgeText}>⚠️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  verified: {
    backgroundColor: "#10b981",
  },
  unverified: {
    backgroundColor: "#f59e0b",
  },
  badgeText: {
    fontSize: 12,
  },
});

// Usage in profile header:
<View style={styles.profileHeader}>
  <Text>{user?.name}</Text>
  <VerificationBadge />
</View>;
```

---

## Best Practices

1. **Don't block all features** - Let users explore the app while unverified
2. **Provide clear CTAs** - Make it easy to resend verification emails
3. **Be persistent but not annoying** - Show reminders, but don't spam
4. **Offer help** - Include support links if users don't receive emails
5. **Test thoroughly** - Use real email addresses during development
6. **Handle edge cases** - Account for spam folders, email delays, etc.
7. **Monitor metrics** - Track verification rates to improve UX

## Common Patterns

✅ **Show banner on profile/settings** (Already implemented)  
✅ **Inline status in user profile**  
✅ **Lock premium features until verified**  
⚠️ **Periodic reminder modals** (can be annoying)  
❌ **Block all app access** (too restrictive)

Choose the pattern that fits your app's needs!
