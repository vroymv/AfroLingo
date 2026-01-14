import BaseMatchingActivity from "@/components/learn/activities/MatchingActivity";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { Activity } from "@/data/lessons";
import { getUnit6ActivityByRef } from "@/data/unit6/pluralsOfNounsContent";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  useCompletionXP,
  useLessonProgressReporter,
} from "@/components/learn/activities/unit3/useLessonProgressXP";
import { UNIT_6_THEME } from "./constants";

interface Props {
  activity: Activity & { contentRef?: string };
  onComplete: () => void;
}

export default function Unit6MatchingActivity({ activity, onComplete }: Props) {
  useLessonProgressReporter();
  const { award } = useCompletionXP(15, "unit6-matching");

  const content = useMemo(
    () => getUnit6ActivityByRef(activity.contentRef || activity.id),
    [activity.contentRef, activity.id]
  );

  const mergedActivity = useMemo(() => {
    return {
      ...activity,
      question: activity.question || (content as any)?.question,
      description: activity.description || (content as any)?.description,
      pairs: (content as any)?.pairs || (activity as any)?.pairs,
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
          screen: "Unit6MatchingActivity",
          reason: "all_pairs_matched",
          contentRef: activity.contentRef,
        });
        onComplete();
      }}
    />
  );
}

export const componentKey = "unit6-matching";

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
    backgroundColor: UNIT_6_THEME.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  continueText: {
    color: "white",
    fontWeight: "800",
  },
});
