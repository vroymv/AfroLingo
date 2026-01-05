import React, { createContext, useContext, useMemo } from "react";

import { mockGroups } from "@/data/community";
import type { Group } from "@/data/community";
import { useGroups } from "@/hooks/community/useGroups";

type GroupsContextValue = ReturnType<typeof useGroups>;

const GroupsContext = createContext<GroupsContextValue | null>(null);

type Props = {
  children: React.ReactNode;
  initialGroups?: Group[];
};

export function GroupsProvider({ children, initialGroups }: Props) {
  const store = useGroups(initialGroups ?? mockGroups);
  const value = useMemo(() => store, [store]);

  return (
    <GroupsContext.Provider value={value}>{children}</GroupsContext.Provider>
  );
}

export function useGroupsStore() {
  const ctx = useContext(GroupsContext);
  if (!ctx)
    throw new Error("useGroupsStore must be used within GroupsProvider");
  return ctx;
}
