import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLessonRuntime } from "@/contexts/LessonRuntimeContext";
import type { Activity } from "@/data/lessons";
import { getGreetingsActivityByRef } from "@/data/unit4/greetingsContent";
import { recordMistake } from "@/services/mistakes";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  useCompletionXP,
  useLessonProgressReporter,
} from "@/components/learn/activities/unit3/useLessonProgressXP";
import { UNIT_4_THEME } from "./constants";

interface Props {
  activity: Activity & { contentRef?: string };
  onComplete: () => void;
}

export default function GreetingsListeningDictationActivity({
  activity,
  onComplete,
}: Props) {
  const { userId, unitId, currentActivityNumber, totalActivities } =
    useLessonRuntime();

  useLessonProgressReporter();
  const { award } = useCompletionXP(15, "greetings-dictation");

  const content = useMemo(
    () => getGreetingsActivityByRef(activity.contentRef || activity.id),
    [activity.contentRef, activity.id]
  );

  const question =
    activity.question || (content as any)?.question || "Listen and type";
  const description = activity.description || (content as any)?.description;
  const audio = (activity as any).audio || (content as any)?.audio;

  const [answer, setAnswer] = useState("");

  const player = useAudioPlayer(audio || "");
  const status = useAudioPlayerStatus(player);

  const togglePlay = () => {
    if (!audio) return;

    if (status.playing) {
      player.pause();
      return;
    }

    if (status.currentTime >= status.duration && status.duration > 0) {
      player.seekTo(0);
    }

    player.play();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          {question}
        </ThemedText>
        {!!description && (
          <ThemedText style={styles.subtitle}>{description}</ThemedText>
        )}

        <View style={styles.audioBox}>
          <TouchableOpacity
            style={[
              styles.playButton,
              status.playing && styles.playButtonActive,
            ]}
            onPress={togglePlay}
            disabled={!audio || status.isBuffering}
            activeOpacity={0.9}
          >
            {status.isBuffering ? (
              <ActivityIndicator color="white" />
            ) : (
              <Ionicons
                name={status.playing ? "pause-circle" : "play-circle"}
                size={56}
                color="white"
              />
            )}
            <ThemedText style={styles.playText}>
              {!audio
                ? "Audio not available"
                : status.playing
                ? "Pause"
                : "Play"}
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.hintRow}>
            <Ionicons name="headset" size={16} color="#6B7280" />
            <ThemedText style={styles.hintText}>
              Replay as many times as you want.
            </ThemedText>
          </View>
        </View>

        <View style={styles.inputBox}>
          <ThemedText style={styles.label}>Your answer</ThemedText>
          <TextInput
            style={styles.input}
            value={answer}
            onChangeText={setAnswer}
            placeholder="Type what you hear…"
            placeholderTextColor="#9CA3AF"
            multiline
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={async () => {
          if (userId && unitId && answer.trim().length === 0) {
            void recordMistake({
              userId,
              unitId,
              activityExternalId: activity.id,
              questionText: String(question),
              userAnswer: { answer },
              correctAnswer: { requirement: "non-empty answer" },
              mistakeType: "listening-dictation-empty",
              occurredAt: new Date().toISOString(),
              metadata: {
                currentActivityNumber,
                totalActivities,
                screen: "GreetingsListeningDictationActivity",
                hasAudio: Boolean(audio),
                contentRef: activity.contentRef,
              },
            });
          }

          await award({
            screen: "GreetingsListeningDictationActivity",
            reason: "completed",
            hasAudio: Boolean(audio),
            noteLength: answer.trim().length,
          });
          onComplete();
        }}
      >
        <ThemedText style={styles.continueText}>Continue</ThemedText>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

export const componentKey = "greetings-listening-dictation";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.75,
    marginBottom: 14,
  },
  audioBox: {
    backgroundColor: "#FFF7ED",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 152, 0, 0.18)",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: UNIT_4_THEME.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  playButtonActive: {
    backgroundColor: UNIT_4_THEME.primaryDark,
  },
  playText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
  hintRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
  hintText: {
    fontSize: 13,
    opacity: 0.8,
    textAlign: "center",
  },
  inputBox: {
    marginTop: 6,
  },
  label: {
    fontWeight: "800",
    marginBottom: 8,
    opacity: 0.9,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    minHeight: 120,
    backgroundColor: "#FAFAFA",
    color: "#111827",
  },
  continueButton: {
    backgroundColor: UNIT_4_THEME.primary,
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    shadowColor: UNIT_4_THEME.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  continueText: {
    color: "white",
    fontSize: 17,
    fontWeight: "900",
  },
});
