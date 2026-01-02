import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { mockPracticePartners, mockConversationPrompts } from "@/data/community";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function PartnersScreen() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredPartners = mockPracticePartners.filter((partner) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "online") return partner.isOnline;
    return partner.level === selectedFilter;
  });

  const filters = [
    { key: "all", label: "All", icon: "👥" },
    { key: "online", label: "Online", icon: "🟢" },
    { key: "beginner", label: "Beginner", icon: "🌱" },
    { key: "intermediate", label: "Intermediate", icon: "📈" },
    { key: "advanced", label: "Advanced", icon: "🏆" },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title">Practice Partners 🤝</ThemedText>
          <ThemedText type="subtitle">
            Connect with language exchange partners
          </ThemedText>
        </ThemedView>

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

        {/* Conversation Prompts */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            💡 Conversation Starters
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.promptsContainer}
          >
            {mockConversationPrompts.map((prompt) => (
              <TouchableOpacity key={prompt.id} style={styles.promptCard}>
                <View style={styles.promptHeader}>
                  <ThemedText style={styles.promptCategory}>
                    {prompt.category}
                  </ThemedText>
                  <View
                    style={[
                      styles.difficultyBadge,
                      getDifficultyStyle(prompt.difficulty),
                    ]}
                  >
                    <ThemedText style={styles.difficultyText}>
                      {prompt.difficulty.toUpperCase()[0]}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.promptText}>
                  {prompt.prompt}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>

        {/* Partners List */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Suggested Matches ({filteredPartners.length})
          </ThemedText>
          {filteredPartners.map((partner) => (
            <TouchableOpacity
              key={partner.id}
              style={styles.partnerCard}
              onPress={() => {
                // Navigate to chat (would be implemented)
              }}
            >
              <View style={styles.partnerHeader}>
                <View style={styles.partnerInfo}>
                  <View style={styles.avatarContainer}>
                    <ThemedText style={styles.avatar}>
                      {partner.user.avatar}
                    </ThemedText>
                    {partner.isOnline && (
                      <View style={styles.onlineIndicator} />
                    )}
                  </View>
                  <View style={styles.partnerDetails}>
                    <View style={styles.nameRow}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.partnerName}
                      >
                        {partner.user.name}
                      </ThemedText>
                      {partner.user.country && (
                        <ThemedText style={styles.flag}>
                          {getCountryFlag(partner.user.country)}
                        </ThemedText>
                      )}
                    </View>
                    <ThemedText style={styles.partnerBio}>
                      {partner.user.bio}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.matchScore}>
                  <ThemedText style={styles.matchPercentage}>
                    {partner.matchScore}%
                  </ThemedText>
                  <ThemedText style={styles.matchLabel}>match</ThemedText>
                </View>
              </View>

              {/* Language Exchange */}
              <View style={styles.languageExchange}>
                <View style={styles.languageItem}>
                  <ThemedText style={styles.languageLabel}>
                    Native in
                  </ThemedText>
                  <View style={styles.languageTag}>
                    <ThemedText style={styles.languageText}>
                      {partner.nativeLanguage}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.exchangeArrow}>⇄</ThemedText>
                <View style={styles.languageItem}>
                  <ThemedText style={styles.languageLabel}>
                    Learning
                  </ThemedText>
                  <View style={styles.languageTag}>
                    <ThemedText style={styles.languageText}>
                      {partner.targetLanguage}
                    </ThemedText>
                  </View>
                </View>
              </View>

              {/* Level & Stats */}
              <View style={styles.partnerStats}>
                <View style={styles.statChip}>
                  <ThemedText style={styles.statIcon}>📚</ThemedText>
                  <ThemedText style={styles.statText}>
                    {partner.level}
                  </ThemedText>
                </View>
                <View style={styles.statChip}>
                  <ThemedText style={styles.statIcon}>🔥</ThemedText>
                  <ThemedText style={styles.statText}>
                    {partner.user.streak}-day streak
                  </ThemedText>
                </View>
                <View style={styles.statChip}>
                  <ThemedText style={styles.statIcon}>⭐</ThemedText>
                  <ThemedText style={styles.statText}>
                    {partner.user.xp} XP
                  </ThemedText>
                </View>
              </View>

              {/* Interests */}
              <View style={styles.interestsContainer}>
                {partner.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <ThemedText style={styles.interestText}>
                      {interest}
                    </ThemedText>
                  </View>
                ))}
              </View>

              {/* Availability */}
              <View style={styles.availabilityRow}>
                <ThemedText style={styles.availabilityIcon}>🕐</ThemedText>
                <ThemedText style={styles.availabilityText}>
                  {partner.availability}
                </ThemedText>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.primaryButton}>
                  <ThemedText style={styles.primaryButtonText}>
                    💬 Start Chat
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <ThemedText style={styles.secondaryButtonText}>
                    👤 View Profile
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Empty State */}
        {filteredPartners.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyIcon}>🔍</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
              No partners found
            </ThemedText>
            <ThemedText style={styles.emptyText}>
              Try adjusting your filters
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <ThemedText style={styles.fabText}>⚙️</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

function getCountryFlag(country: string): string {
  const flags: { [key: string]: string } = {
    US: "🇺🇸",
    GH: "🇬🇭",
    KE: "🇰🇪",
    NG: "🇳🇬",
    ZA: "🇿🇦",
    SN: "🇸🇳",
  };
  return flags[country] || "🌍";
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
  promptsContainer: {
    marginBottom: 8,
  },
  promptCard: {
    width: 220,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  promptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  promptCategory: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.7,
  },
  difficultyBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "700",
  },
  promptText: {
    fontSize: 13,
    lineHeight: 18,
  },
  partnerCard: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  partnerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  partnerInfo: {
    flexDirection: "row",
    flex: 1,
    marginRight: 12,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    fontSize: 40,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.5)",
  },
  partnerDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  partnerName: {
    fontSize: 18,
    marginRight: 8,
  },
  flag: {
    fontSize: 16,
  },
  partnerBio: {
    fontSize: 13,
    opacity: 0.8,
    lineHeight: 18,
  },
  matchScore: {
    alignItems: "center",
    backgroundColor: "rgba(0, 150, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  matchPercentage: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0096FF",
  },
  matchLabel: {
    fontSize: 10,
    opacity: 0.7,
    marginTop: 2,
  },
  languageExchange: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
  },
  languageItem: {
    alignItems: "center",
    flex: 1,
  },
  languageLabel: {
    fontSize: 11,
    opacity: 0.6,
    marginBottom: 6,
  },
  languageTag: {
    backgroundColor: "rgba(0, 150, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  languageText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0096FF",
  },
  exchangeArrow: {
    fontSize: 20,
    opacity: 0.5,
    marginHorizontal: 8,
  },
  partnerStats: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statText: {
    fontSize: 11,
    fontWeight: "600",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  interestTag: {
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  interestText: {
    fontSize: 11,
    color: "#FFD700",
    fontWeight: "600",
  },
  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  availabilityIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    opacity: 0.7,
  },
  actionButtons: {
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
    fontSize: 15,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
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
