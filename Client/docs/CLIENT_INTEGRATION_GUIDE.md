# Client-Side Implementation Example

## Overview

This guide shows how to update the existing lesson player to integrate with the new progress tracking API.

## Step 1: Create API Service

Create `/Client/services/lessonProgressApi.ts`:

```typescript
import { API_URL } from "@/config/env";

const getAuthToken = async () => {
  // Get token from your auth context/storage
  // Replace with your actual auth implementation
  return localStorage.getItem("authToken") || "";
};

export const lessonProgressApi = {
  /**
   * Start or resume a lesson
   */
  async startLesson(lessonId: string) {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/api/lessons/${lessonId}/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to start lesson");
    }

    return response.json();
  },

  /**
   * Submit an activity answer
   */
  async submitActivity(params: {
    activityId: string;
    lessonProgressId: string;
    answer: any;
    timeSpent: number;
    hintsUsed: number;
    isCorrect: boolean;
  }) {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_URL}/api/activities/${params.activityId}/submit`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer: params.answer,
          timeSpent: params.timeSpent,
          hintsUsed: params.hintsUsed,
          isCorrect: params.isCorrect,
          lessonProgressId: params.lessonProgressId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to submit activity");
    }

    return response.json();
  },

  /**
   * Request a hint for an activity
   */
  async requestHint(activityId: string, hintNumber: number) {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_URL}/api/activities/${activityId}/hint`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hintNumber }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get hint");
    }

    return response.json();
  },

  /**
   * Skip an activity
   */
  async skipActivity(
    activityId: string,
    lessonProgressId: string,
    timeSpent: number
  ) {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_URL}/api/activities/${activityId}/skip`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lessonProgressId, timeSpent }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to skip activity");
    }

    return response.json();
  },

  /**
   * Complete a lesson
   */
  async completeLesson(
    lessonId: string,
    finalScore: number,
    totalTimeSpent: number
  ) {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_URL}/api/lessons/${lessonId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ finalScore, totalTimeSpent }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to complete lesson");
    }

    return response.json();
  },

  /**
   * Get lesson progress
   */
  async getLessonProgress(lessonId: string) {
    const token = await getAuthToken();
    const response = await fetch(
      `${API_URL}/api/lessons/${lessonId}/progress`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get lesson progress");
    }

    return response.json();
  },
};
```

## Step 2: Update LessonProgressContext

Enhance `/Client/contexts/LessonProgressContext.tsx`:

```typescript
import { lessonProgressApi } from "@/services/lessonProgressApi";
import { useState, useCallback } from "react";

export interface ActiveLessonState {
  lessonId: string;
  lessonProgressId: string; // NEW: From API
  unitId: string;
  activityIndex: number;
  totalActivities: number;
  startedAt: Date;
  completed: boolean;
  sessionNumber: number; // NEW: Track session
  xpEarned: number; // NEW: Total XP from lesson
}

export interface ActivityState {
  activityId: string;
  startTime: number;
  hintsUsed: number;
  attempts: number;
}

// ... rest of context definition

