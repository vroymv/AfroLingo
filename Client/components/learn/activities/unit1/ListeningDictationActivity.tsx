import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLessonRuntime } from "@/contexts/LessonRuntimeContext";
import { Activity } from "@/data/lessons";
import { updateUserProgress } from "@/services/userprogress";
import { awardXP } from "@/services/xp";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const swahiliAlphabetAudio = require("@/assets/audio/swahili-alphabet.mp3");

interface ListeningDictationActivityProps {
  activity: Activity;
  onComplete: () => void;
}

// The 10 Swahili letters that will be read in the audio
const CORRECT_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

export default function ListeningDictationActivity({
  activity,
  onComplete,
}: ListeningDictationActivityProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctXPAwarded, setCorrectXPAwarded] = useState(false);

  const audioSource = swahiliAlphabetAudio;

  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);

  const handlePlayAudio = () => {
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

  const normalizeAnswer = (text: string): string => {
    // Remove spaces, convert to uppercase, and remove any non-letter characters
    return text
      .toUpperCase()
      .replace(/\s/g, "")
      .replace(/[^A-Z]/g, "");
  };

  const { userId, unitId, currentActivityNumber, totalActivities } =
    useLessonRuntime();

  const checkAnswer = async () => {
    setIsChecking(true);
    const normalized = normalizeAnswer(userAnswer);
    const correctAnswer = CORRECT_LETTERS.join("");

    // Check if the answer matches
    const correct = normalized === correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    setIsChecking(false);

    if (correct) {
      if (userId && !correctXPAwarded) {
        const result = await awardXP({
          userId,
          amount: 15,
          sourceType: "activity_completion",
          sourceId: `listening-dictation-correct-${unitId}-${currentActivityNumber}`,
          metadata: {
            unitId,
            currentActivityNumber,
            totalActivities,
            screen: "ListeningDictationActivity",
            reason: "correct_answer",
            expected: correctAnswer,
            submitted: normalized,
          },
        });

        if (!result.success) {
          console.warn("XP award for correct answer failed", result.message);
        } else {
          setCorrectXPAwarded(true);
        }
      }

      // Short delay before calling onComplete
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  const handleTryAgain = () => {
    setShowFeedback(false);
    setUserAnswer("");
    setIsCorrect(false);
    // Play audio again
    player.seekTo(0);
    player.play();
  };

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

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          {activity.question || "Listen and Write"}
        </ThemedText>

        <ThemedText style={styles.instructionText}>
          🎧 Listen carefully to the audio and write down the 10 letters you
          hear in order.
        </ThemedText>

        {/* Audio Player */}
        <View style={styles.audioSection}>
          <TouchableOpacity
            style={[
              styles.audioButton,
              status.playing && styles.audioButtonActive,
            ]}
            onPress={handlePlayAudio}
            disabled={status.isBuffering || !audioSource}
          >
            {status.isBuffering ? (
              <ActivityIndicator color="white" />
            ) : (
              <Ionicons
                name={status.playing ? "pause-circle" : "play-circle"}
                size={64}
                color="white"
              />
            )}
            <ThemedText style={styles.audioButtonText}>
              {status.playing ? "Pause" : "Play Audio"}
            </ThemedText>
          </TouchableOpacity>

          {!audioSource && (
            <ThemedText style={styles.warningText}>
              ⚠️ Audio file not available. Please add the audio file.
            </ThemedText>
          )}
        </View>

        {/* Answer Input */}
        <View style={styles.answerSection}>
          <ThemedText style={styles.label}>
            Your Answer (separate letters with spaces):
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              showFeedback &&
                (isCorrect ? styles.inputCorrect : styles.inputIncorrect),
            ]}
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="e.g., A B C D E F G H I J"
            placeholderTextColor="#999"
            autoCapitalize="characters"
            editable={!showFeedback}
          />
          <ThemedText style={styles.hintText}>
            💡 Tip: You can listen to the audio multiple times
          </ThemedText>
        </View>

        {/* Feedback */}
        {showFeedback && (
          <View
            style={[
              styles.feedbackContainer,
              isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect,
            ]}
          >
            <Ionicons
              name={isCorrect ? "checkmark-circle" : "close-circle"}
              size={32}
              color={isCorrect ? "#4CAF50" : "#F44336"}
            />
            <ThemedText
              style={[
                styles.feedbackText,
                isCorrect
                  ? styles.feedbackTextCorrect
                  : styles.feedbackTextIncorrect,
              ]}
            >
              {isCorrect
                ? "Excellent! You got all the letters correct! 🎉"
                : "Not quite right. Listen again and try once more."}
            </ThemedText>
            {!isCorrect && (
              <TouchableOpacity
                style={styles.tryAgainButton}
                onPress={handleTryAgain}
              >
                <ThemedText style={styles.tryAgainText}>Try Again</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Check Answer Button */}
        {!showFeedback && (
          <TouchableOpacity
            style={[
              styles.checkButton,
              (!userAnswer.trim() || isChecking) && styles.checkButtonDisabled,
            ]}
            onPress={checkAnswer}
            disabled={!userAnswer.trim() || isChecking}
          >
            <ThemedText style={styles.checkButtonText}>
              {isChecking ? "Checking..." : "Check Answer"}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
}

// Identifier used for dynamic activity rendering
export const componentKey = "listening-dictation";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 16,
    textAlign: "center",
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 24,
  },

  // Audio Section
  audioSection: {
    alignItems: "center",
    marginBottom: 32,
    backgroundColor: "#F0F7FF",
    padding: 24,
    borderRadius: 16,
  },
  audioButton: {
    backgroundColor: "#2196F3",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
    minWidth: 200,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  audioButtonActive: {
    backgroundColor: "#1976D2",
  },
  audioButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  warningText: {
    color: "#FF9800",
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },

  // Answer Section
  answerSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: "#1A1A1A",
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 2,
  },
  inputCorrect: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  inputIncorrect: {
    borderColor: "#F44336",
    backgroundColor: "#FFEBEE",
  },
  hintText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
    textAlign: "center",
  },

  // Feedback
  feedbackContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  feedbackCorrect: {
    backgroundColor: "#E8F5E9",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  feedbackIncorrect: {
    backgroundColor: "#FFEBEE",
    borderWidth: 2,
    borderColor: "#F44336",
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
    lineHeight: 24,
  },
  feedbackTextCorrect: {
    color: "#2E7D32",
  },
  feedbackTextIncorrect: {
    color: "#C62828",
  },
  tryAgainButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  tryAgainText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // Check Button
  checkButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  checkButtonDisabled: {
    backgroundColor: "#BDBDBD",
    shadowOpacity: 0,
    elevation: 0,
  },
  checkButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
