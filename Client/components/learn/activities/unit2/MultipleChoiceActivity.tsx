import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Activity } from "@/data/lessons";
import { getMultipleChoiceActivities } from "@/data/multiple-choice-activity-content";
import { useLessonRuntime } from "@/contexts/LessonRuntimeContext";
import { awardXP } from "@/services/xp";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./MultipleChoiceActivity.styles";

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
  const [correctXPAwarded, setCorrectXPAwarded] = useState(false);

  const { userId, unitId, currentActivityNumber, totalActivities } =
    useLessonRuntime();

  console.log("MultipleChoiceActivity activity:", activity); // --- IGNORE ---

  // Get multiple choice activities and use the first one
  const activities = getMultipleChoiceActivities(activity.id);
  const currentActivity = activities.length > 0 ? activities[0] : activity;

  // Reset state when the activity changes so previous answers don't persist
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectXPAwarded(false);
  }, [activity.id]);

  const question = currentActivity.question;
  const options: string[] = Array.isArray(currentActivity.options)
    ? currentActivity.options
    : [];
  const correctAnswerRaw = currentActivity.correctAnswer;
  const correctAnswerIndex =
    typeof correctAnswerRaw === "number"
      ? correctAnswerRaw
      : typeof correctAnswerRaw === "string"
      ? options.indexOf(correctAnswerRaw)
      : -1;

  const handleOptionSelect = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer !== null && !showResult) {
      setShowResult(true);

      const isCorrectNow = selectedAnswer === correctAnswerIndex;
      if (isCorrectNow && userId && !correctXPAwarded) {
        const sourceKey = `${activity.id}:${currentActivity.id}`;
        const result = await awardXP({
          userId,
          amount: 15,
          sourceType: "activity_completion",
          sourceId: `mcq-correct-${sourceKey}`,
          metadata: {
            unitId,
            currentActivityNumber,
            totalActivities,
            screen: "MultipleChoiceActivity",
            reason: "correct_answer",
            activityId: activity.id,
            contentId: currentActivity.id,
            selectedAnswerIndex: selectedAnswer,
            correctAnswerIndex,
            selectedAnswerText: options[selectedAnswer],
            correctAnswerText: options[correctAnswerIndex],
          },
        });

        if (!result.success) {
          console.warn("XP award for correct answer failed", result.message);
        } else {
          setCorrectXPAwarded(true);
        }
      }
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
            {currentActivity.explanation && (
              <ThemedText style={styles.explanationText}>
                {currentActivity.explanation}
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
