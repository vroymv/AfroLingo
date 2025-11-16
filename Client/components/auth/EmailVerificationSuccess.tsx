import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

/**
 * Email Verification Success Screen
 *
 * This screen can be used as a landing page after users click
 * the verification link in their email. It checks if the email
 * is verified and shows appropriate feedback.
 *
 * To use this with Firebase email verification:
 * 1. Set up deep linking in your app
 * 2. Configure the action URL in Firebase Console
 * 3. Add this screen to your routing configuration
 */
export default function EmailVerificationSuccess() {
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  useEffect(() => {
    // Check verification status
    const checkVerification = async () => {
      // Give it a moment for Firebase to update
      setTimeout(() => {
        setChecking(false);
      }, 2000);
    };

    checkVerification();

    // Auto-redirect after showing success message
    if (user?.emailVerified) {
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 3000);
    }
  }, [user?.emailVerified]);

  if (checking) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={colors.tint} />
        <ThemedText style={styles.checkingText}>
          Verifying your email...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {user?.emailVerified ? (
        <View style={styles.content}>
          <ThemedText style={styles.successEmoji}>✅</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Email Verified!
          </ThemedText>
          <ThemedText style={styles.message}>
            Your email has been successfully verified. You&apos;ll be redirected
            shortly...
          </ThemedText>
        </View>
      ) : (
        <View style={styles.content}>
          <ThemedText style={styles.successEmoji}>📧</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Verification Pending
          </ThemedText>
          <ThemedText style={styles.message}>
            Please click the verification link in your email. If you
            haven&apos;t received it, check your spam folder.
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    maxWidth: 400,
  },
  successEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  checkingText: {
    marginTop: 16,
    fontSize: 16,
  },
});
