import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { recordMistake } from "@/services/mistakes";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SpellingItem {
  partial: string;
  complete: string;
  hint: string;
  image?: string;
}

interface SpellingCompletionActivityProps {
  activity: {
    question?: string;
    description?: string;
    items?: SpellingItem[];
  };
  onComplete: () => void;

  // Optional context for reporting mistakes.
  mistakeReporting?: {
    userId?: string;
    unitId?: string;
    activityExternalId?: string;
    screen?: string;
    metadata?: Record<string, any>;
  };
}

export default function SpellingCompletionActivity({
  activity,
  onComplete,
  mistakeReporting,
}: SpellingCompletionActivityProps) {
  const items = activity.items || [];
  const [answers, setAnswers] = useState<string[]>(
    new Array(items.length).fill("")
  );
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const handleAnswerChange = (index: number, text: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = text;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const newResults = items.map((item, index) => {
      const userAnswer = answers[index].trim().toLowerCase();
      const correctAnswer = item.complete.toLowerCase();
      return userAnswer === correctAnswer;
    });

    if (
      mistakeReporting?.userId &&
      mistakeReporting?.unitId &&
      mistakeReporting?.activityExternalId
    ) {
      const baseQuestion = activity.question || "Complete the Spelling";
      const nowIso = new Date().toISOString();

      items.forEach((item, index) => {
        if (newResults[index]) return;

        void recordMistake({
          userId: mistakeReporting.userId!,
          unitId: mistakeReporting.unitId!,
          activityExternalId: mistakeReporting.activityExternalId!,
          questionText: `${baseQuestion} — ${item.hint}`,
          userAnswer: {
            text: answers[index],
            normalized: answers[index].trim().toLowerCase(),
            index,
          },
          correctAnswer: {
            text: item.complete,
            normalized: item.complete.toLowerCase(),
          },
          mistakeType: "spelling",
          occurredAt: nowIso,
          metadata: {
            screen: mistakeReporting.screen || "SpellingCompletionActivity",
            itemHint: item.hint,
            itemPartial: item.partial,
            ...mistakeReporting.metadata,
          },
        });
      });
    }

    setResults(newResults);
    setSubmitted(true);
  };

  const handleContinue = () => {
    onComplete();
  };

  const allCorrect = submitted && results.every((result) => result);
  const canSubmit = answers.every((answer) => answer.trim() !== "");

  if (items.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No spelling items available</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {activity.question || "Complete the Spelling"}
          </ThemedText>
          {activity.description && (
            <ThemedText type="default" style={styles.description}>
              {activity.description}
            </ThemedText>
          )}
        </View>

        {/* Spelling Items */}
        <View style={styles.itemsContainer}>
          {items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              {/* Image if available */}
              {item.image && (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                    resizeMode="contain"
                  />
                </View>
              )}

              {/* Hint */}
              <ThemedText type="defaultSemiBold" style={styles.hint}>
                {item.hint}
              </ThemedText>

              {/* Partial Word */}
              <ThemedText type="default" style={styles.partialText}>
                Pattern: {item.partial}
              </ThemedText>

              {/* Input Field */}
              <TextInput
                style={[
                  styles.input,
                  submitted &&
                    (results[index]
                      ? styles.inputCorrect
                      : styles.inputIncorrect),
                ]}
                value={answers[index]}
                onChangeText={(text) => handleAnswerChange(index, text)}
                placeholder="Type the complete word..."
                placeholderTextColor="#999"
                editable={!submitted}
                autoCapitalize="none"
                autoCorrect={false}
              />

              {/* Feedback */}
              {submitted && (
                <View style={styles.feedback}>
                  {results[index] ? (
                    <View style={styles.correctFeedback}>
                      <ThemedText style={styles.correctText}>
                        ✓ Correct!
                      </ThemedText>
                    </View>
                  ) : (
                    <View style={styles.incorrectFeedback}>
                      <ThemedText style={styles.incorrectText}>
                        ✗ Incorrect. The answer is: {item.complete}
                      </ThemedText>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          {!submitted ? (
            <TouchableOpacity
              style={[styles.button, !canSubmit && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                Check Answers
              </ThemedText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.button,
                allCorrect ? styles.buttonSuccess : styles.buttonRetry,
              ]}
              onPress={handleContinue}
            >
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                {allCorrect ? "Continue ✓" : "Continue Anyway →"}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Score Summary */}
        {submitted && (
          <View style={styles.scoreContainer}>
            <ThemedText type="default" style={styles.scoreText}>
              Score: {results.filter((r) => r).length} / {items.length}
            </ThemedText>
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
  itemsContainer: {
    gap: 16,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  hint: {
    fontSize: 16,
    marginBottom: 8,
    color: "#4A90E2",
  },
  partialText: {
    fontSize: 20,
    fontFamily: "monospace",
    marginBottom: 12,
    color: "#666",
  },
  input: {
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    backgroundColor: "#FAFAFA",
    color: "#000",
  },
  inputCorrect: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  inputIncorrect: {
    borderColor: "#F44336",
    backgroundColor: "#FFEBEE",
  },
  feedback: {
    marginTop: 8,
  },
  correctFeedback: {
    backgroundColor: "#E8F5E9",
    padding: 8,
    borderRadius: 6,
  },
  correctText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "600",
  },
  incorrectFeedback: {
    backgroundColor: "#FFEBEE",
    padding: 8,
    borderRadius: 6,
  },
  incorrectText: {
    color: "#C62828",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: 24,
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#CCCCCC",
    opacity: 0.6,
  },
  buttonSuccess: {
    backgroundColor: "#4CAF50",
  },
  buttonRetry: {
    backgroundColor: "#FF9800",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  scoreContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    alignItems: "center",
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1976D2",
  },
});
