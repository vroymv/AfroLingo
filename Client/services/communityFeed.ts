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

export type FeedCategory =
  | "DISCUSSION"
  | "QUESTION"
  | "CULTURAL"
  | "PRONUNCIATION";

export type FeedPost = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  language: string | null;
  category: FeedCategory;
  isTrending: boolean;
  isLiked: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
    userType: "LEARNER" | "NATIVE" | "TUTOR";
    languages: string[];
    countryCode: string | null;
  };
  counts: {
    likes: number;
    comments: number;
  };
  reactions: Record<string, number>;
};

export type FeedResponse = {
  posts: FeedPost[];
  pageInfo: {
    hasMore: boolean;
    nextCursor: string | null;
  };
};

export async function fetchCommunityFeed(params?: {
  cursor?: string;
  limit?: number;
  category?: FeedCategory;
  language?: string;
  viewerId?: string;
}) {
  const baseUrl = requireApiBaseUrl();
  const url = new URL(`${baseUrl}/community/feed`);

  if (params?.cursor) url.searchParams.set("cursor", params.cursor);
  if (params?.limit) url.searchParams.set("limit", String(params.limit));
  if (params?.category) url.searchParams.set("category", params.category);
  if (params?.language) url.searchParams.set("language", params.language);
  if (params?.viewerId) url.searchParams.set("viewerId", params.viewerId);

  const authHeader = await getAuthHeader();
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

  return {
    success: true as const,
    data: json.data as FeedResponse,
  };
}

export async function createCommunityPost(params: {
  userId: string;
  title: string;
  content: string;
  category: FeedCategory;
  tags?: string[];
  language?: string;
}) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const res = await fetch(`${baseUrl}/community/feed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify({
      userId: params.userId,
      title: params.title,
      content: params.content,
      category: params.category,
      tags: params.tags,
      language: params.language,
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false) {
    return {
      success: false as const,
      message: json?.message || `Request failed with status ${res.status}`,
    };
  }

  return {
    success: true as const,
    data: json.data as { id: string; createdAt: string },
  };
}

export async function toggleCommunityPostLike(params: {
  postId: string;
  userId: string;
}) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const res = await fetch(
    `${baseUrl}/community/feed/${params.postId}/toggle-like`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify({ userId: params.userId }),
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
    data: json.data as {
      postId: string;
      userId: string;
      isLiked: boolean;
      likes: number;
    },
  };
}

export type FeedComment = {
  id: string;
  body: string;
  parentId: string | null;
  isDeleted: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
    userType: "LEARNER" | "NATIVE" | "TUTOR";
    languages: string[];
    countryCode: string | null;
  };
};

export type FeedCommentsResponse = {
  comments: FeedComment[];
  pageInfo: {
    hasMore: boolean;
    nextCursor: string | null;
  };
};

export async function fetchCommunityPostComments(params: {
  postId: string;
  cursor?: string;
  limit?: number;
}) {
  const baseUrl = requireApiBaseUrl();
  const url = new URL(`${baseUrl}/community/feed/${params.postId}/comments`);
  if (params.cursor) url.searchParams.set("cursor", params.cursor);
  if (params.limit) url.searchParams.set("limit", String(params.limit));

  const authHeader = await getAuthHeader();
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

  return {
    success: true as const,
    data: json.data as FeedCommentsResponse,
  };
}

export async function createCommunityPostComment(params: {
  postId: string;
  userId: string;
  body: string;
  parentId?: string;
}) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const res = await fetch(
    `${baseUrl}/community/feed/${params.postId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify({
        userId: params.userId,
        body: params.body,
        parentId: params.parentId,
      }),
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
    data: json.data as FeedComment,
  };
}
