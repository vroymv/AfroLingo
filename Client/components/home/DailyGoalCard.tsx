import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { getProgressTrackerStats } from "@/services/progressTracker";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface DailyGoalCardProps {
  onContinueLesson: () => void;
}

export default function DailyGoalCard({
  onContinueLesson,
}: DailyGoalCardProps) {
  const { user } = useAuth();
  const [live, setLive] = useState({
    streakDays: 0,
    todayXpEarned: 0,
    dailyXpGoal: 0,
    todayLessonsCompleted: 0,
    dailyLessonGoal: 0,
  });

  const fetchLive = useCallback(async () => {
    if (!user?.id) return;

    const result = await getProgressTrackerStats(user.id);
    if (!result.success) return;

    const goalXp =
      result.data?.todayGoalXp ?? result.data?.dailyXpGoal ?? live.dailyXpGoal;
    const goalLessons =
      result.data?.todayGoalLessons ??
      result.data?.dailyLessonGoal ??
      live.dailyLessonGoal;

    setLive({
      streakDays: result.data?.streakDays ?? 0,
      todayXpEarned: result.data?.todayXpEarned ?? 0,
      dailyXpGoal: typeof goalXp === "number" ? goalXp : 0,
      todayLessonsCompleted: result.data?.todayActivitiesCompleted ?? 0,
      dailyLessonGoal: typeof goalLessons === "number" ? goalLessons : 0,
    });
  }, [user?.id, live.dailyLessonGoal, live.dailyXpGoal]);

  useFocusEffect(
    useCallback(() => {
      fetchLive();
    }, [fetchLive])
  );

  const progressPercent = useMemo(() => {
    if (!live.dailyXpGoal || live.dailyXpGoal <= 0) return 0;
    return Math.min(
      100,
      Math.round((live.todayXpEarned / live.dailyXpGoal) * 100)
    );
  }, [live.dailyXpGoal, live.todayXpEarned]);

  const ringRotation = useMemo(() => {
    return `${Math.round((progressPercent / 100) * 360)}deg`;
  }, [progressPercent]);

  const xpRemaining = useMemo(() => {
    if (!live.dailyXpGoal || live.dailyXpGoal <= 0) return 0;
    return Math.max(0, live.dailyXpGoal - live.todayXpEarned);
  }, [live.dailyXpGoal, live.todayXpEarned]);

  return (
    <ThemedView style={styles.dailyGoalCard}>
      <View style={styles.goalHeader}>
        <ThemedText type="subtitle">Daily Goal Tracker</ThemedText>
        <View style={styles.streakBadge}>
          <ThemedText style={styles.streakIcon}>🔥</ThemedText>
          <ThemedText style={styles.streakNumber}>{live.streakDays}</ThemedText>
        </View>
      </View>

      <View style={styles.progressRingContainer}>
        <View style={styles.progressRing}>
          <View
            style={[
              styles.progressRingFill,
              { transform: [{ rotate: ringRotation }] },
            ]}
          />
          <View style={styles.progressRingInner}>
            <ThemedText style={styles.progressPercentage}>
              {progressPercent}%
            </ThemedText>
            <ThemedText style={styles.progressLabel}>Daily Goal</ThemedText>
          </View>
        </View>
        <View style={styles.goalDetails}>
          <ThemedText style={styles.goalText}>
            {live.dailyLessonGoal > 0
              ? `${live.todayLessonsCompleted} of ${live.dailyLessonGoal} lessons completed today`
              : `${live.todayLessonsCompleted} lessons completed today`}
          </ThemedText>
          <ThemedText style={styles.xpText}>
            +{live.todayXpEarned} XP earned
            {live.dailyXpGoal > 0 ? ` • ${xpRemaining} XP to goal` : ""}
          </ThemedText>
        </View>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={onContinueLesson}
      >
        <ThemedText style={styles.continueButtonText}>
          Continue Lesson
        </ThemedText>
        <ThemedText style={styles.continueButtonIcon}>▶️</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  dailyGoalCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 69, 0, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF4500",
  },
  progressRingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  progressRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    position: "relative",
  },
  progressRingFill: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#007AFF",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
  progressRingInner: {
    alignItems: "center",
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  progressLabel: {
    fontSize: 10,
    opacity: 0.6,
  },
  goalDetails: {
    flex: 1,
  },
  goalText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  xpText: {
    fontSize: 14,
    opacity: 0.7,
  },
  continueButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  continueButtonIcon: {
    color: "white",
    fontSize: 18,
  },
});
