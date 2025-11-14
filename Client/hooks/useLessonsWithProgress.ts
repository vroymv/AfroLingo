import { useState, useEffect } from "react";
import { fetchLessons, LessonsData, Unit } from "@/services/lessons";
import { fetchUserProgress, UserProgressData } from "@/services/userProgress";

/**
 * Combined hook that fetches lessons and merges them with user progress
 * This ensures that the UI shows real-time progress data
 */
export const useLessonsWithProgress = (
  level?: string,
  includeActivities: boolean = true
) => {
  const [data, setData] = useState<LessonsData | null>(null);
  const [stats, setStats] = useState<UserProgressData["stats"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both lessons and progress in parallel
        const [lessonsData, progressData] = await Promise.all([
          fetchLessons(level, includeActivities),
          fetchUserProgress().catch(() => null), // Don't fail if progress fetch fails
        ]);

        // If we have progress data, merge it with lessons
        if (progressData) {
          const progressMap = new Map(
            progressData.units.map((unit) => [unit.id, unit])
          );

          const mergedUnits = lessonsData.units.map((unit): Unit => {
            const userProgress = progressMap.get(unit.id);

            if (userProgress) {
              return {
                ...unit,
                progress: userProgress.progress,
                completedLessons: userProgress.completedLessons,
                xpReward: userProgress.xpEarned || unit.xpReward,
              };
            }

            // No progress yet - return unit with default values
            return {
              ...unit,
              progress: 0,
              completedLessons: 0,
            };
          });

          setData({
            ...lessonsData,
            units: mergedUnits,
          });
          setStats(progressData.stats);
        } else {
          // No progress data - use lessons as-is with default progress
          setData(lessonsData);
          setStats(null);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load lessons")
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [level, includeActivities]);

  const refetch = async () => {
    try {
      setLoading(true);
      const [lessonsData, progressData] = await Promise.all([
        fetchLessons(level, includeActivities),
        fetchUserProgress().catch(() => null),
      ]);

      if (progressData) {
        const progressMap = new Map(
          progressData.units.map((unit) => [unit.id, unit])
        );

        const mergedUnits = lessonsData.units.map((unit): Unit => {
          const userProgress = progressMap.get(unit.id);

          if (userProgress) {
            return {
              ...unit,
              progress: userProgress.progress,
              completedLessons: userProgress.completedLessons,
              xpReward: userProgress.xpEarned || unit.xpReward,
            };
          }

          return {
            ...unit,
            progress: 0,
            completedLessons: 0,
          };
        });

        setData({
          ...lessonsData,
          units: mergedUnits,
        });
        setStats(progressData.stats);
      } else {
        setData(lessonsData);
        setStats(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    stats,
    loading,
    error,
    refetch,
  };
};
