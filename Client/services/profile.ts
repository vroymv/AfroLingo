const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

import { auth } from "@/config/firebase";

export type CommunityUserType = "LEARNER" | "NATIVE" | "TUTOR";

export interface CommunityProfile {
  id: string;
  email: string;
  name: string;
  profileImageUrl: string | null;
  userType: CommunityUserType;
  languages: string[];
  bio: string | null;
  countryCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityProfileResponse {
  success: boolean;
  message?: string;
  data?: CommunityProfile;
}

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

export interface ProfileOverview {
  stats: ProfileStats;
  onboarding: OnboardingData;
  communityProfile: CommunityProfile;
}

export interface ProfileOverviewResponse {
  success: boolean;
  message?: string;
  data?: ProfileOverview;
}

/**
 * Fetch profile overview data used by the Profile tab.
 * This is preferred over calling multiple endpoints separately.
 */
export async function fetchProfileOverview(
  userId: string
): Promise<ProfileOverviewResponse> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    };
  }

  try {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
    const res = await fetch(`${API_BASE_URL}/profile/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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
      message: err?.message || "Failed to fetch profile overview",
    };
  }
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

export async function fetchCommunityProfile(
  userId: string
): Promise<CommunityProfileResponse> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    };
  }

  try {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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
      message: err?.message || "Failed to fetch community profile",
    };
  }
}

export interface UpdateCommunityProfileInput {
  userType?: CommunityUserType;
  languages?: string[];
  bio?: string | null;
  countryCode?: string | null;
  // Stored as the same string used for avatar display (emoji or URL)
  profileImageUrl?: string | null;
  name?: string;
}

export async function updateCommunityProfile(
  userId: string,
  updates: UpdateCommunityProfileInput
): Promise<CommunityProfileResponse> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    };
  }

  try {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(updates),
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
      message: err?.message || "Failed to update community profile",
    };
  }
}
