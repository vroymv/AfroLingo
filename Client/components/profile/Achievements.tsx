import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet } from "react-native";

export default function Achievements() {
  return (
    <ThemedView style={styles.section}>
      <ThemedText type="defaultSemiBold">Achievements</ThemedText>
      <ThemedView style={styles.achievementsContainer}>
        <ThemedView style={styles.achievementCard}>
          <ThemedText type="default">🥇</ThemedText>
          <ThemedText type="default">First Week</ThemedText>
        </ThemedView>
        <ThemedView style={styles.achievementCard}>
          <ThemedText type="default">📖</ThemedText>
          <ThemedText type="default">Bookworm</ThemedText>
        </ThemedView>
        <ThemedView style={styles.achievementCard}>
          <ThemedText type="default">🔥</ThemedText>
          <ThemedText type="default">7-Day Streak</ThemedText>
        </ThemedView>
        <ThemedView style={styles.achievementCard}>
          <ThemedText type="default">🎯</ThemedText>
          <ThemedText type="default">Goal Crusher</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  achievementsContainer: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  achievementCard: {
    flex: 1,
    minWidth: "22%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    alignItems: "center",
  },
});
