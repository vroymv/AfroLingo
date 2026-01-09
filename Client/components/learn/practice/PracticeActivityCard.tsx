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
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Open ${activity.title}`}
      style={styles.cardTouch}
    >
      <ThemedView style={styles.card}>
        {/* Main Content */}
        <View style={styles.content}>
          {/* Icon and Text */}
          <View style={styles.leftContent}>
            <View style={styles.iconContainer}>
              <ThemedText style={styles.emoji}>{activity.emoji}</ThemedText>
            </View>
            <View style={styles.textContent}>
              <ThemedText type="defaultSemiBold" style={styles.title}>
                {activity.title}
              </ThemedText>
              <ThemedText type="default" style={styles.description}>
                {activity.description}
              </ThemedText>

              {/* Meta info below description */}
              {(showDuration || showXp) && (
                <View style={styles.metaRow}>
                  {showDuration && (
                    <ThemedText type="default" style={styles.metaText}>
                      {activity.durationLabel}
                    </ThemedText>
                  )}
                  {showDuration && showXp && (
                    <ThemedText type="default" style={styles.metaDot}>
                      •
                    </ThemedText>
                  )}
                  {showXp && (
                    <ThemedText type="default" style={styles.metaText}>
                      {activity.xpLabel} XP
                    </ThemedText>
                  )}
                  <ThemedText type="default" style={styles.metaDot}>
                    •
                  </ThemedText>
                  <ThemedText type="default" style={styles.metaText}>
                    {kindLabel(activity.kind)}
                  </ThemedText>
                </View>
              )}
            </View>
          </View>

          {/* Arrow Indicator */}
          <View style={styles.arrowContainer}>
            <ThemedText style={styles.arrow}>›</ThemedText>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardTouch: {
    marginBottom: 10,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    // Add subtle shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  emoji: {
    fontSize: 24,
  },
  textContent: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    opacity: 0.65,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    opacity: 0.5,
  },
  metaDot: {
    fontSize: 12,
    opacity: 0.3,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  arrow: {
    fontSize: 28,
    opacity: 0.4,
    fontWeight: "300",
  },
});
