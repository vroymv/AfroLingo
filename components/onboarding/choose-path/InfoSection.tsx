import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, View } from "react-native";

export function InfoSection() {
  const tintColor = useThemeColor({}, "tint");

  return (
    <View style={styles.infoSection}>
      <View style={styles.infoHeader}>
        <View style={styles.infoIconContainer}>
          <ThemedText style={styles.infoIcon}>💡</ThemedText>
        </View>
        <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
          Not sure which to choose?
        </ThemedText>
      </View>
      <ThemedText style={styles.infoText}>
        We recommend taking the placement test! It&apos;s quick, fun, and
        includes cultural context questions that help connect you with your
        heritage.
      </ThemedText>
      <View style={styles.infoBadge}>
        <ThemedText style={[styles.infoBadgeText, { color: tintColor }]}>
          ⭐ Most Popular Choice
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoSection: {
    marginTop: 40,
    marginBottom: 32,
    padding: 24,
    backgroundColor: "rgba(10, 126, 164, 0.08)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(10, 126, 164, 0.15)",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(10, 126, 164, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 23,
    opacity: 0.8,
    fontWeight: "500",
    marginBottom: 16,
  },
  infoBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(10, 126, 164, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(10, 126, 164, 0.2)",
  },
  infoBadgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
