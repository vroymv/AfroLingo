import type { Story } from "@/data/stories";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

function requireApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env."
    );
  }
  return API_BASE_URL;
}

function withQuery(
  url: string,
  query: Record<string, string | undefined>
): string {
  const params = Object.entries(query)
    .filter(([, v]) => typeof v === "string" && v.length > 0)
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`
    );

  if (params.length === 0) return url;
  return `${url}?${params.join("&")}`;
}

export async function fetchStories(userId?: string): Promise<Story[]> {
  const baseUrl = requireApiBaseUrl();
  const url = withQuery(`${baseUrl}/stories`, { userId });
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch stories (${res.status}): ${text}`);
  }

  const json = await res.json();
  return json.data as Story[];
}

export async function fetchStoryById(
  storyId: string,
  userId?: string
): Promise<Story> {
  const baseUrl = requireApiBaseUrl();
  const url = withQuery(`${baseUrl}/stories/${encodeURIComponent(storyId)}`, {
    userId,
  });
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch story (${res.status}): ${text}`);
  }

  const json = await res.json();
  return json.data as Story;
}

export async function markStoryComplete(storyId: string, userId: string) {
  const baseUrl = requireApiBaseUrl();
  const url = `${baseUrl}/stories/${encodeURIComponent(storyId)}/complete`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to mark story complete");
  }

  return json.data;
}
