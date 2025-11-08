import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface DialogueLine {
  speaker: string;
  text: string;
  translation: string;
  audio: string;
}

interface DialogueActivityProps {
  activity: {
    question?: string;
    description?: string;
    image?: string;
    audio?: string;
    dialogue?: DialogueLine[];
  };
  onComplete: () => void;
}

export default function DialogueActivity({
  activity,
  onComplete,
}: DialogueActivityProps) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [playingFull, setPlayingFull] = useState(false);
  const [currentAudioSource, setCurrentAudioSource] = useState<string | null>(
    null
  );

  const player = useAudioPlayer(currentAudioSource || "");
  const status = useAudioPlayerStatus(player);

  const dialogue = activity.dialogue || [];

  const playAudio = (audioPath: string, index?: number) => {
    try {
      // If same audio is already playing, pause it
      if (currentAudioSource === audioPath && status.playing) {
        player.pause();
        setPlayingIndex(null);
        setPlayingFull(false);
        return;
      }

      // Set the new audio source
      setCurrentAudioSource(audioPath);
      player.replace(audioPath);
      player.play();

      if (index !== undefined) {
        setPlayingIndex(index);
        setPlayingFull(false);
      } else {
        setPlayingFull(true);
        setPlayingIndex(null);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setPlayingIndex(null);
      setPlayingFull(false);
    }
  };

  const stopAudio = () => {
    player.pause();
    setPlayingIndex(null);
    setPlayingFull(false);
  };

  // Update playing states based on playback status
  React.useEffect(() => {
    if (!status.playing) {
      setPlayingIndex(null);
      setPlayingFull(false);
    }
  }, [status.playing]);

  if (dialogue.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No dialogue data available</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {activity.question || "Dialogue"}
          </ThemedText>
          {activity.description && (
            <ThemedText type="default" style={styles.description}>
              {activity.description}
            </ThemedText>
          )}
        </View>

        {/* Image */}
        {activity.image && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: activity.image }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Play Full Dialogue Button */}
        {activity.audio && (
          <TouchableOpacity
            style={[
              styles.playFullButton,
              playingFull && styles.playingFullButton,
            ]}
            onPress={() =>
              playingFull ? stopAudio() : playAudio(activity.audio!)
            }
          >
            <ThemedText style={styles.playFullIcon}>
              {playingFull ? "⏸" : "▶️"}
            </ThemedText>
            <ThemedText style={styles.playFullText}>
              {playingFull ? "Pause Full Dialogue" : "Play Full Dialogue"}
            </ThemedText>
          </TouchableOpacity>
        )}

        {/* Dialogue Transcript */}
        <View style={styles.dialogueContainer}>
          <ThemedText type="defaultSemiBold" style={styles.transcriptTitle}>
            Transcript
          </ThemedText>

          {dialogue.map((line, index) => (
            <View
              key={index}
              style={[
                styles.dialogueLine,
                index % 2 === 0
                  ? styles.dialogueLineLeft
                  : styles.dialogueLineRight,
              ]}
            >
              {/* Speaker & Text Container */}
              <View style={styles.lineContent}>
                <View style={styles.lineHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.speaker}>
                    {line.speaker}
                  </ThemedText>

                  {/* Play Button */}
                  <TouchableOpacity
                    style={[
                      styles.playButton,
                      playingIndex === index && styles.playingButton,
                    ]}
                    onPress={() =>
                      playingIndex === index
                        ? stopAudio()
                        : playAudio(line.audio, index)
                    }
                  >
                    <ThemedText style={styles.playIcon}>
                      {playingIndex === index ? "⏸" : "▶️"}
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                {/* Swahili Text */}
                <View style={styles.textBubble}>
                  <ThemedText type="default" style={styles.swahiliText}>
                    {line.text}
                  </ThemedText>
                  <ThemedText type="default" style={styles.translationText}>
                    {line.translation}
                  </ThemedText>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Complete Button */}
        <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
          <ThemedText style={styles.completeButtonText}>Continue</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: "center",
    marginTop: 4,
  },
  imageContainer: {
    marginVertical: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#E0E0E0",
  },
  image: {
    width: "100%",
    height: 200,
  },
  playFullButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playingFullButton: {
    backgroundColor: "#FF9800",
  },
  playFullIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  playFullText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dialogueContainer: {
    marginTop: 10,
  },
  transcriptTitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  dialogueLine: {
    marginBottom: 16,
  },
  dialogueLineLeft: {
    alignItems: "flex-start",
  },
  dialogueLineRight: {
    alignItems: "flex-end",
  },
  lineContent: {
    maxWidth: "85%",
  },
  lineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  speaker: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "700",
  },
  playButton: {
    backgroundColor: "#4CAF50",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  playingButton: {
    backgroundColor: "#FF9800",
  },
  playIcon: {
    fontSize: 12,
    color: "white",
  },
  textBubble: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#4CAF50",
  },
  swahiliText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  translationText: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: "italic",
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 32,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
