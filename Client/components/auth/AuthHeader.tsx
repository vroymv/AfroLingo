import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  const tintColor = useThemeColor({}, "tint");

  return (
    <View style={styles.header}>
      {/* Logo with gradient background and subtle shadow */}
      <View style={styles.logoWrapper}>
        <LinearGradient
          colors={[tintColor + "25", tintColor + "15"]}
          style={styles.logoGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View
            style={[styles.logoInner, { backgroundColor: tintColor + "10" }]}
          >
            <ThemedText style={styles.logoIcon}>🌍</ThemedText>
          </View>
        </LinearGradient>
      </View>

      {/* Title with improved spacing */}
      <ThemedText style={styles.title}>{title}</ThemedText>

      {/* Subtitle with better hierarchy */}
      <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>

      {/* Decorative underline */}
      <View style={styles.decorativeLine}>
        <View style={[styles.lineSegment, { backgroundColor: tintColor }]} />
        <View style={[styles.lineDot, { backgroundColor: tintColor }]} />
        <View style={[styles.lineSegment, { backgroundColor: tintColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  logoWrapper: {
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  logoGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  logoInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    fontSize: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    opacity: 0.65,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
    marginBottom: 20,
  },
  decorativeLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  lineSegment: {
    width: 32,
    height: 2,
    borderRadius: 1,
    opacity: 0.4,
  },
  lineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },
});
