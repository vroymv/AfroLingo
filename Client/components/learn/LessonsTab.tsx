import { ThemedView } from "@/components/ThemedView";
import { useLessonProgress } from "@/contexts/LessonProgressContext";
import { Unit } from "@/data/lessons";
import { useLessonsWithProgress } from "@/hooks/useLessonsWithProgress";
import { useProgressStats } from "@/hooks/useProgressStats";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  AccessibilityInfo,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { EmptyState, ErrorState, LoadingState } from "./LessonsStates";
import { ProgressTracker } from "./ProgressTracker";
import { UnitsList } from "./UnitsList";

export const LessonsTab: React.FC = () => {
  const router = useRouter();
  const { startLesson, activeLesson } = useLessonProgress();
  const { data: lessonsData, loading, error } = useLessonsWithProgress();
  const { stats: progressStats, loading: statsLoading } = useProgressStats();

  const getNextLessonInUnit = useCallback(
    (unit: Unit) => {
      // If there's an active lesson in this unit, return it
      if (
        activeLesson &&
        activeLesson.unitId === unit.id &&
        !activeLesson.completed
      ) {
        return activeLesson.lessonId;
      }

      // Otherwise, find the first incomplete lesson in the unit
      // For now, just return the first lesson since we don't have completion tracking per lesson
      return unit.lessons[0]?.id;
    },
    [activeLesson]
  );

  const handleUnitPress = useCallback(
    (unit: Unit) => {
      const lessonId = getNextLessonInUnit(unit);

      if (lessonId) {
        // Start the lesson in context
        startLesson(lessonId);
        // Navigate to the lesson player
        router.push(`/learn/lesson/${lessonId}` as any);

        const lesson = unit.lessons.find((l) => l.id === lessonId);
        if (Platform.OS === "ios") {
          AccessibilityInfo.announceForAccessibility(
            `Starting ${unit.title} - ${lesson?.phrase || "lesson"}`
          );
        }
      } else {
        console.log("No lessons available in unit:", unit.title);
      }
    },
    [router, startLesson, getNextLessonInUnit]
  );

  if (loading || statsLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  if (!lessonsData || !lessonsData.units || lessonsData.units.length === 0) {
    return <EmptyState />;
  }

  // Don't render ProgressTracker if stats haven't loaded yet
  if (!progressStats) {
    return <LoadingState />;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProgressTracker stats={progressStats} />
        <UnitsList units={lessonsData.units} onUnitPress={handleUnitPress} />
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
