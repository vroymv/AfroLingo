import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  AuthButton,
  AuthDivider,
  AuthHeader,
  AuthInput,
  PasswordInput,
  SocialAuthButtons,
} from "@/components/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
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

export default function LoginScreen() {
  const { login, loginWithGoogle, loginWithApple, isLoading } = useAuth();
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(email.toLowerCase().trim(), password);
      // Navigation will be handled by the root layout based on auth state
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error
          ? error.message
          : "Invalid email or password. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      await loginWithGoogle();
      // Navigation will be handled by the root layout based on auth state
    } catch (error) {
      Alert.alert(
        "Google Sign In Failed",
        error instanceof Error
          ? error.message
          : "Unable to sign in with Google. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setIsAppleLoading(true);
      await loginWithApple();
      // Navigation will be handled by the root layout based on auth state
    } catch (error) {
      Alert.alert(
        "Apple Sign In Failed",
        error instanceof Error
          ? error.message
          : "Unable to sign in with Apple. Please try again.",
        [{ text: "OK" }]
      );
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
              title="Welcome Back!"
              subtitle="Sign in to continue your language journey"
            />

            {/* Form */}
            <View style={styles.form}>
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
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                error={errors.password}
                autoComplete="password"
              />

              {/* Forgot Password Link */}
              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity style={styles.forgotPassword}>
                  <ThemedText
                    style={[styles.forgotPasswordText, { color: tintColor }]}
                  >
                    Forgot Password?
                  </ThemedText>
                </TouchableOpacity>
              </Link>

              {/* Login Button */}
              <AuthButton
                title="Sign In"
                onPress={handleLogin}
                isLoading={isLoading}
              />

              {/* Divider */}
              <AuthDivider />

              {/* Social Login */}
              <SocialAuthButtons
                onGooglePress={handleGoogleLogin}
                onApplePress={handleAppleLogin}
                isGoogleLoading={isGoogleLoading}
                isAppleLoading={isAppleLoading}
                disabled={isLoading}
              />

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <ThemedText style={styles.signupText}>
                  Don&apos;t have an account?{" "}
                </ThemedText>
                <Link href="/(auth)/signup" asChild>
                  <TouchableOpacity>
                    <ThemedText
                      style={[styles.signupLink, { color: tintColor }]}
                    >
                      Sign Up
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
