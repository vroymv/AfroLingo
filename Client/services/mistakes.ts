const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export interface RecordMistakeRequest {
  userId: string;
  unitId: string;

  // Prefer external id from Activity payload
  activityExternalId: string;

  questionText: string;
  userAnswer: any;
  correctAnswer: any;

  mistakeType?: string;
  clientMistakeId?: string;
  occurredAt?: string; // ISO timestamp
  metadata?: Record<string, any>;
}

export interface RecordMistakeResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Best-effort call to record a learning mistake in the backend.
 * Safe to fire-and-forget; failures should not block the UI.
 */
export async function recordMistake(
  payload: RecordMistakeRequest
): Promise<RecordMistakeResponse> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/mistakes`, {
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

    return { success: true, data: json?.data, message: json?.message };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to record mistake",
    };
  }
}
