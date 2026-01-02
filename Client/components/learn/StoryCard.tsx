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
              <ThemedText type="defaultSemiBold" style={styles.storyTitle}>
                {story.title}
              </ThemedText>

              <ThemedText type="default" style={styles.storyDescription}>
                {story.description}
              </ThemedText>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>⏱️</Text>
              <ThemedText type="default" style={styles.statText}>
                {story.estimatedTime}
              </ThemedText>
            </View>

            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶️</Text>
              <ThemedText type="defaultSemiBold" style={styles.playText}>
                {story.isCompleted ? "Review" : "Start"}
              </ThemedText>
            </View>
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
    color: "#1a1a1a",
    marginBottom: 6,
  },
  storyDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
    color: "#1a1a1a",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  playIcon: {
    fontSize: 14,
  },
  playText: {
    fontSize: 14,
    color: "#fff",
  },
});
