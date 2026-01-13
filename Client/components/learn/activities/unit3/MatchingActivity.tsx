import BaseMatchingActivity from "@/components/learn/activities/MatchingActivity";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { Activity } from "@/data/lessons";
import { getTimeMatchingSet } from "@/data/unit3/timeContent";
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

export default function MatchingActivity({ activity, onComplete }: Props) {
  useLessonProgressReporter();
  const { award } = useCompletionXP(15, "matching");

  const content = useMemo(() => {
    if ((activity as any)?.pairs?.length) return null;
    return getTimeMatchingSet(activity.contentRef || activity.id);
  }, [activity]);

  const mergedActivity = useMemo(() => {
    if (!content) return activity;
    return {
      ...activity,
      question: activity.question || content.question,
      description: activity.description || content.description,
      pairs: (activity as any).pairs || content.pairs,
    };
  }, [activity, content]);

  if (!(mergedActivity as any)?.pairs?.length) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Matching content missing for this activity.</ThemedText>
        <TouchableOpacity style={styles.continue} onPress={onComplete}>
          <ThemedText style={styles.continueText}>Continue</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <BaseMatchingActivity
      activity={mergedActivity as any}
      onComplete={async () => {
        await award({
          screen: "MatchingActivity",
          reason: "all_pairs_matched",
        });
        onComplete();
      }}
    />
  );
}

export const componentKey = "matching";

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
