import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLessonRuntime } from "@/contexts/LessonRuntimeContext";
import { Activity } from "@/data/lessons";
import { updateUserProgress } from "@/services/userprogress";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const swahiliAlphabetAudio = require("@/assets/audio/swahili-alphabet.mp3");

interface VocabularyItem {
  id: string;
  image: string;
  word: string; // The complete Swahili word
  blanks: number[]; // Array of indices indicating which letters to hide (e.g., [0, 2] hides 1st and 3rd letter)
}

interface VocabularyFillInActivityProps {
  activity: Activity & {
    vocabulary?: VocabularyItem[];
    audio?: string;
  };
  onComplete: () => void;
}

export default function VocabularyFillInActivity({
  activity,
  onComplete,
}: VocabularyFillInActivityProps) {
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

  // Image mapping for vocabulary items
  const imageMap: { [key: string]: any } = {
    pencil: require("@/assets/images/vocab/pencil.png"),
    notebook: require("@/assets/images/vocab/notebook.png"),
    teacher: require("@/assets/images/vocab/teacher.png"),
    backpack: require("@/assets/images/vocab/backpack.png"),
    eraser: require("@/assets/images/vocab/eraser.png"),
    phone: require("@/assets/images/vocab/phone.png"),
  };

  // Default vocabulary items
  const vocabularyItems: VocabularyItem[] = activity.vocabulary || [
    {
      id: "pencil",
      image: "/assets/images/vocab/pencil.png",
      word: "KALAMU",
      blanks: [0, 3], // K_L_MU
    },
    {
      id: "notebook",
      image: "/assets/images/vocab/notebook.png",
      word: "DAFTARI",
      blanks: [0, 3, 5], // D_FT_R_
    },
    {
      id: "teacher",
      image: "/assets/images/vocab/teacher.png",
      word: "MWALIMU",
      blanks: [0, 4, 6], // M_AL_M_
    },
    {
      id: "backpack",
      image: "/assets/images/vocab/backpack.png",
      word: "MKOBA",
      blanks: [0, 3], // M_OB_
    },
    {
      id: "eraser",
      image: "/assets/images/vocab/eraser.png",
      word: "KIFUTIO",
      blanks: [0, 3, 5], // K_FU_I_
    },
    {
      id: "phone",
      image: "/assets/images/vocab/phone.png",
      word: "SIMU",
      blanks: [0, 2], // S_M_
    },
  ];

  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string[] }>(
    () => {
      const initial: { [key: string]: string[] } = {};
      vocabularyItems.forEach((item) => {
        initial[item.id] = new Array(item.blanks.length).fill("");
      });
      return initial;
    }
  );

  const [showFeedback, setShowFeedback] = useState(false);
  const [correctItems, setCorrectItems] = useState<Set<string>>(new Set());

  // Audio source for vocabulary pronunciation
  const audioSource = swahiliAlphabetAudio;

  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);

  const handlePlayAudio = () => {
    if (status.playing) {
      player.pause();
    } else {
      if (status.currentTime >= status.duration && status.duration > 0) {
        player.seekTo(0);
      }
      player.play();
    }
  };

  const handleInputChange = (
    itemId: string,
    blankIndex: number,
    value: string
  ) => {
    // Only allow single uppercase letter
    const sanitized = value
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 1);

    setUserAnswers((prev) => {
      const newAnswers = { ...prev };
      newAnswers[itemId] = [...prev[itemId]];
      newAnswers[itemId][blankIndex] = sanitized;
      return newAnswers;
    });
  };

  const checkAnswers = () => {
    const correct = new Set<string>();

    vocabularyItems.forEach((item) => {
      const userLetters = userAnswers[item.id];
      const isCorrect = item.blanks.every((blankPos, idx) => {
        const expectedLetter = item.word[blankPos];
        return userLetters[idx] === expectedLetter;
      });

      if (isCorrect) {
        correct.add(item.id);
      }
    });

    setCorrectItems(correct);
    setShowFeedback(true);

    // If all correct, complete the activity
    if (correct.size === vocabularyItems.length) {
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  const handleTryAgain = () => {
    setShowFeedback(false);
    setCorrectItems(new Set());
    // Reset only incorrect answers
    setUserAnswers((prev) => {
      const newAnswers = { ...prev };
      vocabularyItems.forEach((item) => {
        if (!correctItems.has(item.id)) {
          newAnswers[item.id] = new Array(item.blanks.length).fill("");
        }
      });
      return newAnswers;
    });
  };

  const renderWord = (item: VocabularyItem) => {
    const letters = item.word.split("");
    let blankIndex = 0;

    return (
      <View style={styles.wordContainer}>
        {letters.map((letter, idx) => {
          const isBlank = item.blanks.includes(idx);

          if (isBlank) {
            const currentBlankIndex = blankIndex;
            blankIndex++;
            const userValue = userAnswers[item.id][currentBlankIndex] || "";
            const isCorrectLetter =
              showFeedback && correctItems.has(item.id) && userValue === letter;
            const isIncorrectLetter =
              showFeedback && !correctItems.has(item.id) && userValue !== "";

            return (
              <TextInput
                key={idx}
                style={[
                  styles.letterInput,
                  isCorrectLetter && styles.letterInputCorrect,
                  isIncorrectLetter && styles.letterInputIncorrect,
                ]}
                value={userValue}
                onChangeText={(value) =>
                  handleInputChange(item.id, currentBlankIndex, value)
                }
                maxLength={1}
                autoCapitalize="characters"
                editable={!showFeedback || !correctItems.has(item.id)}
              />
            );
          }

          return (
            <View key={idx} style={styles.letterBox}>
              <ThemedText style={styles.letterText}>{letter}</ThemedText>
            </View>
          );
        })}
      </View>
    );
  };

  const allAnswered = vocabularyItems.every((item) =>
    userAnswers[item.id].every((letter) => letter !== "")
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          {activity.question || "Complete the Words"}
        </ThemedText>

        <ThemedText style={styles.instructionText}>
          📝 Fill in the missing letters to spell each word in Swahili.
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
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Ionicons
                name={status.playing ? "pause" : "play"}
                size={24}
                color="white"
              />
            )}
            <ThemedText style={styles.audioButtonText}>
              {status.playing ? "Pause" : "Play Pronunciation"}
            </ThemedText>
          </TouchableOpacity>

          {!audioSource && (
            <ThemedText style={styles.warningText}>
              ⚠️ Audio not available
            </ThemedText>
          )}
        </View>

        {/* Vocabulary Grid */}
        <View style={styles.grid}>
          {vocabularyItems.map((item) => (
            <View key={item.id} style={styles.vocabCard}>
              {/* Image */}
              <View style={styles.imageContainer}>
                {imageMap[item.id] ? (
                  <Image
                    source={imageMap[item.id]}
                    style={styles.image}
                    resizeMode="contain"
                  />
                ) : (
                  <>
                    <Ionicons name="image-outline" size={48} color="#ccc" />
                    <ThemedText style={styles.imagePlaceholder}>
                      {item.id}
                    </ThemedText>
                  </>
                )}
              </View>

              {/* Word with blanks */}
              {renderWord(item)}

              {/* Feedback icon */}
              {showFeedback && (
                <View style={styles.feedbackIcon}>
                  {correctItems.has(item.id) ? (
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

        {/* Check/Try Again Button */}
        {!showFeedback ? (
          <TouchableOpacity
            style={[styles.button, !allAnswered && styles.buttonDisabled]}
            onPress={checkAnswers}
            disabled={!allAnswered}
          >
            <ThemedText style={styles.buttonText}>Check Answers</ThemedText>
          </TouchableOpacity>
        ) : correctItems.size < vocabularyItems.length ? (
          <TouchableOpacity style={styles.button} onPress={handleTryAgain}>
            <ThemedText style={styles.buttonText}>Try Again</ThemedText>
          </TouchableOpacity>
        ) : (
          <View style={styles.successMessage}>
            <Ionicons name="trophy" size={48} color="#FFD700" />
            <ThemedText style={styles.successText}>
              Perfect! All words correct! 🎉
            </ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

// Identifier used for dynamic activity rendering
export const componentKey = "vocabulary-fill-in";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#1A1A1A",
  },
  instructionText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 16,
  },

  // Audio Section
  audioSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  audioButtonActive: {
    backgroundColor: "#1976D2",
  },
  audioButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  warningText: {
    marginTop: 8,
    fontSize: 12,
    color: "#FF9800",
  },

  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },

  // Vocab Card
  vocabCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: 100,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },

  // Word Container
  wordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  letterBox: {
    width: 32,
    height: 40,
    backgroundColor: "#E3F2FD",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2196F3",
  },
  letterText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  letterInput: {
    width: 32,
    height: 40,
    backgroundColor: "white",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#2196F3",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  letterInputCorrect: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  letterInputIncorrect: {
    borderColor: "#F44336",
    backgroundColor: "#FFEBEE",
  },

  // Feedback
  feedbackIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },

  // Button
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Success
  successMessage: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF9E6",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  successText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginTop: 12,
    textAlign: "center",
  },
});
