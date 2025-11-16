import { useState, useEffect } from "react";
import { fetchLessonsWithProgress, LessonsData } from "@/services/lessons";
import { getCurrentUserId } from "@/services/apiClient";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook that fetches lessons with user progress from the API
 * Uses the new /api/lessons/user/:userId endpoint which returns lessons
 * already merged with user progress data
 * Note: Stats are now fetched separately via useProgressStats hook
 */
export const useLessonsWithProgress = (
  level?: string,
  includeActivities: boolean = true
) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<LessonsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      // Don't fetch if auth is still loading or user is not authenticated
      if (authLoading || !isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get current user ID
        const userId = getCurrentUserId();

        // Fetch lessons with user progress already merged from API
        const lessonsData = await fetchLessonsWithProgress(
          userId,
          level,
          includeActivities
        );

        setData(lessonsData);
      } catch (err) {
        console.error("Error loading lessons with progress:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to load lessons")
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authLoading, isAuthenticated, level, includeActivities]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = getCurrentUserId();
      const lessonsData = await fetchLessonsWithProgress(
        userId,
        level,
        includeActivities
      );

      setData(lessonsData);
    } catch (err) {
      console.error("Error refetching lessons:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to refetch lessons")
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};
