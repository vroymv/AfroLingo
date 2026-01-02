import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { User } from "@/types/AuthContext";
import { ProfileStats } from "@/services/profile";

interface WeeklyGoalsProps {
  user: User;
  profileStats: ProfileStats | null;
  isLoading?: boolean;
}

export default function WeeklyGoals({
  user,
  profileStats,
  isLoading,
}: WeeklyGoalsProps) {
  // Use actual goals from profile stats or defaults
  const dailyXpGoal = profileStats?.dailyXpGoal || 30;
  const todayXpEarned = profileStats?.todayXpEarned || 0;
  const todayActivitiesCompleted = profileStats?.todayActivitiesCompleted || 0;

  // Calculate weekly goals based on daily progress
  const goals = [
    {
      label: `Earn ${dailyXpGoal} XP today`,
      current: todayXpEarned,
      total: dailyXpGoal,
    },
    {
      label: "Complete 5 activities today",
      current: Math.min(todayActivitiesCompleted, 5),
      total: 5,
    },
    {
      label: "Keep your streak alive",
      current: profileStats?.todayXpEarned > 0 ? 1 : 0,
      total: 1,
    },
  ];

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Today's Goals</ThemedText>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : (
        <View style={styles.goalsContainer}>
          {goals.map((goal, index) => {
            const percentage = (goal.current / goal.total) * 100;
            return (
              <View key={index} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <ThemedText style={styles.goalLabel}>
                      {goal.label}
                    </ThemedText>
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
    flex: 1,
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
