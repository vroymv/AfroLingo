const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export interface ProgressTrackerLiveStats {
  userId: string;
  totalXP: number;
  streakDays: number;
  completedActivities: number;

  // Optional extended fields (backward-compatible)
  longestStreakDays?: number;
  lastStreakDate?: string | null;
  todayDate?: string; // YYYY-MM-DD (user-local)
  todayXpEarned?: number;
  todayIsStreakDay?: boolean;
  streakThreshold?: number;
}

export async function getProgressTrackerStats(userId: string): Promise<{
  success: boolean;
  data?: ProgressTrackerLiveStats;
  message?: string;
}> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/progress-tracker/${userId}`);
    const json = await res.json().catch(() => ({}));

    if (!res.ok || json?.success === false) {
      return {
        success: false,
        message: json?.message || `Request failed with status ${res.status}`,
      };
    }

    return {
      success: true,
      data: json?.data,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to fetch progress tracker stats",
    };
  }
}
