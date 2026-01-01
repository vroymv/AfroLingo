/**
 * Call the real XP award endpoint to update user XP in the backend.
 */
export async function awardXP(
  payload: AwardXPRequest
): Promise<PreviewAwardXPResponse> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/xp/award`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
      message: err?.message || "Failed to award XP",
    };
  }
}
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export type XPSourceType =
  | "activity_completion"
  | "unit_completion"
  | "lesson_completion"
  | "streak_milestone"
  | "daily_streak"
  | "daily_goal_met"
  | "perfect_unit"
  | "speed_bonus"
  | "manual_adjustment"
  | "bonus_reward";

export interface AwardXPRequest {
  userId: string;
  amount: number;
  sourceType: XPSourceType;
  sourceId: string;
  metadata?: Record<string, any>;
  skipDuplicateCheck?: boolean;
}

export interface PreviewAwardXPResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Temporary test call: send XP award to backend preview endpoint.
 * Backend will only log and NOT touch the database.
 */
export async function previewAwardXP(
  payload: AwardXPRequest
): Promise<PreviewAwardXPResponse> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/xp/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
      message: err?.message || "Failed to preview XP award",
    };
  }
}
