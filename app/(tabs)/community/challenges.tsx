import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { mockChallenges } from "@/data/community";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChallengesScreen() {
  const activeChallenges = mockChallenges.filter(
    (challenge) => challenge.isActive
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title">Challenges 🎯</ThemedText>
          <ThemedText type="subtitle">Practice & earn XP together</ThemedText>
        </ThemedView>

        {/* Stats */}
        <ThemedView style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText type="defaultSemiBold" style={styles.statNumber}>
              127
            </ThemedText>
            <ThemedText type="default" style={styles.statLabel}>
              Total Participants
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="defaultSemiBold" style={styles.statNumber}>
              3
            </ThemedText>
            <ThemedText type="default" style={styles.statLabel}>
              Active Challenges
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="defaultSemiBold" style={styles.statNumber}>
              225
            </ThemedText>
            <ThemedText type="default" style={styles.statLabel}>
              XP Available
            </ThemedText>
          </View>
        </ThemedView>

        {/* Active Challenges */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Weekly Challenges
          </ThemedText>
          {activeChallenges.map((challenge) => (
            <View key={challenge.id} style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <View style={styles.challengeInfo}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.challengeTitle}
                  >
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
                <TouchableOpacity style={styles.primaryButton}>
                  <ThemedText style={styles.primaryButtonText}>
                    {getActionText(challenge.type)}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
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
            </View>
          ))}
        </ThemedView>

        {/* Previous Challenges */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Previous Challenges
          </ThemedText>
          <View style={styles.previousChallenges}>
            <Pressable style={styles.previousChallenge}>
              <ThemedText style={styles.previousTitle}>
                Swahili Family Tree
              </ThemedText>
              <ThemedText style={styles.previousStats}>
                89 submissions • Completed
              </ThemedText>
            </Pressable>
            <Pressable style={styles.previousChallenge}>
              <ThemedText style={styles.previousTitle}>
                Yoruba Greetings
              </ThemedText>
              <ThemedText style={styles.previousStats}>
                156 submissions • Completed
              </ThemedText>
            </Pressable>
            <Pressable style={styles.previousChallenge}>
              <ThemedText style={styles.previousTitle}>
                Zulu Storytelling
              </ThemedText>
              <ThemedText style={styles.previousStats}>
                203 submissions • Completed
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </ScrollView>
    </ThemedView>
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
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    color: "#0096FF",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
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
  previousChallenges: {
    gap: 12,
  },
  previousChallenge: {
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "rgba(0, 150, 255, 0.5)",
  },
  previousTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  previousStats: {
    fontSize: 12,
    opacity: 0.6,
  },
});
