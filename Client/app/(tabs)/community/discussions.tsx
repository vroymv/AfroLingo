import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { mockPosts } from "@/data/community";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function DiscussionsScreen() {
  const trendingPosts = mockPosts.filter((post) => post.trending);
  const allPosts = mockPosts;

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title">Discussions 💬</ThemedText>
          <ThemedText type="subtitle">Connect with fellow learners</ThemedText>
        </ThemedView>

        {/* Trending Section */}
        {trendingPosts.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              🔥 Trending Now
            </ThemedText>
            {trendingPosts.map((post) => (
              <TouchableOpacity key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.authorInfo}>
                    <ThemedText style={styles.avatar}>
                      {post.author.avatar}
                    </ThemedText>
                    <View>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.authorName}
                      >
                        {post.author.name}
                      </ThemedText>
                      <ThemedText type="default" style={styles.timestamp}>
                        {getTimeAgo(post.timestamp)} •{" "}
                        {getUserTypeFlag(
                          post.author.userType,
                          post.author.country
                        )}
                      </ThemedText>
                    </View>
                  </View>
                  {post.trending && (
                    <View style={styles.trendingBadge}>
                      <ThemedText style={styles.trendingText}>🔥</ThemedText>
                    </View>
                  )}
                </View>

                <ThemedText type="defaultSemiBold" style={styles.postTitle}>
                  {post.title}
                </ThemedText>
                <ThemedText type="default" style={styles.postContent}>
                  {post.content}
                </ThemedText>

                {/* Tags */}
                <View style={styles.tagsContainer}>
                  {post.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <ThemedText style={styles.tagText}>{tag}</ThemedText>
                    </View>
                  ))}
                </View>

                {/* Reactions and Stats */}
                <View style={styles.postFooter}>
                  <View style={styles.reactions}>
                    {Object.entries(post.reactions).map(([emoji, count]) => (
                      <TouchableOpacity key={emoji} style={styles.reaction}>
                        <ThemedText style={styles.reactionEmoji}>
                          {emoji}
                        </ThemedText>
                        <ThemedText style={styles.reactionCount}>
                          {count}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.stats}>
                    <ThemedText style={styles.statText}>
                      💬 {post.comments} • 👍 {post.likes}
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ThemedView>
        )}

        {/* All Discussions */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            All Discussions
          </ThemedText>
          {allPosts.map((post) => (
            <TouchableOpacity key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.authorInfo}>
                  <ThemedText style={styles.avatar}>
                    {post.author.avatar}
                  </ThemedText>
                  <View>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.authorName}
                    >
                      {post.author.name}
                    </ThemedText>
                    <ThemedText type="default" style={styles.timestamp}>
                      {getTimeAgo(post.timestamp)} •{" "}
                      {getUserTypeFlag(
                        post.author.userType,
                        post.author.country
                      )}
                    </ThemedText>
                  </View>
                </View>
                {post.trending && (
                  <View style={styles.trendingBadge}>
                    <ThemedText style={styles.trendingText}>🔥</ThemedText>
                  </View>
                )}
              </View>

              <ThemedText type="defaultSemiBold" style={styles.postTitle}>
                {post.title}
              </ThemedText>
              <ThemedText type="default" style={styles.postContent}>
                {post.content}
              </ThemedText>

              {/* Tags */}
              <View style={styles.tagsContainer}>
                {post.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <ThemedText style={styles.tagText}>{tag}</ThemedText>
                  </View>
                ))}
              </View>

              {/* Reactions and Stats */}
              <View style={styles.postFooter}>
                <View style={styles.reactions}>
                  {Object.entries(post.reactions).map(([emoji, count]) => (
                    <TouchableOpacity key={emoji} style={styles.reaction}>
                      <ThemedText style={styles.reactionEmoji}>
                        {emoji}
                      </ThemedText>
                      <ThemedText style={styles.reactionCount}>
                        {count}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.stats}>
                  <ThemedText style={styles.statText}>
                    💬 {post.comments} • 👍 {post.likes}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <ThemedText style={styles.fabText}>✍️</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

function getTimeAgo(timestamp: Date): string {
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
}

function getUserTypeFlag(userType: string, country?: string): string {
  const countryFlags: { [key: string]: string } = {
    US: "🇺🇸",
    GH: "🇬🇭",
    KE: "🇰🇪",
    NG: "🇳🇬",
    ZA: "🇿🇦",
    SN: "🇸🇳",
  };

  const flag = country ? countryFlags[country] || "🌍" : "🌍";
  const typeEmoji =
    userType === "native" ? "🏠" : userType === "tutor" ? "🎓" : "📚";

  return `${flag} ${typeEmoji}`;
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  postCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    fontSize: 24,
    marginRight: 12,
  },
  authorName: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  trendingBadge: {
    backgroundColor: "rgba(255, 100, 50, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendingText: {
    fontSize: 14,
  },
  postTitle: {
    fontSize: 18,
    marginBottom: 8,
    lineHeight: 24,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
    opacity: 0.9,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: "rgba(0, 150, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    color: "#0096FF",
    fontWeight: "600",
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  reactions: {
    flexDirection: "row",
    gap: 12,
  },
  reaction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reactionEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 12,
    fontWeight: "600",
  },
  stats: {
    opacity: 0.7,
  },
  statText: {
    fontSize: 12,
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
