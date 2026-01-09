import { useCallback, useEffect, useMemo, useState } from "react";

import type { User } from "@/data/community";
import {
  fetchDiscoverPeople,
  followUser,
  unfollowUser,
} from "@/services/communityPeople";

export type DiscoverUser = User & {
  isConnected: boolean;
};

function mapDbUserToCommunityUser(dbUser: {
  id: string;
  name: string;
  profileImageUrl: string | null;
  userType: "LEARNER" | "NATIVE" | "TUTOR";
  languages: string[];
  bio: string | null;
  countryCode: string | null;
  xpTotal: number;
  isFollowing: boolean;
}): DiscoverUser {
  const userType = dbUser.userType.toLowerCase() as User["userType"];

  return {
    id: dbUser.id,
    name: dbUser.name,
    avatar: dbUser.profileImageUrl ?? "👤",
    userType,
    country: dbUser.countryCode ?? undefined,
    languages: dbUser.languages ?? [],
    xp: dbUser.xpTotal ?? 0,
    badges: [],
    bio: dbUser.bio ?? undefined,
    isFollowing: dbUser.isFollowing,
    isConnected: dbUser.isFollowing,
  };
}

export function useDiscoverUsers(viewerId: string | null | undefined) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<DiscoverUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!viewerId) {
      setUsers([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchDiscoverPeople(viewerId);
      if (!result.success) {
        setUsers([]);
        setError(result.message || "Failed to load people");
        return;
      }

      setUsers(result.data.map(mapDbUserToCommunityUser));
    } catch (e: any) {
      setUsers([]);
      setError(e?.message || "Failed to load people");
    } finally {
      setIsLoading(false);
    }
  }, [viewerId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredUsers = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return users;

    return users.filter((user) => {
      const nameMatch = user.name.toLowerCase().includes(trimmed);
      const languageMatch = user.languages.some((lang) =>
        lang.toLowerCase().includes(trimmed)
      );
      const countryMatch = (user.country ?? "").toLowerCase().includes(trimmed);
      const typeMatch = user.userType.toLowerCase().includes(trimmed);

      return nameMatch || languageMatch || countryMatch || typeMatch;
    });
  }, [query, users]);

  const clearQuery = () => setQuery("");

  const toggleConnect = useCallback(
    async (userId: string) => {
      if (!viewerId) return;

      const prior = users;
      const next = users.map((u) =>
        u.id === userId ? { ...u, isConnected: !u.isConnected } : u
      );
      setUsers(next);

      const toggled = next.find((u) => u.id === userId);
      if (!toggled) return;

      const action = toggled.isConnected ? "follow" : "unfollow";
      const result =
        action === "follow"
          ? await followUser(viewerId, userId)
          : await unfollowUser(viewerId, userId);

      if (!result.success) {
        setUsers(prior);
        setError(result.message || "Failed to update connection");
      }
    },
    [viewerId, users]
  );

  return {
    query,
    setQuery,
    clearQuery,
    users,
    filteredUsers,
    toggleConnect,
    isLoading,
    error,
    refresh,
  };
}
