import BaseDialogueActivity from "@/components/learn/activities/DialogueActivity";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { Activity } from "@/data/lessons";
import { getUnit7ActivityByRef } from "@/data/unit7/colorsContent";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  useCompletionXP,
  useLessonProgressReporter,
} from "@/components/learn/activities/unit3/useLessonProgressXP";
import { DUMMY_AUDIO_URL, UNIT_7_THEME } from "./constants";

interface Props {
  activity: Activity & { contentRef?: string };
  onComplete: () => void;
}

export default function Unit7DialogueActivity({ activity, onComplete }: Props) {
  useLessonProgressReporter();
  const { award } = useCompletionXP(10, "unit7-dialogue");

  const content = useMemo(
    () => getUnit7ActivityByRef(activity.contentRef || activity.id),
    [activity.contentRef, activity.id]
  );

  const mergedActivity = useMemo(() => {
    const hasAudio = Boolean(
      (content as any)?.audio || (activity as any)?.audio
    );
    return {
      ...activity,
      question: activity.question || (content as any)?.question,
      description: activity.description || (content as any)?.description,
      audio: hasAudio ? DUMMY_AUDIO_URL : undefined,
      dialogue: (content as any)?.dialogue || (activity as any)?.dialogue,
    };
  }, [activity, content]);

  if (!(mergedActivity as any)?.dialogue?.length) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Dialogue content missing for this activity.</ThemedText>
        <TouchableOpacity style={styles.continue} onPress={onComplete}>
          <ThemedText style={styles.continueText}>Continue</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <BaseDialogueActivity
      activity={mergedActivity as any}
      onComplete={async () => {
        await award({
          screen: "Unit7DialogueActivity",
          reason: "completed",
          contentRef: activity.contentRef,
        });
        onComplete();
      }}
    />
  );
}

export const componentKey = "unit7-dialogue";

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
    backgroundColor: UNIT_7_THEME.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  continueText: {
    color: "white",
    fontWeight: "800",
  },
});
