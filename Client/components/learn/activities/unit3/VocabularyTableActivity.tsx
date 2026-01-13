import BaseVocabularyTableActivity from "@/components/learn/activities/VocabularyTableActivity";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { Activity } from "@/data/lessons";
import { getTimeVocabularyTable } from "@/data/unit3/timeContent";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  useLessonProgressReporter,
  useCompletionXP,
} from "./useLessonProgressXP";

interface Props {
  activity: Activity & { contentRef?: string };
  onComplete: () => void;
}

export default function VocabularyTableActivity({
  activity,
  onComplete,
}: Props) {
  useLessonProgressReporter();
  const { award } = useCompletionXP(10, "vocab-table");

  const content = useMemo(() => {
    if ((activity as any)?.items?.length) return null;
    return getTimeVocabularyTable(activity.contentRef || activity.id);
  }, [activity]);

  const mergedActivity = useMemo(() => {
    if (!content) return activity;
    return {
      ...activity,
      question: activity.question || content.question,
      description: activity.description || content.description,
      audio: (activity as any).audio || content.audio,
      items: (activity as any).items || content.items,
    };
  }, [activity, content]);

  if (!(mergedActivity as any)?.items?.length) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Vocabulary content missing for this activity.</ThemedText>
        <TouchableOpacity style={styles.continue} onPress={onComplete}>
          <ThemedText style={styles.continueText}>Continue</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <BaseVocabularyTableActivity
      activity={mergedActivity as any}
      onComplete={async () => {
        await award({ screen: "VocabularyTableActivity", reason: "completed" });
        onComplete();
      }}
    />
  );
}

export const componentKey = "vocabulary-table";

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
    gap: 12,
  },
  continue: {
    backgroundColor: "#9C27B0",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  continueText: {
    color: "white",
    fontWeight: "800",
  },
});
