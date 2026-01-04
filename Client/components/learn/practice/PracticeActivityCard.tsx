import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import type { PracticeActivity } from "./practiceTypes";
import { kindLabel } from "./practiceUtils";

export function PracticeActivityCard({
  activity,
  dividerColor,
  onPress,
}: {
  activity: PracticeActivity;
  dividerColor: string;
  onPress: () => void;
}) {
  const showDuration = Boolean(activity.durationLabel?.trim());
  const showXp = Boolean(activity.xpLabel?.trim());

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`Open ${activity.title}`}
      style={styles.cardTouch}
    >
      <ThemedView style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.icon}>
            <ThemedText style={styles.emoji}>{activity.emoji}</ThemedText>
          </View>
          <View style={styles.info}>
            <ThemedText type="defaultSemiBold" style={styles.title}>
              {activity.title}
            </ThemedText>
            <ThemedText type="default" style={styles.description}>
              {activity.description}
            </ThemedText>
          </View>
          <View style={styles.pill}>
            <ThemedText style={styles.pillText}>
              {kindLabel(activity.kind)}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.footerRow, { borderTopColor: dividerColor }]}>
          {showDuration || showXp ? (
            <View style={styles.metaRow}>
              {showDuration ? (
                <ThemedText type="default" style={styles.metaText}>
                  ⏱ {activity.durationLabel}
                </ThemedText>
              ) : null}
              {showXp ? (
                <ThemedText type="default" style={styles.metaText}>
                  ⭐ {activity.xpLabel}
                </ThemedText>
              ) : null}
            </View>
          ) : (
            <View />
          )}
          <ThemedText type="default" style={styles.cta}>
            Start →
          </ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardTouch: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74, 144, 226, 0.12)",
  },
  emoji: {
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    opacity: 0.75,
    lineHeight: 18,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  pillText: {
    fontSize: 11,
    opacity: 0.8,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaText: {
    fontSize: 12,
    opacity: 0.75,
  },
  cta: {
    fontSize: 13,
    color: "#4A90E2",
    fontWeight: "700",
  },
});
