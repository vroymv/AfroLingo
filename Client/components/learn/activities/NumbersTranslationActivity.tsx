import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Activity } from "@/data/lessons";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface NumbersTranslationActivityProps {
  activity: Activity;
  onComplete: () => void;
}

// 10 Swahili numbers with their numeric values
const NUMBER_PAIRS = [
  { swahili: "kumi na tano", number: "15" },
  { swahili: "arobaini", number: "40" },
  { swahili: "saba", number: "7" },
  { swahili: "sitini", number: "60" },
  { swahili: "mbili", number: "2" },
  { swahili: "themanini", number: "80" },
  { swahili: "kumi na tatu", number: "13" },
  { swahili: "hamsini", number: "50" },
  { swahili: "nane", number: "8" },
  { swahili: "ishirini", number: "20" },
];

export default function NumbersTranslationActivity({
  activity,
  onComplete,
}: NumbersTranslationActivityProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(10).fill(""));
  const [isChecking, setIsChecking] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const normalizeAnswer = (text: string): string => {
    // Remove spaces and any non-digit characters
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
    for (let i = 0; i < NUMBER_PAIRS.length; i++) {
      const normalized = normalizeAnswer(userAnswers[i]);
      const correctAnswer = normalizeAnswer(NUMBER_PAIRS[i].number);
      if (normalized === correctAnswer) {
        correct++;
      }
    }

    setCorrectCount(correct);
    const allCorrect = correct === NUMBER_PAIRS.length;
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
  };

  const isAnswerFilled = userAnswers.every(
    (answer) => answer.trim().length > 0
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            {activity.question || "Write Numbers as Figures"}
          </ThemedText>

          <ThemedText style={styles.instructionText}>
            📝 Convert these Swahili numbers into figures (numerals).
          </ThemedText>

          <View style={styles.exampleBox}>
            <ThemedText style={styles.exampleTitle}>Example:</ThemedText>
            <View style={styles.exampleRow}>
              <ThemedText style={styles.exampleSwahili}>tano</ThemedText>
              <Ionicons name="arrow-forward" size={20} color="#666" />
              <ThemedText style={styles.exampleNumber}>5</ThemedText>
            </View>
          </View>

          {/* Translation Exercises */}
          <View style={styles.exerciseSection}>
            {NUMBER_PAIRS.map((pair, index) => (
              <View key={index} style={styles.exerciseRow}>
                <View style={styles.questionContainer}>
                  <ThemedText style={styles.numberLabel}>
                    {index + 1}.
                  </ThemedText>
                  <View style={styles.swahiliBox}>
                    <ThemedText style={styles.swahiliText}>
                      {pair.swahili}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.answerContainer}>
                  <Ionicons name="arrow-forward" size={24} color="#2196F3" />
                  <TextInput
                    style={[
                      styles.input,
                      showFeedback &&
                        (normalizeAnswer(userAnswers[index]) ===
                        normalizeAnswer(pair.number)
                          ? styles.inputCorrect
                          : styles.inputIncorrect),
                    ]}
                    value={userAnswers[index]}
                    onChangeText={(value) => updateAnswer(index, value)}
                    placeholder="?"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                    editable={!showFeedback}
                    maxLength={3}
                  />
                  {showFeedback && (
                    <View style={styles.feedbackIcon}>
                      {normalizeAnswer(userAnswers[index]) ===
                      normalizeAnswer(pair.number) ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={28}
                          color="#4CAF50"
                        />
                      ) : (
                        <View style={styles.incorrectFeedback}>
                          <Ionicons
                            name="close-circle"
                            size={28}
                            color="#F44336"
                          />
                          <ThemedText style={styles.correctAnswerText}>
                            ({pair.number})
                          </ThemedText>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>

          <ThemedText style={styles.hintText}>
            💡 Tip: Write only the number (e.g., 15, not fifteen)
          </ThemedText>

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
                  ? "Perfect! You translated all 10 numbers correctly! 🎉"
                  : `You got ${correctCount} out of 10 correct. Review the answers and try again!`}
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
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 24,
  },

  // Example Box
  exampleBox: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1976D2",
    marginBottom: 8,
  },
  exampleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  exampleSwahili: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  exampleNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
  },

  // Exercise Section
  exerciseSection: {
    gap: 16,
    marginBottom: 20,
  },
  exerciseRow: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    gap: 12,
  },
  questionContainer: {
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
  swahiliBox: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#2196F3",
  },
  swahiliText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  answerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingLeft: 42,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#2196F3",
    borderRadius: 8,
    padding: 12,
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
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
    width: 80,
    alignItems: "flex-start",
  },
  incorrectFeedback: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  correctAnswerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F44336",
  },
  hintText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    fontStyle: "italic",
    textAlign: "center",
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
