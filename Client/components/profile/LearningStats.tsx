import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
  // Calculate study time estimate (rough estimate: 2 minutes per activity)
  const estimatedStudyHours = profileStats
    ? Math.floor((profileStats.completedActivities * 2) / 60)
    : 0;

  const stats = [
    {
      icon: "🔥",
      label: "Current Streak",
      value: profileStats?.streakDays?.toString() || "0",
      unit: "days",
      gradient: ["#FF6B6B", "#EE5A6F"],
    },
    {
      icon: "📚",
      label: "Activities",
      value: profileStats?.completedActivities?.toString() || "0",
      unit: "completed",
      gradient: ["#4ECDC4", "#44A08D"],
    },
    {
      icon: "⏱️",
      label: "Study Time",
      value: estimatedStudyHours.toString(),
      unit: "hours",
      gradient: ["#A8E6CF", "#56AB91"],
    },
    {
      icon: "🏆",
      label: "XP Points",
      value: profileStats?.totalXP?.toLocaleString() || "0",
      unit: "total",
      gradient: ["#FFD93D", "#F4A261"],
    },
  ];

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>📊 Learning Stats</ThemedText>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : (
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <LinearGradient
              key={index}
              colors={stat.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <ThemedText style={styles.statIcon}>{stat.icon}</ThemedText>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statUnit}>{stat.unit}</ThemedText>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
            </LinearGradient>
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
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
  },
});
