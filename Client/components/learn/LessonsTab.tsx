import { ThemedView } from "@/components/ThemedView";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { ProgressTracker } from "./ProgressTracker";
import { UnitsList } from "./UnitsList";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { computeProgressStats, mapUnitsToUi } from "@/services/lessonTap";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const LessonsTab: React.FC = () => {
  const { state } = useOnboarding();
  const { user } = useAuth();
  const [units, setUnits] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUnits();
    setRefreshing(false);
  }, [fetchUnits]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const mappedUnits = mapUnitsToUi(units);

  // Aggregate progress stats for ProgressTracker (computed via helper)
  const progressStats = computeProgressStats(mappedUnits as any, units);

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
