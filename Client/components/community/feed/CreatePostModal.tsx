import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { createCommunityPost } from "@/services/communityFeed";

type DraftCategory = "discussion" | "question" | "cultural" | "pronunciation";

type Props = {
  visible: boolean;
  userId: string | null | undefined;
  onClose: () => void;
  onPostCreated: () => void;
};

function parseTags(raw: string) {
  const cleaned = raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 6);

  return Array.from(new Set(cleaned));
}

function categoryToApi(cat: DraftCategory) {
  return cat === "discussion"
    ? "DISCUSSION"
    : cat === "question"
    ? "QUESTION"
    : cat === "cultural"
    ? "CULTURAL"
    : "PRONUNCIATION";
}

function getCategoryColor(category: DraftCategory) {
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
      return "#3B82F6";
  }
}

function getCategoryIcon(category: DraftCategory) {
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

export function CreatePostModal({
  visible,
  userId,
  onClose,
  onPostCreated,
}: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [draftTags, setDraftTags] = useState("");
  const [draftCategory, setDraftCategory] =
    useState<DraftCategory>("discussion");
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const canPost = useMemo(() => {
    return Boolean(
      userId && draftTitle.trim() && draftContent.trim() && !isPosting
    );
  }, [draftContent, draftTitle, isPosting, userId]);

  const resetDraft = () => {
    setDraftTitle("");
    setDraftContent("");
    setDraftTags("");
    setDraftCategory("discussion");
    setPostError(null);
  };

  const handleClose = () => {
    if (isPosting) return;
    onClose();
  };

  const submit = () => {
    if (!userId) return;

    const title = draftTitle.trim();
    const content = draftContent.trim();
    if (!title || !content) return;

    if (isPosting) return;
    setPostError(null);
    setIsPosting(true);

    createCommunityPost({
      userId,
      title,
      content,
      category: categoryToApi(draftCategory),
      tags: parseTags(draftTags),
      language: "General",
    })
      .then((result) => {
        if (!result.success) {
          setPostError(result.message);
          return;
        }

        onClose();
        resetDraft();
        onPostCreated();
      })
      .catch(() => {
        setPostError("Something went wrong while posting. Please try again.");
      })
      .finally(() => {
        setIsPosting(false);
      });
  };

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
              <ThemedText style={styles.modalTitle}>Create a post</ThemedText>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.modalCloseButton}
                disabled={isPosting}
              >
                <ThemedText style={styles.modalCloseText}>✕</ThemedText>
              </TouchableOpacity>
            </View>

            {postError ? (
              <View style={styles.modalErrorBox}>
                <ThemedText style={styles.modalErrorText}>
                  {postError}
                </ThemedText>
              </View>
            ) : null}

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
                      activeOpacity={0.85}
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
                  if (isPosting) return;
                  onClose();
                  resetDraft();
                }}
                disabled={isPosting}
                activeOpacity={0.85}
                style={[
                  styles.secondaryButton,
                  {
                    backgroundColor:
                      colorScheme === "dark" ? "#1F2937" : "#E5E7EB",
                    opacity: isPosting ? 0.6 : 1,
                  },
                ]}
              >
                <ThemedText style={styles.secondaryButtonText}>
                  Cancel
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
