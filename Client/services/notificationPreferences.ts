import { auth } from "@/config/firebase";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

function requireApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    );
  }
  return API_BASE_URL;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type NotificationPreferences = {
  dailyReminderEnabled: boolean;
  dailyReminderTime: string; // HH:mm
  streakAlertsEnabled: boolean;
  reactivationNudgesEnabled: boolean;
  tutorChatMessageNotificationsEnabled: boolean;
  groupMessageNotificationsEnabled: boolean;
  newFollowerNotificationsEnabled: boolean;
  weeklySummaryEnabled: boolean;
  achievementUnlockedNotificationsEnabled: boolean;
  communityActivityNotificationsEnabled: boolean;
};

export async function fetchNotificationPreferences(params: { userId: string }) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const res = await fetch(
    `${baseUrl}/users/${params.userId}/notification-preferences`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
    },
  );

  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false) {
    return {
      success: false as const,
      message: json?.message || `Request failed with status ${res.status}`,
    };
  }

  return {
    success: true as const,
    data: json?.data as {
      userId: string;
      preferences: NotificationPreferences;
    },
  };
}

export async function patchNotificationPreferences(params: {
  userId: string;
  patch: Partial<NotificationPreferences>;
}) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const res = await fetch(
    `${baseUrl}/users/${params.userId}/notification-preferences`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(params.patch),
    },
  );

  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false) {
    return {
      success: false as const,
      message: json?.message || `Request failed with status ${res.status}`,
    };
  }

  return {
    success: true as const,
    data: json?.data as {
      userId: string;
      preferences: NotificationPreferences;
    },
  };
}
