import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function EmailVerificationBanner() {
  const { isVerified, isLoading, message, resendEmail } =
    useEmailVerification();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Don't show banner if email is verified
  if (isVerified) {
    return null;
  }

  return (
    <View style={[styles.banner, { backgroundColor: colors.tint + "20" }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          📧 Verify Your Email
        </Text>
        <Text style={[styles.description, { color: colors.text + "CC" }]}>
          Please verify your email address to access all features.
        </Text>
        {message && (
          <Text
            style={[
              styles.message,
              {
                color: message.type === "success" ? "#10b981" : "#ef4444",
              },
            ]}
          >
            {message.text}
          </Text>
        )}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={resendEmail}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Resend Verification Email</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "500",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
