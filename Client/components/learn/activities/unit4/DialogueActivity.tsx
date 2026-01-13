import BaseDialogueActivity from "@/components/learn/activities/DialogueActivity";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { Activity } from "@/data/lessons";
import { getGreetingsActivityByRef } from "@/data/unit4/greetingsContent";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  useCompletionXP,
  useLessonProgressReporter,
} from "@/components/learn/activities/unit3/useLessonProgressXP";
import { UNIT_4_THEME } from "./constants";

interface Props {
  activity: Activity & { contentRef?: string };
  onComplete: () => void;
}

export default function GreetingsDialogueActivity({
  activity,
  onComplete,
}: Props) {
  useLessonProgressReporter();
  const { award } = useCompletionXP(20, "greetings-dialogue");

  const content = useMemo(
    () => getGreetingsActivityByRef(activity.contentRef || activity.id),
    [activity.contentRef, activity.id]
  );

  const merged = useMemo(() => {
    return {
      question: activity.question || (content as any)?.question,
      description: activity.description || (content as any)?.description,
      image: (content as any)?.image || (activity as any)?.image,
      audio: (content as any)?.audio || (activity as any)?.audio,
      dialogue: (content as any)?.dialogue || (activity as any)?.dialogue,
    };
  }, [activity, content]);

  if (!(merged as any)?.dialogue?.length) {
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
      activity={merged as any}
      onComplete={async () => {
        await award({
          screen: "GreetingsDialogueActivity",
          reason: "completed",
        });
        onComplete();
      }}
    />
  );
}

export const componentKey = "greetings-dialogue";

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
    backgroundColor: UNIT_4_THEME.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  continueText: {
    color: "white",
    fontWeight: "800",
  },
});
