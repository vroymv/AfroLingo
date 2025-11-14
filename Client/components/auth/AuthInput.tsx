import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

interface AuthInputProps extends Omit<TextInputProps, "style"> {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  error?: string;
  onChangeText: (text: string) => void;
  value: string;
}

export function AuthInput({
  label,
  icon,
  error,
  onChangeText,
  value,
  ...textInputProps
}: AuthInputProps) {
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

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
          name={icon}
          size={20}
          color={tintColor}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholderTextColor={textColor + "60"}
          value={value}
          onChangeText={onChangeText}
          {...textInputProps}
        />
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
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
