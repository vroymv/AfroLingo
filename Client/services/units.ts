const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export interface ResumeUnitResponse<T = { unitId: string }> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Fetch the user's best resume target (unit) from the server.
 * GET /units/resume/:userId
 */
export async function getResumeUnit(
  userId: string
): Promise<ResumeUnitResponse> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/units/resume/${userId}`);
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
      message: err?.message || "Failed to fetch resume unit",
    };
  }
}
