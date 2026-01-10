import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import {
  createCommunityPostComment,
  fetchCommunityPostComments,
  type FeedComment,
} from "@/services/communityFeed";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type PostRef = {
  id: string;
  title: string;
};

type Props = {
  visible: boolean;
  post: PostRef | null;
  userId: string | null | undefined;
  onClose: () => void;
  onCommentCreated?: (postId: string) => void;
};

function formatTimeAgo(timestamp: Date) {
  const now = new Date();
  const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function CommentsModal({
  visible,
  post,
  userId,
  onClose,
  onCommentCreated,
}: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [comments, setComments] = useState<FeedComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const canPost = useMemo(() => {
    return Boolean(userId && post && draft.trim() && !isPosting);
  }, [draft, isPosting, post, userId]);

  const loadComments = useCallback(async () => {
    if (!post) return;

    setError(null);
    setIsLoading(true);

    const result = await fetchCommunityPostComments({
      postId: post.id,
      limit: 50,
    });
    if (!result.success) {
      setComments([]);
      setError(result.message);
      setIsLoading(false);
      return;
    }

    setComments(result.data.comments);
    setIsLoading(false);
  }, [post]);

  useEffect(() => {
    if (!visible) return;
    if (!post) return;

    setDraft("");
    setIsPosting(false);
    setError(null);
    loadComments();
  }, [loadComments, post, visible]);

  const handleClose = useCallback(() => {
    if (isPosting) return;
    onClose();
  }, [isPosting, onClose]);

  const handleRefresh = useCallback(() => {
    if (!post || isLoading) return;
    loadComments();
  }, [isLoading, loadComments, post]);

  const submit = useCallback(async () => {
    if (!post) return;
    if (!userId) return;

    const body = draft.trim();
    if (!body) return;

    if (isPosting) return;
    setIsPosting(true);
    setError(null);

    const result = await createCommunityPostComment({
      postId: post.id,
      userId,
      body,
    });

    if (!result.success) {
      setError(result.message);
      setIsPosting(false);
      return;
    }

    setComments((prev) => [result.data, ...prev]);
    setDraft("");
    onCommentCreated?.(post.id);
    setIsPosting(false);
  }, [draft, isPosting, onCommentCreated, post, userId]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
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
                backgroundColor: colorScheme === "dark" ? "#111827" : "#FFFFFF",
                borderColor: colors.icon + "20",
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.headerTextContainer}>
                <ThemedText style={styles.modalTitle}>Comments</ThemedText>
                {post ? (
                  <ThemedText
                    style={[styles.subtitle, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {post.title}
                  </ThemedText>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.modalCloseButton}
                disabled={isPosting}
              >
                <ThemedText style={styles.modalCloseText}>✕</ThemedText>
              </TouchableOpacity>
            </View>

            {error ? (
              <View style={styles.modalErrorBox}>
                <ThemedText style={styles.modalErrorText}>{error}</ThemedText>
              </View>
            ) : null}

            <View style={styles.commentsContainer}>
              {isLoading ? (
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
                    {userId ? "Be the first to reply." : "Sign in to comment."}
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
                        style={[
                          styles.commentRow,
                          { borderTopColor: colors.icon + "10" },
                        ]}
                      >
                        <View style={styles.commentInnerRow}>
                          <View style={styles.avatarContainerSmall}>
                            <ThemedText style={styles.avatarSmall}>
                              {c.author.avatar ?? "👤"}
                            </ThemedText>
                          </View>

                          <View style={styles.commentBody}>
                            <View style={styles.commentMetaRow}>
                              <ThemedText style={styles.authorName}>
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

                            <ThemedText style={styles.commentText}>
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

            <View style={styles.modalSection}>
              <ThemedText style={styles.modalLabel}>Add a comment</ThemedText>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder={userId ? "Write a comment…" : "Sign in to comment"}
                placeholderTextColor={
                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                }
                editable={Boolean(userId) && !isPosting}
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
                    opacity: userId ? 1 : 0.7,
                  },
                ]}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleRefresh}
                disabled={!post || isLoading}
                activeOpacity={0.85}
                style={[
                  styles.secondaryButton,
                  {
                    backgroundColor:
                      colorScheme === "dark" ? "#1F2937" : "#E5E7EB",
                    opacity: !post || isLoading ? 0.6 : 1,
                  },
                ]}
              >
                <ThemedText style={styles.secondaryButtonText}>
                  Refresh
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={submit}
                disabled={!canPost}
                activeOpacity={0.85}
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor: colors.tint,
                    opacity: canPost ? 1 : 0.5,
                  },
                ]}
              >
                <View style={styles.primaryButtonInner}>
                  {isPosting ? (
                    <ActivityIndicator
                      size="small"
                      color={colorScheme === "dark" ? "#111827" : "#FFFFFF"}
                    />
                  ) : null}
                  <ThemedText style={styles.primaryButtonText}>
                    {isPosting ? "Posting…" : "Post"}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 14,
    opacity: 0.6,
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
  commentsContainer: {
    maxHeight: 320,
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
  commentRow: {
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  commentInnerRow: {
    flexDirection: "row",
    gap: 10,
  },
  avatarContainerSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarSmall: {
    fontSize: 18,
  },
  commentBody: {
    flex: 1,
  },
  commentMetaRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  authorName: {
    fontSize: 14,
    fontWeight: "700",
    marginRight: 4,
  },
  metaText: {
    fontSize: 13,
    opacity: 0.6,
  },
  commentText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
    marginTop: 4,
  },
  modalSection: {
    marginTop: 12,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.75,
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
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