export const LessonProgressProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [activeLesson, setActiveLesson] = useState<
    ActiveLessonState | undefined
  >();
  const [currentActivity, setCurrentActivity] = useState<
    ActivityState | undefined
  >();

  const startLesson = useCallback(async (lessonId: string) => {
    try {
      // Call API to start/resume lesson
      const response = await lessonProgressApi.startLesson(lessonId);

      const meta = findLesson(lessonId);
      if (!meta) return;

      setActiveLesson({
        lessonId,
        lessonProgressId: response.lessonProgressId, // From API
        unitId: meta.unit.id,
        activityIndex: response.currentActivityIndex, // Resume point from API
        totalActivities: response.totalActivities,
        startedAt: new Date(),
        completed: false,
        sessionNumber: response.sessionNumber,
        xpEarned: response.xpEarned || 0,
      });

      // Start tracking first activity
      const activities = meta.lesson.activities;
      if (activities[response.currentActivityIndex]) {
        setCurrentActivity({
          activityId: activities[response.currentActivityIndex].id,
          startTime: Date.now(),
          hintsUsed: 0,
          attempts: 0,
        });
      }
    } catch (error) {
      console.error("Failed to start lesson:", error);
      // Handle error - maybe show error toast
    }
  }, []);

  const submitActivity = useCallback(
    async (answer: any, isCorrect: boolean) => {
      if (!activeLesson || !currentActivity) return;

      const timeSpent = Math.floor(
        (Date.now() - currentActivity.startTime) / 1000
      );

      try {
        const response = await lessonProgressApi.submitActivity({
          activityId: currentActivity.activityId,
          lessonProgressId: activeLesson.lessonProgressId,
          answer,
          timeSpent,
          hintsUsed: currentActivity.hintsUsed,
          isCorrect,
        });

        // Update lesson state based on API response
        setActiveLesson((prev) =>
          prev
            ? {
                ...prev,
                activityIndex: response.nextActivityIndex,
                xpEarned: prev.xpEarned + response.xpEarned,
                completed: response.lessonCompleted,
              }
            : prev
        );

        // If not completed, start tracking next activity
        if (!response.lessonCompleted) {
          const meta = findLesson(activeLesson.lessonId);
          const nextActivity =
            meta?.lesson.activities[response.nextActivityIndex];

          if (nextActivity) {
            setCurrentActivity({
              activityId: nextActivity.id,
              startTime: Date.now(),
              hintsUsed: 0,
              attempts: 0,
            });
          }
        }

        return response;
      } catch (error) {
        console.error("Failed to submit activity:", error);
        throw error;
      }
    },
    [activeLesson, currentActivity]
  );

  const requestHint = useCallback(async () => {
    if (!currentActivity) return;

    try {
      const response = await lessonProgressApi.requestHint(
        currentActivity.activityId,
        currentActivity.hintsUsed + 1
      );

      // Update hints used count
      setCurrentActivity((prev) =>
        prev
          ? {
              ...prev,
              hintsUsed: prev.hintsUsed + 1,
            }
          : prev
      );

      return response;
    } catch (error) {
      console.error("Failed to get hint:", error);
      throw error;
    }
  }, [currentActivity]);

  const skipActivity = useCallback(async () => {
    if (!activeLesson || !currentActivity) return;

    const timeSpent = Math.floor(
      (Date.now() - currentActivity.startTime) / 1000
    );

    try {
      const response = await lessonProgressApi.skipActivity(
        currentActivity.activityId,
        activeLesson.lessonProgressId,
        timeSpent
      );

      // Move to next activity
      setActiveLesson((prev) =>
        prev
          ? {
              ...prev,
              activityIndex: response.nextActivityIndex,
            }
          : prev
      );

      return response;
    } catch (error) {
      console.error("Failed to skip activity:", error);
      throw error;
    }
  }, [activeLesson, currentActivity]);

  // ... rest of context implementation
};
```

## Step 3: Update ActivityRenderer

Enhance `/Client/components/learn/lesson/ActivityRenderer.tsx`:

```typescript
import { lessonProgressApi } from "@/services/lessonProgressApi";
import { useLessonProgress } from "@/contexts/LessonProgressContext";
import { useState } from "react";

export default function ActivityRenderer({ activity, onComplete }: Props) {
  const { submitActivity, requestHint, skipActivity } = useLessonProgress();
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!userAnswer) return;

    setIsSubmitting(true);
    try {
      // Determine if answer is correct based on activity type
      const isCorrect = checkAnswer(userAnswer, activity);

      // Submit to API
      const response = await submitActivity(userAnswer, isCorrect);

      // Show feedback
      setFeedback(
        response.correct
          ? "✅ Correct! +${response.xpEarned} XP"
          : `❌ ${response.explanation}`
      );

      // If correct, proceed after delay
      if (response.correct) {
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
    } catch (error) {
      setFeedback("Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHint = async () => {
    try {
      const response = await requestHint();
      // Show hint in UI
      showHintModal(response.hint);
    } catch (error) {
      console.error("Failed to get hint:", error);
    }
  };

  const handleSkip = async () => {
    try {
      await skipActivity();
      onComplete();
    } catch (error) {
      console.error("Failed to skip activity:", error);
    }
  };

  // ... rest of component
}
```

## Step 4: Update Lesson Player Screen

Update `/Client/app/learn/lesson/[lessonId].tsx`:

```typescript
export default function LessonPlayerScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const { activeLesson, startLesson, getCurrentActivity } = useLessonProgress();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (lessonId && activeLesson?.lessonId !== lessonId) {
      setIsLoading(true);
      startLesson(lessonId).finally(() => setIsLoading(false));
    }
  }, [lessonId, activeLesson?.lessonId, startLesson]);

  if (isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Loading lesson...</ThemedText>
      </ThemedView>
    );
  }

  const currentActivity = getCurrentActivity();

  if (!currentActivity || !activeLesson) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Lesson not found.</ThemedText>
      </ThemedView>
    );
  }

  const handleActivityComplete = () => {
    if (activeLesson.completed) {
      // Show completion screen with stats
      showCompletionModal({
        xpEarned: activeLesson.xpEarned,
        sessionNumber: activeLesson.sessionNumber,
      });
    } else {
      // Activity renderer will handle moving to next activity
      // via the submitActivity call in context
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LessonHeader
        unitTitle={meta.unitTitle}
        currentActivity={activeLesson.activityIndex + 1}
        totalActivities={activeLesson.totalActivities}
        onClose={() => router.back()}
      />

      <ScrollView>
        <ActivityRenderer
          activity={currentActivity}
          onComplete={handleActivityComplete}
        />
      </ScrollView>

      {activeLesson.completed && (
        <LessonCompletionCard
          xpEarned={activeLesson.xpEarned}
          onBackToLearn={() => router.back()}
          onNextLesson={handleNextLesson}
        />
      )}
    </SafeAreaView>
  );
}
```

## Step 5: Add Progress Indicators

Create `/Client/components/learn/ProgressStats.tsx`:

```typescript
import { lessonProgressApi } from "@/services/lessonProgressApi";
import { useEffect, useState } from "react";

