import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, View } from "react-native";

export function InfoSection() {
  const tintColor = useThemeColor({}, "tint");

  return (
    <View style={styles.infoSection}>
      <View style={styles.iconRow}>
        <View style={styles.iconBox}>
          <ThemedText style={styles.icon}>💡</ThemedText>
        </View>
        <View style={styles.iconBox}>
          <ThemedText style={styles.icon}>⭐</ThemedText>
        </View>
        <View style={styles.iconBox}>
          <ThemedText style={styles.icon}>🎯</ThemedText>
        </View>
      </View>

      <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
        Not sure which to choose?
      </ThemedText>

      <ThemedText style={styles.infoText}>
        Take the placement test for a personalized start!
      </ThemedText>

      <View style={styles.badgeRow}>
        <View style={[styles.badge, { borderColor: tintColor + "30" }]}>
          <ThemedText style={styles.badgeText}>Quick & Fun</ThemedText>
        </View>
        <View style={[styles.badge, { borderColor: tintColor + "30" }]}>
          <ThemedText style={styles.badgeText}>Cultural</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoSection: {
    marginTop: 32,
    marginBottom: 24,
    padding: 24,
    backgroundColor: "rgba(10, 126, 164, 0.08)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(10, 126, 164, 0.15)",
    alignItems: "center",
  },
  iconRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(10, 126, 164, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 28,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    textAlign: "center",
    opacity: 0.8,
    fontWeight: "500",
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 12,
  },
  badge: {
    backgroundColor: "rgba(10, 126, 164, 0.12)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.8,
  },
});
