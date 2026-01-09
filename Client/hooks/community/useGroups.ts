import { useCallback, useEffect, useMemo, useState } from "react";

import type { Group } from "@/data/community";
import { getLanguageFlag } from "@/utils/language";

import { useAuth } from "@/contexts/AuthContext";
import { useNotificationBadge } from "@/contexts/community/NotificationBadgeContext";
import {
  fetchDiscoverGroups,
  fetchGroupMessages,
  fetchMyGroups,
  joinGroup as joinGroupApi,
  leaveGroup as leaveGroupApi,
  type DiscoverGroupRow,
  type MyGroupRow,
  type ServerGroupMessage,
} from "@/services/communityGroups";

export type GroupChatReactionMap = Record<string, string[]>;

export type GroupChatMessage = {
  id: string;
  groupId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  reactions: GroupChatReactionMap;
  clientMessageId?: string;
};

export type GroupRow = Group & {
  lastActivityAt: Date;
  lastMessagePreview: string;
  unreadCount: number;
};

export type GroupsFilter = "all" | "my" | "public";

type CreateGroupInput = {
  name: string;
  description: string;
  language: string;
  type: Group["type"];
  category: string;
};

function toggleTapback(
  reactions: GroupChatReactionMap,
  emoji: string,
  userId: string
): GroupChatReactionMap {
  const next: GroupChatReactionMap = {};
  const existingEmoji = Object.entries(reactions).find(([, ids]) =>
    ids.includes(userId)
  )?.[0];

  // Copy, removing user from any existing reaction.
  Object.entries(reactions).forEach(([key, ids]) => {
    next[key] = ids.filter((id) => id !== userId);
  });

  // If user tapped the same emoji again, that means remove.
  const shouldAdd = existingEmoji !== emoji;
  if (shouldAdd) {
    next[emoji] = [...(next[emoji] ?? []), userId];
  }

  // Clean empty arrays to keep UI tidy.
  Object.keys(next).forEach((key) => {
    if (next[key].length === 0) delete next[key];
  });

  return next;
}

function makeMeta(
  groups: Group[]
): Record<string, Omit<GroupRow, keyof Group>> {
  return Object.fromEntries(
    groups.map((group) => [
      group.id,
      {
        lastActivityAt: new Date(group.isMember ? Date.now() : 0),
        unreadCount: 0,
        lastMessagePreview: group.description,
      },
    ])
  );
}

function mapDiscoverRowToGroup(row: DiscoverGroupRow): Group {
  const language = row.language ?? "";
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    language,
    avatar: getLanguageFlag(language) || "👥",
    memberCount: row.memberCount ?? 0,
    weeklyXpGoal: 3000,
    currentXp: 0,
    groupStreak: 0,
    type: row.privacy === "PUBLIC" ? "public" : "private",
    category: row.tags?.[0] ?? "Study Group",
    isMember: row.isMember,
    topMembers: [],
  };
}

function mapMyRowToGroup(row: MyGroupRow): Group {
  const language = row.group.language ?? "";
  return {
    id: row.group.id,
    name: row.group.name,
    description: row.group.description ?? "",
    language,
    avatar: getLanguageFlag(language) || "👥",
    memberCount: row.group.memberCount ?? 0,
    weeklyXpGoal: 3000,
    currentXp: 0,
    groupStreak: 0,
    type: row.group.privacy === "PUBLIC" ? "public" : "private",
    category: row.group.tags?.[0] ?? "Study Group",
    isMember: true,
    topMembers: [],
  };
}

function mapServerMessageToClientMessage(
  m: ServerGroupMessage
): GroupChatMessage {
  return {
    id: m.id,
    groupId: m.groupId,
    senderId: m.senderId,
    content: m.body,
    timestamp: new Date(m.createdAt),
    reactions: {},
    clientMessageId: m.clientMessageId,
  };
}

