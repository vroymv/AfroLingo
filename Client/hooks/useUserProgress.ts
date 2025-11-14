import { useState, useEffect } from "react";
import { fetchUserProgress, UserProgressData } from "@/services/userProgress";

/**
 * Hook to fetch user's progress data
 */
export const useUserProgress = (userId?: string) => {
  const [data, setData] = useState<UserProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        setLoading(true);
        setError(null);
        const progressData = await fetchUserProgress(userId);
        setData(progressData);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load user progress")
        );
      } finally {
        setLoading(false);
      }
    };

    loadUserProgress();
  }, [userId]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchUserProgress(userId),
  };
};
