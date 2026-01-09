import { auth } from "@/config/firebase";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export type CommunityUserType = "LEARNER" | "NATIVE" | "TUTOR";

export interface DiscoverPeopleUser {
  id: string;
  name: string;
  profileImageUrl: string | null;
  userType: CommunityUserType;
  languages: string[];
  bio: string | null;
  countryCode: string | null;
  xpTotal: number;
  isFollowing: boolean;
}

export interface DiscoverPeopleResponse {
  success: boolean;
  message?: string;
  data?: {
    users: DiscoverPeopleUser[];
  };
}

function requireApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env."
    );
  }
  return API_BASE_URL;
}

export async function fetchDiscoverPeople(
  viewerId: string,
  params?: { q?: string; limit?: number }
) {
  const baseUrl = requireApiBaseUrl();

  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;

  const url = new URL(`${baseUrl}/community/people/discover/${viewerId}`);
  if (params?.q) url.searchParams.set("q", params.q);
  if (typeof params?.limit === "number")
    url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const json: DiscoverPeopleResponse = await res.json().catch(() => ({
    success: false,
    message: `Request failed with status ${res.status}`,
  }));

  if (!res.ok || json?.success === false) {
    return {
      success: false as const,
      message: json?.message || `Request failed with status ${res.status}`,
    };
  }

  return {
    success: true as const,
    data: json.data?.users ?? [],
  };
}

export async function followUser(viewerId: string, targetUserId: string) {
  const baseUrl = requireApiBaseUrl();

  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  const res = await fetch(
    `${baseUrl}/community/people/${viewerId}/follow/${targetUserId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

  return { success: true as const };
}

export async function unfollowUser(viewerId: string, targetUserId: string) {
  const baseUrl = requireApiBaseUrl();

  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  const res = await fetch(
    `${baseUrl}/community/people/${viewerId}/follow/${targetUserId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

  return { success: true as const };
}
