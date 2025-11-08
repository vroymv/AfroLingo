import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    try {
      setIsLoading(true);
      setError("");
      await resetPassword(email.toLowerCase().trim());
      setEmailSent(true);
    } catch (err) {
      Alert.alert(
        "Error",
        err instanceof Error
          ? err.message
          : "Failed to send reset email. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  if (emailSent) {
    return (
      <ThemedView style={[styles.root, { backgroundColor }]}>
        <StatusBar style="auto" />
        <LinearGradient
          colors={[tintColor + "15", backgroundColor]}
          style={styles.gradient}
        />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.successContainer}>
            <View
              style={[
                styles.successIconContainer,
                { backgroundColor: "#4CAF50" + "20" },
              ]}
            >
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            </View>

            <ThemedText style={styles.successTitle}>
              Check Your Email
            </ThemedText>
            <ThemedText style={styles.successMessage}>
              We&apos;ve sent password reset instructions to:
            </ThemedText>
            <ThemedText style={[styles.emailText, { color: tintColor }]}>
              {email}
            </ThemedText>

            <View style={styles.instructionsBox}>
              <ThemedText style={styles.instructionsTitle}>
                Next Steps:
              </ThemedText>
              <ThemedText style={styles.instructionsText}>
                1. Check your email inbox{"\n"}
                2. Click the reset link in the email{"\n"}
                3. Create a new password{"\n"}
                4. Sign in with your new password
              </ThemedText>
            </View>

            <ThemedText style={styles.noteText}>
              Didn&apos;t receive the email? Check your spam folder or try
              again.
            </ThemedText>

            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: tintColor }]}
              onPress={handleBackToLogin}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.backButtonText}>
                Back to Sign In
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => {
                setEmailSent(false);
                setEmail("");
              }}
            >
              <ThemedText
                style={[styles.resendButtonText, { color: tintColor }]}
              >
                Try Different Email
              </ThemedText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.root, { backgroundColor }]}>
      <StatusBar style="auto" />
      <LinearGradient
        colors={[tintColor + "15", backgroundColor]}
        style={styles.gradient}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButtonTop}
              onPress={handleBackToLogin}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={tintColor} />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: tintColor + "20" },
                ]}
              >
                <Ionicons name="lock-closed" size={32} color={tintColor} />
              </View>
              <ThemedText style={styles.title}>Forgot Password?</ThemedText>
              <ThemedText style={styles.subtitle}>
                No worries! Enter your email and we&apos;ll send you reset
                instructions.
              </ThemedText>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Email Address</ThemedText>
                <View
                  style={[
                    styles.inputContainer,
                    { borderColor: error ? "#FF6B6B" : tintColor + "30" },
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={tintColor}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="your.email@example.com"
                    placeholderTextColor={textColor + "60"}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (error) setError("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    autoFocus
                  />
                </View>
                {error && (
                  <ThemedText style={styles.errorText}>{error}</ThemedText>
                )}
              </View>

              <TouchableOpacity
                style={[styles.resetButton, { backgroundColor: tintColor }]}
                onPress={handleResetPassword}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons
                      name="send-outline"
                      size={20}
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <ThemedText style={styles.resetButtonText}>
                      Send Reset Link
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>

              {/* Additional Info */}
              <View style={styles.infoBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={tintColor}
                  style={{ marginRight: 8 }}
                />
                <ThemedText style={styles.infoText}>
                  The reset link will be valid for 24 hours
                </ThemedText>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  backButtonTop: {
    alignSelf: "flex-start",
    padding: 8,
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  resetButton: {
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 24,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(100, 100, 100, 0.1)",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 32,
    textAlign: "center",
  },
  instructionsBox: {
    width: "100%",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "rgba(100, 100, 100, 0.1)",
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 24,
    opacity: 0.8,
  },
  noteText: {
    fontSize: 13,
    opacity: 0.6,
    textAlign: "center",
    marginBottom: 32,
  },
  backButton: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendButton: {
    padding: 12,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
