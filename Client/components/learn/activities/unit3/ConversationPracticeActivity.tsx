import BaseConversationPracticeActivity from "@/components/learn/activities/ConversationPracticeActivity";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { Activity } from "@/data/lessons";
import { getTimeConversation } from "@/data/unit3/timeContent";
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

export default function ConversationPracticeActivity({
  activity,
  onComplete,
}: Props) {
  useLessonProgressReporter();
  const { award } = useCompletionXP(10, "conversation");

  const content = useMemo(() => {
    if ((activity as any)?.conversation?.length) return null;
    return getTimeConversation(activity.contentRef || activity.id);
  }, [activity]);

  const mergedActivity = useMemo(() => {
    if (!content) return activity as any;
    return {
      ...activity,
      question: activity.question || content.question,
      description: activity.description || content.description,
      conversation: (activity as any).conversation || content.conversation,
    };
  }, [activity, content]);

  if (!(mergedActivity as any)?.conversation?.length) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Conversation content missing for this activity.</ThemedText>
        <TouchableOpacity style={styles.continue} onPress={onComplete}>
          <ThemedText style={styles.continueText}>Continue</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <BaseConversationPracticeActivity
      activity={mergedActivity as any}
      onComplete={async () => {
        await award({
          screen: "ConversationPracticeActivity",
          reason: "completed",
        });
        onComplete();
      }}
    />
  );
}

export const componentKey = "conversation-practice";

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
