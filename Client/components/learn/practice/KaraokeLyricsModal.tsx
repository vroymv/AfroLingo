import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import {
  getActiveKaraokeExercise,
  getKaraokeExercise,
  type KaraokeExercise,
  type KaraokeLine,
  type KaraokeWord,
} from "@/services/karaoke";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

function flattenWords(lines: KaraokeLine[]) {
  const flat: (KaraokeWord & { flatIndex: number; lineIndex: number })[] = [];
  let flatIndex = 0;
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    for (const word of lines[lineIndex].words) {
      flat.push({ ...word, flatIndex, lineIndex });
      flatIndex += 1;
    }
  }
  return flat;
}

function findActiveWordIndex(words: KaraokeWord[], positionMs: number): number {
  // Linear scan is fine for short clips (10s) + small word counts.
  for (let i = 0; i < words.length; i += 1) {
    const w = words[i];
    if (positionMs >= w.startMs && positionMs < w.endMs) return i;
  }
  return -1;
}

export function KaraokeLyricsModal({
  visible,
  onClose,
  exerciseId,
}: {
  visible: boolean;
  onClose: () => void;
  exerciseId?: string | null;
}) {
  const colorScheme = useColorScheme() ?? "light";

  const [exercise, setExercise] = useState<KaraokeExercise | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const lines: KaraokeLine[] = useMemo(
    () => exercise?.transcript?.lines ?? [],
    [exercise]
  );

  const flatWords = useMemo(() => flattenWords(lines), [lines]);
  const justWords = useMemo(
    () =>
      flatWords.map(({ text, startMs, endMs }) => ({ text, startMs, endMs })),
    [flatWords]
  );

  const [isReady, setIsReady] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>("");

  const player = useAudioPlayer(audioUrl || "");
  const status = useAudioPlayerStatus(player);

  const isPlaying = Boolean(status.playing);
  const positionMs = status.currentTime ? status.currentTime * 1000 : 0;
  const durationMs = status.duration ? status.duration * 1000 : 1;

  const jump = useRef(new Animated.Value(0)).current;

  const activeIndex = useMemo(
    () => findActiveWordIndex(justWords, positionMs),
    [justWords, positionMs]
  );

  const activeTokenKey = activeIndex >= 0 ? `${activeIndex}` : "-1";

  useEffect(() => {
    if (!visible) return;

    let canceled = false;

    setLoading(true);
    setLoadError(null);
    setIsReady(false);
    setExercise(null);
    setAudioUrl("");

    (async () => {
      const result = exerciseId
        ? await getKaraokeExercise(exerciseId)
        : await getActiveKaraokeExercise();
      if (canceled) return;

      if (!result.success || !result.data) {
        setLoadError(result.message || "Failed to load karaoke exercise");
        setLoading(false);
        return;
      }

      if (!result.data.audioClipUrl) {
        setLoadError("Karaoke exercise is missing audio");
        setLoading(false);
        return;
      }

      setExercise(result.data);
      setAudioUrl(result.data.audioClipUrl);
      setIsReady(true);
      setLoading(false);
    })().catch((e) => {
      if (canceled) return;
      setLoadError(e?.message || "Failed to load karaoke exercise");
      setLoading(false);
    });

    return () => {
      canceled = true;
    };
  }, [exerciseId, visible]);

  useEffect(() => {
    if (!visible) return;
    if (!audioUrl) return;

    try {
      player.replace(audioUrl);
      player.pause();
    } catch {
      // ignore
    }
  }, [audioUrl, player, visible]);

  useEffect(() => {
    // When the modal closes, stop + unload.
    if (visible) return;

    setIsReady(false);
    setAudioUrl("");
    setExercise(null);
    setLoading(false);
    setLoadError(null);

    try {
      player.pause();
      player.replace("");
    } catch {
      // ignore
    }
  }, [player, visible]);

  useEffect(() => {
    if (!visible) return;
    if (activeIndex < 0) return;

    jump.setValue(0);
    Animated.sequence([
      Animated.timing(jump, {
        toValue: -10,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(jump, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTokenKey, activeIndex, jump, visible]);

  const handleTogglePlay = async () => {
    try {
      if (!isReady) return;
      if (!audioUrl) return;

      if (isPlaying) {
        player.pause();
      } else {
        // Ensure the right clip is loaded before playing.
        player.replace(audioUrl);
        player.play();
      }
    } catch (e) {
      console.error("Failed to toggle playback", e);
    }
  };

  const handleClose = async () => {
    try {
      player.pause();
      player.replace("");
    } catch {
      // ignore
    }
    onClose();
  };

  const progress = durationMs > 0 ? positionMs / durationMs : 0;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <LinearGradient
        colors={
          colorScheme === "dark"
            ? ["#1a1a2e", "#16213e", "#0f3460"]
            : ["#667eea", "#764ba2", "#f093fb"]
        }
        style={styles.gradientContainer}
      >
        {/* Close button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Close karaoke"
            style={styles.closeButtonTop}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.closeIcon}>✕</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Title area */}
        <View style={styles.titleContainer}>
          <ThemedText style={styles.emoji}>🎵</ThemedText>
          <ThemedText style={styles.trackTitle}>
            {exercise?.title ?? "Karaoke Lyrics"}
          </ThemedText>
          {exercise?.subtitle ? (
            <ThemedText style={styles.trackSubtitle}>
              {exercise.subtitle}
            </ThemedText>
          ) : null}
        </View>

        {/* Lyrics display - centered and large */}
        <View style={styles.lyricsContainer}>
          <View style={styles.lyricsScrollArea}>
            {loading ? (
              <ThemedText style={styles.trackSubtitle}>Loading…</ThemedText>
            ) : loadError ? (
              <ThemedText style={styles.trackSubtitle}>{loadError}</ThemedText>
            ) : lines.length === 0 ? (
              <ThemedText style={styles.trackSubtitle}>
                No lyrics available.
              </ThemedText>
            ) : (
              lines.map((line, lineIndex) => {
                const priorWordCount = lines
                  .slice(0, lineIndex)
                  .reduce((sum, l) => sum + l.words.length, 0);

                return (
                  <View key={`line-${lineIndex}`} style={styles.lyricsLine}>
                    {line.words.map((word, wordIndex) => {
                      const flatIndex = priorWordCount + wordIndex;
                      const isActive = flatIndex === activeIndex;

                      return (
                        <Animated.Text
                          key={`w-${lineIndex}-${wordIndex}`}
                          style={[
                            styles.lyricWord,
                            isActive && {
                              color: "#FFD700",
                              fontWeight: "700",
                              textShadowColor: "rgba(255, 215, 0, 0.5)",
                              textShadowOffset: { width: 0, height: 0 },
                              textShadowRadius: 12,
                              transform: [
                                { translateY: jump },
                                { scale: 1.15 },
                              ],
                            },
                          ]}
                        >
                          {word.text + " "}
                        </Animated.Text>
                      );
                    })}
                  </View>
                );
              })
            )}
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
          <View style={styles.timeRow}>
            <ThemedText style={styles.timeLabel}>
              {Math.floor(positionMs / 1000)}s
            </ThemedText>
            <ThemedText style={styles.timeLabel}>
              {Math.floor(durationMs / 1000)}s
            </ThemedText>
          </View>
        </View>

        {/* Play/Pause button */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            onPress={handleTogglePlay}
            disabled={!isReady}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? "Pause audio" : "Play audio"}
            style={[
              styles.playButtonLarge,
              !isReady && styles.playButtonDisabled,
            ]}
            activeOpacity={0.85}
          >
            <ThemedText style={styles.playIcon}>
              {isPlaying ? "⏸" : "▶"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  topBar: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  closeButtonTop: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 6,
  },
  trackSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  lyricsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  lyricsScrollArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  lyricsLine: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 24,
    paddingHorizontal: 10,
    gap: 8,
  },
  lyricWord: {
    fontSize: 28,
    lineHeight: 48,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
    textAlign: "center",
    marginHorizontal: 4,
  },
  progressContainer: {
    marginTop: 20,
    marginBottom: 24,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timeLabel: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
  },
  controlsContainer: {
    alignItems: "center",
  },
  playButtonLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonDisabled: {
    opacity: 0.5,
  },
  playIcon: {
    fontSize: 32,
    color: "#667eea",
  },
});
