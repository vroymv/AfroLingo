import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchCommunityFeed,
  createCommunityPost,
  toggleCommunityPostLike,
  type FeedPost,
} from "@/services/communityFeed";
import {
  StyleSheet,
  ScrollView,
  View,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
} from "react-native";
import { mockPosts, Post, mockUsers } from "@/data/community";
import { Colors } from "@/constants/Colors";

export default function CommunityIndex() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const tabBarHeight = useBottomTabBarHeight();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [draftTags, setDraftTags] = useState("");
  const [draftCategory, setDraftCategory] =
    useState<Post["category"]>("discussion");

  const currentUser = user
    ? {
        id: user.id,
        name: user.name,
        avatar: user.avatar ?? "👤",
        userType: "learner" as const,
        languages: [],
        xp: 0,
        badges: [],
      }
    : mockUsers[0];

  const loadFeed = React.useCallback(async () => {
    const result = await fetchCommunityFeed({
      limit: 20,
      viewerId: user?.id,
    });
    if (!result.success) {
      return;
    }

    const mapped: Post[] = result.data.posts.map((p: FeedPost) => {
      const userType =
        p.author.userType === "NATIVE"
          ? "native"
          : p.author.userType === "TUTOR"
          ? "tutor"
          : "learner";

      const category =
        p.category === "DISCUSSION"
          ? "discussion"
          : p.category === "QUESTION"
          ? "question"
          : p.category === "CULTURAL"
          ? "cultural"
          : "pronunciation";

      return {
        id: p.id,
        title: p.title,
        content: p.content,
        author: {
          id: p.author.id,
          name: p.author.name,
          avatar: p.author.avatar ?? "👤",
          userType,
          country: p.author.countryCode ?? undefined,
          languages: p.author.languages,
          xp: 0,
          badges: [],
        },
        tags: p.tags,
        timestamp: new Date(p.createdAt),
        likes: p.counts.likes,
        comments: p.counts.comments,
        isLiked: p.isLiked,
        language: p.language ?? "General",
        category,
        reactions: p.reactions,
        trending: p.isTrending,
      };
    });

    setPosts(mapped);
  }, [user?.id]);

  React.useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadFeed().finally(() => setRefreshing(false));
  }, [loadFeed]);

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

    if (user?.id) {
      toggleCommunityPostLike({ postId, userId: user.id }).then((r) => {
        if (!r.success) return;
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  isLiked: r.data.isLiked,
                  likes: r.data.likes,
                }
              : p
          )
        );
      });
    }
  };

  const resetDraft = () => {
    setDraftTitle("");
    setDraftContent("");
    setDraftTags("");
    setDraftCategory("discussion");
  };

  const parseTags = (raw: string) => {
    const cleaned = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 6);

    // De-dupe while preserving order
    return Array.from(new Set(cleaned));
  };

  const createPost = () => {
    const title = draftTitle.trim();
    const content = draftContent.trim();
    if (!title || !content) return;

    const now = new Date();
    const newPost: Post = {
      id: `local-${now.getTime()}`,
      title,
      content,
      author: currentUser,
      tags: parseTags(draftTags),
      timestamp: now,
      likes: 0,
      comments: 0,
      isLiked: false,
      language: "General",
      category: draftCategory,
      reactions: { "👍": 0 },
      trending: false,
    };

    // If logged in, persist to server; otherwise fallback to local-only.
    if (user?.id) {
      const apiCategory =
        draftCategory === "discussion"
          ? "DISCUSSION"
          : draftCategory === "question"
          ? "QUESTION"
          : draftCategory === "cultural"
          ? "CULTURAL"
          : "PRONUNCIATION";

      createCommunityPost({
        userId: user.id,
        title,
        content,
        category: apiCategory,
        tags: parseTags(draftTags),
        language: "General",
      })
        .then(() => loadFeed())
        .finally(() => {
          setIsCreateModalVisible(false);
          resetDraft();
        });
      return;
    }

    setPosts((prev) => [newPost, ...prev]);
    setIsCreateModalVisible(false);
    resetDraft();
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

      {/* Create Post Modal */}
      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setIsCreateModalVisible(false);
        }}
      >
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalContainer}
          >
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor:
                    colorScheme === "dark" ? "#111827" : "#FFFFFF",
                  borderColor: colors.icon + "20",
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>Create a post</ThemedText>
                <TouchableOpacity
                  onPress={() => {
                    setIsCreateModalVisible(false);
                  }}
                  style={styles.modalCloseButton}
                >
                  <ThemedText style={styles.modalCloseText}>✕</ThemedText>
                </TouchableOpacity>
              </View>

              <View style={styles.modalSection}>
                <ThemedText style={styles.modalLabel}>Category</ThemedText>
                <View style={styles.categoryPickerRow}>
                  {(
                    [
                      "discussion",
                      "question",
                      "cultural",
                      "pronunciation",
                    ] as const
                  ).map((cat) => {
                    const isActive = draftCategory === cat;
                    const accent = getCategoryColor(cat);
                    return (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setDraftCategory(cat)}
                        style={[
                          styles.categoryChip,
                          {
                            backgroundColor: isActive
                              ? accent + "22"
                              : colorScheme === "dark"
                              ? "#1F2937"
                              : "#F3F4F6",
                            borderColor: isActive ? accent : "transparent",
                          },
                        ]}
                      >
                        <ThemedText style={styles.categoryChipIcon}>
                          {getCategoryIcon(cat)}
                        </ThemedText>
                        <ThemedText
                          style={[
                            styles.categoryChipText,
                            isActive && { color: accent, fontWeight: "700" },
                          ]}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </ThemedText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.modalSection}>
                <ThemedText style={styles.modalLabel}>Title</ThemedText>
                <TextInput
                  value={draftTitle}
                  onChangeText={setDraftTitle}
                  placeholder="What are you learning today?"
                  placeholderTextColor={
                    colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                  }
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      backgroundColor:
                        colorScheme === "dark" ? "#0B1220" : "#F9FAFB",
                      borderColor: colors.icon + "20",
                    },
                  ]}
                />
              </View>

              <View style={styles.modalSection}>
                <ThemedText style={styles.modalLabel}>Content</ThemedText>
                <TextInput
                  value={draftContent}
                  onChangeText={setDraftContent}
                  placeholder="Share your question, tip, or story…"
                  placeholderTextColor={
                    colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                  }
                  multiline
                  textAlignVertical="top"
                  style={[
                    styles.textArea,
                    {
                      color: colors.text,
                      backgroundColor:
                        colorScheme === "dark" ? "#0B1220" : "#F9FAFB",
                      borderColor: colors.icon + "20",
                    },
                  ]}
                />
              </View>

              <View style={styles.modalSection}>
                <ThemedText style={styles.modalLabel}>Tags</ThemedText>
                <TextInput
                  value={draftTags}
                  onChangeText={setDraftTags}
                  placeholder="Comma-separated (e.g. Yoruba, Beginner)"
                  placeholderTextColor={
                    colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                  }
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      backgroundColor:
                        colorScheme === "dark" ? "#0B1220" : "#F9FAFB",
                      borderColor: colors.icon + "20",
                    },
                  ]}
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => {
                    setIsCreateModalVisible(false);
                    resetDraft();
                  }}
                  style={[
                    styles.secondaryButton,
                    {
                      backgroundColor:
                        colorScheme === "dark" ? "#1F2937" : "#E5E7EB",
                    },
                  ]}
                >
                  <ThemedText style={styles.secondaryButtonText}>
                    Cancel
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={createPost}
                  disabled={!draftTitle.trim() || !draftContent.trim()}
                  style={[
                    styles.primaryButton,
                    {
                      backgroundColor: colors.tint,
                      opacity:
                        !draftTitle.trim() || !draftContent.trim() ? 0.5 : 1,
                    },
                  ]}
                >
                  <ThemedText style={styles.primaryButtonText}>Post</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: colors.tint,
            bottom: Math.max(20, tabBarHeight + 16),
          },
        ]}
        onPress={() => setIsCreateModalVisible(true)}
      >
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
    elevation: 12,
    zIndex: 50,
  },
  fabIcon: {
    fontSize: 24,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
  },
  modalCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: {
    fontSize: 18,
    opacity: 0.7,
  },
  modalSection: {
    marginTop: 10,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.75,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    minHeight: 110,
  },
  categoryPickerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  categoryChipIcon: {
    fontSize: 14,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.9,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    opacity: 0.9,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0B1220",
  },
});
