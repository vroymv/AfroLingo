import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import type { GroupRow } from "@/hooks/community/useGroups";

type ThemeColors = (typeof Colors)["light"];

type Props = {
  group: GroupRow;
  colors: ThemeColors;
};

export function GroupBanner({ group, colors }: Props) {
  return (
    <View style={styles.groupBanner}>
      <View
        style={[styles.groupAvatar, { backgroundColor: `${colors.icon}10` }]}
      >
        <ThemedText style={styles.groupAvatarText}>{group.avatar}</ThemedText>
      </View>
      <ThemedText style={styles.groupSubtitle}>
        {group.memberCount} members •{" "}
        {group.type === "public" ? "Public" : "Private"}
      </ThemedText>
      <ThemedText style={styles.groupAbout} numberOfLines={2}>
        {group.description}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  groupBanner: {
    alignItems: "center",
    paddingTop: 6,
    paddingBottom: 14,
    gap: 6,
  },
  groupAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  groupAvatarText: {
    fontSize: 28,
  },
  groupSubtitle: {
    fontSize: 13,
    opacity: 0.75,
    fontWeight: "700",
    textAlign: "center",
  },
  groupAbout: {
    fontSize: 13,
    opacity: 0.85,
    textAlign: "center",
    paddingHorizontal: 28,
  },
});
