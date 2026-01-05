import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GroupListItem } from "@/components/community/groups/GroupListItem";
import { GroupsEmptyState } from "@/components/community/groups/GroupsEmptyState";
import { GroupsFilterPills } from "@/components/community/groups/GroupsFilterPills";
import { GroupsSearchBar } from "@/components/community/groups/GroupsSearchBar";
import { useGroupsStore } from "@/contexts/community/GroupsContext";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type SectionKey = "my" | "available";

type Section = {
  key: SectionKey;
  title: string;
  data: string[]; // group ids
};

export default function GroupsIndexScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const {
    query,
    setQuery,
    clearQuery,
    filter,
    setFilter,
    myGroups,
    availableGroups,
    stats,
    joinGroup,
  } = useGroupsStore();

  const sections = useMemo<Section[]>(() => {
    const s: Section[] = [];

    if (myGroups.length > 0) {
      s.push({
        key: "my",
        title: "Your Groups",
        data: myGroups.map((g) => g.id),
      });
    }

    if (availableGroups.length > 0) {
      s.push({
        key: "available",
        title: "Available Groups",
        data: availableGroups.map((g) => g.id),
      });
    }

    return s;
  }, [availableGroups, myGroups]);

  const groupById = useMemo(() => {
    const map = new Map<string, (typeof myGroups)[number]>();
    [...myGroups, ...availableGroups].forEach((g) => map.set(g.id, g));
    return map;
  }, [availableGroups, myGroups]);

  const flatRows = useMemo(() => {
    const rows: (
      | { kind: "section"; section: Section }
      | { kind: "item"; groupId: string }
    )[] = [];

    sections.forEach((section) => {
      rows.push({ kind: "section", section });
      section.data.forEach((groupId) => rows.push({ kind: "item", groupId }));
    });

    return rows;
  }, [sections]);

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
        <View style={styles.headerLeft}>
          <ThemedText style={styles.headerTitle}>Groups & Clubs</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Learn together, grow together
          </ThemedText>
        </View>

        <TouchableOpacity
          style={styles.headerAction}
          activeOpacity={0.85}
          onPress={() => router.push("/(tabs)/community/groups/create" as any)}
        >
          <ThemedText style={[styles.headerActionText, { color: colors.tint }]}>
            ➕
          </ThemedText>
        </TouchableOpacity>
      </View>

      <GroupsFilterPills value={filter} onChange={setFilter} />

      <GroupsSearchBar
        value={query}
        onChangeText={setQuery}
        onClear={clearQuery}
      />

      <FlatList
        data={flatRows}
        keyExtractor={(item, index) =>
          item.kind === "section"
            ? `s-${item.section.key}`
            : `g-${item.groupId}-${index}`
        }
        renderItem={({ item }) => {
          if (item.kind === "section") {
            return (
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>
                  {item.section.title}
                </ThemedText>
              </View>
            );
          }

          const group = groupById.get(item.groupId);
          if (!group) return null;

          return (
            <GroupListItem
              group={group}
              onPress={() =>
                router.push({
                  pathname: "/community/groups/[groupId]",
                  params: { groupId: group.id },
                })
              }
              onJoin={() => joinGroup(group.id)}
            />
          );
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<GroupsEmptyState />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    opacity: 0.6,
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
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    opacity: 0.7,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  listContent: {
    paddingBottom: 16,
  },
});
