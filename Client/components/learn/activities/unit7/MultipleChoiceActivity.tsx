import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { Activity } from "@/data/lessons";
import { getUnit7ActivityByRef } from "@/data/unit7/colorsContent";
import { useLessonRuntime } from "@/contexts/LessonRuntimeContext";
import { awardXP } from "@/services/xp";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  useCompletionXP,
  useLessonProgressReporter,
} from "@/components/learn/activities/unit3/useLessonProgressXP";
import { UNIT_7_THEME } from "./constants";

interface Props {
  activity: Activity & { contentRef?: string };
  onComplete: () => void;
}

export default function Unit7MultipleChoiceActivity({
  activity,
  onComplete,
}: Props) {
  useLessonProgressReporter();
  const { award } = useCompletionXP(10, "unit7-mcq-complete");

  const { userId, unitId, currentActivityNumber, totalActivities } =
    useLessonRuntime();

  const content = useMemo(
    () => getUnit7ActivityByRef(activity.contentRef || activity.id),
    [activity.contentRef, activity.id]
  );

  const question =
    (content as any)?.question?.toString?.() ||
    activity.question ||
    "Choose an answer";

  const options: string[] = Array.isArray((content as any)?.options)
    ? ((content as any).options as string[])
    : Array.isArray((activity as any)?.options)
    ? ((activity as any).options as string[])
    : [];

  const correctAnswerIndex =
    typeof (content as any)?.correctAnswer === "number"
      ? ((content as any).correctAnswer as number)
      : typeof (activity as any)?.correctAnswer === "number"
      ? ((activity as any).correctAnswer as number)
      : -1;

  const explanation =
    (content as any)?.explanation?.toString?.() ||
    (activity as any)?.explanation;

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctXPAwarded, setCorrectXPAwarded] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectXPAwarded(false);
  }, [activity.id]);

  const isCorrect =
    selectedAnswer !== null && selectedAnswer === correctAnswerIndex;

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;

    if (!showResult) {
      setShowResult(true);

      if (isCorrect && userId && !correctXPAwarded) {
        const sourceKey = `${activity.id}:${
          activity.contentRef || activity.id
        }`;

        const result = await awardXP({
          userId,
          amount: 15,
          sourceType: "activity_completion",
          sourceId: `unit7-mcq-correct-${sourceKey}`,
          metadata: {
            unitId,
            currentActivityNumber,
            totalActivities,
            screen: "Unit7MultipleChoiceActivity",
            reason: "correct_answer",
            activityId: activity.id,
            contentRef: activity.contentRef,
            selectedAnswerIndex: selectedAnswer,
            correctAnswerIndex,
            selectedAnswerText: options[selectedAnswer],
            correctAnswerText: options[correctAnswerIndex],
          },
        });

        if (result.success) {
          setCorrectXPAwarded(true);
        }
      }

      return;
    }

    await award({
      screen: "Unit7MultipleChoiceActivity",
      reason: "completed",
      contentRef: activity.contentRef,
      isCorrect,
    });

    onComplete();
  };

  if (!question || options.length === 0 || correctAnswerIndex < 0) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Activity content missing.</ThemedText>
        <TouchableOpacity style={styles.fallback} onPress={onComplete}>
          <ThemedText style={styles.fallbackText}>Continue</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          {question}
        </ThemedText>

        <View style={styles.options}>
          {options.map((opt, idx) => {
            const selected = selectedAnswer === idx;
            const showCorrect = showResult && idx === correctAnswerIndex;
            const showWrong = showResult && selected && !isCorrect;

            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.option,
                  selected && !showResult && styles.optionSelected,
                  showCorrect && styles.optionCorrect,
                  showWrong && styles.optionWrong,
                ]}
                onPress={() => (!showResult ? setSelectedAnswer(idx) : null)}
                disabled={showResult}
                activeOpacity={0.9}
              >
                <ThemedText
                  style={[
                    styles.optionText,
                    showCorrect && styles.optionTextCorrect,
                    showWrong && styles.optionTextWrong,
                  ]}
                >
                  {opt}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        {showResult && (
          <View style={styles.resultBox}>
            <ThemedText
              style={[styles.resultTitle, isCorrect ? styles.good : styles.bad]}
            >
              {isCorrect ? "✅ Correct" : "❌ Not quite"}
            </ThemedText>
            {!isCorrect && (
              <ThemedText style={styles.resultSubtitle}>
                Correct answer: {options[correctAnswerIndex]}
              </ThemedText>
            )}
            {!!explanation && (
              <ThemedText style={styles.explanation}>{explanation}</ThemedText>
            )}
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.cta,
          selectedAnswer === null && !showResult && styles.ctaDisabled,
        ]}
        onPress={handleSubmit}
        disabled={selectedAnswer === null && !showResult}
        activeOpacity={0.9}
      >
        <ThemedText style={styles.ctaText}>
          {showResult ? "Continue" : "Submit"}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

export const componentKey = "unit7-multiple-choice";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "space-between",
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
    marginBottom: 14,
  },
  options: {
    gap: 10,
  },
  option: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  optionSelected: {
    borderColor: UNIT_7_THEME.primary,
    backgroundColor: "rgba(233, 30, 99, 0.14)",
  },
  optionCorrect: {
    borderColor: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
  },
  optionWrong: {
    borderColor: "#EF4444",
    backgroundColor: "rgba(239, 68, 68, 0.12)",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "700",
    opacity: 0.9,
  },
  optionTextCorrect: {
    color: "#065F46",
  },
  optionTextWrong: {
    color: "#7F1D1D",
  },
  resultBox: {
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  resultTitle: {
    fontWeight: "900",
    marginBottom: 6,
  },
  good: {
    color: "#047857",
  },
  bad: {
    color: "#B91C1C",
  },
  resultSubtitle: {
    opacity: 0.85,
    marginBottom: 6,
  },
  explanation: {
    opacity: 0.8,
    lineHeight: 20,
  },
  cta: {
    backgroundColor: UNIT_7_THEME.primary,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: UNIT_7_THEME.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaDisabled: {
    opacity: 0.55,
  },
  ctaText: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
    gap: 12,
  },
  fallback: {
    backgroundColor: UNIT_7_THEME.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  fallbackText: {
    color: "white",
    fontWeight: "800",
  },
});
