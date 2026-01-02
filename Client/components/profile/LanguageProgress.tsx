import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { User } from "@/types/AuthContext";
import { ProfileStats, OnboardingData } from "@/services/profile";

interface LanguageProgressProps {
  user: User;
  profileStats: ProfileStats | null;
  onboardingData: OnboardingData | null;
  isLoading?: boolean;
}

// Language display names with flags
const LANGUAGE_INFO: Record<
  string,
  { name: string; flag: string; region: string }
> = {
  sw: { name: "Swahili", flag: "🇰🇪", region: "East African" },
  zu: { name: "Zulu", flag: "🇿🇦", region: "South African" },
  ln: { name: "Lingala", flag: "🇨🇩", region: "Central African" },
  xh: { name: "Xhosa", flag: "🇿🇦", region: "South African" },
  yo: { name: "Yoruba", flag: "🇳🇬", region: "Nigerian" },
  ig: { name: "Igbo", flag: "🇳🇬", region: "Nigerian" },
  ha: { name: "Hausa", flag: "🇳🇬", region: "Nigerian" },
};

// Level display names
const LEVEL_NAMES: Record<string, string> = {
  "absolute-beginner": "Absolute Beginner",
  beginner: "Beginner",
  refresher: "Refresher",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function LanguageProgress({
  user,
  profileStats,
  onboardingData,
  isLoading,
}: LanguageProgressProps) {
  // Get language info from onboarding data
  const languageCode = onboardingData?.selectedLanguage || "yo";
  const languageInfo = LANGUAGE_INFO[languageCode] || LANGUAGE_INFO["yo"];
  const levelName = onboardingData?.selectedLevel
    ? LEVEL_NAMES[onboardingData.selectedLevel] || "Beginner"
    : "Beginner";

  // Calculate progress based on real activity completions
  // Assuming 2 activities per 1% progress point (200 activities = 100% proficiency)
  const ACTIVITIES_PER_PROGRESS_POINT = 2;
  const activitiesCompleted = profileStats?.completedActivities || 0;
  const baseProgress = Math.min(
    Math.floor(activitiesCompleted / ACTIVITIES_PER_PROGRESS_POINT),
    100
  );

  const skills = [
    {
      name: "Speaking",
      percentage: Math.min(Math.floor(baseProgress * 0.6), 100),
    },
    {
      name: "Listening",
      percentage: Math.min(Math.floor(baseProgress * 0.75), 100),
    },
    {
      name: "Reading",
      percentage: Math.min(Math.floor(baseProgress * 0.85), 100),
    },
    {
      name: "Writing",
      percentage: Math.min(Math.floor(baseProgress * 0.5), 100),
    },
  ];

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Language Progress</ThemedText>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : (
        <View style={styles.languageCard}>
          <View style={styles.languageHeader}>
            <View style={styles.languageInfo}>
              <ThemedText style={styles.languageName}>
                {languageInfo.name}
              </ThemedText>
              <ThemedText style={styles.languageDescription}>
                {languageInfo.region} Language
              </ThemedText>
            </View>
            <View style={styles.levelBadge}>
              <ThemedText style={styles.levelText}>{levelName}</ThemedText>
            </View>
          </View>

          <View style={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillRow}>
                <View style={styles.skillHeader}>
                  <ThemedText style={styles.skillName}>{skill.name}</ThemedText>
                  <ThemedText style={styles.skillPercentage}>
                    {skill.percentage}%
                  </ThemedText>
                </View>
                <View style={styles.skillBarBackground}>
                  <View
                    style={[
                      styles.skillBarFill,
                      { width: `${skill.percentage}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.overallProgress}>
            <View style={styles.overallHeader}>
              <ThemedText style={styles.overallLabel}>
                Overall Proficiency
              </ThemedText>
              <ThemedText style={styles.overallValue}>
                {baseProgress}%
              </ThemedText>
            </View>
            <View style={styles.overallBarBackground}>
              <View
                style={[styles.overallBarFill, { width: `${baseProgress}%` }]}
              />
            </View>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  languageCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  languageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  languageDescription: {
    fontSize: 13,
    opacity: 0.7,
  },
  levelBadge: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
  },
  skillsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  skillRow: {
    gap: 8,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  skillName: {
    fontSize: 15,
    fontWeight: "600",
  },
  skillBarBackground: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    overflow: "hidden",
  },
  skillBarFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#4A90E2",
  },
  skillPercentage: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A90E2",
  },
  overallProgress: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  overallHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  overallLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  overallValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  overallBarBackground: {
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    overflow: "hidden",
  },
  overallBarFill: {
    height: "100%",
    borderRadius: 7,
    backgroundColor: "#4A90E2",
  },
});
