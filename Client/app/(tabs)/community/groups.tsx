import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Group, mockGroups } from "@/data/community";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type GroupRow = Group & {
  lastActivityAt: Date;
  lastMessagePreview: string;
  unreadCount: number;
};

export default function GroupsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [query, setQuery] = useState("");

  const rows = useMemo<GroupRow[]>(() => {
    const now = Date.now();
    return mockGroups
      .map((group, index) => {
        const idNumber = Number.parseInt(group.id, 10);
        const hoursAgo = (Number.isFinite(idNumber) ? idNumber : index + 1) * 7;
        const lastActivityAt = new Date(now - hoursAgo * 60 * 60 * 1000);

        const unreadBase =
          (Number.isFinite(idNumber) ? idNumber : index + 1) * 3;
        const unreadCount = group.isMember ? unreadBase % 6 : 0;

        return {
          ...group,
          lastActivityAt,
          unreadCount,
          lastMessagePreview: group.description,
        };
      })
      .sort((a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime());
  }, []);

  const filteredRows = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return rows;

    return rows.filter((group) => {
      return (
        group.name.toLowerCase().includes(trimmed) ||
        group.language.toLowerCase().includes(trimmed) ||
        group.category.toLowerCase().includes(trimmed)
      );
    });
  }, [query, rows]);

  const formatTime = (date: Date) => {
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
  };

  const renderItem = ({ item }: { item: GroupRow }) => {
    const badgeBg = colors.tint;
    const separatorColor = `${colors.icon}20`;
    const subtleBg = `${colors.icon}14`;

    return (
      <TouchableOpacity
        style={[styles.row, { borderBottomColor: separatorColor }]}
        activeOpacity={0.8}
      >
        <View style={[styles.avatar, { backgroundColor: subtleBg }]}>
          <ThemedText style={styles.avatarEmoji}>{item.avatar}</ThemedText>
        </View>

        <View style={styles.rowBody}>
          <View style={styles.rowTop}>
            <ThemedText style={styles.rowTitle} numberOfLines={1}>
              {item.name}
            </ThemedText>
            <ThemedText
              style={[
                styles.rowTime,
                item.unreadCount > 0 && { color: colors.tint, opacity: 1 },
              ]}
            >
              {formatTime(item.lastActivityAt)}
            </ThemedText>
          </View>

          <View style={styles.rowBottom}>
            <ThemedText style={styles.rowPreview} numberOfLines={1}>
              {item.lastMessagePreview}
            </ThemedText>

            {item.isMember ? (
              item.unreadCount > 0 ? (
                <View
                  style={[styles.unreadBadge, { backgroundColor: badgeBg }]}
                >
                  <ThemedText style={styles.unreadText}>
                    {item.unreadCount}
                  </ThemedText>
                </View>
              ) : (
                <View style={styles.metaPill}>
                  <ThemedText style={styles.metaPillText}>
                    {getLanguageFlag(item.language)} {item.language}
                  </ThemedText>
                </View>
              )
            ) : (
              <View style={[styles.joinPill, { borderColor: colors.tint }]}>
                <ThemedText style={[styles.joinText, { color: colors.tint }]}>
                  Join
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            borderBottomColor: `${colors.icon}20`,
            backgroundColor: colors.background,
          },
        ]}
      >
        <ThemedText style={styles.headerTitle}>Groups</ThemedText>

        <TouchableOpacity style={styles.headerAction} activeOpacity={0.8}>
          <ThemedText style={[styles.headerActionText, { color: colors.tint }]}>
            ➕
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <View
          style={[styles.searchBar, { backgroundColor: `${colors.icon}12` }]}
        >
          <ThemedText style={[styles.searchIcon, { opacity: 0.7 }]}>
            🔍
          </ThemedText>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search groups"
            placeholderTextColor={colors.icon}
            style={[styles.searchInput, { color: colors.text }]}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              style={styles.clearButton}
              hitSlop={10}
            >
              <ThemedText style={[styles.clearText, { opacity: 0.7 }]}>
                ✕
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredRows}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyIcon}>👥</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
              No groups found
            </ThemedText>
            <ThemedText style={styles.emptyText}>
              Try a different search.
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

function getLanguageFlag(language: string): string {
  const flags: { [key: string]: string } = {
    Zulu: "🇿🇦",
    Swahili: "🇰🇪",
    Yoruba: "🇳🇬",
    Akan: "🇬🇭",
    Wolof: "🇸🇳",
    General: "🌍",
  };
  return flags[language] || "🌍";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerActionText: {
    fontSize: 20,
    fontWeight: "700",
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: {
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 16,
  },
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
    marginBottom: 4,
  },
  rowTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    marginRight: 12,
  },
  rowTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowPreview: {
    flex: 1,
    fontSize: 13,
    opacity: 0.7,
    marginRight: 12,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  joinText: {
    fontSize: 12,
    fontWeight: "700",
  },
  metaPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    opacity: 0.8,
  },
  metaPillText: {
    fontSize: 12,
    opacity: 0.7,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
});
