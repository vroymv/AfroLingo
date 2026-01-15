import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLessonRuntime } from "@/contexts/LessonRuntimeContext";
import type { Activity } from "@/data/lessons";
import { getGreetingsActivityByRef } from "@/data/unit4/greetingsContent";
import { awardXP } from "@/services/xp";
import { recordMistake } from "@/services/mistakes";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  useCompletionXP,
  useLessonProgressReporter,
} from "@/components/learn/activities/unit3/useLessonProgressXP";
import { UNIT_4_THEME } from "./constants";

interface Props {
  activity: Activity & { contentRef?: string };
  onComplete: () => void;
}

export default function GreetingsMultipleChoiceActivity({
  activity,
  onComplete,
}: Props) {
  useLessonProgressReporter();
  const { award } = useCompletionXP(10, "greetings-mcq-complete");

  const { userId, unitId, currentActivityNumber, totalActivities } =
    useLessonRuntime();

  const content = useMemo(
    () => getGreetingsActivityByRef(activity.contentRef || activity.id),
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

      if (!isCorrect && userId && unitId) {
        void recordMistake({
          userId,
          unitId,
          activityExternalId: activity.id,
          questionText: String(question),
          userAnswer: {
            selectedAnswerIndex: selectedAnswer,
            selectedAnswerText: options[selectedAnswer],
          },
          correctAnswer: {
            correctAnswerIndex,
            correctAnswerText: options[correctAnswerIndex],
          },
          mistakeType: "multiple-choice",
          occurredAt: new Date().toISOString(),
          metadata: {
            currentActivityNumber,
            totalActivities,
            screen: "GreetingsMultipleChoiceActivity",
            contentRef: activity.contentRef,
          },
        });
      }

      if (isCorrect && userId && !correctXPAwarded) {
        const sourceKey = `${activity.id}:${
          activity.contentRef || activity.id
        }`;
        const result = await awardXP({
          userId,
          amount: 15,
          sourceType: "activity_completion",
          sourceId: `mcq-correct-${sourceKey}`,
          metadata: {
            unitId,
            currentActivityNumber,
            totalActivities,
            screen: "GreetingsMultipleChoiceActivity",
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
      screen: "GreetingsMultipleChoiceActivity",
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
      >
        <ThemedText style={styles.ctaText}>
          {showResult ? "Continue" : "Submit"}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

export const componentKey = "greetings-multiple-choice";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#F8F9FA",
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
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },
  options: {
    gap: 12,
  },
  option: {
    backgroundColor: "#FFF7ED",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionSelected: {
    borderColor: UNIT_4_THEME.primary,
    backgroundColor: "rgba(255, 152, 0, 0.12)",
  },
  optionCorrect: {
    borderColor: "#16A34A",
    backgroundColor: "rgba(22, 163, 74, 0.10)",
  },
  optionWrong: {
    borderColor: "#DC2626",
    backgroundColor: "rgba(220, 38, 38, 0.08)",
  },
  optionText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  optionTextCorrect: {
    color: "#16A34A",
  },
  optionTextWrong: {
    color: "#DC2626",
  },
  resultBox: {
    marginTop: 14,
    backgroundColor: "#FFF7ED",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 152, 0, 0.18)",
  },
  resultTitle: {
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 6,
  },
  resultSubtitle: {
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 6,
    fontWeight: "700",
  },
  explanation: {
    textAlign: "center",
    opacity: 0.8,
  },
  good: { color: "#16A34A" },
  bad: { color: "#DC2626" },
  cta: {
    backgroundColor: UNIT_4_THEME.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  ctaDisabled: {
    backgroundColor: "#D1D5DB",
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
    gap: 12,
    padding: 20,
  },
  fallback: {
    backgroundColor: UNIT_4_THEME.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  fallbackText: {
    color: "white",
    fontWeight: "800",
  },
});
