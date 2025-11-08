import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface TagProps {
  text: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "small" | "medium" | "large";
  onPress?: () => void;
}

export function Tag({
  text,
  variant = "primary",
  size = "medium",
  onPress,
}: TagProps) {
  const Component = onPress ? TouchableOpacity : ThemedText;

  return (
    <Component
      style={[styles.tag, getVariantStyle(variant), getSizeStyle(size)]}
      onPress={onPress}
    >
      <ThemedText style={[styles.tagText, getTextStyle(variant)]}>
        {text}
      </ThemedText>
    </Component>
  );
}

function getVariantStyle(variant: string) {
  switch (variant) {
    case "primary":
      return { backgroundColor: "rgba(0, 150, 255, 0.2)" };
    case "secondary":
      return { backgroundColor: "rgba(156, 163, 175, 0.2)" };
    case "success":
      return { backgroundColor: "rgba(34, 197, 94, 0.2)" };
    case "warning":
      return { backgroundColor: "rgba(249, 115, 22, 0.2)" };
    case "danger":
      return { backgroundColor: "rgba(239, 68, 68, 0.2)" };
    default:
      return { backgroundColor: "rgba(0, 150, 255, 0.2)" };
  }
}

function getSizeStyle(size: string) {
  switch (size) {
    case "small":
      return { paddingHorizontal: 8, paddingVertical: 4 };
    case "medium":
      return { paddingHorizontal: 12, paddingVertical: 6 };
    case "large":
      return { paddingHorizontal: 16, paddingVertical: 8 };
    default:
      return { paddingHorizontal: 12, paddingVertical: 6 };
  }
}

function getTextStyle(variant: string) {
  switch (variant) {
    case "primary":
      return { color: "#0096FF" };
    case "secondary":
      return { color: "#9CA3AF" };
    case "success":
      return { color: "#22C55E" };
    case "warning":
      return { color: "#F97316" };
    case "danger":
      return { color: "#EF4444" };
    default:
      return { color: "#0096FF" };
  }
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
