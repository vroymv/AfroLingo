const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export type KaraokeWord = {
  text: string;
  startMs: number;
  endMs: number;
};

export type KaraokeLine = {
  words: KaraokeWord[];
};

export type KaraokeTranscript = {
  lines: KaraokeLine[];
};

export type KaraokeExercise = {
  id: string;
  title: string;
  subtitle?: string;
  language?: string;
  audioClipUrl: string;
  transcript?: KaraokeTranscript;
  durationMs?: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export async function getActiveKaraokeExercise(): Promise<
  ApiResponse<KaraokeExercise>
> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env.",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/karaoke/active`);
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
      message: err?.message || "Failed to fetch karaoke exercise",
    };
  }
}
