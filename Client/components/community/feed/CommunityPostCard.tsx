import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import React, { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import type { CommunityPost as Post } from "@/types/communityFeed";

type Props = {
  post: Post;
  onPressLike: () => void;
  onPressComment?: () => void;
};

function formatTimeAgo(timestamp: Date) {
  const now = new Date();
  const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function getCategoryColor(category: Post["category"], tint: string) {
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
      return tint;
  }
}

function getCategoryIcon(category: Post["category"]) {
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
}

export function CommunityPostCard({
  post,
  onPressLike,
  onPressComment,
}: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const cardBg = colorScheme === "dark" ? "#1F2937" : "#FFFFFF";
  const shadowColor = colorScheme === "dark" ? "#000" : "#000";
  const tagBg = colorScheme === "dark" ? "#374151" : "#F3F4F6";

  const accent = getCategoryColor(post.category, colors.tint);

  const handleLikePress = useCallback(() => {
    onPressLike();
  }, [onPressLike]);

  return (
    <View style={[styles.postCard, { backgroundColor: cardBg, shadowColor }]}>
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <View style={styles.avatarContainer}>
            <ThemedText style={styles.avatar}>{post.author.avatar}</ThemedText>
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

      <View style={styles.categoryContainer}>
        <View
          style={[styles.categoryBadge, { backgroundColor: accent + "15" }]}
        >
          <ThemedText style={styles.categoryIcon}>
            {getCategoryIcon(post.category)}
          </ThemedText>
          <ThemedText style={[styles.categoryText, { color: accent }]}>
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.postContent}>
        <ThemedText style={styles.postTitle}>{post.title}</ThemedText>
        <ThemedText style={styles.postText}>{post.content}</ThemedText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tagsContainer}
      >
        {post.tags.map((tag, index) => (
          <View
            key={`${post.id}:tag:${index}`}
            style={[styles.tag, { backgroundColor: tagBg }]}
          >
            <ThemedText style={styles.tagText}>#{tag}</ThemedText>
          </View>
        ))}
      </ScrollView>

      <View style={styles.reactionsBar}>
        <View style={styles.reactionsList}>
          {Object.entries(post.reactions).map(([emoji, count]) => (
            <View
              key={`${post.id}:reaction:${emoji}`}
              style={styles.reactionItem}
            >
              <ThemedText style={styles.reactionEmoji}>{emoji}</ThemedText>
              <ThemedText style={styles.reactionCount}>{count}</ThemedText>
            </View>
          ))}
        </View>
        <ThemedText style={styles.commentsCount}>
          {post.comments} comments
        </ThemedText>
      </View>

      <View style={styles.actionsBar}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLikePress}>
          <ThemedText
            style={[styles.actionIcon, post.isLiked && { fontSize: 22 }]}
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

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onPressComment}
          disabled={!onPressComment}
        >
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
  );
}

const styles = StyleSheet.create({
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
});
