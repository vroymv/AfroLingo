import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface TermsCheckboxProps {
  agreed: boolean;
  onToggle: () => void;
  error?: string;
}

export function TermsCheckbox({ agreed, onToggle, error }: TermsCheckboxProps) {
  const tintColor = useThemeColor({}, "tint");

  return (
    <>
      <TouchableOpacity
        style={styles.termsContainer}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkbox,
            {
              borderColor: error ? "#FF6B6B" : tintColor + "30",
              backgroundColor: agreed ? tintColor : "transparent",
            },
          ]}
        >
          {agreed && <Ionicons name="checkmark" size={16} color="#fff" />}
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
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
    </>
  );
}

const styles = StyleSheet.create({
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
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
