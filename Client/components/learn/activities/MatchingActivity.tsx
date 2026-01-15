import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOptionalLessonRuntime } from "@/contexts/LessonRuntimeContext";
import { Activity } from "@/data/lessons";
import { recordMistake } from "@/services/mistakes";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface MatchPair {
  left: string;
  right: string;
}

interface MatchingActivityProps {
  activity: Activity & {
    pairs?: MatchPair[];
  };
  onComplete: () => void;
}

export default function MatchingActivity({
  activity,
  onComplete,
}: MatchingActivityProps) {
  const runtime = useOptionalLessonRuntime();

  const isPracticeRuntime =
    typeof runtime?.unitId === "string" &&
    runtime.unitId.startsWith("practice:");
  const userId = runtime?.userId ?? null;
  const unitId = runtime?.unitId;
  const currentActivityNumber = runtime?.currentActivityNumber;
  const totalActivities = runtime?.totalActivities;

  const pairs = activity.pairs || [];

  // Shuffle the right side
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [rightItems] = useState(() => shuffleArray(pairs.map((p) => p.right)));
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matches, setMatches] = useState<Map<number, number>>(new Map());
  const [correctMatches, setCorrectMatches] = useState<Set<number>>(new Set());
  const [incorrectPairs, setIncorrectPairs] = useState<
    { left: number; right: number }[]
  >([]);

  const handleLeftPress = (index: number) => {
    if (correctMatches.has(index)) return; // Already matched
    setSelectedLeft(index);
    setSelectedRight(null);
  };

  const handleRightPress = (index: number) => {
    if (Array.from(matches.values()).includes(index)) return; // Already matched

    if (selectedLeft !== null) {
      // Check if this is a correct match
      const leftValue = pairs[selectedLeft].left;
      const rightValue = rightItems[index];
      const correctPair = pairs.find(
        (p) => p.left === leftValue && p.right === rightValue
      );

      if (correctPair) {
        // Correct match!
        const newMatches = new Map(matches);
        newMatches.set(selectedLeft, index);
        setMatches(newMatches);

        const newCorrectMatches = new Set(correctMatches);
        newCorrectMatches.add(selectedLeft);
        setCorrectMatches(newCorrectMatches);

        setSelectedLeft(null);
        setSelectedRight(null);

        // Clear any previous incorrect indicators
        setIncorrectPairs([]);
      } else {
        // Incorrect match
        if (userId && unitId && !isPracticeRuntime) {
          const expectedRight = pairs[selectedLeft]?.right;

          void recordMistake({
            userId,
            unitId,
            activityExternalId: activity.id,
            questionText: String(activity.question || "Match the pairs"),
            userAnswer: {
              leftIndex: selectedLeft,
              rightIndex: index,
              left: leftValue,
              right: rightValue,
            },
            correctAnswer: {
              left: leftValue,
              right: expectedRight,
            },
            mistakeType: "matching",
            occurredAt: new Date().toISOString(),
            metadata: {
              currentActivityNumber,
              totalActivities,
              screen: "MatchingActivity",
              pairsCount: pairs.length,
            },
          });
        }

        setIncorrectPairs([{ left: selectedLeft, right: index }]);
        setSelectedRight(index);

        // Clear after a short delay
        setTimeout(() => {
          setIncorrectPairs([]);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 1000);
      }
    }
  };

  const isComplete = correctMatches.size === pairs.length;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {activity.question}
          </ThemedText>
          {activity.description && (
            <ThemedText type="default" style={styles.description}>
              {activity.description}
            </ThemedText>
          )}
          <ThemedText type="default" style={styles.instruction}>
            Tap a Swahili word, then tap its English translation
          </ThemedText>
        </View>

        {/* Matching Area */}
        <View style={styles.matchingContainer}>
          {/* Left Column */}
          <View style={styles.column}>
            {pairs.map((pair, index) => {
              const isMatched = correctMatches.has(index);
              const isSelected = selectedLeft === index;
              const hasIncorrect = incorrectPairs.some((p) => p.left === index);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.item,
                    styles.leftItem,
                    isMatched && styles.matchedItem,
                    isSelected && styles.selectedItem,
                    hasIncorrect && styles.incorrectItem,
                  ]}
                  onPress={() => handleLeftPress(index)}
                  disabled={isMatched}
                >
                  <ThemedText
                    style={[
                      styles.itemText,
                      isMatched && styles.matchedText,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {pair.left}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Right Column */}
          <View style={styles.column}>
            {rightItems.map((item, index) => {
              const isMatched = Array.from(matches.values()).includes(index);
              const isSelected = selectedRight === index;
              const hasIncorrect = incorrectPairs.some(
                (p) => p.right === index
              );

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.item,
                    styles.rightItem,
                    isMatched && styles.matchedItem,
                    isSelected && styles.selectedItem,
                    hasIncorrect && styles.incorrectItem,
                  ]}
                  onPress={() => handleRightPress(index)}
                  disabled={isMatched}
                >
                  <ThemedText
                    style={[
                      styles.itemText,
                      isMatched && styles.matchedText,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {item}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <ThemedText type="default" style={styles.progressText}>
            Matched: {correctMatches.size} / {pairs.length}
          </ThemedText>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !isComplete && styles.disabledButton]}
          onPress={onComplete}
          disabled={!isComplete}
        >
          <ThemedText style={styles.continueButtonText}>
            {isComplete ? "Continue" : "Match all pairs to continue"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 8,
  },
  instruction: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
    fontStyle: "italic",
  },
  matchingContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  column: {
    flex: 1,
    gap: 12,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E5EA",
    backgroundColor: "#fff",
  },
  leftItem: {
    backgroundColor: "#E3F2FD",
  },
  rightItem: {
    backgroundColor: "#FFF3E0",
  },
  selectedItem: {
    borderColor: "#4A90E2",
    backgroundColor: "#D6EBFF",
  },
  matchedItem: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
    opacity: 0.6,
  },
  incorrectItem: {
    borderColor: "#F44336",
    backgroundColor: "#FFEBEE",
  },
  itemText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  selectedText: {
    color: "#4A90E2",
    fontWeight: "600",
  },
  matchedText: {
    color: "#4CAF50",
  },
  progressContainer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  continueButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#B0BEC5",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
