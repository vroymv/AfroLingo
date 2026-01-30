import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  fetchTopActiveGroups,
  type TopActiveGroupRow,
} from "@/services/communityGroups";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface CommunitySectionProps {
  selectedLanguage: string | null;
  onNavigateToCommunity: () => void;
}

export default function CommunitySection({
  selectedLanguage,
  onNavigateToCommunity,
}: CommunitySectionProps) {
  const router = useRouter();
  const [groups, setGroups] = useState<TopActiveGroupRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getLanguageName = (language: string | null) => {
    if (!language) return "Language";
    return language.charAt(0).toUpperCase() + language.slice(1);
  };

  const filterLanguage = useMemo(() => {
    const value = selectedLanguage?.trim();
    return value && value.length >= 2 ? value : undefined;
  }, [selectedLanguage]);

  const formatTimeAgo = (iso: string | null) => {
    if (!iso) return "New";
    const timestamp = new Date(iso);
    if (Number.isNaN(timestamp.getTime())) return "New";
    const diffSeconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (diffSeconds < 60) return "Just now";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return `${Math.floor(diffSeconds / 86400)}d ago`;
  };

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetchTopActiveGroups({
      limit: 3,
      windowDays: 7,
      language: filterLanguage,
    })
      .then((result) => {
        if (cancelled) return;
        if (result.success) {
          setGroups(result.data);
        } else {
          setGroups([]);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setGroups([]);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filterLanguage]);

  return (
    <ThemedView style={styles.communitySection}>
      <View style={styles.communitySectionHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Communities
        </ThemedText>
        <TouchableOpacity
          onPress={() => {
            onNavigateToCommunity();
            router.push("/(tabs)/community/groups" as any);
          }}
        >
          <ThemedText style={styles.seeAllText}>See All</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.communityScrollView}
        contentContainerStyle={styles.communityScrollContent}
      >
        {isLoading ? (
          <View style={styles.discussionCard}>
            <View style={styles.discussionHeader}>
              <ThemedText style={styles.discussionBadge}>👥</ThemedText>
              <ThemedText style={styles.discussionTime}>Loading…</ThemedText>
            </View>
            <ThemedText style={styles.discussionTitle}>
              Top {getLanguageName(selectedLanguage)} communities
            </ThemedText>
            <ThemedText style={styles.discussionPreview}>
              Fetching active groups from the community feed…
            </ThemedText>
          </View>
        ) : groups.length === 0 ? (
          <View style={styles.discussionCard}>
            <View style={styles.discussionHeader}>
              <ThemedText style={styles.discussionBadge}>👥</ThemedText>
              <ThemedText style={styles.discussionTime}>
                No activity yet
              </ThemedText>
            </View>
            <ThemedText style={styles.discussionTitle}>
              No active communities found
            </ThemedText>
            <ThemedText style={styles.discussionPreview}>
              Be the first to start a conversation.
            </ThemedText>
          </View>
        ) : (
          groups.map((g) => (
            <TouchableOpacity
              key={g.id}
              style={styles.discussionCard}
              onPress={() =>
                router.push({
                  pathname: "/community/groups/[groupId]" as any,
                  params: { groupId: g.id },
                })
              }
            >
              <View style={styles.discussionHeader}>
                <ThemedText style={styles.discussionBadge}>👥</ThemedText>
                <ThemedText style={styles.discussionTime}>
                  {formatTimeAgo(g.lastMessageAt)}
                </ThemedText>
              </View>
              <ThemedText style={styles.discussionTitle}>{g.name}</ThemedText>
              <ThemedText style={styles.discussionPreview}>
                {g.description ||
                  `Join the ${g.name} community and start chatting.`}
              </ThemedText>
              <View style={styles.discussionStats}>
                <ThemedText style={styles.discussionStat}>
                  {g.messageCount} messages
                </ThemedText>
                <ThemedText style={styles.discussionStat}>•</ThemedText>
                <ThemedText style={styles.discussionStat}>
                  {g.memberCount ?? 0} members
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))
        )}
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
