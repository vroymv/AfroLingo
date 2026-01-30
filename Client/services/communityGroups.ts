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

export type ServerGroup = {
  id: string;
  externalId?: string | null;
  name: string;
  description: string | null;
  language: string | null;
  tags: string[];
  privacy: "PUBLIC" | "PRIVATE" | "INVITE";
  avatarUrl: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  memberCount?: number;
};

export type TopActiveGroupRow = ServerGroup & {
  messageCount: number;
  lastMessageAt: string | null;
};

export type CreateGroupWithInvitesInput = {
  userId: string;
  name: string;
  description?: string;
  language?: string;
  tags?: string[];
  privacy?: "PUBLIC" | "PRIVATE" | "INVITE";
  invitedUserIds?: string[];
};

export type CreateGroupWithInvitesResponse = {
  group: {
    id: string;
    name: string;
    privacy: "PUBLIC" | "PRIVATE" | "INVITE";
    createdAt: string;
  };
  inviteCount: number;
};

export type GroupInviteRow = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELED";
  createdAt: string;
  group: {
    id: string;
    name: string;
    privacy: "PUBLIC" | "PRIVATE" | "INVITE";
    language: string | null;
    tags: string[];
    avatarUrl: string | null;
  };
  invitedByUser: {
    id: string;
    name: string;
    profileImageUrl: string | null;
  };
};

export type MyGroupRow = {
  membership: {
    id: string;
    role: "OWNER" | "MEMBER";
    joinedAt: string;
    lastReadAt: string | null;
    unreadCount: number;
  };
  group: ServerGroup & {
    lastMessage: {
      id: string;
      body: string;
      createdAt: string;
      senderId: string;
    } | null;
  };
};

export type DiscoverGroupRow = ServerGroup & {
  isMember: boolean;
  membership: {
    groupId: string;
    role: "OWNER" | "MEMBER";
    joinedAt: string;
    lastReadAt: string | null;
  } | null;
};

export async function fetchMyGroups(userId: string) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const res = await fetch(`${baseUrl}/community/groups/my/${userId}`, {
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
    data: (json?.data?.groups ?? []) as MyGroupRow[],
  };
}

export async function fetchDiscoverGroups(params: {
  userId: string;
  q?: string;
  language?: string;
  limit?: number;
}) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const url = new URL(`${baseUrl}/community/groups/discover/${params.userId}`);
  if (params.q) url.searchParams.set("q", params.q);
  if (params.language) url.searchParams.set("language", params.language);
  if (typeof params.limit === "number")
    url.searchParams.set("limit", String(params.limit));

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
    data: (json?.data?.groups ?? []) as DiscoverGroupRow[],
  };
}

export async function fetchTopActiveGroups(params?: {
  language?: string;
  limit?: number;
  windowDays?: number;
}) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const url = new URL(`${baseUrl}/community/groups/top-active`);
  if (params?.language) url.searchParams.set("language", params.language);
  if (typeof params?.limit === "number")
    url.searchParams.set("limit", String(params.limit));
  if (typeof params?.windowDays === "number")
    url.searchParams.set("windowDays", String(params.windowDays));

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
    data: (json?.data?.groups ?? []) as TopActiveGroupRow[],
  };
}

export async function joinGroup(params: { userId: string; groupId: string }) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const res = await fetch(
    `${baseUrl}/community/groups/${params.userId}/join/${params.groupId}`,
    {
      method: "POST",
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

  return { success: true as const };
}

export async function leaveGroup(params: { userId: string; groupId: string }) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const res = await fetch(
    `${baseUrl}/community/groups/${params.userId}/leave/${params.groupId}`,
    {
      method: "DELETE",
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

  return { success: true as const };
}

export async function createGroupWithInvites(
  params: CreateGroupWithInvitesInput,
) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const res = await fetch(
    `${baseUrl}/community/groups/${params.userId}/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify({
        name: params.name,
        description: params.description,
        language: params.language,
        tags: params.tags,
        privacy: params.privacy,
        invitedUserIds: params.invitedUserIds,
      }),
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
    data: (json?.data ?? null) as CreateGroupWithInvitesResponse | null,
  };
}

export async function fetchGroupInvites(params: {
  userId: string;
  limit?: number;
}) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const url = new URL(`${baseUrl}/community/groups/${params.userId}/invites`);
  if (typeof params.limit === "number")
    url.searchParams.set("limit", String(params.limit));

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
    data: (json?.data?.invites ?? []) as GroupInviteRow[],
  };
}

export async function acceptGroupInvite(params: {
  userId: string;
  inviteId: string;
}) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const res = await fetch(
    `${baseUrl}/community/groups/${params.userId}/invites/${params.inviteId}/accept`,
    {
      method: "POST",
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
    data: (json?.data ?? null) as { groupId: string } | null,
  };
}

export async function declineGroupInvite(params: {
  userId: string;
  inviteId: string;
}) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const res = await fetch(
    `${baseUrl}/community/groups/${params.userId}/invites/${params.inviteId}/decline`,
    {
      method: "POST",
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
    data: (json?.data ?? null) as { inviteId: string } | null,
  };
}

export type ServerGroupMessage = {
  id: string;
  groupId: string;
  channelId: string | null;
  senderId: string;
  body: string;
  metadata: unknown;
  clientMessageId: string;
  createdAt: string;
};

export async function fetchGroupMessages(params: {
  userId: string;
  groupId: string;
  cursor?: string;
  limit?: number;
  markRead?: boolean;
}) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const url = new URL(
    `${baseUrl}/community/groups/${params.userId}/${params.groupId}/messages`,
  );
  if (params.cursor) url.searchParams.set("cursor", params.cursor);
  if (typeof params.limit === "number")
    url.searchParams.set("limit", String(params.limit));
  if (typeof params.markRead === "boolean")
    url.searchParams.set("markRead", params.markRead ? "true" : "false");

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
    data: {
      messages: (json?.data?.messages ?? []) as ServerGroupMessage[],
      nextCursor: (json?.data?.nextCursor ?? null) as string | null,
    },
  };
}

export async function sendGroupMessage(params: {
  userId: string;
  groupId: string;
  body: string;
  clientMessageId: string;
  channelId?: string;
  metadata?: unknown;
}) {
  const baseUrl = requireApiBaseUrl();
  const authHeader = await getAuthHeader();

  const res = await fetch(
    `${baseUrl}/community/groups/${params.userId}/${params.groupId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify({
        body: params.body,
        clientMessageId: params.clientMessageId,
        channelId: params.channelId,
        metadata: params.metadata,
      }),
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
    data: (json?.data?.message ?? null) as ServerGroupMessage | null,
  };
}
