import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Activity } from "@/data/lessons";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useLessonRuntime } from "@/contexts/LessonRuntimeContext";
import { updateUserProgress } from "@/services/userprogress";
import { awardXP } from "@/services/xp";

interface NumbersIntroductionActivityProps {
  activity: Activity;
  onComplete: () => void;
}

export default function NumbersIntroductionActivity({
  onComplete,
}: NumbersIntroductionActivityProps) {
  const { userId, unitId, currentActivityNumber, totalActivities } =
    useLessonRuntime();

  const isPracticeRuntime =
    typeof unitId === "string" && unitId.startsWith("practice:");

  // Report progress on mount (and when identifiers change)
  useEffect(() => {
    if (!userId) return; // Skip if user not authenticated yet
    if (isPracticeRuntime) return;
    updateUserProgress({
      userId,
      unitId,
      currentActivityNumber,
      totalActivities,
    }).catch((e) => console.warn("Failed to send progress", e));
  }, [
    userId,
    unitId,
    currentActivityNumber,
    totalActivities,
    isPracticeRuntime,
  ]);

  const handlePress = async () => {
    if (userId) {
      const result = await awardXP({
        userId,
        amount: 10,
        sourceType: "activity_completion",
        sourceId: `numbers-intro-${unitId}-${currentActivityNumber}`,
        metadata: {
          unitId,
          currentActivityNumber,
          totalActivities,
          screen: "NumbersIntroductionActivity",
          reason: "activity_completed",
        },
      });

      if (!result.success) {
        console.warn("XP award failed", result.message);
      }
    }

    onComplete();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="calculator" size={64} color="#4A90E2" />
        </View>
        <ThemedText type="title" style={styles.title}>
          Swahili Numbers Introduction
        </ThemedText>
        <ThemedText style={styles.question}>
          {`Let's learn Swahili numbers! You'll discover how to count from 1 to 100 and beyond, essential for everyday conversations.`}
        </ThemedText>
        <View style={styles.tipContainer}>
          <Ionicons name="bulb-outline" size={20} color="#FFB800" />
          <ThemedText style={styles.description}>
            Tap &ldquo;Let&apos;s Go&rdquo; to start counting in Swahili.
          </ThemedText>
        </View>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handlePress}>
        <ThemedText style={styles.continueButtonText}>
          Let&apos;s Go!
        </ThemedText>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

// Identifier used for dynamic activity rendering
export const componentKey = "numbers-introduction";

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    paddingVertical: 24,
    minHeight: 400,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EBF5FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 32,
  },
  question: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 28,
    fontWeight: "500",
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    maxWidth: "90%",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  continueButton: {
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginHorizontal: 20,
    gap: 8,
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
