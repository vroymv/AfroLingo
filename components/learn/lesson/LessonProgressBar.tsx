import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { StyleSheet, View } from "react-native";

interface LessonProgressBarProps {
  currentActivity: number;
  totalActivities: number;
}

export default function LessonProgressBar({
  currentActivity,
  totalActivities,
}: LessonProgressBarProps) {
  const progressPercentage = (currentActivity / totalActivities) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressBarBackground}>
        <View
          style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
        />
      </View>
      <ThemedText style={styles.progressLabel}>
        {currentActivity} of {totalActivities}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#E8E8E8",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4A90E2",
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    fontWeight: "500",
  },
});
