import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
} from "react-native";
import { mockPosts, Post } from "@/data/community";
import { Colors } from "@/constants/Colors";

export default function CommunityIndex() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate fetching new posts
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getCategoryColor = (category: Post["category"]) => {
    switch (category) {
      case "discussion":
        return "#3B82F6";
      case "question":
        return "#8B5CF6";
      case "cultural":
        return "#EC4899";
      case "pronunciation":
        return "#10B981";
      default:
        return colors.tint;
    }
  };

  const getCategoryIcon = (category: Post["category"]) => {
    switch (category) {
      case "discussion":
        return "💬";
      case "question":
        return "❓";
      case "cultural":
        return "🌍";
      case "pronunciation":
        return "🗣️";
      default:
        return "📝";
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.background,
              borderBottomColor: colors.icon + "20",
            },
          ]}
        >
          <ThemedText style={styles.headerTitle}>Community Feed</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Connect with learners worldwide
          </ThemedText>
        </View>

        {/* Feed Posts */}
        <View style={styles.feedContainer}>
          {posts.map((post) => (
            <View
              key={post.id}
              style={[
                styles.postCard,
                {
                  backgroundColor:
                    colorScheme === "dark" ? "#1F2937" : "#FFFFFF",
                  shadowColor: colorScheme === "dark" ? "#000" : "#000",
                },
              ]}
            >
              {/* Post Header */}
              <View style={styles.postHeader}>
                <View style={styles.authorInfo}>
                  <View style={styles.avatarContainer}>
                    <ThemedText style={styles.avatar}>
                      {post.author.avatar}
                    </ThemedText>
                  </View>
                  <View style={styles.authorDetails}>
                    <View style={styles.authorNameRow}>
                      <ThemedText style={styles.authorName}>
                        {post.author.name}
                      </ThemedText>
                      {post.trending && (
                        <View style={styles.trendingBadge}>
                          <ThemedText style={styles.trendingText}>
                            🔥 Trending
                          </ThemedText>
                        </View>
                      )}
                    </View>
                    <View style={styles.metaInfo}>
                      <ThemedText style={styles.metaText}>
                        {post.author.userType === "native"
                          ? "🌟 Native Speaker"
                          : post.author.userType === "tutor"
                          ? "👨‍🏫 Tutor"
                          : "🎓 Learner"}
                      </ThemedText>
                      <ThemedText style={styles.metaDot}>•</ThemedText>
                      <ThemedText style={styles.metaText}>
                        {formatTimeAgo(post.timestamp)}
                      </ThemedText>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <ThemedText style={styles.moreIcon}>⋯</ThemedText>
                </TouchableOpacity>
              </View>

              {/* Category Badge */}
              <View style={styles.categoryContainer}>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: getCategoryColor(post.category) + "15" },
                  ]}
                >
                  <ThemedText style={styles.categoryIcon}>
                    {getCategoryIcon(post.category)}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.categoryText,
                      { color: getCategoryColor(post.category) },
                    ]}
                  >
                    {post.category.charAt(0).toUpperCase() +
                      post.category.slice(1)}
                  </ThemedText>
                </View>
              </View>

              {/* Post Content */}
              <View style={styles.postContent}>
                <ThemedText style={styles.postTitle}>{post.title}</ThemedText>
                <ThemedText style={styles.postText}>{post.content}</ThemedText>
              </View>

              {/* Tags */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tagsContainer}
              >
                {post.tags.map((tag, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tag,
                      {
                        backgroundColor:
                          colorScheme === "dark" ? "#374151" : "#F3F4F6",
                      },
                    ]}
                  >
                    <ThemedText style={styles.tagText}>#{tag}</ThemedText>
                  </View>
                ))}
              </ScrollView>

              {/* Reactions Bar */}
              <View style={styles.reactionsBar}>
                <View style={styles.reactionsList}>
                  {Object.entries(post.reactions).map(([emoji, count]) => (
                    <View key={emoji} style={styles.reactionItem}>
                      <ThemedText style={styles.reactionEmoji}>
                        {emoji}
                      </ThemedText>
                      <ThemedText style={styles.reactionCount}>
                        {count}
                      </ThemedText>
                    </View>
                  ))}
                </View>
                <ThemedText style={styles.commentsCount}>
                  {post.comments} comments
                </ThemedText>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsBar}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLike(post.id)}
                >
                  <ThemedText
                    style={[
                      styles.actionIcon,
                      post.isLiked && { fontSize: 22 },
                    ]}
                  >
                    {post.isLiked ? "❤️" : "🤍"}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.actionText,
                      post.isLiked && { color: "#EF4444", fontWeight: "600" },
                    ]}
                  >
                    {post.likes}
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <ThemedText style={styles.actionIcon}>💬</ThemedText>
                  <ThemedText style={styles.actionText}>Comment</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <ThemedText style={styles.actionIcon}>🔗</ThemedText>
                  <ThemedText style={styles.actionText}>Share</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <ThemedText style={styles.actionIcon}>🔖</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Load More Indicator */}
        <View style={styles.loadMoreContainer}>
          <TouchableOpacity style={styles.loadMoreButton}>
            <ThemedText style={styles.loadMoreText}>Load More Posts</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.tint }]}>
        <ThemedText style={styles.fabIcon}>✏️</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  feedContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  postCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: "row",
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatar: {
    fontSize: 24,
  },
  authorDetails: {
    flex: 1,
    justifyContent: "center",
  },
  authorNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
  trendingBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendingText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#EF4444",
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 13,
    opacity: 0.6,
  },
  metaDot: {
    fontSize: 13,
    opacity: 0.6,
    marginHorizontal: 6,
  },
  moreButton: {
    padding: 4,
  },
  moreIcon: {
    fontSize: 24,
    opacity: 0.4,
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
  },
  postContent: {
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 24,
  },
  postText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  tagsContainer: {
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.7,
  },
  reactionsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB20",
    marginBottom: 8,
  },
  reactionsList: {
    flexDirection: "row",
    gap: 12,
  },
  reactionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.7,
  },
  commentsCount: {
    fontSize: 13,
    opacity: 0.6,
  },
  actionsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB20",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionIcon: {
    fontSize: 18,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
  },
  loadMoreContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadMoreButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
  },
});
