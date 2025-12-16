import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getActivityContent } from "@/data/activity-content";
import { Activity } from "@/data/lessons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// Identifier used for dynamic activity rendering
export const componentKey = "multiple-choice";

interface MultipleChoiceActivityProps {
  activity: Activity;
  onComplete: () => void;
}

export default function MultipleChoiceActivity({
  activity,
  onComplete,
}: MultipleChoiceActivityProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const content = getActivityContent(activity.id);

  const question = content?.question ?? activity.question;
  const options: string[] = Array.isArray(content?.options)
    ? content.options
    : [];
  const correctAnswerIndexRaw =
    content?.correctAnswer ?? activity.correctAnswer;
  const correctAnswerIndex =
    typeof correctAnswerIndexRaw === "number" ? correctAnswerIndexRaw : -1;

  const handleOptionSelect = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null && !showResult) {
      setShowResult(true);
    } else if (showResult) {
      onComplete();
    }
  };

  const isCorrect =
    selectedAnswer !== null && selectedAnswer === correctAnswerIndex;

  if (!question || options.length === 0 || correctAnswerIndex < 0) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>
          Activity content missing
        </ThemedText>
        <ThemedText style={styles.errorSubtext}>
          This activity can’t be displayed right now.
        </ThemedText>
        <TouchableOpacity style={styles.continueButton} onPress={onComplete}>
          <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.question}>{question}</ThemedText>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => {
            let optionStyle: any = styles.option;

            if (showResult) {
              if (index === correctAnswerIndex) {
                optionStyle = [styles.option, styles.correctOption];
              } else if (index === selectedAnswer && !isCorrect) {
                optionStyle = [styles.option, styles.incorrectOption];
              }
            } else if (selectedAnswer === index) {
              optionStyle = [styles.option, styles.selectedOption];
            }

            return (
              <TouchableOpacity
                key={index}
                style={optionStyle}
                onPress={() => handleOptionSelect(index)}
                disabled={showResult}
              >
                <ThemedText
                  style={[
                    styles.optionText,
                    showResult &&
                      index === correctAnswerIndex &&
                      styles.correctText,
                    showResult &&
                      index === selectedAnswer &&
                      !isCorrect &&
                      styles.incorrectText,
                  ]}
                >
                  {option}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        {showResult && (
          <View style={styles.resultContainer}>
            <ThemedText
              style={[
                styles.resultText,
                isCorrect
                  ? styles.correctResultText
                  : styles.incorrectResultText,
              ]}
            >
              {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
            </ThemedText>
            {!isCorrect && (
              <ThemedText style={styles.correctAnswerText}>
                The correct answer is: {options[correctAnswerIndex]}
              </ThemedText>
            )}
            {(content?.explanation ?? activity.explanation) && (
              <ThemedText style={styles.explanationText}>
                {content?.explanation ?? activity.explanation}
              </ThemedText>
            )}
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          selectedAnswer === null && !showResult && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={selectedAnswer === null && !showResult}
      >
        <ThemedText style={styles.submitButtonText}>
          {showResult ? "Continue" : "Submit"}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
  },
  content: {
    justifyContent: "center",
    marginBottom: 24,
  },
  question: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  option: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedOption: {
    borderColor: "#4A90E2",
    backgroundColor: "rgba(74, 144, 226, 0.1)",
  },
  correctOption: {
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  incorrectOption: {
    borderColor: "#F44336",
    backgroundColor: "rgba(244, 67, 54, 0.1)",
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
  correctText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  incorrectText: {
    color: "#F44336",
    fontWeight: "600",
  },
  resultContainer: {
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  correctResultText: {
    color: "#4CAF50",
  },
  incorrectResultText: {
    color: "#F44336",
  },
  explanationText: {
    fontSize: 14,
    textAlign: "center",
    color: "#4A90E2",
  },
  correctAnswerText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    color: "#4CAF50",
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: "#4A90E2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#CCC",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
    color: "#F44336",
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.7,
  },
  continueButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
