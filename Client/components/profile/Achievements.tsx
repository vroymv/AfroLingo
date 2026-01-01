import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { User } from "@/types/AuthContext";
import { ProfileStats } from "@/services/profile";

interface AchievementsProps {
  user: User;
  profileStats: ProfileStats | null;
  isLoading?: boolean;
}

export default function Achievements({
  user,
  profileStats,
  isLoading,
}: AchievementsProps) {
  // Calculate achievements based on real user data
  const daysSinceJoined = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const activitiesCompleted = profileStats?.completedActivities || 0;
  const totalXP = profileStats?.totalXP || 0;
  const currentStreak = profileStats?.streakDays || 0;
  const longestStreak = profileStats?.longestStreakDays || 0;

  const achievements = [
    {
      emoji: "🥇",
      name: "First Week",
      description: "Completed your first week",
      unlocked: daysSinceJoined >= 7,
    },
    {
      emoji: "📖",
      name: "Bookworm",
      description: "Finished 25 activities",
      unlocked: activitiesCompleted >= 25,
    },
    {
      emoji: "🔥",
      name: "7-Day Streak",
      description: "7 days in a row",
      unlocked: currentStreak >= 7 || longestStreak >= 7,
    },
    {
      emoji: "🎯",
      name: "Goal Crusher",
      description: "Complete 50 activities",
      unlocked: activitiesCompleted >= 50,
    },
    {
      emoji: "🌟",
      name: "Rising Star",
      description: "Earn 1000 XP",
      unlocked: totalXP >= 1000,
    },
    {
      emoji: "💎",
      name: "Diamond League",
      description: "Earn 5000 XP",
      unlocked: totalXP >= 5000,
    },
  ];

  return (
    <ThemedView style={styles.section}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.sectionTitle}>🏆 Achievements</ThemedText>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>
            {achievements.filter((a) => a.unlocked).length}/
            {achievements.length}
          </ThemedText>
        </View>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : (
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement, index) => (
            <TouchableOpacity key={index} activeOpacity={0.8}>
              <LinearGradient
                colors={
                  achievement.unlocked
                    ? ["#FFD700", "#FFA500"]
                    : ["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.02)"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.lockedCard,
                ]}
              >
                <ThemedText
                  style={[
                    styles.achievementEmoji,
                    !achievement.unlocked && styles.lockedEmoji,
                  ]}
                >
                  {achievement.emoji}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.achievementName,
                    !achievement.unlocked && styles.lockedText,
                  ]}
                >
                  {achievement.name}
                </ThemedText>
                {achievement.unlocked && (
                  <View style={styles.checkmark}>
                    <ThemedText style={styles.checkmarkText}>✓</ThemedText>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#FFF",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  achievementCard: {
    width: 110,
    height: 120,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    position: "relative",
  },
  lockedCard: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  achievementEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  lockedEmoji: {
    opacity: 0.3,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    color: "#FFF",
  },
  lockedText: {
    opacity: 0.4,
  },
  checkmark: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#4CAF50",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
