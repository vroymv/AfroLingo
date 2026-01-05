import { useMemo, useState } from "react";

import type { Group } from "@/data/community";
import { mockUserProfile, mockUsers } from "@/data/community";

export type GroupChatReactionMap = Record<string, string[]>;

export type GroupChatMessage = {
  id: string;
  groupId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  reactions: GroupChatReactionMap;
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

function seedMessagesForGroup(group: Group): GroupChatMessage[] {
  const participants = [mockUserProfile, ...group.topMembers, ...mockUsers]
    .filter((u, idx, arr) => arr.findIndex((x) => x.id === u.id) === idx)
    .slice(0, 5);

  const now = Date.now();
  const texts = [
    `Hey everyone — welcome to ${group.name}!`,
    "What are you practicing today?",
    "Drop a phrase you learned this week 👇",
    "Anyone want to do a quick speaking challenge?",
    "Here’s a helpful resource I found.",
    "🔥 Let’s keep the streak going!",
  ];

  return texts.map((content, index) => {
    const sender = participants[index % participants.length];
    const minutesAgo = (texts.length - index) * 9;

    return {
      id: `${group.id}-m-${index + 1}`,
      groupId: group.id,
      senderId: sender.id,
      content,
      timestamp: new Date(now - minutesAgo * 60 * 1000),
      reactions: {},
    };
  });
}

function seedConversations(
  groups: Group[]
): Record<string, GroupChatMessage[]> {
  return Object.fromEntries(groups.map((g) => [g.id, seedMessagesForGroup(g)]));
}

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
  const now = Date.now();
  return Object.fromEntries(
    groups.map((group, index) => {
      const idNumber = Number.parseInt(group.id, 10);
      const hoursAgo = (Number.isFinite(idNumber) ? idNumber : index + 1) * 7;
      const lastActivityAt = new Date(now - hoursAgo * 60 * 60 * 1000);

      const unreadBase = (Number.isFinite(idNumber) ? idNumber : index + 1) * 3;
      const unreadCount = group.isMember ? unreadBase % 6 : 0;

      return [
        group.id,
        {
          lastActivityAt,
          unreadCount,
          lastMessagePreview: group.description,
        },
      ];
    })
  );
}

export function useGroups(initialGroups: Group[]) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<GroupsFilter>("all");
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [metaById, setMetaById] = useState(() => makeMeta(initialGroups));
  const [conversationsByGroupId, setConversationsByGroupId] = useState(() =>
    seedConversations(initialGroups)
  );

  const currentUser = mockUserProfile;

  const usersById = useMemo(() => {
    const all = [mockUserProfile, ...mockUsers];
    return Object.fromEntries(all.map((u) => [u.id, u]));
  }, []);

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

  const joinGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              isMember: true,
              memberCount: group.memberCount + 1,
            }
          : group
      )
    );

    setMetaById((prev) => {
      const existing = prev[groupId];
      if (!existing) return prev;
      return {
        ...prev,
        [groupId]: {
          ...existing,
          unreadCount: Math.max(existing.unreadCount, 1),
          lastActivityAt: new Date(),
        },
      };
    });
  };

  const leaveGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              isMember: false,
              memberCount: Math.max(0, group.memberCount - 1),
            }
          : group
      )
    );

    setMetaById((prev) => {
      const existing = prev[groupId];
      if (!existing) return prev;
      return {
        ...prev,
        [groupId]: {
          ...existing,
          unreadCount: 0,
          lastActivityAt: new Date(),
        },
      };
    });
  };

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
      [newId]: seedMessagesForGroup(newGroup),
    }));

    return newId;
  };

  const getMessagesForGroup = (groupId: string) =>
    conversationsByGroupId[groupId] ?? [];

  const sendMessage = (groupId: string, content: string) => {
    const message: GroupChatMessage = {
      id: `${groupId}-m-${Date.now()}`,
      groupId,
      senderId: currentUser.id,
      content,
      timestamp: new Date(),
      reactions: {},
    };

    setConversationsByGroupId((prev) => {
      const existing = prev[groupId] ?? [];
      return { ...prev, [groupId]: [...existing, message] };
    });

    setMetaById((prev) => {
      const existing = prev[groupId];
      if (!existing) return prev;
      return {
        ...prev,
        [groupId]: {
          ...existing,
          lastActivityAt: new Date(),
          lastMessagePreview: content,
          unreadCount: 0,
        },
      };
    });
  };

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
    getGroupById,
    joinGroup,
    leaveGroup,
    createGroup,
    getMessagesForGroup,
    sendMessage,
    reactToMessage,
  };
}
