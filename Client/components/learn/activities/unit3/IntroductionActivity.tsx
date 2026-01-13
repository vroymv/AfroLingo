import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { Activity } from "@/data/lessons";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  useLessonProgressReporter,
  useCompletionXP,
} from "./useLessonProgressXP";

interface IntroductionActivityProps {
  activity: Activity & { contentRef?: string };
  onComplete: () => void;
}

export default function IntroductionActivity({
  activity,
  onComplete,
}: IntroductionActivityProps) {
  useLessonProgressReporter();
  const { award } = useCompletionXP(10, "intro");

  const title = useMemo(() => {
    if (activity.question && activity.question.trim()) return activity.question;
    return "Welcome!";
  }, [activity.question]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar" size={54} color="#9C27B0" />
        </View>

        <ThemedText type="title" style={styles.heading}>
          {"Days, Months, and Seasons"}
        </ThemedText>

        <ThemedText style={styles.title}>{title}</ThemedText>

        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={18} color="#FFB800" />
          <ThemedText style={styles.tipText}>
            Learn the words first, then test yourself with quick quizzes.
          </ThemedText>
        </View>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={async () => {
          await award({
            screen: "IntroductionActivity",
            reason: "start_lesson",
          });
          onComplete();
        }}
      >
        <ThemedText style={styles.continueButtonText}>
          {"Let’s start"}
        </ThemedText>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

export const componentKey = "days-months-seasons-introduction";

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    paddingVertical: 24,
    minHeight: 420,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 14,
  },
  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(156, 39, 176, 0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  heading: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "800",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
    opacity: 0.85,
    paddingHorizontal: 10,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFF9E6",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 6,
  },
  tipText: {
    fontSize: 14,
    opacity: 0.75,
    flex: 1,
  },
  continueButton: {
    backgroundColor: "#9C27B0",
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  continueButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "800",
  },
});
