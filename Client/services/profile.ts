const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export interface ProfileStats {
  userId: string;
  totalXP: number;
  streakDays: number;
  longestStreakDays: number;
  lastStreakDate: string | null;
  todayDate: string;
  todayXpEarned: number;
  todayIsStreakDay: boolean;
  streakThreshold: number;
  dailyXpGoal: number | null;
  dailyLessonGoal: number | null;
  todayGoalXp: number | null;
  todayGoalLessons: number | null;
  todayMetGoal: boolean;
  todayActivitiesCompleted: number;
  todayUnitsCompleted: number;
  completedActivities: number;
}

export interface OnboardingData {
  isCompleted: boolean;
  selectedLanguage: string | null;
  selectedLevel: string | null;
  placementTestScore: number | null;
  personalization: {
    reasons: string[];
    timeCommitment: string;
  } | null;
  currentStep: number;
}

export interface ProfileStatsResponse {
  success: boolean;
  message?: string;
  data?: ProfileStats;
}

export interface OnboardingDataResponse {
  success: boolean;
  message?: string;
  data?: OnboardingData;
}

/**
 * Fetch comprehensive profile stats from the progress tracker endpoint
 */
export async function fetchProfileStats(
  userId: string
): Promise<ProfileStatsResponse> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/progress-tracker/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

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
      message: json?.message,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to fetch profile stats",
    };
  }
}

/**
 * Fetch user's onboarding data (language, level, etc.)
 */
export async function fetchOnboardingData(
  userId: string
): Promise<OnboardingDataResponse> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/onboarding/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

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
      message: json?.message,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to fetch onboarding data",
    };
  }
}
