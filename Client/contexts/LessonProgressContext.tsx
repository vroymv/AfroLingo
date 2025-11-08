import { mockLessonsData } from "@/data/lessons";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface ActiveLessonState {
  lessonId: string;
  unitId: string;
  lessonIndex: number; // index within unit
  activityIndex: number; // placeholder for future multi-activity lessons
  startedAt: Date;
  completed: boolean;
}

interface LessonProgressContextType {
  activeLesson?: ActiveLessonState;
  startLesson: (lessonId: string) => void;
  nextLessonId: () => string | undefined;
  completeLesson: () => void;
  advanceActivity: () => void;
  goToNextLesson: () => string | undefined; // returns new lesson id
  isInLesson: boolean;
  getLessonMeta: (lessonId: string) =>
    | {
        phrase: string;
        meaning: string;
        unitTitle: string;
        alphabetImage?: string;
        audio?: string;
      }
    | undefined;
  getCurrentActivity: () => any | undefined;
}

const LessonProgressContext = createContext<
  LessonProgressContextType | undefined
>(undefined);

function findLesson(lessonId: string) {
  for (const unit of mockLessonsData.units) {
    const idx = unit.lessons.findIndex((l) => l.id === lessonId);
    if (idx !== -1) {
      return { unit, lesson: unit.lessons[idx], lessonIndex: idx };
    }
  }
  return undefined;
}

function computeNextLessonId(currentLessonId?: string): string | undefined {
  // Flatten lessons preserving unit ordering
  const flattened: { unitId: string; lessonId: string }[] = [];
  mockLessonsData.units.forEach((u) => {
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
}: {
  children: ReactNode;
}) => {
  const [activeLesson, setActiveLesson] = useState<
    ActiveLessonState | undefined
  >();

  const startLesson = useCallback((lessonId: string) => {
    const meta = findLesson(lessonId);
    if (!meta) return;
    setActiveLesson({
      lessonId,
      unitId: meta.unit.id,
      lessonIndex: meta.lessonIndex,
      activityIndex: 0,
      startedAt: new Date(),
      completed: false,
    });
  }, []);

  const completeLesson = useCallback(() => {
    setActiveLesson((prev) => (prev ? { ...prev, completed: true } : prev));
  }, []);

  const goToNextLesson = useCallback(() => {
    const nextId = computeNextLessonId(activeLesson?.lessonId);
    if (nextId) {
      startLesson(nextId);
    }
    return nextId;
  }, [activeLesson?.lessonId, startLesson]);

  const nextLessonIdFn = useCallback(
    () => computeNextLessonId(activeLesson?.lessonId),
    [activeLesson?.lessonId]
  );

  const getLessonMeta = useCallback((lessonId: string) => {
    const res = findLesson(lessonId);
    if (!res) return undefined;
    return {
      phrase: res.lesson.phrase,
      meaning: res.lesson.meaning,
      unitTitle: res.unit.title,
      alphabetImage: res.lesson.alphabetImage,
      audio: res.lesson.audio,
    };
  }, []);

  const advanceActivity = useCallback(() => {
    setActiveLesson((prev) => {
      if (!prev) return prev;
      const meta = findLesson(prev.lessonId);
      if (!meta) return prev;

      const totalActivities = meta.lesson.activities.length;
      const nextActivityIndex = prev.activityIndex + 1;

      if (nextActivityIndex >= totalActivities) {
        // Lesson complete
        return { ...prev, completed: true };
      }

      return { ...prev, activityIndex: nextActivityIndex };
    });
  }, []);

  const getCurrentActivity = useCallback(() => {
    if (!activeLesson) return undefined;
    const meta = findLesson(activeLesson.lessonId);
    if (!meta) return undefined;
    return meta.lesson.activities[activeLesson.activityIndex];
  }, [activeLesson]);

  const value = useMemo<LessonProgressContextType>(
    () => ({
      activeLesson,
      startLesson,
      completeLesson,
      advanceActivity,
      goToNextLesson,
      nextLessonId: nextLessonIdFn,
      isInLesson: !!activeLesson && !activeLesson.completed,
      getLessonMeta,
      getCurrentActivity,
    }),
    [
      activeLesson,
      startLesson,
      completeLesson,
      advanceActivity,
      goToNextLesson,
      nextLessonIdFn,
      getLessonMeta,
      getCurrentActivity,
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
