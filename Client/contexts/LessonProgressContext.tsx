import {
  fetchLessonsWithProgress,
  startLessonApi,
  LessonsData,
} from "@/services/lessons";
import { getCurrentUserId } from "@/services/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ActiveLessonState,
  LessonProgressContextType,
  LessonProgressProviderProps,
} from "@/types/contexts";

export type { ActiveLessonState, LessonProgressContextType };

const LessonProgressContext = createContext<
  LessonProgressContextType | undefined
>(undefined);

function findLesson(lessonsData: LessonsData | undefined, lessonId: string) {
  if (!lessonsData) return undefined;

  for (const unit of lessonsData.units) {
    const idx = unit.lessons.findIndex((l) => l.id === lessonId);
    if (idx !== -1) {
      return { unit, lesson: unit.lessons[idx], lessonIndex: idx };
    }
  }
  return undefined;
}

function computeNextLessonId(
  lessonsData: LessonsData | undefined,
  currentLessonId?: string
): string | undefined {
  if (!lessonsData) return undefined;

  // Flatten lessons preserving unit ordering
  const flattened: { unitId: string; lessonId: string }[] = [];
  lessonsData.units.forEach((u) => {
    u.lessons.forEach((l) => flattened.push({ unitId: u.id, lessonId: l.id }));
  });

  if (!flattened.length) return undefined;
  if (!currentLessonId) return flattened[0].lessonId;
  const currentIdx = flattened.findIndex((l) => l.lessonId === currentLessonId);
  if (currentIdx === -1) return flattened[0].lessonId;
  return flattened[currentIdx + 1]?.lessonId; // may be undefined if at end
}

export const LessonProgressProvider = ({
  children,
}: LessonProgressProviderProps) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeLesson, setActiveLesson] = useState<
    ActiveLessonState | undefined
  >();
  const [lessonsData, setLessonsData] = useState<LessonsData | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lessons with user progress on mount
  const fetchLessons = useCallback(async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const userId = getCurrentUserId();
      const data = await fetchLessonsWithProgress(userId);

      setLessonsData(data);
    } catch (err) {
      console.error("Error fetching lessons:", err);
      setError(err instanceof Error ? err.message : "Failed to load lessons");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Only fetch when auth is ready and user is authenticated
    if (!authLoading && isAuthenticated) {
      fetchLessons();
    } else if (!authLoading && !isAuthenticated) {
      // User is not authenticated, clear data
      setIsLoading(false);
      setLessonsData(undefined);
    }
  }, [authLoading, isAuthenticated, fetchLessons]);

  const startLesson = useCallback(
    async (lessonId: string) => {
      try {
        const meta = findLesson(lessonsData, lessonId);
        if (!meta) {
          console.error("Lesson not found:", lessonId);
          return;
        }

        // Call API to track lesson start
        await startLessonApi(lessonId);

        // Update local state
        setActiveLesson({
          lessonId,
          unitId: meta.unit.id,
          lessonIndex: meta.lessonIndex,
          activityIndex: meta.lesson.currentActivityIndex || 0,
          startedAt: new Date(),
          completed: false,
        });
      } catch (err) {
        console.error("Error starting lesson:", err);
        // Still set local state even if API call fails
        const meta = findLesson(lessonsData, lessonId);
        if (meta) {
          setActiveLesson({
            lessonId,
            unitId: meta.unit.id,
            lessonIndex: meta.lessonIndex,
            activityIndex: 0,
            startedAt: new Date(),
            completed: false,
          });
        }
      }
    },
    [lessonsData]
  );

  const completeLesson = useCallback(() => {
    setActiveLesson((prev) => (prev ? { ...prev, completed: true } : prev));
  }, []);

  const goToNextLesson = useCallback(() => {
    const nextId = computeNextLessonId(lessonsData, activeLesson?.lessonId);
    if (nextId) {
      startLesson(nextId);
    }
    return nextId;
  }, [lessonsData, activeLesson?.lessonId, startLesson]);

  const nextLessonIdFn = useCallback(
    () => computeNextLessonId(lessonsData, activeLesson?.lessonId),
    [lessonsData, activeLesson?.lessonId]
  );

  const getLessonMeta = useCallback(
    (lessonId: string) => {
      const res = findLesson(lessonsData, lessonId);
      if (!res) return undefined;
      return {
        phrase: res.lesson.phrase,
        meaning: res.lesson.meaning,
        unitTitle: res.unit.title,
        alphabetImage: res.lesson.alphabetImage,
        audio: res.lesson.audio,
      };
    },
    [lessonsData]
  );

  const advanceActivity = useCallback(() => {
    setActiveLesson((prev) => {
      if (!prev) return prev;
      const meta = findLesson(lessonsData, prev.lessonId);
      if (!meta) return prev;

      const totalActivities = meta.lesson.activities.length;
      const nextActivityIndex = prev.activityIndex + 1;

      if (nextActivityIndex >= totalActivities) {
        // Lesson complete
        return { ...prev, completed: true };
      }

      return { ...prev, activityIndex: nextActivityIndex };
    });
  }, [lessonsData]);

  const getCurrentActivity = useCallback(() => {
    if (!activeLesson) return undefined;
    const meta = findLesson(lessonsData, activeLesson.lessonId);
    if (!meta) return undefined;
    return meta.lesson.activities[activeLesson.activityIndex];
  }, [lessonsData, activeLesson]);

  const value = useMemo<LessonProgressContextType>(
    () => ({
      activeLesson,
      lessonsData,
      isLoading,
      error,
      startLesson,
      completeLesson,
      advanceActivity,
      goToNextLesson,
      nextLessonId: nextLessonIdFn,
      isInLesson: !!activeLesson && !activeLesson.completed,
      getLessonMeta,
      getCurrentActivity,
      refreshLessons: fetchLessons,
    }),
    [
      activeLesson,
      lessonsData,
      isLoading,
      error,
      startLesson,
      completeLesson,
      advanceActivity,
      goToNextLesson,
      nextLessonIdFn,
      getLessonMeta,
      getCurrentActivity,
      fetchLessons,
    ]
  );

  return (
    <LessonProgressContext.Provider value={value}>
      {children}
    </LessonProgressContext.Provider>
  );
};

export function useLessonProgress() {
  const ctx = useContext(LessonProgressContext);
  if (!ctx)
    throw new Error(
      "useLessonProgress must be used within LessonProgressProvider"
    );
  return ctx;
}
