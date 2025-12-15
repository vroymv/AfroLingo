import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { User } from "@/types/AuthContext";

interface LearningStatsProps {
  user: User;
}

export default function LearningStats({ user }: LearningStatsProps) {
  // Calculate days since account creation
  const daysSinceJoined = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const stats = [
    {
      icon: "🔥",
      label: "Current Streak",
      value: Math.min(daysSinceJoined, 7).toString(),
      unit: "days",
      gradient: ["#FF6B6B", "#EE5A6F"],
    },
    {
      icon: "📚",
      label: "Lessons",
      value: Math.floor(daysSinceJoined * 1.5).toString(),
      unit: "completed",
      gradient: ["#4ECDC4", "#44A08D"],
    },
    {
      icon: "⏱️",
      label: "Study Time",
      value: Math.floor(daysSinceJoined * 0.8).toString(),
      unit: "hours",
      gradient: ["#A8E6CF", "#56AB91"],
    },
    {
      icon: "🏆",
      label: "XP Points",
      value: (Math.floor(daysSinceJoined * 1.5) * 50).toLocaleString(),
      unit: "total",
      gradient: ["#FFD93D", "#F4A261"],
    },
  ];

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>📊 Learning Stats</ThemedText>
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
