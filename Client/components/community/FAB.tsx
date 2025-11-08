import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface FABProps {
  icon: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "small" | "medium" | "large";
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export function FAB({
  icon,
  onPress,
  variant = "primary",
  size = "medium",
  position = "bottom-right",
}: FABProps) {
  return (
    <TouchableOpacity
      style={[
        styles.fab,
        getVariantStyle(variant),
        getSizeStyle(size),
        getPositionStyle(position),
        styles.shadow,
      ]}
      onPress={onPress}
    >
      <ThemedText style={[styles.fabText, getTextSizeStyle(size)]}>
        {icon}
      </ThemedText>
    </TouchableOpacity>
  );
}

function getVariantStyle(variant: string) {
  switch (variant) {
    case "primary":
      return { backgroundColor: "#0096FF" };
    case "secondary":
      return { backgroundColor: "#6B7280" };
    case "success":
      return { backgroundColor: "#22C55E" };
    case "warning":
      return { backgroundColor: "#F97316" };
    case "danger":
      return { backgroundColor: "#EF4444" };
    default:
      return { backgroundColor: "#0096FF" };
  }
}

function getSizeStyle(size: string) {
  switch (size) {
    case "small":
      return { width: 48, height: 48, borderRadius: 24 };
    case "medium":
      return { width: 56, height: 56, borderRadius: 28 };
    case "large":
      return { width: 64, height: 64, borderRadius: 32 };
    default:
      return { width: 56, height: 56, borderRadius: 28 };
  }
}

function getTextSizeStyle(size: string) {
  switch (size) {
    case "small":
      return { fontSize: 20 };
    case "medium":
      return { fontSize: 24 };
    case "large":
      return { fontSize: 28 };
    default:
      return { fontSize: 24 };
  }
}

function getPositionStyle(position: string) {
  switch (position) {
    case "bottom-right":
      return { position: "absolute" as const, right: 20, bottom: 20 };
    case "bottom-left":
      return { position: "absolute" as const, left: 20, bottom: 20 };
    case "top-right":
      return { position: "absolute" as const, right: 20, top: 20 };
    case "top-left":
      return { position: "absolute" as const, left: 20, top: 20 };
    default:
      return { position: "absolute" as const, right: 20, bottom: 20 };
  }
}

const styles = StyleSheet.create({
  fab: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    color: "white",
  },
});
