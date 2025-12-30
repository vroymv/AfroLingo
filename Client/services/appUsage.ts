const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function recordAppOpen(userId: string): Promise<{
  success: boolean;
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
    const res = await fetch(`${API_BASE_URL}/app-usage/open`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || json?.success === false) {
      return {
        success: false,
        message: json?.message || `Request failed with status ${res.status}`,
      };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, message: err?.message || "Failed to record open" };
  }
}

export async function recordAppClose(userId: string): Promise<{
  success: boolean;
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
    const res = await fetch(`${API_BASE_URL}/app-usage/close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || json?.success === false) {
      return {
        success: false,
        message: json?.message || `Request failed with status ${res.status}`,
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to record close",
    };
  }
}
