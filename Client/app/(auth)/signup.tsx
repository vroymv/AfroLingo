import { ThemedView } from "@/components/ThemedView";
import {
  AuthButton,
  AuthDivider,
  AuthHeader,
  AuthInput,
  PasswordInput,
  SocialAuthButtons,
  TermsCheckbox,
} from "@/components/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";

export default function SignupScreen() {
  const {
    signup,
    loginWithGoogle,
    loginWithApple,
    isLoading,
    error: authError,
    clearError,
  } = useAuth();
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  // Clear auth error when component unmounts
  useEffect(() => {
    return () => {
      if (authError) {
        clearError();
      }
    };
  }, [authError, clearError]);

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    // Clear any previous auth errors
    if (authError) {
      clearError();
    }

    try {
      await signup(name.trim(), email.toLowerCase().trim(), password);

      // Show non-blocking verification reminder
      Alert.alert(
        "📧 Check Your Email",
        `We've sent a verification email to ${email
          .toLowerCase()
          .trim()}.\n\nPlease check your inbox (and spam folder) to verify your account.\n\nYou can continue using the app while we wait for verification!`,
        [
          {
            text: "Got it!",
            style: "default",
          },
        ],
        { cancelable: true }
      );

      // Navigation will be handled by the root layout based on auth state
    } catch {
      // Error is now displayed inline via authError state
    }
  };

  const handleGoogleSignup = async () => {
    // Clear any previous auth errors
    if (authError) {
      clearError();
    }

    try {
      setIsGoogleLoading(true);
      await loginWithGoogle();
      // Navigation will be handled by the root layout based on auth state
    } catch {
      // Error is now displayed inline via authError state
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignup = async () => {
    // Clear any previous auth errors
    if (authError) {
      clearError();
    }

    try {
      setIsAppleLoading(true);
      await loginWithApple();
      // Navigation will be handled by the root layout based on auth state
    } catch {
      // Error is now displayed inline via authError state
    } finally {
      setIsAppleLoading(false);
    }
  };

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
            {/* Header */}
            <AuthHeader
              title="Create Account"
              subtitle="Start your African language learning journey today"
              variant="signup"
            />

            {/* Form */}
            <View style={styles.form}>
              {/* Error Message */}
              {authError && (
                <View
                  style={[
                    styles.errorContainer,
                    { backgroundColor: "#FEE2E2", borderColor: "#EF4444" },
                  ]}
                >
                  <Ionicons name="alert-circle" size={20} color="#DC2626" />
                  <ThemedText style={styles.errorText}>{authError}</ThemedText>
                  <TouchableOpacity
                    onPress={clearError}
                    style={styles.errorClose}
                  >
                    <Ionicons name="close" size={20} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Name Input */}
              <AuthInput
                label="Full Name"
                icon="person-outline"
                placeholder="John Doe"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name)
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  if (authError) clearError();
                }}
                error={errors.name}
                autoCapitalize="words"
                autoComplete="name"
              />

              {/* Email Input */}
              <AuthInput
                label="Email"
                icon="mail-outline"
                placeholder="your.email@example.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  if (authError) clearError();
                }}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
              />

              {/* Password Input */}
              <PasswordInput
                label="Password"
                placeholder="Create a strong password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password)
                    setErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                  if (authError) clearError();
                }}
                error={errors.password}
                autoComplete="password-new"
              />

              {/* Confirm Password Input */}
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                  if (authError) clearError();
                }}
                error={errors.confirmPassword}
                autoComplete="password-new"
              />

              {/* Terms and Conditions */}
              <TermsCheckbox
                agreed={agreedToTerms}
                onToggle={() => {
                  setAgreedToTerms(!agreedToTerms);
                  if (errors.terms)
                    setErrors((prev) => ({ ...prev, terms: undefined }));
                }}
                error={errors.terms}
              />

              {/* Signup Button */}
              <AuthButton
                title="Create Account"
                onPress={handleSignup}
                isLoading={isLoading}
                style={{ marginTop: 24, marginBottom: 24 }}
              />

              {/* Divider */}
              <AuthDivider />

              {/* Social Signup */}
              <SocialAuthButtons
                onGooglePress={handleGoogleSignup}
                onApplePress={handleAppleSignup}
                isGoogleLoading={isGoogleLoading}
                isAppleLoading={isAppleLoading}
                disabled={isLoading}
              />

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <ThemedText style={styles.loginText}>
                  Already have an account?{" "}
                </ThemedText>
                <Link href="./login" asChild>
                  <TouchableOpacity>
                    <ThemedText
                      style={[styles.loginLink, { color: tintColor }]}
                    >
                      Sign In
                    </ThemedText>
                  </TouchableOpacity>
                </Link>
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
    paddingTop: 40,
    paddingBottom: 32,
  },
  form: {
    flex: 1,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: "#DC2626",
    fontWeight: "500",
  },
  errorClose: {
    padding: 4,
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
