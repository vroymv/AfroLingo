import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet } from "react-native";

export default function LearningStats() {
  return (
    <ThemedView style={styles.section}>
      <ThemedText type="defaultSemiBold">Learning Stats</ThemedText>
      <ThemedView style={styles.statsContainer}>
        <ThemedView style={styles.statCard}>
          <ThemedText type="defaultSemiBold">🔥 Current Streak</ThemedText>
          <ThemedText type="title">7 days</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statCard}>
          <ThemedText type="defaultSemiBold">📚 Lessons Completed</ThemedText>
          <ThemedText type="title">28</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statCard}>
          <ThemedText type="defaultSemiBold">⏱️ Study Time</ThemedText>
          <ThemedText type="title">45h</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statCard}>
          <ThemedText type="defaultSemiBold">🏆 XP Points</ThemedText>
          <ThemedText type="title">1,240</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  statsContainer: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0, 150, 255, 0.1)",
    alignItems: "center",
  },
});
