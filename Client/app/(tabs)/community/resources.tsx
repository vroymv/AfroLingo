import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { mockResources } from "@/data/community";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ResourcesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesFilter =
      selectedFilter === "all" ||
      resource.type === selectedFilter ||
      resource.language.toLowerCase() === selectedFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const filters = [
    { key: "all", label: "All", icon: "📚" },
    { key: "podcast", label: "Podcasts", icon: "🎧" },
    { key: "video", label: "Videos", icon: "🎥" },
    { key: "pdf", label: "PDFs", icon: "📄" },
    { key: "study_group", label: "Groups", icon: "👥" },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title">Resources 📚</ThemedText>
          <ThemedText type="subtitle">
            Curated materials & community shares
          </ThemedText>
        </ThemedView>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search resources..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <ThemedText style={styles.searchIcon}>🔍</ThemedText>
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

        {/* Results Count */}
        <ThemedText style={styles.resultsCount}>
          {filteredResources.length} resource
          {filteredResources.length !== 1 ? "s" : ""} found
        </ThemedText>

        {/* Resources List */}
        <ThemedView style={styles.section}>
          {filteredResources.map((resource) => (
            <TouchableOpacity key={resource.id} style={styles.resourceCard}>
              <View style={styles.resourceHeader}>
                <View style={styles.resourceInfo}>
                  <View style={styles.resourceTitleRow}>
                    <ThemedText style={styles.resourceIcon}>
                      {getResourceIcon(resource.type)}
                    </ThemedText>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.resourceTitle}
                    >
                      {resource.title}
                    </ThemedText>
                  </View>
                  <View style={styles.resourceMeta}>
                    <View style={styles.metaItem}>
                      <ThemedText style={styles.languageFlag}>
                        {getLanguageFlag(resource.language)}
                      </ThemedText>
                      <ThemedText style={styles.languageText}>
                        {resource.language}
                      </ThemedText>
                    </View>
                    <View
                      style={[
                        styles.difficultyBadge,
                        getDifficultyStyle(resource.difficulty),
                      ]}
                    >
                      <ThemedText style={styles.difficultyText}>
                        {resource.difficulty.toUpperCase()}
                      </ThemedText>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.bookmarkButton}>
                  <ThemedText style={styles.bookmarkIcon}>
                    {resource.isBookmarked ? "🔖" : "📌"}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <ThemedText type="default" style={styles.resourceDescription}>
                {resource.description}
              </ThemedText>

              {/* Tags */}
              <View style={styles.tagsContainer}>
                {resource.tags.slice(0, 3).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <ThemedText style={styles.tagText}>{tag}</ThemedText>
                  </View>
                ))}
                {resource.tags.length > 3 && (
                  <View style={styles.moreTagsIndicator}>
                    <ThemedText style={styles.moreTagsText}>
                      +{resource.tags.length - 3}
                    </ThemedText>
                  </View>
                )}
              </View>

              {/* Resource Stats */}
              <View style={styles.resourceStats}>
                <View style={styles.statRow}>
                  <ThemedText style={styles.statIcon}>⭐</ThemedText>
                  <ThemedText style={styles.statText}>
                    {resource.rating} ({resource.reviews} reviews)
                  </ThemedText>
                </View>
                <View style={styles.statRow}>
                  <ThemedText style={styles.statIcon}>🔖</ThemedText>
                  <ThemedText style={styles.statText}>
                    {resource.bookmarks} bookmarks
                  </ThemedText>
                </View>
                {resource.duration && (
                  <View style={styles.statRow}>
                    <ThemedText style={styles.statIcon}>⏱️</ThemedText>
                    <ThemedText style={styles.statText}>
                      {resource.duration}
                    </ThemedText>
                  </View>
                )}
              </View>

              {/* Author Info */}
              {resource.author && (
                <View style={styles.authorInfo}>
                  <ThemedText style={styles.authorAvatar}>
                    {resource.author.avatar}
                  </ThemedText>
                  <ThemedText style={styles.authorName}>
                    Shared by {resource.author.name}
                  </ThemedText>
                  <ThemedText style={styles.userTypeIcon}>
                    {getUserTypeIcon(resource.author.userType)}
                  </ThemedText>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.resourceActions}>
                <TouchableOpacity style={styles.primaryButton}>
                  <ThemedText style={styles.primaryButtonText}>
                    {getActionText(resource.type)}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <ThemedText style={styles.secondaryButtonText}>
                    Share
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyIcon}>📭</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
              No resources found
            </ThemedText>
            <ThemedText style={styles.emptyText}>
              Try adjusting your search or filters
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

function getResourceIcon(type: string): string {
  const icons: { [key: string]: string } = {
    podcast: "🎧",
    video: "🎥",
    pdf: "📄",
    article: "📰",
    playlist: "🎵",
    study_group: "👥",
  };
  return icons[type] || "📚";
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

function getDifficultyStyle(difficulty: string) {
  switch (difficulty) {
    case "beginner":
      return { backgroundColor: "rgba(34, 197, 94, 0.2)" };
    case "intermediate":
      return { backgroundColor: "rgba(249, 115, 22, 0.2)" };
    case "advanced":
      return { backgroundColor: "rgba(239, 68, 68, 0.2)" };
    default:
      return { backgroundColor: "rgba(156, 163, 175, 0.2)" };
  }
}

function getUserTypeIcon(userType: string): string {
  switch (userType) {
    case "native":
      return "🏠";
    case "tutor":
      return "🎓";
    case "learner":
      return "📚";
    default:
      return "👤";
  }
}

function getActionText(type: string): string {
  switch (type) {
    case "podcast":
      return "🎧 Listen";
    case "video":
      return "▶️ Watch";
    case "pdf":
      return "📄 Download";
    case "study_group":
      return "👥 Join Group";
    default:
      return "Open";
  }
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
  searchContainer: {
    position: "relative",
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    paddingRight: 50,
    fontSize: 16,
    color: "white",
  },
  searchIcon: {
    position: "absolute",
    right: 16,
    top: 16,
    fontSize: 18,
  },
  filtersContainer: {
    marginBottom: 16,
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
    fontSize: 16,
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
  resultsCount: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  resourceCard: {
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  resourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  resourceIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  resourceTitle: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  resourceMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageFlag: {
    fontSize: 14,
    marginRight: 6,
  },
  languageText: {
    fontSize: 12,
    fontWeight: "600",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "700",
  },
  bookmarkButton: {
    padding: 8,
  },
  bookmarkIcon: {
    fontSize: 20,
  },
  resourceDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    opacity: 0.9,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 6,
  },
  tag: {
    backgroundColor: "rgba(0, 150, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: "#0096FF",
    fontWeight: "600",
  },
  moreTagsIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moreTagsText: {
    fontSize: 11,
    opacity: 0.7,
  },
  resourceStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 16,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statText: {
    fontSize: 12,
    opacity: 0.8,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  authorAvatar: {
    fontSize: 16,
    marginRight: 8,
  },
  authorName: {
    fontSize: 12,
    opacity: 0.8,
    flex: 1,
  },
  userTypeIcon: {
    fontSize: 14,
  },
  resourceActions: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#0096FF",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
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
    fontSize: 24,
    color: "white",
  },
});
