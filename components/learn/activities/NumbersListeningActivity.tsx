import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Activity } from "@/data/lessons";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface NumbersListeningActivityProps {
  activity: Activity;
  onComplete: () => void;
}

// The 10 Swahili numbers that will be read in the audio
// Numbers 1-10: moja, mbili, tatu, nne, tano, sita, saba, nane, tisa, kumi
// User should write the numeric values 1-10
const CORRECT_NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export default function NumbersListeningActivity({
  activity,
  onComplete,
}: NumbersListeningActivityProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(10).fill(""));
  const [isChecking, setIsChecking] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Audio source for the numbers
  const audioSource = activity.audio
    ? activity.audio.startsWith("/assets/")
      ? require("@/assets/audio/swahili-alphabet.mp3")
      : activity.audio
    : null;

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
    // Remove spaces and any non-digit characters, keep only numbers
    return text.trim().replace(/[^0-9]/g, "");
  };

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const checkAnswer = () => {
    setIsChecking(true);

    // Check each answer
    let correct = 0;
    for (let i = 0; i < CORRECT_NUMBERS.length; i++) {
      const normalized = normalizeAnswer(userAnswers[i]);
      const correctAnswer = normalizeAnswer(CORRECT_NUMBERS[i]);
      if (normalized === correctAnswer) {
        correct++;
      }
    }

    setCorrectCount(correct);
    const allCorrect = correct === CORRECT_NUMBERS.length;
    setIsCorrect(allCorrect);
    setShowFeedback(true);
    setIsChecking(false);

    if (allCorrect) {
      // Short delay before calling onComplete
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const handleTryAgain = () => {
    setShowFeedback(false);
    setUserAnswers(Array(10).fill(""));
    setIsCorrect(false);
    setCorrectCount(0);
    // Play audio again
    player.seekTo(0);
    player.play();
  };

  const isAnswerFilled = userAnswers.every(
    (answer) => answer.trim().length > 0
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          {activity.question || "Numbers Listening Exercise"}
        </ThemedText>

        <ThemedText style={styles.instructionText}>
          🎧 Listen carefully to the audio and write down the 10 numbers you
          hear as figures (1, 2, 3, etc.).
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
              ⚠️ Audio file not available. Please add the audio file at:
              /assets/audio/numbers-listening-exercise.mp3
            </ThemedText>
          )}
        </View>

        {/* Answer Inputs */}
        <View style={styles.answerSection}>
          <ThemedText style={styles.label}>
            Write the numbers you hear as figures (1-10):
          </ThemedText>
          <View style={styles.inputGrid}>
            {userAnswers.map((answer, index) => (
              <View key={index} style={styles.inputRow}>
                <ThemedText style={styles.numberLabel}>{index + 1}.</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    showFeedback &&
                      (normalizeAnswer(answer) ===
                      normalizeAnswer(CORRECT_NUMBERS[index])
                        ? styles.inputCorrect
                        : styles.inputIncorrect),
                  ]}
                  value={answer}
                  onChangeText={(value) => updateAnswer(index, value)}
                  placeholder={`${index + 1}`}
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  editable={!showFeedback}
                  maxLength={2}
                />
                {showFeedback && (
                  <View style={styles.feedbackIcon}>
                    {normalizeAnswer(answer) ===
                    normalizeAnswer(CORRECT_NUMBERS[index]) ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#4CAF50"
                      />
                    ) : (
                      <Ionicons name="close-circle" size={24} color="#F44336" />
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
          <ThemedText style={styles.hintText}>
            💡 Tip: You can listen to the audio multiple times. Write the
            numbers as digits (1, 2, 3...).
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
                ? "Perfect! You got all 10 numbers correct! 🎉"
                : `You got ${correctCount} out of 10 correct. Listen again and try once more.`}
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
              (!isAnswerFilled || isChecking) && styles.checkButtonDisabled,
            ]}
            onPress={checkAnswer}
            disabled={!isAnswerFilled || isChecking}
          >
            <ThemedText style={styles.checkButtonText}>
              {isChecking ? "Checking..." : "Check Answers"}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
}

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
    lineHeight: 20,
  },

  // Answer Section
  answerSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  inputGrid: {
    gap: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  numberLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    width: 30,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1A1A1A",
  },
  inputCorrect: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  inputIncorrect: {
    borderColor: "#F44336",
    backgroundColor: "#FFEBEE",
  },
  feedbackIcon: {
    width: 30,
    alignItems: "center",
  },
  hintText: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
    fontStyle: "italic",
  },

  // Feedback
  feedbackContainer: {
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  feedbackCorrect: {
    backgroundColor: "#E8F5E9",
  },
  feedbackIncorrect: {
    backgroundColor: "#FFEBEE",
  },
  feedbackText: {
    fontSize: 16,
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
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
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
