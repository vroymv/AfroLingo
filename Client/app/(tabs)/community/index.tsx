import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchCommunityFeed,
  toggleCommunityPostLike,
  type FeedPost,
} from "@/services/communityFeed";
import { FeedHeader } from "@/components/community/feed/FeedHeader";
import { CommunityPostCard } from "@/components/community/feed/CommunityPostCard";
import { FeedEmptyState } from "@/components/community/feed/FeedEmptyState";
import { FeedFooter } from "@/components/community/feed/FeedFooter";
import { CreatePostModal } from "@/components/community/feed/CreatePostModal";
import { CommentsModal } from "@/components/community/feed/CommentsModal";
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  useColorScheme,
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

  const openComments = React.useCallback((post: Post) => {
    setActivePost(post);
    setIsCommentsModalVisible(true);
  }, []);

  const closeComments = React.useCallback(() => {
    setIsCommentsModalVisible(false);
    setActivePost(null);
  }, []);

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

      <CommentsModal
        visible={isCommentsModalVisible}
        post={
          activePost ? { id: activePost.id, title: activePost.title } : null
        }
        userId={user?.id}
        onClose={closeComments}
        onCommentCreated={(postId) => {
          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId ? { ...p, comments: p.comments + 1 } : p
            )
          );
        }}
      />

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
  feedContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  footerSpacer: {
    height: 1,
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
});
