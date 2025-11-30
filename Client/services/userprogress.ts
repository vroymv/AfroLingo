const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export interface ActivityRuntimePayload {
  userId: string | null;
  unitId: string;
  currentActivityNumber: number;
  totalActivities: number;
}

export interface UpdateUserProgressResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Send activity runtime data to the server to update user progress.
 * Intended to be called from Activity components via LessonRuntimeContext.
 */
export async function updateUserProgress(
  payload: ActivityRuntimePayload
): Promise<UpdateUserProgressResponse> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/userprogress`, {
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
      message: err?.message || "Failed to update user progress",
    };
  }
}
