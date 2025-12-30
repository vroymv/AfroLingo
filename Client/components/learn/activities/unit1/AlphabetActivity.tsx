import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLessonRuntime } from "@/contexts/LessonRuntimeContext";
import { updateUserProgress } from "@/services/userprogress";
import { awardXP } from "@/services/xp";
import { Activity } from "@/types/lessonProgressContext";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Helper function to format time in MM:SS format
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

interface AlphabetActivityProps {
  activity: Activity;
  onComplete: () => void;
}

export default function AlphabetActivity({
  activity,
  onComplete,
}: AlphabetActivityProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioXPAwarded, setAudioXPAwarded] = useState(false);

  const audioSource = require("@/assets/audio/swahili-alphabet.mp3");

  // Create audio player with the audio source
  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);

  const handlePlayPause = () => {
    if (status.playing) {
      player.pause();
    } else {
      // If finished, seek to beginning before playing
      if (status.currentTime >= status.duration && status.duration > 0) {
        player.seekTo(0);
      }
      player.play();
    }
  };

  const { userId, unitId, currentActivityNumber, totalActivities } =
    useLessonRuntime();

  // Report progress on mount (and when identifiers change)
  useEffect(() => {
    if (!userId) return; // Skip if user not authenticated yet
    updateUserProgress({
      userId,
      unitId,
      currentActivityNumber,
      totalActivities,
    }).catch((e) => console.warn("Failed to send progress", e));
  }, [userId, unitId, currentActivityNumber, totalActivities]);

  // Award XP once when the audio has been listened to fully
  useEffect(() => {
    if (!userId || audioXPAwarded) return;

    if (status.duration > 0 && status.currentTime >= status.duration - 1) {
      (async () => {
        const result = await awardXP({
          userId,
          amount: 5,
          sourceType: "activity_completion",
          sourceId: `alphabet-audio-${unitId}-${currentActivityNumber}`,
          metadata: {
            unitId,
            currentActivityNumber,
            totalActivities,
            screen: "AlphabetActivity",
            reason: "audio_listened",
          },
        });

        if (!result.success) {
          console.warn("XP award for audio failed", result.message);
        } else {
          setAudioXPAwarded(true);
        }
      })();
    }
  }, [
    userId,
    unitId,
    currentActivityNumber,
    totalActivities,
    status.currentTime,
    status.duration,
    audioXPAwarded,
  ]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          {"The Swahili Alphabet"}
        </ThemedText>

        <ThemedText style={styles.instructionText}>
          Tap the image below to view it fullscreen
        </ThemedText>

        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.imageWrapper}
            onPress={() => setIsFullscreen(true)}
            activeOpacity={0.95}
          >
            <Image
              source={require("@/assets/images/Swahili-alphabet.png")}
              style={styles.alphabetImage}
              resizeMode="contain"
            />
            <View style={styles.expandButton}>
              <Ionicons name="expand" size={20} color="white" />
              <ThemedText style={styles.expandText}>Tap to enlarge</ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.audioSection}>
          <ThemedText style={styles.audioInstructionText}>
            Listen to the pronunciation
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.audioButton,
              status.playing && styles.audioButtonActive,
            ]}
            onPress={handlePlayPause}
            disabled={status.isBuffering}
          >
            {status.isBuffering ? (
              <ActivityIndicator color="white" />
            ) : (
              <Ionicons
                name={status.playing ? "pause-circle" : "play-circle"}
                size={48}
                color="white"
              />
            )}
            <ThemedText style={styles.audioButtonText}>
              {status.playing
                ? "Pause Pronunciation"
                : "Play Alphabet Pronunciation"}
            </ThemedText>
          </TouchableOpacity>
          {status.duration > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(status.currentTime / status.duration) * 100}%`,
                    },
                  ]}
                />
              </View>
              <ThemedText style={styles.timeText}>
                {formatTime(status.currentTime)} / {formatTime(status.duration)}
              </ThemedText>
            </View>
          )}
        </View>

        <ThemedText style={styles.description}>
          Listen carefully to learn how each letter is pronounced in Swahili.
          Practice along with the audio for best results.
        </ThemedText>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={async () => {
          if (userId) {
            const result = await awardXP({
              userId,
              amount: 10,
              sourceType: "activity_completion",
              sourceId: `alphabet-complete-${unitId}-${currentActivityNumber}`,
              metadata: {
                unitId,
                currentActivityNumber,
                totalActivities,
                screen: "AlphabetActivity",
                reason: "activity_completed",
              },
            });

            if (!result.success) {
              console.warn("XP award for completion failed", result.message);
            }
          }

          onComplete();
        }}
      >
        <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>

      {/* Fullscreen Modal */}
      <Modal
        visible={isFullscreen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsFullscreen(false)}
      >
        <View style={styles.fullscreenContainer}>
          <View style={styles.fullscreenHeader}>
            <ThemedText style={styles.fullscreenTitle}>
              Swahili Alphabet
            </ThemedText>
            <TouchableOpacity
              style={styles.closeFullscreenButton}
              onPress={() => setIsFullscreen(false)}
            >
              <Ionicons name="close" size={32} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.fullscreenScroll}
            contentContainerStyle={styles.fullscreenScrollContent}
            maximumZoomScale={3}
            minimumZoomScale={1}
          >
            <Image
              source={require("@/assets/images/Swahili-alphabet.png")}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </ScrollView>

          <View style={styles.fullscreenFooter}>
            <ThemedText style={styles.fullscreenHint}>
              Pinch to zoom • Scroll to explore
            </ThemedText>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

// Identifier used for dynamic activity rendering
export const componentKey = "alphabet";

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    paddingVertical: 24,
    minHeight: 500,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 24,
    fontWeight: "700",
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "500",
  },
  imageContainer: {
    width: "100%",
    maxWidth: 500,
    aspectRatio: 1,
    marginBottom: 24,
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#4A90E2",
  },
  alphabetImage: {
    width: "100%",
    height: "100%",
  },
  expandButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(74, 144, 226, 0.95)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  expandText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  audioSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  audioInstructionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4A90E2",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 16,
    minWidth: 280,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  audioButtonActive: {
    backgroundColor: "#357ABD",
  },
  audioButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  progressContainer: {
    width: "100%",
    maxWidth: 280,
    marginTop: 12,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(74, 144, 226, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4A90E2",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  noAudioContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 32,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  noAudioText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
    paddingHorizontal: 32,
    lineHeight: 22,
  },
  continueButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  // Fullscreen Modal Styles
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  fullscreenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  fullscreenTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  closeFullscreenButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 22,
  },
  fullscreenScroll: {
    flex: 1,
  },
  fullscreenScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  fullscreenImage: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT - 200,
  },
  fullscreenFooter: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
  },
  fullscreenHint: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontStyle: "italic",
  },
});
