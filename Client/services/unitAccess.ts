const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export interface TouchUnitAccessPayload {
  userId: string;
  unitId: string;
}

export interface TouchUnitAccessResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Touch a unit access on the server so UserProgress.lastAccessedAt stays meaningful.
 * POST /units/:unitId/access
 */
export async function touchUnitAccess(
  payload: TouchUnitAccessPayload
): Promise<TouchUnitAccessResponse> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/units/${payload.unitId}/access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: payload.userId }),
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
      message: err?.message || "Failed to touch unit access",
    };
  }
}
