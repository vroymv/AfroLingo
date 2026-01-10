import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchCommunityFeed,
  toggleCommunityPostLike,
  fetchCommunityPostComments,
  createCommunityPostComment,
  type FeedComment,
  type FeedPost,
} from "@/services/communityFeed";
import { FeedHeader } from "@/components/community/feed/FeedHeader";
import { CommunityPostCard } from "@/components/community/feed/CommunityPostCard";
import { FeedEmptyState } from "@/components/community/feed/FeedEmptyState";
import { FeedFooter } from "@/components/community/feed/FeedFooter";
import { CreatePostModal } from "@/components/community/feed/CreatePostModal";
import {
  StyleSheet,
  ScrollView,
  FlatList,
  View,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import type { CommunityPost as Post } from "@/types/communityFeed";
import { Colors } from "@/constants/Colors";

export default function CommunityIndex() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const tabBarHeight = useBottomTabBarHeight();

  const PAGE_SIZE = 20;

  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const listRef = React.useRef<FlatList<Post>>(null);
  const endReachedDuringMomentumRef = React.useRef(false);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [draftComment, setDraftComment] = useState("");
  const [isCommentPosting, setIsCommentPosting] = useState(false);

  const mapFeedPostToPost = React.useCallback((p: FeedPost): Post => {
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
  }, []);

  const loadFeed = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    setLoadMoreError(null);

    const result = await fetchCommunityFeed({
      limit: PAGE_SIZE,
      viewerId: user?.id,
    });
    if (!result.success) {
      setPosts([]);
      setHasMore(false);
      setNextCursor(null);
      setLoadError(result.message);
      setIsLoading(false);
      return;
    }

    setPosts(result.data.posts.map(mapFeedPostToPost));
    setHasMore(result.data.pageInfo.hasMore);
    setNextCursor(result.data.pageInfo.nextCursor);
    setIsLoading(false);
  }, [PAGE_SIZE, mapFeedPostToPost, user?.id]);

  const refreshFeed = React.useCallback(async () => {
    setLoadError(null);
    setLoadMoreError(null);

    const result = await fetchCommunityFeed({
      limit: PAGE_SIZE,
      viewerId: user?.id,
    });

    if (!result.success) {
      if (posts.length === 0) {
        setLoadError(result.message);
      }
      return;
    }

    setPosts(result.data.posts.map(mapFeedPostToPost));
    setHasMore(result.data.pageInfo.hasMore);
    setNextCursor(result.data.pageInfo.nextCursor);
  }, [PAGE_SIZE, mapFeedPostToPost, posts.length, user?.id]);

  const loadMore = React.useCallback(async () => {
    if (isLoadingMore || isLoading || refreshing) return;
    if (!hasMore || !nextCursor) return;

    setIsLoadingMore(true);
    setLoadMoreError(null);

    const result = await fetchCommunityFeed({
      cursor: nextCursor,
      limit: PAGE_SIZE,
      viewerId: user?.id,
    });

    if (!result.success) {
      setLoadMoreError(result.message);
      setIsLoadingMore(false);
      return;
    }

    const mapped = result.data.posts.map(mapFeedPostToPost);
    setPosts((prev) => {
      if (mapped.length === 0) return prev;
      const seen = new Set(prev.map((p) => p.id));
      const unique = mapped.filter((p) => !seen.has(p.id));
      return unique.length > 0 ? [...prev, ...unique] : prev;
    });
    setHasMore(result.data.pageInfo.hasMore);
    setNextCursor(result.data.pageInfo.nextCursor);
    setIsLoadingMore(false);
  }, [
    PAGE_SIZE,
    hasMore,
    isLoading,
    isLoadingMore,
    mapFeedPostToPost,
    nextCursor,
    refreshing,
    user?.id,
  ]);

  React.useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshFeed().finally(() => setRefreshing(false));
  }, [refreshFeed]);

  const handleLike = React.useCallback(
    (postId: string) => {
      if (!user?.id) return;

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

      toggleCommunityPostLike({ postId, userId: user.id }).then((r) => {
        if (!r.success) {
          // Best-effort re-sync
          loadFeed();
          return;
        }
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
    },
    [loadFeed, user?.id]
  );

  const formatTimeAgo = React.useCallback((timestamp: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }, []);

  const loadComments = React.useCallback(async (postId: string) => {
    setCommentsError(null);
    setIsCommentsLoading(true);

    const result = await fetchCommunityPostComments({ postId, limit: 50 });
    if (!result.success) {
      setComments([]);
      setCommentsError(result.message);
      setIsCommentsLoading(false);
      return;
    }

    setComments(result.data.comments);
    setIsCommentsLoading(false);
  }, []);

  const openComments = React.useCallback(
    (post: Post) => {
      setActivePost(post);
      setDraftComment("");
      setIsCommentsModalVisible(true);
      loadComments(post.id);
    },
    [loadComments]
  );

  const closeComments = React.useCallback(() => {
    setIsCommentsModalVisible(false);
    setActivePost(null);
    setComments([]);
    setCommentsError(null);
    setDraftComment("");
    setIsCommentPosting(false);
  }, []);

  const submitComment = React.useCallback(async () => {
    if (!activePost) return;
    if (!user?.id) return;

    const body = draftComment.trim();
    if (!body) return;

    if (isCommentPosting) return;
    setIsCommentPosting(true);
    setCommentsError(null);

    const result = await createCommunityPostComment({
      postId: activePost.id,
      userId: user.id,
      body,
    });

    if (!result.success) {
      setCommentsError(result.message);
      setIsCommentPosting(false);
      return;
    }

    setComments((prev) => [result.data, ...prev]);
    setDraftComment("");

    // Best-effort local comment count bump
    setPosts((prev) =>
      prev.map((p) =>
        p.id === activePost.id ? { ...p, comments: p.comments + 1 } : p
      )
    );

    setIsCommentPosting(false);
  }, [activePost, draftComment, isCommentPosting, user?.id]);

  const renderPostItem = React.useCallback(
    ({ item: post }: { item: Post }) => (
      <CommunityPostCard
        post={post}
        onPressLike={() => handleLike(post.id)}
        onPressComment={() => openComments(post)}
      />
    ),
    [handleLike, openComments]
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        ref={listRef}
        style={styles.scrollView}
        contentContainerStyle={styles.feedContainer}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPostItem}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (endReachedDuringMomentumRef.current) return;
          endReachedDuringMomentumRef.current = true;
          loadMore();
        }}
        onMomentumScrollBegin={() => {
          endReachedDuringMomentumRef.current = false;
        }}
        ListHeaderComponent={<FeedHeader />}
        ListEmptyComponent={
          <FeedEmptyState
            isLoading={isLoading}
            loadError={loadError}
            isSignedIn={Boolean(user)}
            tintColor={colors.tint}
            onRetry={loadFeed}
          />
        }
        ListFooterComponent={
          posts.length > 0 ? (
            <FeedFooter
              isLoadingMore={isLoadingMore}
              loadMoreError={loadMoreError}
              hasMore={hasMore}
              tintColor={colors.tint}
              onRetry={loadMore}
            />
          ) : (
            <View style={styles.footerSpacer} />
          )
        }
      />

      {/* Comments Modal */}
      <Modal
        visible={isCommentsModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeComments}
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
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <ThemedText style={styles.modalTitle}>Comments</ThemedText>
                  {activePost ? (
                    <ThemedText
                      style={[styles.headerSubtitle, { marginTop: 2 }]}
                      numberOfLines={1}
                    >
                      {activePost.title}
                    </ThemedText>
                  ) : null}
                </View>
                <TouchableOpacity
                  onPress={closeComments}
                  style={styles.modalCloseButton}
                >
                  <ThemedText style={styles.modalCloseText}>✕</ThemedText>
                </TouchableOpacity>
              </View>

              {commentsError ? (
                <View style={styles.modalErrorBox}>
                  <ThemedText style={styles.modalErrorText}>
                    {commentsError}
                  </ThemedText>
                </View>
              ) : null}

              <View style={{ maxHeight: 320 }}>
                {isCommentsLoading ? (
                  <View style={styles.stateContainer}>
                    <ActivityIndicator />
                    <ThemedText style={styles.stateText}>
                      Loading comments…
                    </ThemedText>
                  </View>
                ) : comments.length === 0 ? (
                  <View style={styles.stateContainer}>
                    <ThemedText style={styles.stateTitle}>
                      No comments yet
                    </ThemedText>
                    <ThemedText style={styles.stateText}>
                      {user ? "Be the first to reply." : "Sign in to comment."}
                    </ThemedText>
                  </View>
                ) : (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {comments.map((c) => {
                      const userType =
                        c.author.userType === "NATIVE"
                          ? "native"
                          : c.author.userType === "TUTOR"
                          ? "tutor"
                          : "learner";

                      return (
                        <View
                          key={c.id}
                          style={{
                            paddingVertical: 10,
                            borderTopWidth: 1,
                            borderTopColor: colors.icon + "10",
                          }}
                        >
                          <View style={{ flexDirection: "row", gap: 10 }}>
                            <View
                              style={[
                                styles.avatarContainer,
                                { width: 36, height: 36, borderRadius: 18 },
                              ]}
                            >
                              <ThemedText
                                style={[styles.avatar, { fontSize: 18 }]}
                              >
                                {c.author.avatar ?? "👤"}
                              </ThemedText>
                            </View>
                            <View style={{ flex: 1 }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  gap: 8,
                                  alignItems: "center",
                                }}
                              >
                                <ThemedText
                                  style={[styles.authorName, { fontSize: 14 }]}
                                >
                                  {c.author.name}
                                </ThemedText>
                                <ThemedText style={styles.metaText}>
                                  {userType === "native"
                                    ? "🌟"
                                    : userType === "tutor"
                                    ? "👨‍🏫"
                                    : "🎓"}
                                </ThemedText>
                                <ThemedText style={styles.metaText}>
                                  {formatTimeAgo(new Date(c.createdAt))}
                                </ThemedText>
                              </View>
                              <ThemedText
                                style={[styles.postText, { marginTop: 4 }]}
                              >
                                {c.body}
                              </ThemedText>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                )}
              </View>

              <View style={[styles.modalSection, { marginTop: 12 }]}>
                <ThemedText style={styles.modalLabel}>Add a comment</ThemedText>
                <TextInput
                  value={draftComment}
                  onChangeText={setDraftComment}
                  placeholder={user ? "Write a comment…" : "Sign in to comment"}
                  placeholderTextColor={
                    colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                  }
                  editable={!!user && !isCommentPosting}
                  multiline
                  textAlignVertical="top"
                  style={[
                    styles.textArea,
                    {
                      minHeight: 80,
                      color: colors.text,
                      backgroundColor:
                        colorScheme === "dark" ? "#0B1220" : "#F9FAFB",
                      borderColor: colors.icon + "20",
                      opacity: user ? 1 : 0.7,
                    },
                  ]}
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => {
                    if (activePost) loadComments(activePost.id);
                  }}
                  disabled={!activePost || isCommentsLoading}
                  style={[
                    styles.secondaryButton,
                    {
                      backgroundColor:
                        colorScheme === "dark" ? "#1F2937" : "#E5E7EB",
                      opacity: !activePost || isCommentsLoading ? 0.6 : 1,
                    },
                  ]}
                >
                  <ThemedText style={styles.secondaryButtonText}>
                    Refresh
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={submitComment}
                  disabled={!user || !draftComment.trim() || isCommentPosting}
                  style={[
                    styles.primaryButton,
                    {
                      backgroundColor: colors.tint,
                      opacity:
                        !user || !draftComment.trim() || isCommentPosting
                          ? 0.5
                          : 1,
                    },
                  ]}
                >
                  <View style={styles.primaryButtonInner}>
                    {isCommentPosting ? (
                      <ActivityIndicator
                        size="small"
                        color={colorScheme === "dark" ? "#111827" : "#FFFFFF"}
                      />
                    ) : null}
                    <ThemedText style={styles.primaryButtonText}>
                      {isCommentPosting ? "Posting…" : "Post"}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <CreatePostModal
        visible={isCreateModalVisible}
        userId={user?.id}
        onClose={() => setIsCreateModalVisible(false)}
        onPostCreated={() => {
          listRef.current?.scrollToOffset({ offset: 0, animated: true });
          loadFeed();
        }}
      />

      {user ? (
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
          <ThemedText style={styles.fabIcon}>＋</ThemedText>
        </TouchableOpacity>
      ) : null}
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
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  feedContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
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
  authorName: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
  metaText: {
    fontSize: 13,
    opacity: 0.6,
  },
  postText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  footerSpacer: {
    height: 1,
  },
  stateContainer: {
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  stateText: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: "center",
    paddingHorizontal: 24,
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
  modalErrorBox: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    marginBottom: 4,
  },
  modalErrorText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#991B1B",
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
  primaryButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0B1220",
  },
});
