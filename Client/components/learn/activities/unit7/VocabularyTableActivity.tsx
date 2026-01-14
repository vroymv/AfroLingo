import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { Activity } from "@/data/lessons";
import { getUnit7ActivityByRef } from "@/data/unit7/colorsContent";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  useCompletionXP,
  useLessonProgressReporter,
} from "@/components/learn/activities/unit3/useLessonProgressXP";
import { DUMMY_AUDIO_URL, UNIT_7_THEME } from "./constants";

type Unit7VocabItem = {
  word: string;
  meaning: string;
  pronunciation: string;
  image?: string;
};

function colorForMeaning(meaning?: string): string {
  const m = String(meaning || "")
    .trim()
    .toLowerCase();
  switch (m) {
    case "red":
      return "#EF4444";
    case "blue":
      return "#3B82F6";
    case "green":
      return "#22C55E";
    case "yellow":
      return "#FACC15";
    case "orange":
      return "#FB923C";
    case "purple":
      return "#A855F7";
    case "pink":
      return "#EC4899";
    case "brown":
      return "#A16207";
    case "white":
      return "#F9FAFB";
    case "black":
      return "#111827";
    case "gray":
    case "grey":
      return "#6B7280";
    case "gold":
      return "#F59E0B";
    case "silver":
      return "#9CA3AF";
    default:
      return UNIT_7_THEME.primary;
  }
}

interface Props {
  activity: Activity & { contentRef?: string };
  onComplete: () => void;
}

export default function Unit7VocabularyTableActivity({
  activity,
  onComplete,
}: Props) {
  useLessonProgressReporter();
  const { award } = useCompletionXP(10, "unit7-vocab");

  const content = useMemo(
    () => getUnit7ActivityByRef(activity.contentRef || activity.id),
    [activity.contentRef, activity.id]
  );

  const merged = useMemo(() => {
    const question = activity.question || (content as any)?.question;
    const description = activity.description || (content as any)?.description;
    const rawItems = (content as any)?.items || (activity as any)?.items || [];

    const items: Unit7VocabItem[] = Array.isArray(rawItems)
      ? rawItems
          .map((it: any) => ({
            word: String(it?.word ?? "").trim(),
            meaning: String(it?.meaning ?? "").trim(),
            pronunciation: String(it?.pronunciation ?? "").trim(),
            image: typeof it?.image === "string" ? it.image : undefined,
          }))
          .filter((it: Unit7VocabItem) => it.word && it.meaning)
      : [];

    const hasAudio = Boolean(
      (content as any)?.audio || (activity as any)?.audio
    );

    return {
      question,
      description,
      items,
      audio: hasAudio ? DUMMY_AUDIO_URL : undefined,
    };
  }, [activity, content]);

  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const player = useAudioPlayer(DUMMY_AUDIO_URL);
  const status = useAudioPlayerStatus(player);

  const toggleRowAudio = (index: number) => {
    if (status.isBuffering) return;

    // All dummy audio, but keep UI responsive.
    if (status.playing && playingIndex === index) {
      player.pause();
      setPlayingIndex(null);
      return;
    }

    if (status.currentTime >= status.duration && status.duration > 0) {
      player.seekTo(0);
    }

    setPlayingIndex(index);
    player.play();
  };

  if (!merged.items.length) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Vocabulary content missing for this activity.</ThemedText>
        <TouchableOpacity style={styles.fallback} onPress={onComplete}>
          <ThemedText style={styles.fallbackText}>Continue</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons
              name="color-palette"
              size={22}
              color={UNIT_7_THEME.primary}
            />
          </View>
          <View style={styles.headerText}>
            <ThemedText type="title" style={styles.title}>
              {merged.question || "Vocabulary"}
            </ThemedText>
            {!!merged.description && (
              <ThemedText style={styles.subtitle}>
                {merged.description}
              </ThemedText>
            )}
          </View>
        </View>

        <View style={styles.list}>
          {merged.items.map((item, idx) => {
            const swatch = colorForMeaning(item.meaning);
            const isWhite = swatch.toLowerCase() === "#f9fafb";
            const isPlaying = status.playing && playingIndex === idx;

            return (
              <View key={`${item.word}-${idx}`} style={styles.card}>
                <View
                  style={[
                    styles.swatch,
                    { backgroundColor: swatch },
                    isWhite && styles.swatchWhite,
                  ]}
                />

                <View style={styles.cardText}>
                  <ThemedText style={styles.word}>{item.word}</ThemedText>
                  <ThemedText style={styles.meaning}>{item.meaning}</ThemedText>
                  {!!item.pronunciation && (
                    <ThemedText style={styles.pronunciation}>
                      [{item.pronunciation}]
                    </ThemedText>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.play,
                    isPlaying && styles.playActive,
                    status.isBuffering && styles.playDisabled,
                  ]}
                  onPress={() => toggleRowAudio(idx)}
                  activeOpacity={0.9}
                  disabled={status.isBuffering}
                >
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={18}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.cta}
        onPress={async () => {
          await award({
            screen: "Unit7VocabularyTableActivity",
            reason: "completed",
            contentRef: activity.contentRef,
          });
          onComplete();
        }}
        activeOpacity={0.9}
      >
        <ThemedText style={styles.ctaText}>Continue</ThemedText>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

export const componentKey = "unit7-vocabulary-table";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    justifyContent: "space-between",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 28,
    gap: 14,
  },
  header: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: UNIT_7_THEME.tint,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(233, 30, 99, 0.25)",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 2,
  },
  list: {
    gap: 12,
    marginTop: 6,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  swatchWhite: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardText: {
    flex: 1,
    gap: 2,
  },
  word: {
    fontSize: 16,
    fontWeight: "900",
  },
  meaning: {
    fontSize: 14,
    fontWeight: "700",
    opacity: 0.85,
  },
  pronunciation: {
    fontSize: 13,
    opacity: 0.65,
  },
  play: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: UNIT_7_THEME.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  playActive: {
    backgroundColor: UNIT_7_THEME.primaryDark,
  },
  playDisabled: {
    opacity: 0.7,
  },
  cta: {
    backgroundColor: UNIT_7_THEME.primary,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 18,
    shadowColor: UNIT_7_THEME.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
    gap: 12,
  },
  fallback: {
    backgroundColor: UNIT_7_THEME.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  fallbackText: {
    color: "white",
    fontWeight: "800",
  },
});
