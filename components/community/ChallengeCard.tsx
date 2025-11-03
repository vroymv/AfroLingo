import { ThemedText } from "@/components/ThemedText";
import type { Challenge } from "@/data/community";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ChallengeCardProps {
  challenge: Challenge;
  onPress?: () => void;
  onSubmit?: () => void;
  onViewSubmissions?: () => void;
}

export function ChallengeCard({
  challenge,
  onPress,
  onSubmit,
  onViewSubmissions,
}: ChallengeCardProps) {
  return (
    <TouchableOpacity style={styles.challengeCard} onPress={onPress}>
      <View style={styles.challengeHeader}>
        <View style={styles.challengeInfo}>
          <ThemedText type="defaultSemiBold" style={styles.challengeTitle}>
            {challenge.title}
          </ThemedText>
          <View style={styles.challengeMeta}>
            <View style={styles.metaItem}>
              <ThemedText style={styles.languageFlag}>
                {getLanguageFlag(challenge.language)}
              </ThemedText>
              <ThemedText style={styles.languageText}>
                {challenge.language}
              </ThemedText>
            </View>
            <View
              style={[
                styles.difficultyBadge,
                getDifficultyStyle(challenge.difficulty),
              ]}
            >
              <ThemedText style={styles.difficultyText}>
                {challenge.difficulty.toUpperCase()}
              </ThemedText>
            </View>
          </View>
        </View>
        <View style={styles.xpBadge}>
          <ThemedText style={styles.xpText}>
            +{challenge.xpReward} XP
          </ThemedText>
        </View>
      </View>

      <ThemedText type="default" style={styles.challengeDescription}>
        {challenge.description}
      </ThemedText>

      <View style={styles.challengeStats}>
        <View style={styles.statRow}>
          <ThemedText style={styles.statIcon}>👥</ThemedText>
          <ThemedText style={styles.statText}>
            {challenge.participants} participants
          </ThemedText>
        </View>
        <View style={styles.statRow}>
          <ThemedText style={styles.statIcon}>⏰</ThemedText>
          <ThemedText style={styles.statText}>
            {getDaysLeft(challenge.deadline)} days left
          </ThemedText>
        </View>
        {challenge.badge && (
          <View style={styles.statRow}>
            <ThemedText style={styles.statIcon}>🏆</ThemedText>
            <ThemedText style={styles.statText}>
              Badge: {challenge.badge}
            </ThemedText>
          </View>
        )}
      </View>

      <View style={styles.challengeActions}>
        <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
          <ThemedText style={styles.primaryButtonText}>
            {getActionText(challenge.type)}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onViewSubmissions}
        >
          <ThemedText style={styles.secondaryButtonText}>
            View Submissions
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(
                  (challenge.participants / 200) * 100,
                  100
                )}%`,
              },
            ]}
          />
        </View>
        <ThemedText style={styles.progressText}>
          {challenge.participants}/200 goal
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

function getLanguageFlag(language: string): string {
  const flags: { [key: string]: string } = {
    Zulu: "🇿🇦",
    Swahili: "🇰🇪",
    Yoruba: "🇳🇬",
    Akan: "🇬🇭",
    Wolof: "🇸🇳",
    General: "🌍",
  };
  return flags[language] || "🌍";
}

function getDifficultyStyle(difficulty: string) {
  switch (difficulty) {
    case "beginner":
      return { backgroundColor: "rgba(34, 197, 94, 0.2)" };
    case "intermediate":
      return { backgroundColor: "rgba(249, 115, 22, 0.2)" };
    case "advanced":
      return { backgroundColor: "rgba(239, 68, 68, 0.2)" };
    default:
      return { backgroundColor: "rgba(156, 163, 175, 0.2)" };
  }
}

function getDaysLeft(deadline: Date): number {
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getActionText(type: string): string {
  switch (type) {
    case "speaking":
      return "🎤 Record Response";
    case "writing":
      return "✍️ Write Response";
    case "translation":
      return "🔄 Submit Translation";
    case "cultural":
      return "🌍 Share Culture";
    default:
      return "Submit Response";
  }
}

const styles = StyleSheet.create({
  challengeCard: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  challengeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 18,
    marginBottom: 8,
    lineHeight: 24,
  },
  challengeMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  languageText: {
    fontSize: 14,
    fontWeight: "600",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "700",
  },
  xpBadge: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  xpText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFD700",
  },
  challengeDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
    opacity: 0.9,
  },
  challengeStats: {
    marginBottom: 16,
    gap: 8,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  statText: {
    fontSize: 14,
    opacity: 0.8,
  },
  challengeActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#0096FF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0096FF",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
});
