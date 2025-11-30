import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Activity } from "@/data/lessons";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useLessonRuntime } from "@/contexts/LessonRuntimeContext";

interface IntroductionActivityProps {
  activity: Activity;
  onComplete: () => void;
}

export default function AlphabetIntroductionActivity({
  onComplete,
}: IntroductionActivityProps) {
  const { userId, unitId, currentActivityNumber, totalActivities } =
    useLessonRuntime();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="language" size={64} color="#4A90E2" />
        </View>
        <ThemedText type="title" style={styles.title}>
          Swahili Alphabet Introduction
        </ThemedText>
        <ThemedText style={styles.question}>
          {`Let's explore the Swahili alphabet! You'll learn the letters, their sounds, and how they're used in everyday words.`}
        </ThemedText>
        <View style={styles.tipContainer}>
          <Ionicons name="bulb-outline" size={20} color="#FFB800" />
          <ThemedText style={styles.description}>
            Tap &ldquo;Let&apos;s Go&rdquo; to begin your journey into the
            Swahili alphabet.
          </ThemedText>
        </View>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={onComplete}>
        <ThemedText style={styles.continueButtonText}>
          Let&apos;s Go!
        </ThemedText>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

// Identifier used for dynamic activity rendering
export const componentKey = "introduction";

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
    gap: 8,
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  continueButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
