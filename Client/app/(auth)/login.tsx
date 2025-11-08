import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
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

export default function LoginScreen() {
  const { login, loginWithGoogle, loginWithApple, isLoading } = useAuth();
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
            <View style={styles.header}>
              <View
                style={[
                  styles.logoContainer,
                  { backgroundColor: tintColor + "20" },
                ]}
              >
                <ThemedText style={styles.logoIcon}>🌍</ThemedText>
              </View>
              <ThemedText style={styles.title}>Welcome Back!</ThemedText>
              <ThemedText style={styles.subtitle}>
                Sign in to continue your language journey
              </ThemedText>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Email</ThemedText>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      borderColor: errors.email ? "#FF6B6B" : tintColor + "30",
                    },
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
                      if (errors.email)
                        setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                  />
                </View>
                {errors.email && (
                  <ThemedText style={styles.errorText}>
                    {errors.email}
                  </ThemedText>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Password</ThemedText>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      borderColor: errors.password
                        ? "#FF6B6B"
                        : tintColor + "30",
                    },
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={tintColor}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="Enter your password"
                    placeholderTextColor={textColor + "60"}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={tintColor}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <ThemedText style={styles.errorText}>
                    {errors.password}
                  </ThemedText>
                )}
              </View>

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
              <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: tintColor }]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.loginButtonText}>
                    Sign In
                  </ThemedText>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: tintColor + "30" },
                  ]}
                />
                <ThemedText style={styles.dividerText}>or</ThemedText>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: tintColor + "30" },
                  ]}
                />
              </View>

              {/* Social Login (Optional - can be implemented later) */}
              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    { borderColor: tintColor + "30" },
                  ]}
                  onPress={handleGoogleLogin}
                  disabled={isGoogleLoading || isLoading}
                  activeOpacity={0.7}
                >
                  {isGoogleLoading ? (
                    <ActivityIndicator size="small" color={tintColor} />
                  ) : (
                    <>
                      <ThemedText style={styles.socialIcon}>G</ThemedText>
                      <ThemedText style={styles.socialButtonText}>
                        Google
                      </ThemedText>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    { borderColor: tintColor + "30" },
                  ]}
                  onPress={handleAppleLogin}
                  disabled={isAppleLoading || isLoading}
                  activeOpacity={0.7}
                >
                  {isAppleLoading ? (
                    <ActivityIndicator size="small" color={tintColor} />
                  ) : (
                    <>
                      <ThemedText style={styles.socialIcon}></ThemedText>
                      <ThemedText style={styles.socialButtonText}>
                        Apple
                      </ThemedText>
                    </>
                  )}
                </TouchableOpacity>
              </View>

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
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
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
  passwordToggle: {
    padding: 4,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    opacity: 0.6,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    gap: 8,
  },
  socialIcon: {
    fontSize: 20,
    fontWeight: "bold",
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
