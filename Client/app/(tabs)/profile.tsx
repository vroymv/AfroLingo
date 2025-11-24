import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import EmailVerificationBanner from "@/components/auth/EmailVerificationBanner";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileScreen() {
  const { user } = useAuth();
  console.log("Authenticated user:", user);
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <EmailVerificationBanner />

        <ThemedView style={styles.header}>
          <ThemedView style={styles.avatar}>
            <ThemedText type="title">👤</ThemedText>
          </ThemedView>
          <ThemedText type="title">Sarah Johnson</ThemedText>
          <ThemedText type="subtitle">
            Learning Yoruba • Beginner Level
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold">Learning Stats</ThemedText>
          <ThemedView style={styles.statsContainer}>
            <ThemedView style={styles.statCard}>
              <ThemedText type="defaultSemiBold">🔥 Current Streak</ThemedText>
              <ThemedText type="title">7 days</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statCard}>
              <ThemedText type="defaultSemiBold">
                📚 Lessons Completed
              </ThemedText>
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

        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold">Language Progress</ThemedText>
          <ThemedView style={styles.languageCard}>
            <ThemedView style={styles.languageHeader}>
              <ThemedText type="defaultSemiBold">🇳🇬 Yoruba</ThemedText>
              <ThemedText type="default">Beginner</ThemedText>
            </ThemedView>
            <ThemedView style={styles.skillsContainer}>
              <ThemedView style={styles.skillRow}>
                <ThemedText type="default">Speaking</ThemedText>
                <ThemedView style={styles.skillBar}>
                  <ThemedView style={[styles.skillFill, { width: "40%" }]} />
                </ThemedView>
              </ThemedView>
              <ThemedView style={styles.skillRow}>
                <ThemedText type="default">Listening</ThemedText>
                <ThemedView style={styles.skillBar}>
                  <ThemedView style={[styles.skillFill, { width: "55%" }]} />
                </ThemedView>
              </ThemedView>
              <ThemedView style={styles.skillRow}>
                <ThemedText type="default">Reading</ThemedText>
                <ThemedView style={styles.skillBar}>
                  <ThemedView style={[styles.skillFill, { width: "35%" }]} />
                </ThemedView>
              </ThemedView>
              <ThemedView style={styles.skillRow}>
                <ThemedText type="default">Writing</ThemedText>
                <ThemedView style={styles.skillBar}>
                  <ThemedView style={[styles.skillFill, { width: "30%" }]} />
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold">Settings</ThemedText>
          <ThemedView style={styles.settingsContainer}>
            <TouchableOpacity style={styles.settingItem}>
              <ThemedText type="default">📱 App Preferences</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <ThemedText type="default">🔔 Notifications</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <ThemedText type="default">🌍 Language Settings</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <ThemedText type="default">👥 Privacy</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <ThemedText type="default">📞 Support</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <ThemedText type="default">🚪 Sign Out</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
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
  languageCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  languageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  skillsContainer: {
    gap: 12,
  },
  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skillBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginLeft: 16,
  },
  skillFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#2196F3",
  },
  settingsContainer: {
    marginTop: 12,
  },
  settingItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 8,
  },
});
