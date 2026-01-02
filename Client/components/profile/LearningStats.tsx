import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { User } from "@/types/AuthContext";
import { ProfileStats } from "@/services/profile";

interface LearningStatsProps {
  user: User;
  profileStats: ProfileStats | null;
  isLoading?: boolean;
}

export default function LearningStats({
  user,
  profileStats,
  isLoading,
}: LearningStatsProps) {
  // Estimate study time based on activity completions
  // Assuming approximately 2 minutes per activity
  const MINUTES_PER_ACTIVITY = 2;
  const estimatedStudyHours = profileStats
    ? Math.floor((profileStats.completedActivities * MINUTES_PER_ACTIVITY) / 60)
    : 0;

  const stats = [
    {
      label: "Streak",
      value: profileStats?.streakDays?.toString() || "0",
      unit: "days",
    },
    {
      label: "Activities",
      value: profileStats?.completedActivities?.toString() || "0",
      unit: "completed",
    },
    {
      label: "Study Time",
      value: estimatedStudyHours.toString(),
      unit: "hours",
    },
    {
      label: "XP Points",
      value: profileStats?.totalXP?.toLocaleString() || "0",
      unit: "earned",
    },
  ];

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Learning Stats</ThemedText>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : (
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statUnit}>{stat.unit}</ThemedText>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
            </View>
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "rgba(74, 144, 226, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(74, 144, 226, 0.15)",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
