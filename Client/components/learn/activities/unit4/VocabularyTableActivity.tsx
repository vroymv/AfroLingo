import BaseVocabularyTableActivity from "@/components/learn/activities/VocabularyTableActivity";
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
import { DUMMY_AUDIO_URL, UNIT_4_THEME } from "./constants";

interface Props {
  activity: Activity & { contentRef?: string };
  onComplete: () => void;
}

export default function GreetingsVocabularyTableActivity({
  activity,
  onComplete,
}: Props) {
  useLessonProgressReporter();
  const { award } = useCompletionXP(10, "greetings-vocab");

  const content = useMemo(
    () => getGreetingsActivityByRef(activity.contentRef || activity.id),
    [activity.contentRef, activity.id]
  );

  const mergedActivity = useMemo(() => {
    const items = (
      (content as any)?.items ??
      (activity as any)?.items ??
      []
    ).map((item: any) => ({
      ...item,
      audio: item?.audio || DUMMY_AUDIO_URL,
    }));

    return {
      ...activity,
      question: activity.question || (content as any)?.question,
      description: activity.description || (content as any)?.description,
      audio: (activity as any).audio || (content as any)?.audio,
      items,
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
        await award({
          screen: "GreetingsVocabularyTableActivity",
          reason: "completed",
        });
        onComplete();
      }}
    />
  );
}

export const componentKey = "greetings-vocabulary-table";

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
