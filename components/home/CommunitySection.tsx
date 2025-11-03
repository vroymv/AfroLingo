import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface CommunitySectionProps {
  selectedLanguage: string | null;
  onNavigateToCommunity: () => void;
}

export default function CommunitySection({
  selectedLanguage,
  onNavigateToCommunity,
}: CommunitySectionProps) {
  const getLanguageName = (language: string | null) => {
    if (!language) return "Language";
    return language.charAt(0).toUpperCase() + language.slice(1);
  };

  return (
    <ThemedView style={styles.communitySection}>
      <View style={styles.communitySectionHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Community & Live Classes
        </ThemedText>
        <TouchableOpacity onPress={onNavigateToCommunity}>
          <ThemedText style={styles.seeAllText}>See All</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.communityScrollView}
        contentContainerStyle={styles.communityScrollContent}
      >
        <TouchableOpacity style={styles.liveClassCard}>
          <View style={styles.liveClassHeader}>
            <View style={styles.liveBadge}>
              <ThemedText style={styles.liveBadgeText}>LIVE</ThemedText>
            </View>
            <ThemedText style={styles.liveClassTime}>in 2h</ThemedText>
          </View>
          <ThemedText style={styles.liveClassTitle}>
            Conversational {getLanguageName(selectedLanguage)}
          </ThemedText>
          <ThemedText style={styles.liveClassTeacher}>
            with Teacher Amara
          </ThemedText>
          <View style={styles.participantsRow}>
            <ThemedText style={styles.participantsText}>12 joined</ThemedText>
            <View style={styles.participantAvatars}>
              <View style={[styles.avatar, { backgroundColor: "#FF6B35" }]} />
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: "#4ECDC4", marginLeft: -8 },
                ]}
              />
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: "#45B7D1", marginLeft: -8 },
                ]}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.discussionCard}>
          <View style={styles.discussionHeader}>
            <ThemedText style={styles.discussionBadge}>💬</ThemedText>
            <ThemedText style={styles.discussionTime}>3h ago</ThemedText>
          </View>
          <ThemedText style={styles.discussionTitle}>
            Share your cultural stories!
          </ThemedText>
          <ThemedText style={styles.discussionPreview}>
            &ldquo;My grandmother used to say this beautiful phrase in...&rdquo;
          </ThemedText>
          <View style={styles.discussionStats}>
            <ThemedText style={styles.discussionStat}>32 replies</ThemedText>
            <ThemedText style={styles.discussionStat}>•</ThemedText>
            <ThemedText style={styles.discussionStat}>18 hearts</ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.discussionCard}>
          <View style={styles.discussionHeader}>
            <ThemedText style={styles.discussionBadge}>🎯</ThemedText>
            <ThemedText style={styles.discussionTime}>1d ago</ThemedText>
          </View>
          <ThemedText style={styles.discussionTitle}>
            Weekly Challenge: Family Tree
          </ThemedText>
          <ThemedText style={styles.discussionPreview}>
            &ldquo;Learn 10 family relationship words and share a
            photo...&rdquo;
          </ThemedText>
          <View style={styles.discussionStats}>
            <ThemedText style={styles.discussionStat}>
              89 participants
            </ThemedText>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  communitySection: {
    margin: 20,
    marginTop: 0,
  },
  communitySectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  seeAllText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  communityScrollView: {
    marginHorizontal: -20,
  },
  communityScrollContent: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  liveClassCard: {
    width: 280,
    backgroundColor: "rgba(52, 199, 89, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(52, 199, 89, 0.2)",
  },
  liveClassHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  liveBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  liveClassTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  liveClassTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  liveClassTeacher: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  participantsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participantsText: {
    fontSize: 12,
    opacity: 0.6,
  },
  participantAvatars: {
    flexDirection: "row",
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
  },
  discussionCard: {
    width: 260,
    backgroundColor: "rgba(0, 122, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.1)",
  },
  discussionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  discussionBadge: {
    fontSize: 16,
  },
  discussionTime: {
    fontSize: 12,
    opacity: 0.5,
  },
  discussionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  discussionPreview: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 16,
    marginBottom: 8,
  },
  discussionStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  discussionStat: {
    fontSize: 11,
    opacity: 0.6,
    marginRight: 8,
  },
});
