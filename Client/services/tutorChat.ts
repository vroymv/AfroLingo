import type {
  Paginated,
  TutorChatMessage,
  TutorChatThread,
} from "@/types/TutorChat";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

function requireApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env."
    );
  }
  return API_BASE_URL;
}

function authHeaders(token?: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getOrCreateTutorChatThread(params: {
  learnerId: string;
  tutorId: string;
  token?: string;
}): Promise<ApiResponse<TutorChatThread>> {
  try {
    const baseUrl = requireApiBaseUrl();

    const res = await fetch(`${baseUrl}/tutor-chat/threads`, {
      method: "POST",
      headers: authHeaders(params.token),
      body: JSON.stringify({
        learnerId: params.learnerId,
        tutorId: params.tutorId,
      }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || json?.success === false) {
      return {
        success: false,
        message: json?.message || `Request failed with status ${res.status}`,
      };
    }

    return { success: true, data: json?.data as TutorChatThread };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to create thread",
    };
  }
}

export async function fetchTutorChatThreads(params: {
  userId: string;
  token?: string;
}): Promise<ApiResponse<TutorChatThread[]>> {
  try {
    const baseUrl = requireApiBaseUrl();

    const url = `${baseUrl}/tutor-chat/threads?userId=${encodeURIComponent(
      params.userId
    )}`;

    const res = await fetch(url, {
      method: "GET",
      headers: authHeaders(params.token),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || json?.success === false) {
      return {
        success: false,
        message: json?.message || `Request failed with status ${res.status}`,
      };
    }

    return { success: true, data: (json?.data ?? []) as TutorChatThread[] };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to fetch threads",
    };
  }
}

export async function fetchTutorChatMessages(params: {
  threadId: string;
  cursor?: string;
  limit?: number;
  token?: string;
}): Promise<ApiResponse<Paginated<TutorChatMessage>>> {
  try {
    const baseUrl = requireApiBaseUrl();

    const query = new URLSearchParams();
    if (params.cursor) query.set("cursor", params.cursor);
    if (typeof params.limit === "number")
      query.set("limit", String(params.limit));

    const url = `${baseUrl}/tutor-chat/threads/${encodeURIComponent(
      params.threadId
    )}/messages${query.toString() ? `?${query.toString()}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: authHeaders(params.token),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || json?.success === false) {
      return {
        success: false,
        message: json?.message || `Request failed with status ${res.status}`,
      };
    }

    return { success: true, data: json?.data as Paginated<TutorChatMessage> };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to fetch messages",
    };
  }
}

export async function sendTutorChatMessage(params: {
  threadId: string;
  senderId: string;
  body: string;
  clientMessageId: string;
  token?: string;
}): Promise<ApiResponse<TutorChatMessage>> {
  try {
    const baseUrl = requireApiBaseUrl();

    const res = await fetch(
      `${baseUrl}/tutor-chat/threads/${encodeURIComponent(
        params.threadId
      )}/messages`,
      {
        method: "POST",
        headers: authHeaders(params.token),
        body: JSON.stringify({
          senderId: params.senderId,
          body: params.body,
          clientMessageId: params.clientMessageId,
        }),
      }
    );

    const json = await res.json().catch(() => ({}));

    if (!res.ok || json?.success === false) {
      return {
        success: false,
        message: json?.message || `Request failed with status ${res.status}`,
      };
    }

    return { success: true, data: json?.data as TutorChatMessage };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to send message",
    };
  }
}

export async function markTutorChatThreadRead(params: {
  threadId: string;
  userId: string;
  token?: string;
}): Promise<ApiResponse<TutorChatThread>> {
  try {
    const baseUrl = requireApiBaseUrl();

    const res = await fetch(
      `${baseUrl}/tutor-chat/threads/${encodeURIComponent(
        params.threadId
      )}/read`,
      {
        method: "POST",
        headers: authHeaders(params.token),
        body: JSON.stringify({ userId: params.userId }),
      }
    );

    const json = await res.json().catch(() => ({}));

    if (!res.ok || json?.success === false) {
      return {
        success: false,
        message: json?.message || `Request failed with status ${res.status}`,
      };
    }

    return { success: true, data: json?.data as TutorChatThread };
  } catch (err: any) {
    return { success: false, message: err?.message || "Failed to mark read" };
  }
}
