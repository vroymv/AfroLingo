import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { mockUserProfile } from "@/data/community";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function UserProfileScreen() {
  const [isFollowing, setIsFollowing] = useState(
    mockUserProfile.isFollowing || false
  );

  const profile = mockUserProfile;

  // Constants for mock progress percentages
  const BASE_LANGUAGE_PROGRESS = 45;
  const PROGRESS_INCREMENT = 15;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "#FFD700";
      case "epic":
        return "#9333ea";
      case "rare":
        return "#0096FF";
      default:
        return "#6b7280";
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <ThemedText style={styles.avatar}>{profile.avatar}</ThemedText>
            <View style={styles.levelBadge}>
              <ThemedText style={styles.levelText}>
                {profile.level?.toUpperCase()[0]}
              </ThemedText>
            </View>
          </View>

          <ThemedText type="title" style={styles.name}>
            {profile.name}
          </ThemedText>

          {profile.bio && (
            <ThemedText style={styles.bio}>{profile.bio}</ThemedText>
          )}

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>
                {profile.followers || 0}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Followers</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>
                {profile.following || 0}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Following</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>
                {profile.totalXp}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Total XP</ThemedText>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.followButton,
                isFollowing && styles.followingButton,
              ]}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <ThemedText
                style={[
                  styles.followButtonText,
                  isFollowing && styles.followingButtonText,
                ]}
              >
                {isFollowing ? "✓ Following" : "+ Follow"}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.encourageButton}>
              <ThemedText style={styles.encourageButtonText}>
                🔥 Encourage
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <ThemedText style={styles.iconButtonText}>💬</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Streak & Progress */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            🔥 Streak & Progress
          </ThemedText>
          <View style={styles.streakCard}>
            <View style={styles.streakRow}>
              <View style={styles.streakItem}>
                <ThemedText style={styles.streakEmoji}>🔥</ThemedText>
                <View>
                  <ThemedText style={styles.streakNumber}>
                    {profile.currentStreak}
                  </ThemedText>
                  <ThemedText style={styles.streakLabel}>
                    Day Streak
                  </ThemedText>
                </View>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <ThemedText style={styles.streakEmoji}>⚡</ThemedText>
                <View>
                  <ThemedText style={styles.streakNumber}>
                    {profile.longestStreak}
                  </ThemedText>
                  <ThemedText style={styles.streakLabel}>
                    Longest Streak
                  </ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.progressRow}>
              <ThemedText style={styles.progressLabel}>
                📚 Lessons Completed
              </ThemedText>
              <ThemedText style={styles.progressValue}>
                {profile.lessonsCompleted}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Languages Learning */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            🌍 Languages
          </ThemedText>
          <View style={styles.languagesCard}>
            {profile.languages.map((language, index) => (
              <View key={index} style={styles.languageItem}>
                <ThemedText style={styles.languageFlag}>
                  {getLanguageFlag(language)}
                </ThemedText>
                <View style={styles.languageDetails}>
                  <ThemedText style={styles.languageName}>
                    {language}
                  </ThemedText>
                  <ThemedText style={styles.languageLevel}>
                    {profile.level || "Beginner"}
                  </ThemedText>
                </View>
                <View style={styles.languageProgress}>
                  <View style={styles.miniProgressBar}>
                    <View
                      style={[
                        styles.miniProgressFill,
                        { width: `${BASE_LANGUAGE_PROGRESS + index * PROGRESS_INCREMENT}%` },
                      ]}
                    />
                  </View>
                  <ThemedText style={styles.languagePercentage}>
                    {BASE_LANGUAGE_PROGRESS + index * PROGRESS_INCREMENT}%
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements & Badges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              🏆 Achievements ({profile.achievements.length})
            </ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllText}>See All</ThemedText>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.achievementsContainer}
          >
            {profile.achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  {
                    borderColor: getRarityColor(achievement.rarity),
                  },
                ]}
              >
                <ThemedText style={styles.achievementIcon}>
                  {achievement.icon}
                </ThemedText>
                <ThemedText style={styles.achievementTitle}>
                  {achievement.title}
                </ThemedText>
                <ThemedText style={styles.achievementDescription}>
                  {achievement.description}
                </ThemedText>
                <View
                  style={[
                    styles.rarityBadge,
                    { backgroundColor: getRarityColor(achievement.rarity) },
                  ]}
                >
                  <ThemedText style={styles.rarityText}>
                    {achievement.rarity}
                  </ThemedText>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Badges Collection */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            🎖️ Badges ({profile.badges.length})
          </ThemedText>
          <View style={styles.badgesContainer}>
            {profile.badges.map((badge, index) => (
              <View key={index} style={styles.badgeChip}>
                <ThemedText style={styles.badgeText}>{badge}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            📊 Recent Activity
          </ThemedText>
          <View style={styles.activityList}>
            {profile.recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <ThemedText style={styles.activityEmoji}>
                    {getActivityIcon(activity.type)}
                  </ThemedText>
                </View>
                <View style={styles.activityDetails}>
                  <ThemedText style={styles.activityDescription}>
                    {activity.description}
                  </ThemedText>
                  <ThemedText style={styles.activityTime}>
                    {getTimeAgo(activity.timestamp)}
                  </ThemedText>
                </View>
                {activity.xpEarned && (
                  <View style={styles.xpBadge}>
                    <ThemedText style={styles.xpText}>
                      +{activity.xpEarned} XP
                    </ThemedText>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Share Profile Button */}
        <TouchableOpacity style={styles.shareButton}>
          <ThemedText style={styles.shareButtonText}>
            📤 Share Profile
          </ThemedText>
        </TouchableOpacity>
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
    English: "🇺🇸",
  };
  return flags[language] || "🌍";
}

function getActivityIcon(type: string): string {
  const icons: { [key: string]: string } = {
    lesson: "📚",
    challenge: "🎯",
    streak: "🔥",
    achievement: "🏆",
    post: "💬",
  };
  return icons[type] || "✨";
}

function getTimeAgo(timestamp: Date): string {
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    fontSize: 80,
  },
  levelBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0096FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(0, 0, 0, 0.5)",
  },
  levelText: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },
  name: {
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0096FF",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  followButton: {
    flex: 1,
    backgroundColor: "#0096FF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  followingButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  followButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  followingButtonText: {
    color: "#0096FF",
  },
  encourageButton: {
    flex: 1,
    backgroundColor: "rgba(255, 100, 50, 0.2)",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  encourageButtonText: {
    fontWeight: "600",
    fontSize: 15,
  },
  iconButton: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonText: {
    fontSize: 20,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: "#0096FF",
    fontWeight: "600",
  },
  streakCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  streakRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  streakItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  streakEmoji: {
    fontSize: 32,
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0096FF",
  },
  streakLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  streakDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0096FF",
  },
  languagesCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  languageFlag: {
    fontSize: 32,
    marginRight: 12,
  },
  languageDetails: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  languageLevel: {
    fontSize: 12,
    opacity: 0.7,
  },
  languageProgress: {
    alignItems: "flex-end",
  },
  miniProgressBar: {
    width: 60,
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  miniProgressFill: {
    height: "100%",
    backgroundColor: "#0096FF",
  },
  languagePercentage: {
    fontSize: 11,
    fontWeight: "600",
    color: "#0096FF",
  },
  achievementsContainer: {
    marginBottom: 8,
  },
  achievementCard: {
    width: 150,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  achievementIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  achievementDescription: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 8,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: "700",
    color: "white",
    textTransform: "uppercase",
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badgeChip: {
    backgroundColor: "rgba(0, 150, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0096FF",
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityDetails: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  xpBadge: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  xpText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFD700",
  },
  shareButton: {
    margin: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
