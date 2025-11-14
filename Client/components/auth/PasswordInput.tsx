import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface PasswordInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  autoComplete?: "password" | "password-new";
}

export function PasswordInput({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  autoComplete = "password",
}: PasswordInputProps) {
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? "#FF6B6B" : tintColor + "30",
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
          placeholder={placeholder}
          placeholderTextColor={textColor + "60"}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoComplete={autoComplete}
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
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
