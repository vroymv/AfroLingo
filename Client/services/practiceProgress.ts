const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export type PracticeProgressEvent = "start" | "attempt" | "complete";

export interface PracticeProgressEventPayload {
  userId: string | null;
  activityExternalId: string;
  event: PracticeProgressEvent;

  isCorrect?: boolean;
  score?: number;
  timeSpentSec?: number;

  answer?: any;
  metadata?: any;
}

export interface UpdatePracticeProgressResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export async function updatePracticeActivityProgress(
  payload: PracticeProgressEventPayload
): Promise<UpdatePracticeProgressResponse> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    };
  }

  if (!payload.userId) {
    return { success: false, message: "No userId available" };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/practice/progress`, {
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
      message: err?.message || "Failed to update practice progress",
    };
  }
}