interface ProgressStats {
  accuracyRate: number;
  totalCorrect: number;
  totalIncorrect: number;
  xpEarned: number;
  perfectActivities: number;
}

export function ProgressStats({ lessonId }: { lessonId: string }) {
  const [stats, setStats] = useState<ProgressStats | null>(null);

  useEffect(() => {
    lessonProgressApi
      .getLessonProgress(lessonId)
      .then((data) => setStats(data.lessonProgress))
      .catch(console.error);
  }, [lessonId]);

  if (!stats) return null;

  return (
    <View style={styles.statsContainer}>
      <StatItem
        label="Accuracy"
        value={`${stats.accuracyRate.toFixed(1)}%`}
        icon="🎯"
      />
      <StatItem
        label="Correct"
        value={stats.totalCorrect.toString()}
        icon="✅"
      />
      <StatItem label="XP" value={stats.xpEarned.toString()} icon="⭐" />
      <StatItem
        label="Perfect"
        value={stats.perfectActivities.toString()}
        icon="💯"
      />
    </View>
  );
}
```

## Testing Checklist

Once APIs are implemented:

- [ ] Start new lesson → Check database for `LessonProgress` record
- [ ] Submit correct answer → Verify XP awarded and activity index incremented
- [ ] Submit incorrect answer → Check `UserMistake` created
- [ ] Request hint → Verify `hintsUsed` incremented
- [ ] Close and reopen lesson → Confirm resumes at correct activity
- [ ] Complete lesson → Verify completion timestamp and bonus XP
- [ ] Check daily activity → Confirm streak and daily stats updated

## Error Handling

Add error boundaries and try-catch blocks:

```typescript
try {
  await submitActivity(answer, isCorrect);
} catch (error) {
  // Show error toast
  Toast.show({
    type: "error",
    text1: "Connection Error",
    text2: "Failed to save progress. Please try again.",
  });

  // Log for debugging
  console.error("Submit activity error:", error);

  // Optionally retry
  // await retryWithBackoff(() => submitActivity(answer, isCorrect));
}
```

## Offline Support (Future)

Consider adding:

1. Queue failed requests in AsyncStorage
2. Retry when connection restored
3. Show offline indicator
4. Cache lesson content locally

```typescript
// Pseudocode for offline queue
if (!isOnline) {
  await queueOfflineAction({
    type: "SUBMIT_ACTIVITY",
    payload: { activityId, answer, timeSpent },
  });
  // Show pending indicator
} else {
  await submitActivity(answer, isCorrect);
}
```

---

## Summary

The client-side integration involves:

1. ✅ **API Service Layer** - Centralized API calls
2. ✅ **Context Updates** - Track API-provided state
3. ✅ **Component Updates** - Call API on user actions
4. ✅ **Error Handling** - Graceful failure recovery
5. ✅ **Loading States** - User feedback during API calls
6. ✅ **Progress Display** - Show real-time stats

Once the server APIs are implemented, these client changes will enable full progress tracking!
