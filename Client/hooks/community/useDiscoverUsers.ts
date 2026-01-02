import { useMemo, useState } from "react";

import type { User } from "@/data/community";

export type DiscoverUser = User & {
  isConnected: boolean;
};

export function useDiscoverUsers(initialUsers: User[]) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<DiscoverUser[]>(() =>
    initialUsers.map((user) => ({
      ...user,
      isConnected: user.isFollowing ?? false,
    }))
  );

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

  const toggleConnect = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isConnected: !user.isConnected } : user
      )
    );
  };

  return {
    query,
    setQuery,
    clearQuery,
    users,
    filteredUsers,
    toggleConnect,
  };
}
