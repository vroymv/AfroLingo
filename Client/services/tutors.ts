import type { Tutor } from "@/types/Tutor";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

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

export async function fetchTutors(params?: {
  q?: string;
  language?: string;
  limit?: number;
}): Promise<ApiResponse<Tutor[]>> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    };
  }

  try {
    const url = withQuery(`${API_BASE_URL}/tutors`, {
      q: params?.q,
      language: params?.language,
      limit:
        typeof params?.limit === "number" ? String(params.limit) : undefined,
    });

    const res = await fetch(url);
    const json = await res.json().catch(() => ({}));

    if (!res.ok || json?.success === false) {
      return {
        success: false,
        message: json?.message || `Request failed with status ${res.status}`,
      };
    }

    return {
      success: true,
      data: (json?.data ?? []) as Tutor[],
      message: json?.message,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to fetch tutors",
    };
  }
}
