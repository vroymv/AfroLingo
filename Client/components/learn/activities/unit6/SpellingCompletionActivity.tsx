import BaseSpellingCompletionActivity from "@/components/learn/activities/SpellingCompletionActivity";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLessonRuntime } from "@/contexts/LessonRuntimeContext";
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

export default function Unit6SpellingCompletionActivity({
  activity,
  onComplete,
}: Props) {
  useLessonProgressReporter();
  const { award } = useCompletionXP(15, "unit6-spelling");

  const { userId, unitId, currentActivityNumber, totalActivities } =
    useLessonRuntime();

  const content = useMemo(
    () => getUnit6ActivityByRef(activity.contentRef || activity.id),
    [activity.contentRef, activity.id]
  );

  const merged = useMemo(() => {
    const rawItems = (content as any)?.items || (activity as any)?.items || [];

    // Unit 6 JSON uses { word, blanks, meaning }
    const normalizedItems = Array.isArray(rawItems)
      ? rawItems.map((item: any) => ({
          partial: item?.partial ?? item?.blanks,
          complete: item?.complete ?? item?.word,
          hint: item?.hint ?? item?.meaning,
        }))
      : [];

    return {
      question: activity.question || (content as any)?.question,
      description: activity.description || (content as any)?.description,
      items: normalizedItems,
    };
  }, [activity, content]);

  if (!(merged as any)?.items?.length) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Spelling content missing for this activity.</ThemedText>
        <TouchableOpacity style={styles.continue} onPress={onComplete}>
          <ThemedText style={styles.continueText}>Continue</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <BaseSpellingCompletionActivity
      activity={merged as any}
      mistakeReporting={{
        userId,
        unitId,
        activityExternalId: activity.id,
        screen: "Unit6SpellingCompletionActivity",
        metadata: {
          currentActivityNumber,
          totalActivities,
          contentRef: activity.contentRef,
        },
      }}
      onComplete={async () => {
        await award({
          screen: "Unit6SpellingCompletionActivity",
          reason: "completed",
          contentRef: activity.contentRef,
        });
        onComplete();
      }}
    />
  );
}

export const componentKey = "unit6-spelling-completion";

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
