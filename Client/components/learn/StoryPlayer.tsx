import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { Story } from "@/data/stories";
import { useAuth } from "@/contexts/AuthContext";
import { markStoryComplete } from "@/services/stories";

type DialogueStoryPlayerProps = {
  story: Story;
  visible: boolean;
  onClose: () => void;
  onMarkedComplete?: (storyId: string) => void;
};

const DialogueStoryPlayer: React.FC<DialogueStoryPlayerProps> = ({
  story,
  visible,
  onClose,
  onMarkedComplete,
}) => {
  const { user } = useAuth();
  const [showTranslations, setShowTranslations] = useState<{
    [key: string]: boolean;
  }>({});
  const [playingSegmentId, setPlayingSegmentId] = useState<string | null>(null);
  const [currentAudioSource, setCurrentAudioSource] = useState<string | null>(
    null
  );
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [queueIndex, setQueueIndex] = useState(0);
  const lastAdvancedForSegmentIdRef = useRef<string | null>(null);

  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [localIsCompleted, setLocalIsCompleted] = useState<boolean>(
    Boolean(story.isCompleted)
  );

  const player = useAudioPlayer(currentAudioSource || "");
  const status = useAudioPlayerStatus(player);

  const toggleTranslation = (segmentId: string) => {
    setShowTranslations((prev) => ({
      ...prev,
      [segmentId]: !prev[segmentId],
    }));
  };

  // Get unique speakers to assign consistent sides
  const speakers = Array.from(
    new Set(story.segments.map((s) => s.speaker).filter(Boolean))
  );

  const getSpeakerSide = (speaker?: string): "left" | "right" => {
    if (!speaker) return "left";
    const index = speakers.indexOf(speaker);
    return index % 2 === 0 ? "left" : "right";
  };

  const getSpeakerColor = (speaker?: string): string => {
    if (!speaker) return "#4A90E2";
    const index = speakers.indexOf(speaker);
    const colors = ["#4A90E2", "#10B981", "#8B5CF6", "#F59E0B"];
    return colors[index % colors.length];
  };

  const audioQueue = useMemo(() => {
    return story.segments
      .filter((s) => Boolean(s.audio))
      .map((s) => ({ id: s.id, audio: s.audio as string }));
  }, [story.segments]);

  const stopAllAudio = useCallback(() => {
    try {
      player.pause();
    } catch {
      // ignore
    }
    setIsPlayingAll(false);
    setPlayingSegmentId(null);
    setCurrentAudioSource(null);
    setQueueIndex(0);
    lastAdvancedForSegmentIdRef.current = null;
  }, [player]);

  const playFullDialogue = useCallback(() => {
    if (audioQueue.length === 0) return;

    // Toggle: if currently playing the full queue, pause/stop.
    if (isPlayingAll && status.playing) {
      stopAllAudio();
      return;
    }

    setIsPlayingAll(true);
    setQueueIndex(0);
    lastAdvancedForSegmentIdRef.current = null;

    const first = audioQueue[0];
    setCurrentAudioSource(first.audio);
    player.replace(first.audio);
    player.play();
    setPlayingSegmentId(first.id);
  }, [audioQueue, isPlayingAll, player, status.playing, stopAllAudio]);

  const advanceQueue = useCallback(() => {
    const nextIndex = queueIndex + 1;
    if (nextIndex >= audioQueue.length) {
      stopAllAudio();
      return;
    }

    const next = audioQueue[nextIndex];
    setQueueIndex(nextIndex);
    setCurrentAudioSource(next.audio);
    player.replace(next.audio);
    player.play();
    setPlayingSegmentId(next.id);
  }, [audioQueue, player, queueIndex, stopAllAudio]);

  useEffect(() => {
    if (!isPlayingAll) return;
    if (audioQueue.length === 0) return;
    if (!playingSegmentId) return;

    const anyStatus = status as any;
    const didJustFinish =
      Boolean(anyStatus?.didJustFinish) ||
      Boolean(anyStatus?.didFinish) ||
      Boolean(anyStatus?.finished) ||
      Boolean(anyStatus?.ended);

    const nearEnd =
      typeof anyStatus?.positionMillis === "number" &&
      typeof anyStatus?.durationMillis === "number" &&
      anyStatus.durationMillis > 0 &&
      anyStatus.positionMillis >= anyStatus.durationMillis - 250;

    // Advance only once per segment completion.
    if (
      (didJustFinish || nearEnd) &&
      lastAdvancedForSegmentIdRef.current !== playingSegmentId
    ) {
      lastAdvancedForSegmentIdRef.current = playingSegmentId;
      advanceQueue();
    }
  }, [status, isPlayingAll, audioQueue, playingSegmentId, advanceQueue]);

  useEffect(() => {
    // If modal closes, ensure audio is stopped.
    if (!visible) {
      stopAllAudio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    setLocalIsCompleted(Boolean(story.isCompleted));
  }, [story.id, story.isCompleted]);

  const playAudio = (segmentId: string, audioUrl?: string) => {
    if (!audioUrl) return;

    try {
      if (isPlayingAll) {
        setIsPlayingAll(false);
        setQueueIndex(0);
        lastAdvancedForSegmentIdRef.current = null;
      }

      // If same audio is already playing, pause it
      if (currentAudioSource === audioUrl && status.playing) {
        player.pause();
        setPlayingSegmentId(null);
        return;
      }

      // Set the new audio source and play
      setCurrentAudioSource(audioUrl);
      player.replace(audioUrl);
      player.play();
      setPlayingSegmentId(segmentId);
    } catch (error) {
      console.error("Error playing audio:", error);
      setPlayingSegmentId(null);
    }
  };

  const handleClose = () => {
    stopAllAudio();
    onClose();
  };

  const handleMarkComplete = async () => {
    if (!user?.id) return;
    if (isMarkingComplete) return;

    try {
      setIsMarkingComplete(true);
      await markStoryComplete(story.id, user.id);
      setLocalIsCompleted(true);
      onMarkedComplete?.(story.id);
    } catch (e) {
      console.error("Failed to mark story complete:", e);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <ThemedView style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.cover}>{story.cover}</Text>
              <View style={styles.headerText}>
                <ThemedText type="title" style={styles.title}>
                  {story.title}
                </ThemedText>
                <ThemedText type="default" style={styles.description}>
                  {story.description}
                </ThemedText>

                <View style={styles.headerActionsRow}>
                  {localIsCompleted ? (
                    <View style={styles.completedPill}>
                      <Text style={styles.completedPillText}>Completed</Text>
                    </View>
                  ) : user?.id ? (
                    <TouchableOpacity
                      onPress={handleMarkComplete}
                      disabled={isMarkingComplete}
                      accessibilityRole="button"
                      accessibilityLabel="Mark story as complete"
                      style={styles.completeButton}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.completeButtonText}>
                        {isMarkingComplete ? "Saving..." : "Mark as complete"}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Close story"
              style={styles.closeButton}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {story.segments.map((segment) => {
              const side = getSpeakerSide(segment.speaker);
              const color = getSpeakerColor(segment.speaker);
              const isLeft = side === "left";

              return (
                <View
                  key={segment.id}
                  style={[
                    styles.messageContainer,
                    isLeft ? styles.messageLeft : styles.messageRight,
                  ]}
                >
                  {segment.speaker && (
                    <Text
                      style={[
                        styles.speaker,
                        isLeft ? styles.speakerLeft : styles.speakerRight,
                      ]}
                    >
                      {segment.speaker}
                    </Text>
                  )}

                  <View
                    style={[
                      styles.bubble,
                      isLeft
                        ? [styles.bubbleLeft, { backgroundColor: color }]
                        : styles.bubbleRight,
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => toggleTranslation(segment.id)}
                      style={styles.bubbleContent}
                    >
                      <View style={styles.messageRow}>
                        <Text
                          style={[
                            styles.messageText,
                            isLeft
                              ? styles.messageTextLeft
                              : styles.messageTextRight,
                          ]}
                        >
                          {segment.text}
                        </Text>
                        {segment.audio && (
                          <TouchableOpacity
                            onPress={() => playAudio(segment.id, segment.audio)}
                            style={[
                              styles.playButton,
                              isLeft
                                ? styles.playButtonLeft
                                : styles.playButtonRight,
                            ]}
                          >
                            <Text style={styles.playIcon}>
                              {playingSegmentId === segment.id && status.playing
                                ? "⏸"
                                : "▶️"}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      {showTranslations[segment.id] && (
                        <View style={styles.translationContainer}>
                          <Text
                            style={[
                              styles.translationText,
                              isLeft
                                ? styles.translationTextLeft
                                : styles.translationTextRight,
                            ]}
                          >
                            {segment.translation}
                          </Text>
                        </View>
                      )}

                      <View style={styles.tapHint}>
                        <Text
                          style={[
                            styles.tapHintText,
                            isLeft
                              ? styles.tapHintTextLeft
                              : styles.tapHintTextRight,
                          ]}
                        >
                          {showTranslations[segment.id]
                            ? "👁️ Hide"
                            : "Tap for translation"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            <View style={styles.bottomSpacer} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={playFullDialogue}
              disabled={audioQueue.length === 0}
              activeOpacity={0.8}
              style={[
                styles.playAllButton,
                audioQueue.length === 0 && styles.playAllButtonDisabled,
              ]}
            >
              <Text style={styles.playAllIcon}>
                {isPlayingAll && status.playing ? "⏸" : "▶️"}
              </Text>
              <Text style={styles.playAllText}>
                {isPlayingAll && status.playing
                  ? "Pause dialogue"
                  : "Play full dialogue"}
              </Text>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

export default DialogueStoryPlayer;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#F8F9FA",
    maxHeight: "88%",
    paddingTop: 12,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  cover: {
    fontSize: 40,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    color: "#1a1a1a",
  },
  description: {
    marginTop: 4,
    fontSize: 13,
    opacity: 0.7,
    color: "#1a1a1a",
  },
  headerActionsRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  completeButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  completeButtonText: {
    color: "#10B981",
    fontWeight: "800",
    fontSize: 12,
  },
  completedPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  completedPillText: {
    color: "#10B981",
    fontWeight: "800",
    fontSize: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74, 144, 226, 0.15)",
  },
  closeIcon: {
    fontSize: 16,
    color: "#4A90E2",
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 96,
    gap: 16,
  },
  messageContainer: {
    maxWidth: "80%",
  },
  messageLeft: {
    alignSelf: "flex-start",
  },
  messageRight: {
    alignSelf: "flex-end",
  },
  speaker: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
    opacity: 0.7,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  speakerLeft: {
    color: "#1a1a1a",
    marginLeft: 4,
  },
  speakerRight: {
    color: "#1a1a1a",
    marginRight: 4,
    textAlign: "right",
  },
  bubble: {
    borderRadius: 20,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleContent: {
    width: "100%",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  playButtonLeft: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  playButtonRight: {
    backgroundColor: "rgba(74, 144, 226, 0.1)",
  },
  playIcon: {
    fontSize: 14,
  },
  bubbleLeft: {
    borderTopLeftRadius: 4,
  },
  bubbleRight: {
    backgroundColor: "#fff",
    borderTopRightRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
  },
  messageText: {
    flexShrink: 1,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  messageTextLeft: {
    color: "#fff",
  },
  messageTextRight: {
    color: "#1a1a1a",
  },
  translationContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  translationText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
  },
  translationTextLeft: {
    color: "rgba(255, 255, 255, 0.9)",
    borderTopColor: "rgba(255, 255, 255, 0.3)",
  },
  translationTextRight: {
    color: "#374151",
    borderTopColor: "rgba(0, 0, 0, 0.08)",
  },
  tapHint: {
    marginTop: 8,
    alignItems: "center",
  },
  tapHintText: {
    fontSize: 11,
    fontWeight: "600",
  },
  tapHintTextLeft: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  tapHintTextRight: {
    color: "#9CA3AF",
  },
  bottomSpacer: {
    height: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.06)",
  },
  playAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "rgba(74, 144, 226, 0.15)",
  },
  playAllButtonDisabled: {
    opacity: 0.5,
  },
  playAllIcon: {
    fontSize: 16,
  },
  playAllText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
  },
});
