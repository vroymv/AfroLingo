import { auth } from "@/config/firebase";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export interface HeritageJourneyLesson {
  unitId: string;
  title: string;
  xp: number;
  progress: string;
  completedActivities: number;
  totalActivities: number;
  isCompleted: boolean;
  lastAccessedAt: string | null;
}

export interface HeritageJourneyResponseData {
  userId: string;
  onboardingCompleted: boolean;
  selectedLanguage: string | null;
  selectedLevel: string | null;
  lessons: HeritageJourneyLesson[];
}

export interface HeritageJourneyResponse {
  success: boolean;
  message?: string;
  data?: HeritageJourneyResponseData;
}

export async function getHeritageJourney(
  userId: string
): Promise<HeritageJourneyResponse> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    };
  }

  try {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
    const res = await fetch(`${API_BASE_URL}/home/heritage-journey/${userId}`, {
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
      message: err?.message || "Failed to fetch heritage journey",
    };
  }
}
