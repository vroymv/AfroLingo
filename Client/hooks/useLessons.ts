import { useState, useEffect } from "react";
import {
  fetchLessons,
  fetchLessonById,
  fetchLessonsByUnit,
  LessonsData,
  Lesson,
  Unit,
} from "@/services/lessons";

/**
 * Hook to fetch all lessons
 */
export const useLessons = (
  level?: string,
  includeActivities: boolean = true
) => {
  const [data, setData] = useState<LessonsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLoading(true);
        setError(null);
        const lessonsData = await fetchLessons(level, includeActivities);
        setData(lessonsData);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load lessons")
        );
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [level, includeActivities]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchLessons(level, includeActivities),
  };
};

/**
 * Hook to fetch a specific lesson by ID
 */
export const useLesson = (lessonId: string) => {
  const [data, setData] = useState<(Lesson & { unit: any }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true);
        setError(null);
        const lessonData = await fetchLessonById(lessonId);
        setData(lessonData);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load lesson")
        );
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      loadLesson();
    }
  }, [lessonId]);

  return { data, loading, error, refetch: () => fetchLessonById(lessonId) };
};

/**
 * Hook to fetch lessons by unit
 */
export const useUnitLessons = (
  unitId: string,
  includeActivities: boolean = true
) => {
  const [data, setData] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadUnitLessons = async () => {
      try {
        setLoading(true);
        setError(null);
        const unitData = await fetchLessonsByUnit(unitId, includeActivities);
        setData(unitData);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load unit lessons")
        );
      } finally {
        setLoading(false);
      }
    };

    if (unitId) {
      loadUnitLessons();
    }
  }, [unitId, includeActivities]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchLessonsByUnit(unitId, includeActivities),
  };
};
