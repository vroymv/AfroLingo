import { ENV } from "@/config/env";
import { getAuthHeaders, getCurrentUserId } from "./apiClient";

/**
 * Interface for Unit Progress data
 */
export interface UnitProgress {
  id: string;
  title: string;
  level: string;
  icon: string;
  color: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  xpReward: number;
  xpEarned: number;
}

/**
 * Interface for User Stats
 */
export interface UserStats {
  totalXP: number;
  streakDays: number;
  completedUnits: number;
  inProgressUnits: number;
  totalUnits: number;
}

/**
 * Interface for User Progress Response
 */
export interface UserProgressData {
  stats: UserStats;
  units: UnitProgress[];
}

/**
 * API Response wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Fetch user's progress including stats and units
 *
 * @param userId - Optional user ID (defaults to current authenticated user)
 * @returns Promise<UserProgressData>
 *
 * @example
 * const progress = await fetchUserProgress();
 * console.log(`Total XP: ${progress.stats.totalXP}`);
 */
export const fetchUserProgress = async (
  userId?: string
): Promise<UserProgressData> => {
  try {
    // Get user ID and headers
    const targetUserId = userId || getCurrentUserId();
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${ENV.API_BASE_URL}/users/${targetUserId}/progress`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<UserProgressData> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Failed to fetch user progress");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    throw error;
  }
};
