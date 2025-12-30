import { ThemedView } from "@/components/ThemedView";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { ProgressTracker } from "./ProgressTracker";
import { UnitsList } from "./UnitsList";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mapUnitsToUi, computeMilestones } from "@/services/lessonTap";
import { getProgressTrackerStats } from "@/services/progressTracker";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const LessonsTab: React.FC = () => {
  const { state } = useOnboarding();
  const { user } = useAuth();
  const [units, setUnits] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [liveStats, setLiveStats] = useState({
    totalXP: 0,
    streakDays: 0,
    completedActivities: 0,
  });

  const fetchUnits = useCallback(async () => {
    if (!API_BASE_URL) {
      console.error(
        "Missing EXPO_PUBLIC_API_BASE_URL; cannot fetch units from API."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/units/level/${state.selectedLevel}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user?.id }),
        }
      );

      const data = await response.json();
      setUnits(data.data);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  }, [state.selectedLevel, user?.id]);

  const fetchProgressTracker = useCallback(async () => {
    if (!user?.id) return;

    const result = await getProgressTrackerStats(user.id);
    if (!result.success) {
      console.warn("Failed to fetch progress tracker stats", result.message);
      return;
    }

    setLiveStats({
      totalXP: result.data?.totalXP ?? 0,
      streakDays: result.data?.streakDays ?? 0,
      completedActivities: result.data?.completedActivities ?? 0,
    });
  }, [user?.id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchUnits(), fetchProgressTracker()]);
    setRefreshing(false);
  }, [fetchUnits, fetchProgressTracker]);

  useEffect(() => {
    fetchUnits();
    fetchProgressTracker();
  }, [fetchUnits, fetchProgressTracker]);

  const mappedUnits = mapUnitsToUi(units);

  const completedUnits = mappedUnits.filter((u) => u.progress === 100).length;
  const inProgressUnits = mappedUnits.filter(
    (u) => u.progress > 0 && u.progress < 100
  ).length;
  const totalUnits = mappedUnits.length;
  const milestones = computeMilestones(mappedUnits as any);

  const progressStats = {
    totalXP: liveStats.totalXP,
    streakDays: liveStats.streakDays,
    completedActivities: liveStats.completedActivities,
    completedUnits,
    inProgressUnits,
    totalUnits,
    milestones,
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ProgressTracker stats={progressStats} />
        <UnitsList units={mappedUnits as any} />
        <View style={styles.bottomPadding} />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bottomPadding: {
    height: 100,
  },
});
