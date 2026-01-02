import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { Story } from "@/data/stories";

type StoryProgressProps = {
  stories: Story[];
};

export const StoryProgress: React.FC<StoryProgressProps> = ({ stories }) => {
  const totalStories = stories.length;
  const startedStories = stories.filter(
    (story) => story.completedWords.length > 0
  ).length;
  const completedStories = stories.filter((story) => story.isCompleted).length;

  return (
    <ThemedView style={styles.progressContainer}>
      <View style={styles.progressTitleRow}>
        <Text style={styles.journeyEmoji}>🌍</Text>
        <ThemedText type="title" style={styles.progressTitle}>
          Your Story Journey
        </ThemedText>
      </View>

      <View style={styles.progressStats}>
        <View style={styles.progressStatCard}>
          <View style={styles.statCircle}>
            <Text style={styles.statCircleEmoji}>📚</Text>
          </View>
          <ThemedText type="subtitle" style={styles.statValue}>
            {totalStories}
          </ThemedText>
          <ThemedText type="default" style={styles.statLabel}>
            Total Stories
          </ThemedText>
        </View>

        <View style={styles.progressStatCard}>
          <View style={[styles.statCircle, styles.statCircleActive]}>
            <Text style={styles.statCircleEmoji}>📖</Text>
          </View>
          <ThemedText type="subtitle" style={styles.statValue}>
            {startedStories}
          </ThemedText>
          <ThemedText type="default" style={styles.statLabel}>
            In Progress
          </ThemedText>
        </View>

        <View style={styles.progressStatCard}>
          <View style={[styles.statCircle, styles.statCircleComplete]}>
            <Text style={styles.statCircleEmoji}>✨</Text>
          </View>
          <ThemedText type="subtitle" style={styles.statValue}>
            {completedStories}
          </ThemedText>
          <ThemedText type="default" style={styles.statLabel}>
            Completed
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    marginTop: 16,
    marginBottom: 24,
    padding: 24,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  progressTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 12,
  },
  journeyEmoji: {
    fontSize: 32,
  },
  progressTitle: {
    fontSize: 24,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  progressStatCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 16,
  },
  statCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statCircleActive: {
    backgroundColor: "rgba(74, 144, 226, 0.2)",
  },
  statCircleComplete: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  statCircleEmoji: {
    fontSize: 28,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  // Removed styles related to Total Words Learned
});
