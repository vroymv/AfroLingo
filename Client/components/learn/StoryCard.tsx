import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { Story } from "@/data/stories";

type StoryCardProps = {
  story: Story;
  onPress: () => void;
};

const STORY_GRADIENT_COLORS: [string, string] = ["#4A90E2", "#66BB6A"];

export const StoryCard: React.FC<StoryCardProps> = ({ story, onPress }) => {
  const wordsLearned = story.completedWords.length;
  const progressPercentage = Math.round(
    (wordsLearned / story.totalWords) * 100
  );
  const hasQuestions = Boolean(story.questions && story.questions.length > 0);

  return (
    <TouchableOpacity onPress={onPress} style={styles.storyCard}>
      <LinearGradient
        colors={STORY_GRADIENT_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <ThemedView style={styles.storyCardContent}>
          <View style={styles.storyHeader}>
            <View style={styles.coverContainer}>
              <Text style={styles.storyCover}>{story.cover}</Text>
              {story.isCompleted && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedIcon}>✓</Text>
                </View>
              )}
            </View>

            <View style={styles.storyInfo}>
              <View style={styles.titleRow}>
                <ThemedText type="defaultSemiBold" style={styles.storyTitle}>
                  {story.title}
                </ThemedText>
                {hasQuestions && (
                  <View style={styles.quizBadge}>
                    <Text style={styles.quizIcon}>📝</Text>
                  </View>
                )}
              </View>

              <ThemedText type="default" style={styles.storyDescription}>
                {story.description}
              </ThemedText>
            </View>
          </View>

          {wordsLearned > 0 && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <ThemedText type="default" style={styles.progressLabel}>
                  {wordsLearned}/{story.totalWords} words learned
                </ThemedText>
                <ThemedText type="default" style={styles.progressPercentage}>
                  {progressPercentage}%
                </ThemedText>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progressPercentage}%`,
                      backgroundColor: "#4A90E2",
                    },
                  ]}
                />
              </View>
            </View>
          )}

          <View style={styles.cardFooter}>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statIcon}>⏱️</Text>
                <ThemedText type="default" style={styles.statText}>
                  {story.estimatedTime}
                </ThemedText>
              </View>

              <View style={styles.stat}>
                <Text style={styles.statIcon}>📚</Text>
                <ThemedText type="default" style={styles.statText}>
                  {story.segments.length} parts
                </ThemedText>
              </View>

              {hasQuestions && (
                <View style={styles.stat}>
                  <Text style={styles.statIcon}>❓</Text>
                  <ThemedText type="default" style={styles.statText}>
                    {story.questions?.length} questions
                  </ThemedText>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.playButton}>
              <Text style={styles.playIcon}>▶️</Text>
              <ThemedText type="defaultSemiBold" style={styles.playText}>
                {wordsLearned > 0 ? "Continue" : "Start"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  storyCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  cardGradient: {
    padding: 2,
  },
  storyCardContent: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 18,
    padding: 16,
  },
  storyHeader: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  coverContainer: {
    position: "relative",
  },
  storyCover: {
    fontSize: 48,
  },
  completedBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  completedIcon: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  storyInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  storyTitle: {
    fontSize: 18,
    flex: 1,
    color: "#1a1a1a",
  },
  quizBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 152, 0, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  quizIcon: {
    fontSize: 14,
  },
  storyDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: 12,
    color: "#1a1a1a",
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    opacity: 0.7,
    color: "#1a1a1a",
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A90E2",
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  statsRow: {
    flexDirection: "row",
    flex: 1,
    gap: 12,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    fontSize: 12,
    opacity: 0.7,
    color: "#1a1a1a",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  playIcon: {
    fontSize: 14,
  },
  playText: {
    fontSize: 14,
    color: "#fff",
  },
});
