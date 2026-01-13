import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { Activity } from "@/data/lessons";
import { getTimeListeningDictation } from "@/data/unit3/timeContent";
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
  useLessonProgressReporter,
  useCompletionXP,
} from "./useLessonProgressXP";

interface Props {
  activity: Activity & { contentRef?: string };
  onComplete: () => void;
}

export default function ListeningDictationActivity({
  activity,
  onComplete,
}: Props) {
  useLessonProgressReporter();
  const { award } = useCompletionXP(15, "listening-dictation");

  const content = useMemo(() => {
    return getTimeListeningDictation(activity.contentRef || activity.id);
  }, [activity.contentRef, activity.id]);

  const question = activity.question || content?.question || "Listen and type";
  const description = activity.description || content?.description;
  const audio = (activity as any).audio || content?.audio;
  const sampleAnswer = content?.sampleAnswer;

  const [answer, setAnswer] = useState("");
  const [showSample, setShowSample] = useState(false);

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
              You can replay as many times as you want.
            </ThemedText>
          </View>
        </View>

        <View style={styles.inputBox}>
          <ThemedText style={styles.label}>Your notes</ThemedText>
          <TextInput
            style={styles.input}
            value={answer}
            onChangeText={setAnswer}
            placeholder="Type what you hear…"
            placeholderTextColor="#9CA3AF"
            multiline
          />

          {!!sampleAnswer && (
            <TouchableOpacity
              style={styles.sampleToggle}
              onPress={() => setShowSample((v) => !v)}
            >
              <Ionicons
                name={showSample ? "eye-off" : "eye"}
                size={16}
                color="#6B7280"
              />
              <ThemedText style={styles.sampleToggleText}>
                {showSample ? "Hide sample answer" : "Reveal sample answer"}
              </ThemedText>
            </TouchableOpacity>
          )}

          {showSample && !!sampleAnswer && (
            <View style={styles.sampleBox}>
              <ThemedText style={styles.sampleTitle}>Sample answer</ThemedText>
              <ThemedText style={styles.sampleText}>{sampleAnswer}</ThemedText>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={async () => {
          await award({
            screen: "ListeningDictationActivity",
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

export const componentKey = "listening-dictation";

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
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.75,
    marginBottom: 14,
  },
  audioBox: {
    backgroundColor: "#F3E8FF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#9C27B0",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  playButtonActive: {
    backgroundColor: "#7B1FA2",
  },
  playText: {
    color: "white",
    fontWeight: "800",
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
    fontWeight: "700",
    marginBottom: 8,
    opacity: 0.9,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    minHeight: 110,
    backgroundColor: "#FAFAFA",
    color: "#111827",
  },
  sampleToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  sampleToggleText: {
    fontWeight: "700",
    opacity: 0.8,
  },
  sampleBox: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
    padding: 12,
  },
  sampleTitle: {
    fontWeight: "800",
    marginBottom: 6,
  },
  sampleText: {
    opacity: 0.85,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: "#9C27B0",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  continueText: {
    color: "white",
    fontSize: 17,
    fontWeight: "900",
  },
});
