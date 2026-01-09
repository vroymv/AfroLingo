import { auth } from "@/config/firebase";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

function requireApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env."
    );
  }
  return API_BASE_URL;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type ServerNotification = {
  id: string;
  type: string;
  data: any;
  createdAt: string;
  readAt: string | null;
};

export async function fetchCommunityNotifications(params: {
  userId: string;
  limit?: number;
}) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const url = new URL(`${baseUrl}/community/notifications/${params.userId}`);
  if (typeof params.limit === "number") {
    url.searchParams.set("limit", String(params.limit));
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false) {
    return {
      success: false as const,
      message: json?.message || `Request failed with status ${res.status}`,
    };
  }

  const notifications = (json?.data?.notifications ??
    []) as ServerNotification[];
  const unreadCount = Number(json?.data?.unreadCount ?? 0);

  return {
    success: true as const,
    data: {
      notifications,
      unreadCount: Number.isFinite(unreadCount) ? unreadCount : 0,
    },
  };
}

export async function markCommunityNotificationRead(params: {
  userId: string;
  notificationId: string;
}) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const res = await fetch(
    `${baseUrl}/community/notifications/${params.userId}/read/${params.notificationId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
    }
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
    data: { notificationId: params.notificationId },
  };
}
