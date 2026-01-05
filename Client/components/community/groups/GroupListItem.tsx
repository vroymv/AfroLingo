import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import React, { useMemo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import type { GroupRow } from "@/hooks/community/useGroups";
import { getLanguageFlag } from "@/utils/language";

type Props = {
  group: GroupRow;
  onPress: () => void;
  onJoin: () => void;
};

function formatTime(date: Date) {
  const now = new Date();
  const sameDay =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  if (sameDay) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const hours12 = hours % 12 || 12;
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${hours12}:${minutes} ${ampm}`;
  }

  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function GroupListItem({ group, onPress, onJoin }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const separatorColor = `${colors.icon}20`;
  const subtleBg = `${colors.icon}12`;
  const badgeBg = colors.tint;

  const metaLine = useMemo(() => {
    const membersLabel = `${group.memberCount} members`;
    return `${getLanguageFlag(group.language)} ${
      group.language
    }  •  ${membersLabel}`;
  }, [group.language, group.memberCount]);

  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: separatorColor }]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={[styles.avatar, { backgroundColor: subtleBg }]}>
        <ThemedText style={styles.avatarEmoji}>{group.avatar}</ThemedText>
      </View>

      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <ThemedText style={styles.rowTitle} numberOfLines={1}>
            {group.name}
          </ThemedText>
          <ThemedText
            style={[
              styles.rowTime,
              group.unreadCount > 0 && { color: colors.tint, opacity: 1 },
            ]}
          >
            {formatTime(group.lastActivityAt)}
          </ThemedText>
        </View>

        <View style={styles.rowBottom}>
          <View style={styles.previewWrap}>
            <ThemedText style={styles.metaLine} numberOfLines={1}>
              {metaLine}
            </ThemedText>
            <ThemedText style={styles.preview} numberOfLines={1}>
              {group.lastMessagePreview}
            </ThemedText>
          </View>

          {group.isMember ? (
            group.unreadCount > 0 ? (
              <View style={[styles.unreadBadge, { backgroundColor: badgeBg }]}>
                <ThemedText style={styles.unreadText}>
                  {group.unreadCount}
                </ThemedText>
              </View>
            ) : (
              <View style={[styles.metaPill, { backgroundColor: subtleBg }]}>
                <ThemedText style={styles.metaPillText}>
                  {group.category}
                </ThemedText>
              </View>
            )
          ) : (
            <TouchableOpacity
              onPress={onJoin}
              activeOpacity={0.85}
              style={[styles.joinPill, { borderColor: colors.tint }]}
            >
              <ThemedText style={[styles.joinText, { color: colors.tint }]}>
                Join
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  rowBody: {
    flex: 1,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    gap: 12,
  },
  rowTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },
  rowTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  previewWrap: {
    flex: 1,
  },
  metaLine: {
    fontSize: 12,
    opacity: 0.65,
    marginBottom: 2,
  },
  preview: {
    fontSize: 13,
    opacity: 0.75,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  joinPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  joinText: {
    fontSize: 12,
    fontWeight: "800",
  },
  metaPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaPillText: {
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.75,
  },
});
