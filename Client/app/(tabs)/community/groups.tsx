import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { mockGroups } from "@/data/community";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function GroupsScreen() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const myGroups = mockGroups.filter((group) => group.isMember);
  const publicGroups = mockGroups.filter((group) => group.type === "public");

  const filteredGroups = mockGroups.filter((group) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "my_groups") return group.isMember;
    if (selectedFilter === "public") return group.type === "public";
    return group.language === selectedFilter;
  });

  const filters = [
    { key: "all", label: "All", icon: "🌐" },
    { key: "my_groups", label: "My Groups", icon: "⭐" },
    { key: "public", label: "Public", icon: "🔓" },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title">Groups & Clubs 👥</ThemedText>
          <ThemedText type="subtitle">
            Learn together, grow together
          </ThemedText>
        </ThemedView>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{myGroups.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Your Groups</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>
              {publicGroups.length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Available</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>
              {mockGroups.reduce((sum, g) => sum + g.memberCount, 0)}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Total Members</ThemedText>
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                selectedFilter === filter.key && styles.activeFilterTab,
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <ThemedText style={styles.filterIcon}>{filter.icon}</ThemedText>
              <ThemedText
                style={[
                  styles.filterText,
                  selectedFilter === filter.key && styles.activeFilterText,
                ]}
              >
                {filter.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* My Groups Section */}
        {myGroups.length > 0 && selectedFilter !== "public" && (
          <ThemedView style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              ⭐ Your Groups
            </ThemedText>
            {myGroups.map((group) => (
              <TouchableOpacity key={group.id} style={styles.groupCard}>
                <View style={styles.groupHeader}>
                  <View style={styles.groupInfo}>
                    <ThemedText style={styles.groupAvatar}>
                      {group.avatar}
                    </ThemedText>
                    <View style={styles.groupDetails}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.groupName}
                      >
                        {group.name}
                      </ThemedText>
                      <View style={styles.groupMeta}>
                        <ThemedText style={styles.metaText}>
                          {getLanguageFlag(group.language)} {group.language}
                        </ThemedText>
                        <ThemedText style={styles.metaDot}>•</ThemedText>
                        <ThemedText style={styles.metaText}>
                          {group.memberCount} members
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  <View style={styles.streakBadge}>
                    <ThemedText style={styles.streakEmoji}>🔥</ThemedText>
                    <ThemedText style={styles.streakNumber}>
                      {group.groupStreak}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText style={styles.groupDescription}>
                  {group.description}
                </ThemedText>

                {/* Weekly Goal Progress */}
                <View style={styles.goalSection}>
                  <View style={styles.goalHeader}>
                    <ThemedText style={styles.goalTitle}>
                      Weekly XP Goal
                    </ThemedText>
                    <ThemedText style={styles.goalProgress}>
                      {group.currentXp} / {group.weeklyXpGoal} XP
                    </ThemedText>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(
                            (group.currentXp / group.weeklyXpGoal) * 100,
                            100
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                  <ThemedText style={styles.goalStatus}>
                    {Math.round((group.currentXp / group.weeklyXpGoal) * 100)}%
                    complete
                  </ThemedText>
                </View>

                {/* Top Members */}
                {group.topMembers.length > 0 && (
                  <View style={styles.topMembers}>
                    <ThemedText style={styles.topMembersLabel}>
                      Top Contributors:
                    </ThemedText>
                    <View style={styles.memberAvatars}>
                      {group.topMembers.map((member, index) => (
                        <View key={member.id} style={styles.memberAvatar}>
                          <ThemedText style={styles.memberAvatarEmoji}>
                            {member.avatar}
                          </ThemedText>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.groupActions}>
                  <TouchableOpacity style={styles.primaryButton}>
                    <ThemedText style={styles.primaryButtonText}>
                      🏆 View Leaderboard
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <ThemedText style={styles.iconButtonText}>💬</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <ThemedText style={styles.iconButtonText}>⚙️</ThemedText>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ThemedView>
        )}

        {/* Available Groups */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            {selectedFilter === "my_groups"
              ? ""
              : "🔓 Available Groups to Join"}
          </ThemedText>
          {filteredGroups
            .filter((group) => !group.isMember)
            .map((group) => (
              <TouchableOpacity key={group.id} style={styles.groupCard}>
                <View style={styles.groupHeader}>
                  <View style={styles.groupInfo}>
                    <ThemedText style={styles.groupAvatar}>
                      {group.avatar}
                    </ThemedText>
                    <View style={styles.groupDetails}>
                      <View style={styles.nameRow}>
                        <ThemedText
                          type="defaultSemiBold"
                          style={styles.groupName}
                        >
                          {group.name}
                        </ThemedText>
                        {group.type === "private" && (
                          <View style={styles.privateBadge}>
                            <ThemedText style={styles.privateBadgeText}>
                              🔒 Private
                            </ThemedText>
                          </View>
                        )}
                      </View>
                      <View style={styles.groupMeta}>
                        <ThemedText style={styles.metaText}>
                          {getLanguageFlag(group.language)} {group.language}
                        </ThemedText>
                        <ThemedText style={styles.metaDot}>•</ThemedText>
                        <ThemedText style={styles.metaText}>
                          {group.memberCount} members
                        </ThemedText>
                        <ThemedText style={styles.metaDot}>•</ThemedText>
                        <ThemedText style={styles.metaText}>
                          {group.category}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  <View style={styles.streakBadge}>
                    <ThemedText style={styles.streakEmoji}>🔥</ThemedText>
                    <ThemedText style={styles.streakNumber}>
                      {group.groupStreak}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText style={styles.groupDescription}>
                  {group.description}
                </ThemedText>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <ThemedText style={styles.statIcon}>🎯</ThemedText>
                    <ThemedText style={styles.statText}>
                      {group.weeklyXpGoal} XP goal
                    </ThemedText>
                  </View>
                  <View style={styles.statItem}>
                    <ThemedText style={styles.statIcon}>⚡</ThemedText>
                    <ThemedText style={styles.statText}>Active</ThemedText>
                  </View>
                </View>

                {/* Join Button */}
                <TouchableOpacity
                  style={[
                    styles.joinButton,
                    group.type === "private" && styles.requestButton,
                  ]}
                >
                  <ThemedText style={styles.joinButtonText}>
                    {group.type === "private"
                      ? "🔒 Request to Join"
                      : "➕ Join Group"}
                  </ThemedText>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
        </ThemedView>

        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyIcon}>👥</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
              No groups found
            </ThemedText>
            <ThemedText style={styles.emptyText}>
              Try adjusting your filters
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <ThemedText style={styles.fabText}>➕</ThemedText>
      </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0096FF",
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.7,
    marginTop: 4,
    textAlign: "center",
  },
  filtersContainer: {
    marginBottom: 24,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeFilterTab: {
    backgroundColor: "rgba(0, 150, 255, 0.2)",
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#0096FF",
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  groupCard: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  groupInfo: {
    flexDirection: "row",
    flex: 1,
    marginRight: 12,
  },
  groupAvatar: {
    fontSize: 40,
    marginRight: 12,
  },
  groupDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  groupName: {
    fontSize: 18,
    marginRight: 8,
  },
  privateBadge: {
    backgroundColor: "rgba(255, 165, 0, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  privateBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  groupMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 12,
    opacity: 0.7,
  },
  metaDot: {
    fontSize: 12,
    opacity: 0.5,
    marginHorizontal: 6,
  },
  streakBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255, 100, 50, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  streakEmoji: {
    fontSize: 16,
  },
  streakNumber: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },
  groupDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.9,
  },
  goalSection: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  goalProgress: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0096FF",
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0096FF",
    borderRadius: 4,
  },
  goalStatus: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: "right",
  },
  topMembers: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  topMembersLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  memberAvatars: {
    flexDirection: "row",
  },
  memberAvatar: {
    marginLeft: -8,
  },
  memberAvatarEmoji: {
    fontSize: 24,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    overflow: "hidden",
  },
  groupActions: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#0096FF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  iconButton: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonText: {
    fontSize: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  statText: {
    fontSize: 12,
    opacity: 0.8,
  },
  joinButton: {
    backgroundColor: "#0096FF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  requestButton: {
    backgroundColor: "rgba(255, 165, 0, 0.3)",
  },
  joinButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0096FF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 28,
    color: "white",
  },
});
