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

export default function SignupScreen() {
  const { signup, loginWithGoogle, loginWithApple, isLoading } = useAuth();
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    try {
      await signup(name.trim(), email.toLowerCase().trim(), password);
      // Navigation will be handled by the root layout based on auth state
    } catch (error) {
      Alert.alert(
        "Signup Failed",
        error instanceof Error
          ? error.message
          : "Unable to create account. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsGoogleLoading(true);
      await loginWithGoogle();
      // Navigation will be handled by the root layout based on auth state
    } catch (error) {
      Alert.alert(
        "Google Sign Up Failed",
        error instanceof Error
          ? error.message
          : "Unable to sign up with Google. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignup = async () => {
    try {
      setIsAppleLoading(true);
      await loginWithApple();
      // Navigation will be handled by the root layout based on auth state
    } catch (error) {
      Alert.alert(
        "Apple Sign Up Failed",
        error instanceof Error
          ? error.message
          : "Unable to sign up with Apple. Please try again.",
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
              <ThemedText style={styles.title}>Create Account</ThemedText>
              <ThemedText style={styles.subtitle}>
                Start your African language learning journey today
              </ThemedText>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Full Name</ThemedText>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      borderColor: errors.name ? "#FF6B6B" : tintColor + "30",
                    },
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={tintColor}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="John Doe"
                    placeholderTextColor={textColor + "60"}
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                </View>
                {errors.name && (
                  <ThemedText style={styles.errorText}>
                    {errors.name}
                  </ThemedText>
                )}
              </View>

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
                    placeholder="Create a strong password"
                    placeholderTextColor={textColor + "60"}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password)
                        setErrors((prev) => ({
                          ...prev,
                          password: undefined,
                        }));
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password-new"
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

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Confirm Password</ThemedText>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      borderColor: errors.confirmPassword
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
                    placeholder="Confirm your password"
                    placeholderTextColor={textColor + "60"}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (errors.confirmPassword)
                        setErrors((prev) => ({
                          ...prev,
                          confirmPassword: undefined,
                        }));
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.passwordToggle}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-outline" : "eye-off-outline"
                      }
                      size={20}
                      color={tintColor}
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <ThemedText style={styles.errorText}>
                    {errors.confirmPassword}
                  </ThemedText>
                )}
              </View>

              {/* Terms and Conditions */}
              <TouchableOpacity
                style={styles.termsContainer}
                onPress={() => {
                  setAgreedToTerms(!agreedToTerms);
                  if (errors.terms)
                    setErrors((prev) => ({ ...prev, terms: undefined }));
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: errors.terms ? "#FF6B6B" : tintColor + "30",
                      backgroundColor: agreedToTerms
                        ? tintColor
                        : "transparent",
                    },
                  ]}
                >
                  {agreedToTerms && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <ThemedText style={styles.termsText}>
                  I agree to the{" "}
                  <ThemedText style={[styles.termsLink, { color: tintColor }]}>
                    Terms of Service
                  </ThemedText>{" "}
                  and{" "}
                  <ThemedText style={[styles.termsLink, { color: tintColor }]}>
                    Privacy Policy
                  </ThemedText>
                </ThemedText>
              </TouchableOpacity>
              {errors.terms && (
                <ThemedText style={styles.errorText}>{errors.terms}</ThemedText>
              )}

              {/* Signup Button */}
              <TouchableOpacity
                style={[
                  styles.signupButton,
                  { backgroundColor: tintColor, marginTop: 24 },
                ]}
                onPress={handleSignup}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.signupButtonText}>
                    Create Account
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

              {/* Social Signup (Optional - can be implemented later) */}
              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    { borderColor: tintColor + "30" },
                  ]}
                  onPress={handleGoogleSignup}
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
                  onPress={handleAppleSignup}
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
  header: {
    alignItems: "center",
    marginBottom: 32,
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  signupButton: {
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  signupButtonText: {
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
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
