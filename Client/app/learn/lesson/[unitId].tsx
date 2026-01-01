import ActivityRenderer from "@/components/learn/lesson/ActivityRenderer";
import LessonCompletionCard from "@/components/learn/lesson/LessonCompletionCard";
import LessonHeader from "@/components/learn/lesson/LessonHeader";
import LessonTitleCard from "@/components/learn/lesson/LessonTitleCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Activity } from "@/data/lessons";
import { useAuth } from "@/contexts/AuthContext";
import { LessonRuntimeProvider } from "@/contexts/LessonRuntimeContext";
import { touchUnitAccess } from "@/services/unitAccess";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function LessonPlayerScreen() {
  const { unitId } = useLocalSearchParams<{ unitId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  // Server returns a single unit with activities
  const [unit, setUnit] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = React.useState(0);

  useEffect(() => {
    if (!unitId) return;

    // Best-effort: keep server-side lastAccessedAt meaningful for resume.
    if (user?.id) {
      void touchUnitAccess({ userId: user.id, unitId: String(unitId) });
    }

    const fetchUnit = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!API_BASE_URL) {
          throw new Error(
            "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env."
          );
        }

        const response = await fetch(`${API_BASE_URL}/units/${unitId}`);
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch unit");
        }
        setUnit(data.data);
      } catch (e: any) {
        console.error("Error fetching unit:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUnit();
  }, [unitId, user?.id]);

  // Normalize server activities to client Activity shape (minimal)
  const activities: Activity[] = useMemo(() => {
    if (!unit?.activities) return [];
    return unit.activities
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
      .map((a: any) => ({
        id: a.id,
        type: (a.type as Activity["type"]) || "introduction",
      }));
  }, [unit]);

  // Meta fallback. Phrase/meaning may not exist on server yet.
  const meta = useMemo(
    () => ({
      phrase: unit?.title || "Lesson Phrase Pending",
      meaning: unit?.level || "Meaning Pending",
      unitTitle: unit?.title || "Unit",
    }),
    [unit]
  );

  const totalActivities = activities.length || 1;
  const currentActivityNumber = currentActivityIndex + 1;
  const currentActivity = activities[currentActivityIndex];

  const lessonCompleted = currentActivityIndex >= activities.length;

  const recordLessonComplete = (id: string, xp: number) => {
    console.log(`Lesson ${id} completed. Awarded ${xp} XP.`);
    // TODO: persist completion/xp to backend
  };

  const handleActivityComplete = () => {
    if (currentActivityIndex + 1 < activities.length) {
      setCurrentActivityIndex((idx) => idx + 1);
    } else {
      // Mark completion
      recordLessonComplete(unitId as string, unit?.xpReward || 15);
      setCurrentActivityIndex(activities.length); // past the end
    }
  };

  const handleBackToLearn = () => router.back();
  const handleNextLesson = () => router.replace("/(tabs)/learn" as any); // TODO: navigate to next unit when available

  if (!unitId) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>No lesson selected.</ThemedText>
      </ThemedView>
    );
  }

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Loading lesson...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Error: {error}</ThemedText>
      </ThemedView>
    );
  }

  if (!unit) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Unit not found.</ThemedText>
      </ThemedView>
    );
  }

  if (!currentActivity && !lessonCompleted) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>No activities available.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Custom Header with Progress */}
      <LessonHeader
        unitTitle={meta.unitTitle}
        currentActivity={Math.min(currentActivityNumber, totalActivities)}
        totalActivities={totalActivities}
        onClose={() => router.back()}
      />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lesson Title Card */}
        <LessonTitleCard phrase={meta.phrase} meaning={meta.meaning} />

        {/* Activity Content */}
        {!lessonCompleted && currentActivity && (
          <LessonRuntimeProvider
            value={{
              userId: user?.id ?? null,
              unitId: String(unitId),
              currentActivityNumber,
              totalActivities,
            }}
          >
            <View style={styles.body}>
              <ActivityRenderer
                activity={currentActivity}
                lessonMeta={meta}
                onActivityComplete={handleActivityComplete}
              />
            </View>
          </LessonRuntimeProvider>
        )}

        {/* Completion Footer */}
        {lessonCompleted && (
          <LessonRuntimeProvider
            value={{
              userId: user?.id ?? null,
              unitId: String(unitId),
              currentActivityNumber,
              totalActivities,
            }}
          >
            <LessonCompletionCard
              xpEarned={unit?.xpReward || 15}
              onBackToLearn={handleBackToLearn}
              onNextLesson={handleNextLesson}
            />
          </LessonRuntimeProvider>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Body
  body: {
    paddingHorizontal: 20,
    minHeight: 400,
  },
});
