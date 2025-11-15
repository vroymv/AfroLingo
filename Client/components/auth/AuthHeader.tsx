import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  const tintColor = useThemeColor({}, "tint");

  return (
    <View style={styles.header}>
      {/* Logo */}
      <View style={styles.logoWrapper}>
        <Image
          source={require("@/assets/images/icons/login-icon.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Title with improved spacing */}
      <Text style={styles.title}>{title}</Text>

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
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  logoWrapper: {
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  logoImage: {
    width: 160,
    height: 160,
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
    marginBottom: 15,
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
