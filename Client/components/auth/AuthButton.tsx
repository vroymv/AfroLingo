import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function AuthButton({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  style,
}: AuthButtonProps) {
  const tintColor = useThemeColor({}, "tint");

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: tintColor }, style]}
      onPress={onPress}
      disabled={isLoading || disabled}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <ThemedText style={styles.buttonText}>{title}</ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
