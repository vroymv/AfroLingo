import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { mockPosts, mockUsers, type Comment } from "@/data/community";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [replyText, setReplyText] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const post = mockPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Post not found</ThemedText>
      </ThemedView>
    );
  }

  // Mock comments data
  const mockComments: Comment[] = [
    {
      id: "1",
      content:
        "This is so helpful! I've been struggling with the same issue. Native speakers always seem to make it look so easy 😅",
      author: mockUsers[1],
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      likes: 12,
      replies: [
        {
          id: "2",
          content:
            "Happy to help! The key is to practice little and often. Try recording yourself daily.",
          author: mockUsers[0],
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          likes: 8,
          replies: [],
          audioUrl: "https://example.com/audio1.mp3",
        },
      ],
    },
    {
      id: "3",
      content:
        "I found this YouTube channel really helpful for pronunciation: [YorubaWithAde]. They break down the tones really well.",
      author: mockUsers[2],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 18,
      replies: [],
    },
  ];

  const handleReply = (commentId?: string) => {
    setReplyingTo(commentId || null);
    setShowReplyModal(true);
  };

  const submitReply = () => {
    // Handle reply submission
    console.log("Reply:", replyText);
    setReplyText("");
    setShowReplyModal(false);
    setReplyingTo(null);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ThemedText style={styles.backIcon}>←</ThemedText>
          </TouchableOpacity>
          <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
            Discussion
          </ThemedText>
          <TouchableOpacity style={styles.shareButton}>
            <ThemedText style={styles.shareIcon}>📤</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Original Post */}
        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.authorInfo}>
              <ThemedText style={styles.avatar}>
                {post.author.avatar}
              </ThemedText>
              <View>
                <ThemedText type="defaultSemiBold" style={styles.authorName}>
                  {post.author.name}
                </ThemedText>
                <ThemedText type="default" style={styles.timestamp}>
                  {getTimeAgo(post.timestamp)} •{" "}
                  {getUserTypeFlag(post.author.userType, post.author.country)}
                </ThemedText>
              </View>
            </View>
            {post.trending && (
              <View style={styles.trendingBadge}>
                <ThemedText style={styles.trendingText}>🔥 Trending</ThemedText>
              </View>
            )}
          </View>

          <ThemedText type="title" style={styles.postTitle}>
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

          {/* Reactions */}
          <View style={styles.reactionsContainer}>
            <View style={styles.reactions}>
              {Object.entries(post.reactions).map(([emoji, count]) => (
                <TouchableOpacity key={emoji} style={styles.reaction}>
                  <ThemedText style={styles.reactionEmoji}>{emoji}</ThemedText>
                  <ThemedText style={styles.reactionCount}>{count}</ThemedText>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.addReaction}>
                <ThemedText style={styles.addReactionText}>😊</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleReply()}
            >
              <ThemedText style={styles.actionIcon}>💬</ThemedText>
              <ThemedText style={styles.actionText}>Reply</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <ThemedText style={styles.actionIcon}>🎤</ThemedText>
              <ThemedText style={styles.actionText}>Voice Reply</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <ThemedText style={styles.actionIcon}>📱</ThemedText>
              <ThemedText style={styles.actionText}>Video Reply</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <ThemedText type="defaultSemiBold" style={styles.commentsTitle}>
            {mockComments.length} Comments
          </ThemedText>

          {mockComments.map((comment) => (
            <View key={comment.id}>
              {/* Main Comment */}
              <View style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <ThemedText style={styles.commentAvatar}>
                    {comment.author.avatar}
                  </ThemedText>
                  <View style={styles.commentInfo}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.commentAuthor}
                    >
                      {comment.author.name}
                    </ThemedText>
                    <ThemedText style={styles.commentTimestamp}>
                      {getTimeAgo(comment.timestamp)} •{" "}
                      {getUserTypeFlag(
                        comment.author.userType,
                        comment.author.country
                      )}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText style={styles.commentContent}>
                  {comment.content}
                </ThemedText>

                {comment.audioUrl && (
                  <View style={styles.audioPlayer}>
                    <TouchableOpacity style={styles.playButton}>
                      <ThemedText style={styles.playIcon}>▶️</ThemedText>
                    </TouchableOpacity>
                    <View style={styles.audioWave}>
                      <ThemedText style={styles.audioText}>
                        Audio Reply • 0:45
                      </ThemedText>
                    </View>
                  </View>
                )}

                <View style={styles.commentActions}>
                  <TouchableOpacity style={styles.commentAction}>
                    <ThemedText style={styles.likeIcon}>👍</ThemedText>
                    <ThemedText style={styles.likeCount}>
                      {comment.likes}
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.commentAction}
                    onPress={() => handleReply(comment.id)}
                  >
                    <ThemedText style={styles.replyIcon}>↩️</ThemedText>
                    <ThemedText style={styles.replyText}>Reply</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Nested Replies */}
              {comment.replies.map((reply) => (
                <View key={reply.id} style={styles.replyCard}>
                  <View style={styles.commentHeader}>
                    <ThemedText style={styles.commentAvatar}>
                      {reply.author.avatar}
                    </ThemedText>
                    <View style={styles.commentInfo}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.commentAuthor}
                      >
                        {reply.author.name}
                      </ThemedText>
                      <ThemedText style={styles.commentTimestamp}>
                        {getTimeAgo(reply.timestamp)} •{" "}
                        {getUserTypeFlag(
                          reply.author.userType,
                          reply.author.country
                        )}
                      </ThemedText>
                    </View>
                  </View>

                  <ThemedText style={styles.commentContent}>
                    {reply.content}
                  </ThemedText>

                  {reply.audioUrl && (
                    <View style={styles.audioPlayer}>
                      <TouchableOpacity style={styles.playButton}>
                        <ThemedText style={styles.playIcon}>▶️</ThemedText>
                      </TouchableOpacity>
                      <View style={styles.audioWave}>
                        <ThemedText style={styles.audioText}>
                          Audio Reply • 0:32
                        </ThemedText>
                      </View>
                    </View>
                  )}

                  <View style={styles.commentActions}>
                    <TouchableOpacity style={styles.commentAction}>
                      <ThemedText style={styles.likeIcon}>👍</ThemedText>
                      <ThemedText style={styles.likeCount}>
                        {reply.likes}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Reply Modal */}
      <Modal
        visible={showReplyModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowReplyModal(false)}>
              <ThemedText style={styles.cancelText}>Cancel</ThemedText>
            </TouchableOpacity>
            <ThemedText type="defaultSemiBold">
              {replyingTo ? "Reply to Comment" : "Reply to Post"}
            </ThemedText>
            <TouchableOpacity onPress={submitReply}>
              <ThemedText style={styles.submitText}>Post</ThemedText>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.replyInput}
            placeholder="Share your thoughts..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={replyText}
            onChangeText={setReplyText}
            multiline
            autoFocus
          />

          <View style={styles.replyOptions}>
            <TouchableOpacity style={styles.replyOption}>
              <ThemedText style={styles.optionIcon}>🎤</ThemedText>
              <ThemedText style={styles.optionText}>Record Audio</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.replyOption}>
              <ThemedText style={styles.optionIcon}>📱</ThemedText>
              <ThemedText style={styles.optionText}>Record Video</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
  },
  shareButton: {
    padding: 8,
  },
  shareIcon: {
    fontSize: 20,
  },
  postCard: {
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    fontSize: 32,
    marginRight: 16,
  },
  authorName: {
    fontSize: 18,
  },
  timestamp: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  trendingBadge: {
    backgroundColor: "rgba(255, 100, 50, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  trendingText: {
    fontSize: 12,
    fontWeight: "600",
  },
  postTitle: {
    fontSize: 24,
    marginBottom: 16,
    lineHeight: 32,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
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
  reactionsContainer: {
    marginBottom: 20,
  },
  reactions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  reaction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reactionEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  reactionCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  addReaction: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addReactionText: {
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 150, 255, 0.1)",
    padding: 12,
    borderRadius: 12,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  commentsSection: {
    padding: 20,
  },
  commentsTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  commentCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 12,
  },
  replyCard: {
    marginLeft: 32,
    marginBottom: 12,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 12,
    borderLeftWidth: 2,
    borderLeftColor: "rgba(0, 150, 255, 0.3)",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  commentAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  commentInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 16,
  },
  commentTimestamp: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  commentContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  audioPlayer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 150, 255, 0.1)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  playButton: {
    marginRight: 12,
  },
  playIcon: {
    fontSize: 16,
  },
  audioWave: {
    flex: 1,
  },
  audioText: {
    fontSize: 14,
    color: "#0096FF",
  },
  commentActions: {
    flexDirection: "row",
    gap: 16,
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  likeCount: {
    fontSize: 12,
    fontWeight: "600",
  },
  replyIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  replyText: {
    fontSize: 12,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 20,
  },
  cancelText: {
    fontSize: 16,
    color: "#FF6B6B",
  },
  submitText: {
    fontSize: 16,
    color: "#0096FF",
    fontWeight: "600",
  },
  replyInput: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "white",
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  replyOptions: {
    flexDirection: "row",
    gap: 12,
  },
  replyOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 12,
  },
  optionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
