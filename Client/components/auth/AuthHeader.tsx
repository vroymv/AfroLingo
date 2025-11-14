import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, View } from "react-native";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  const tintColor = useThemeColor({}, "tint");

  return (
    <View style={styles.header}>
      <View
        style={[styles.logoContainer, { backgroundColor: tintColor + "20" }]}
      >
        <ThemedText style={styles.logoIcon}>🌍</ThemedText>
      </View>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
