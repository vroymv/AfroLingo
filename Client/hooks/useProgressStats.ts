import { useState, useEffect } from "react";
import { fetchUserStats, ProgressTrackerStats } from "@/services/userProgress";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook to fetch user progress tracker statistics
 * This is a lightweight hook that only fetches the stats needed for the ProgressTracker component
 * All calculations are done on the server side
 */
export const useProgressStats = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<ProgressTrackerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      // Don't fetch if auth is still loading or user is not authenticated
      if (authLoading || !isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const statsData = await fetchUserStats();
        setStats(statsData);
      } catch (err) {
        console.error("Error loading progress stats:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to load stats")
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [authLoading, isAuthenticated]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);

      const statsData = await fetchUserStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error refetching progress stats:", err);
      setError(err instanceof Error ? err : new Error("Failed to load stats"));
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refetch,
  };
};
