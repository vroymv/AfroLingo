import ActivityRenderer from "@/components/learn/lesson/ActivityRenderer";
import LessonCompletionCard from "@/components/learn/lesson/LessonCompletionCard";
import LessonHeader from "@/components/learn/lesson/LessonHeader";
import LessonTitleCard from "@/components/learn/lesson/LessonTitleCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
// Placeholder for lesson progress context
// Placeholder for lesson progress actions (remove useUserProgress)
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LessonPlayerScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  // Placeholder for lesson completion action
  const recordLessonComplete = (lessonId: string, xp: number) => {
    // TODO: Implement lesson completion logic
    // This is a placeholder for awarding XP and marking lesson complete
    console.log(`Lesson ${lessonId} completed. Awarded ${xp} XP.`);
  };
  // Placeholders for lesson progress context values
  const activeLesson = null; // TODO: Replace with actual lesson data
  const lessonsData = null; // TODO: Replace with actual lessons data
  const isLoading = false; // TODO: Replace with actual loading state
  const startLesson = (lessonId: string) => {}; // TODO: Implement startLesson
  const advanceActivity = () => {}; // TODO: Implement advanceActivity
  const goToNextLesson = () => null; // TODO: Implement goToNextLesson
  const getLessonMeta = (lessonId: string) => null; // TODO: Implement getLessonMeta
  const getCurrentActivity = () => null; // TODO: Implement getCurrentActivity

  useEffect(() => {
    if (lessonId && activeLesson?.lessonId !== lessonId && !isLoading) {
      startLesson(lessonId);
    }
  }, [lessonId, activeLesson?.lessonId, isLoading, startLesson]);

  if (isLoading || !lessonsData) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Loading lesson...</ThemedText>
      </ThemedView>
    );
  }

  if (!lessonId) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>No lesson selected.</ThemedText>
      </ThemedView>
    );
  }

  const currentActivity = getCurrentActivity();
  const meta = getLessonMeta(lessonId);

  if (!currentActivity || !meta) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Loading lesson...</ThemedText>
      </ThemedView>
    );
  }

  // Get lesson data from lessonsData
  const lessonData = activeLesson
    ? (() => {
        for (const unit of lessonsData.units) {
          const lesson = unit.lessons.find(
            (l: any) => l.id === activeLesson.lessonId
          );
          if (lesson) return lesson;
        }
        return null;
      })()
    : null;

  const totalActivities = lessonData?.activities?.length || 1;
  const currentActivityNumber = (activeLesson?.activityIndex || 0) + 1;

  const handleActivityComplete = () => {
    if (activeLesson?.completed) {
      const next = goToNextLesson();
      if (next) {
        router.replace(`/learn/lesson/${next}` as any);
      } else {
        router.replace("/(tabs)/learn" as any);
      }
    } else {
      advanceActivity();

      // Check if lesson is now complete and award XP
      if (activeLesson && getCurrentActivity() === undefined) {
        recordLessonComplete(lessonId, 15); // Award 15 XP per lesson
      }
    }
  };

  const handleBackToLearn = () => {
    router.back();
  };

  const handleNextLesson = () => {
    const next = goToNextLesson();
    if (next) {
      router.replace(`/learn/lesson/${next}` as any);
    } else {
      router.replace("/(tabs)/learn" as any);
    }
  };

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
        currentActivity={currentActivityNumber}
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
        <View style={styles.body}>
          <ActivityRenderer
            activity={currentActivity}
            lessonMeta={meta}
            onActivityComplete={handleActivityComplete}
          />
        </View>

        {/* Completion Footer */}
        {activeLesson?.completed && (
          <LessonCompletionCard
            xpEarned={15}
            onBackToLearn={handleBackToLearn}
            onNextLesson={handleNextLesson}
          />
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

  // Scroll View Styles
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
