import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet } from "react-native";

export default function WeeklyGoals() {
  return (
    <ThemedView style={styles.section}>
      <ThemedText type="defaultSemiBold">Weekly Goals</ThemedText>
      <ThemedView style={styles.goalCard}>
        <ThemedView style={styles.goalHeader}>
          <ThemedText type="default">Complete 5 lessons</ThemedText>
          <ThemedText type="default">3/5</ThemedText>
        </ThemedView>
        <ThemedView style={styles.progressBar}>
          <ThemedView style={[styles.progressFill, { width: "60%" }]} />
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.goalCard}>
        <ThemedView style={styles.goalHeader}>
          <ThemedText type="default">Practice 30 minutes daily</ThemedText>
          <ThemedText type="default">5/7</ThemedText>
        </ThemedView>
        <ThemedView style={styles.progressBar}>
          <ThemedView style={[styles.progressFill, { width: "71%" }]} />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  goalCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
});