function makeClientMessageId(): string {
  return `cm_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function useGroups(initialGroups: Group[] = []) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<GroupsFilter>("all");
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [metaById, setMetaById] = useState(() => makeMeta(initialGroups));
  const [conversationsByGroupId, setConversationsByGroupId] = useState<
    Record<string, GroupChatMessage[]>
  >({});

  const { user, isAuthenticated } = useAuth();
  const { socket, isSocketConnected } = useNotificationBadge();

  const currentUser = useMemo(() => {
    return {
      id: user?.id ?? "",
      name: user?.name ?? "",
      avatar: "🙂",
    };
  }, [user?.id, user?.name]);

  const usersById = useMemo(() => {
    if (!currentUser.id) return {} as Record<string, typeof currentUser>;
    return { [currentUser.id]: currentUser } as Record<
      string,
      typeof currentUser
    >;
  }, [currentUser]);

  const refreshGroups = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;

    const [myRes, discoverRes] = await Promise.all([
      fetchMyGroups(user.id),
      fetchDiscoverGroups({ userId: user.id }),
    ]);

    if (!myRes.success || !discoverRes.success) {
      return;
    }

    const myRows = myRes.data;
    const discoverRows = discoverRes.data;

    const myGroups = myRows.map(mapMyRowToGroup);
    const myIds = new Set(myGroups.map((g) => g.id));

    const availableGroups = discoverRows
      .filter((g) => !g.isMember)
      .filter((g) => !myIds.has(g.id))
      .map(mapDiscoverRowToGroup);

    const merged = [...myGroups, ...availableGroups];
    setGroups(merged);

    setMetaById(() => {
      const next: Record<string, Omit<GroupRow, keyof Group>> = {};

      for (const row of myRows) {
        const groupId = row.group.id;
        const lastMessage = row.group.lastMessage;
        next[groupId] = {
          lastActivityAt: new Date(
            lastMessage?.createdAt ?? row.group.createdAt
          ),
          unreadCount: row.membership.unreadCount ?? 0,
          lastMessagePreview: lastMessage?.body ?? row.group.description ?? "",
        };
      }

      for (const row of discoverRows) {
        if (row.isMember) continue;
        if (myIds.has(row.id)) continue;
        next[row.id] = {
          lastActivityAt: new Date(row.createdAt),
          unreadCount: 0,
          lastMessagePreview: row.description ?? "",
        };
      }

      return next;
    });
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    void refreshGroups();
  }, [refreshGroups]);

  const rows = useMemo<GroupRow[]>(() => {
    return groups
      .map((group) => ({
        ...group,
        ...(metaById[group.id] ?? {
          lastActivityAt: new Date(),
          unreadCount: 0,
          lastMessagePreview: group.description,
        }),
      }))
      .sort((a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime());
  }, [groups, metaById]);

  const stats = useMemo(() => {
    const myCount = rows.filter((g) => g.isMember).length;
    const availableCount = rows.filter((g) => !g.isMember).length;
    const totalMembers = rows.reduce((sum, g) => sum + g.memberCount, 0);

    return { myCount, availableCount, totalMembers };
  }, [rows]);

  const visibleRows = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    const matchesQuery = (group: GroupRow) => {
      if (!trimmed) return true;
      return (
        group.name.toLowerCase().includes(trimmed) ||
        group.language.toLowerCase().includes(trimmed) ||
        group.category.toLowerCase().includes(trimmed)
      );
    };

    const matchesFilter = (group: GroupRow) => {
      if (filter === "my") return group.isMember;
      if (filter === "public") return group.type === "public";
      return true;
    };

    return rows.filter((g) => matchesQuery(g) && matchesFilter(g));
  }, [filter, query, rows]);

  const myGroups = useMemo(
    () => visibleRows.filter((g) => g.isMember),
    [visibleRows]
  );

  const availableGroups = useMemo(
    () => visibleRows.filter((g) => !g.isMember),
    [visibleRows]
  );

  const clearQuery = () => setQuery("");

  const getGroupById = (groupId: string) =>
    rows.find((group) => group.id === groupId);

  const joinGroup = useCallback(
    async (groupId: string) => {
      if (!isAuthenticated || !user?.id) return;
      const res = await joinGroupApi({ userId: user.id, groupId });
      if (!res.success) return;

      socket?.emit?.("groups:sync");
      void refreshGroups();
    },
    [isAuthenticated, refreshGroups, socket, user?.id]
  );

  const leaveGroup = useCallback(
    async (groupId: string) => {
      if (!isAuthenticated || !user?.id) return;
      const res = await leaveGroupApi({ userId: user.id, groupId });
      if (!res.success) return;

      socket?.emit?.("groups:sync");
      void refreshGroups();
    },
    [isAuthenticated, refreshGroups, socket, user?.id]
  );

  const createGroup = (input: CreateGroupInput) => {
    const newId = `${Date.now()}`;

    const newGroup: Group = {
      id: newId,
      name: input.name,
      description: input.description,
      language: input.language,
      avatar: "👥",
      memberCount: 1,
      weeklyXpGoal: 3000,
      currentXp: 0,
      groupStreak: 0,
      type: input.type,
      category: input.category,
      isMember: true,
      topMembers: [],
    };

    setGroups((prev) => [newGroup, ...prev]);
    setMetaById((prev) => ({
      ...prev,
      [newId]: {
        lastActivityAt: new Date(),
        unreadCount: 0,
        lastMessagePreview: newGroup.description,
      },
    }));

    setConversationsByGroupId((prev) => ({
      ...prev,
      [newId]: [],
    }));

    return newId;
  };

  const getMessagesForGroup = (groupId: string) =>
    conversationsByGroupId[groupId] ?? [];

  const loadMessagesForGroup = useCallback(
    async (groupId: string) => {
      if (!isAuthenticated || !user?.id) return;

      const res = await fetchGroupMessages({
        userId: user.id,
        groupId,
        limit: 50,
        markRead: true,
      });

      if (!res.success) return;

      const nextThread = [...res.data.messages]
        .reverse()
        .map(mapServerMessageToClientMessage);

      setConversationsByGroupId((prev) => ({
        ...prev,
        [groupId]: nextThread,
      }));

      setMetaById((prev) => {
        const existing = prev[groupId];
        if (!existing) return prev;
        const last = nextThread[nextThread.length - 1];
        return {
          ...prev,
          [groupId]: {
            ...existing,
            unreadCount: 0,
            lastActivityAt: last?.timestamp ?? existing.lastActivityAt,
            lastMessagePreview: last?.content ?? existing.lastMessagePreview,
          },
        };
      });

      void refreshGroups();
    },
    [isAuthenticated, refreshGroups, user?.id]
  );

  const sendMessage = useCallback(
    (groupId: string, content: string) => {
      if (!currentUser.id) return;
      const clientMessageId = makeClientMessageId();

      const optimistic: GroupChatMessage = {
        id: clientMessageId,
        groupId,
        senderId: currentUser.id,
        content,
        timestamp: new Date(),
        reactions: {},
        clientMessageId,
      };

      setConversationsByGroupId((prev) => {
        const existing = prev[groupId] ?? [];
        return { ...prev, [groupId]: [...existing, optimistic] };
      });

      setMetaById((prev) => {
        const existing = prev[groupId];
        if (!existing) return prev;
        return {
          ...prev,
          [groupId]: {
            ...existing,
            lastActivityAt: optimistic.timestamp,
            lastMessagePreview: content,
            unreadCount: 0,
          },
        };
      });

      if (socket && isSocketConnected) {
        socket.emit("message:send", {
          groupId,
          body: content,
          clientMessageId,
        });
      }
    },
    [currentUser.id, isSocketConnected, socket]
  );

  const reactToMessage = (
    groupId: string,
    messageId: string,
    emoji: string
  ) => {
    setConversationsByGroupId((prev) => {
      const thread = prev[groupId] ?? [];
      const nextThread = thread.map((m) =>
        m.id === messageId
          ? {
              ...m,
              reactions: toggleTapback(m.reactions, emoji, currentUser.id),
            }
          : m
      );

      return { ...prev, [groupId]: nextThread };
    });
  };

  // Realtime: merge message:new and reconcile message:ack.
  useEffect(() => {
    if (!socket || !currentUser.id) return;

    const onMessageNew = (payload: any) => {
      const groupId =
        typeof payload?.groupId === "string" ? payload.groupId : "";
      const message = payload?.message;
      if (!groupId || !message) return;

      const serverId = typeof message?.id === "string" ? message.id : "";
      const clientMessageId =
        typeof message?.clientMessageId === "string"
          ? message.clientMessageId
          : null;

      const next: GroupChatMessage = {
        id: serverId || clientMessageId || makeClientMessageId(),
        groupId,
        senderId: message.senderId,
        content: message.body,
        timestamp: new Date(message.createdAt),
        reactions: {},
        clientMessageId: clientMessageId ?? undefined,
      };

      setConversationsByGroupId((prev) => {
        const existing = prev[groupId] ?? [];
        const alreadyHasServer = serverId
          ? existing.some((m) => m.id === serverId)
          : false;
        const alreadyHasClient = clientMessageId
          ? existing.some(
              (m) =>
                m.clientMessageId === clientMessageId ||
                m.id === clientMessageId
            )
          : false;

        if (alreadyHasServer || alreadyHasClient) return prev;
        return { ...prev, [groupId]: [...existing, next] };
      });

      setMetaById((prev) => {
        const existing = prev[groupId];
        if (!existing) return prev;

        const isMine = next.senderId === currentUser.id;
        return {
          ...prev,
          [groupId]: {
            ...existing,
            lastActivityAt: next.timestamp,
            lastMessagePreview: next.content,
            unreadCount: isMine ? 0 : existing.unreadCount + 1,
          },
        };
      });
    };

    const onMessageAck = (payload: any) => {
      const clientMessageId =
        typeof payload?.clientMessageId === "string"
          ? payload.clientMessageId
          : "";
      const serverMessageId =
        typeof payload?.serverMessageId === "string"
          ? payload.serverMessageId
          : "";
      const createdAt = payload?.createdAt ? new Date(payload.createdAt) : null;
      if (!clientMessageId || !serverMessageId) return;

      setConversationsByGroupId((prev) => {
        const next: Record<string, GroupChatMessage[]> = { ...prev };
        for (const [groupId, thread] of Object.entries(prev)) {
          const idx = thread.findIndex(
            (m) =>
              m.id === clientMessageId || m.clientMessageId === clientMessageId
          );
          if (idx === -1) continue;
          const updated = [...thread];
          updated[idx] = {
            ...updated[idx],
            id: serverMessageId,
            timestamp: createdAt ?? updated[idx].timestamp,
          };
          next[groupId] = updated;
          break;
        }
        return next;
      });
    };

    socket.on("message:new", onMessageNew);
    socket.on("message:ack", onMessageAck);
    return () => {
      socket.off("message:new", onMessageNew);
      socket.off("message:ack", onMessageAck);
    };
  }, [currentUser.id, socket]);

  return {
    currentUser,
    usersById,
    query,
    setQuery,
    clearQuery,
    filter,
    setFilter,
    rows,
    visibleRows,
    myGroups,
    availableGroups,
    stats,
    refreshGroups,
    getGroupById,
    joinGroup,
    leaveGroup,
    createGroup,
    getMessagesForGroup,
    loadMessagesForGroup,
    sendMessage,
    reactToMessage,
  };
}
