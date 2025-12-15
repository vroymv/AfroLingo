import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { User } from "@/types/AuthContext";

interface WeeklyGoalsProps {
  user: User;
}

export default function WeeklyGoals({ user }: WeeklyGoalsProps) {
  // Calculate dynamic progress based on days active
  const daysSinceJoined = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const weekProgress = daysSinceJoined % 7;
  const goals = [
    {
      label: "Complete 5 lessons",
      current: Math.min(weekProgress, 5),
      total: 5,
      icon: "🎯",
    },
    {
      label: "Practice 30 minutes daily",
      current: Math.min(weekProgress, 7),
      total: 7,
      icon: "⏰",
    },
    {
      label: "Master 20 new words",
      current: Math.min(weekProgress * 2, 20),
      total: 20,
      icon: "📝",
    },
  ];

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>🎯 Weekly Goals</ThemedText>
      <View style={styles.goalsContainer}>
        {goals.map((goal, index) => {
          const percentage = (goal.current / goal.total) * 100;
          return (
            <View key={index} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalInfo}>
                  <ThemedText style={styles.goalIcon}>{goal.icon}</ThemedText>
                  <ThemedText style={styles.goalLabel}>{goal.label}</ThemedText>
                </View>
                <View style={styles.goalProgress}>
                  <ThemedText style={styles.goalNumbers}>
                    {goal.current}/{goal.total}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.progressBarContainer}>
                <LinearGradient
                  colors={
                    percentage >= 100
                      ? ["#4CAF50", "#45A049"]
                      : ["#4A90E2", "#357ABD"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.min(percentage, 100)}%` },
                  ]}
                />
              </View>
              <ThemedText style={styles.percentageText}>
                {Math.round(percentage)}% Complete
              </ThemedText>
            </View>
          );
        })}
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
  goalsContainer: {
    gap: 12,
  },
  goalCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  goalInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  goalIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  goalLabel: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  goalProgress: {
    backgroundColor: "rgba(74, 144, 226, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  goalNumbers: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  percentageText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "right",
  },
});
