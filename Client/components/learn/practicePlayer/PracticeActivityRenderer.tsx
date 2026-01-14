import AlphabetVocabularyTableActivity, {
  componentKey as alphabetVocabularyTableKey,
} from "@/components/learn/practiceActivities/unit1/AlphabetVocabularyTableActivity";
import FlashcardActivity from "@/components/learn/practiceActivities/FlashcardActivity";
import ListeningDictationActivity, {
  componentKey as listeningDictationKey,
} from "@/components/learn/practiceActivities/unit1/ListeningDictationActivity";
import TimeIntroductionActivity from "@/components/learn/practiceActivities/unit3/IntroductionActivity";
import TimeVocabularyTableActivity from "@/components/learn/practiceActivities/unit3/VocabularyTableActivity";
import TimeSpellingCompletionActivity from "@/components/learn/practiceActivities/unit3/SpellingCompletionActivity";
import TimeMatchingActivity from "@/components/learn/practiceActivities/unit3/MatchingActivity";
import TimeListeningDictationActivity from "@/components/learn/practiceActivities/unit3/ListeningDictationActivity";
import TimeConversationPracticeActivity from "@/components/learn/practiceActivities/unit3/ConversationPracticeActivity";
import TimeDialogueActivity from "@/components/learn/practiceActivities/unit3/DialogueActivity";
import MultipleChoiceActivity, {
  componentKey as multipleChoiceKey,
} from "@/components/learn/practiceActivities/unit2/MultipleChoiceActivity";
import NumbersIntroductionActivity, {
  componentKey as numbersIntroductionKey,
} from "@/components/learn/practiceActivities/unit2/NumbersIntroductionActivity";
import NumbersListeningActivity, {
  componentKey as numbersListeningKey,
} from "@/components/learn/practiceActivities/unit2/NumbersListeningActivity";
import NumbersTableActivity, {
  componentKey as numbersTableKey,
} from "@/components/learn/practiceActivities/unit2/NumbersTableActivity";
import NumbersTranslationActivity, {
  componentKey as numbersTranslationKey,
} from "@/components/learn/practiceActivities/unit2/NumbersTranslationActivity";
import Unit5IntroductionActivity, {
  componentKey as unit5IntroductionKey,
} from "@/components/learn/practiceActivities/unit5/IntroductionActivity";
import Unit5VocabularyTableActivity, {
  componentKey as unit5VocabularyTableKey,
} from "@/components/learn/practiceActivities/unit5/VocabularyTableActivity";
import Unit5MultipleChoiceActivity, {
  componentKey as unit5MultipleChoiceKey,
} from "@/components/learn/practiceActivities/unit5/MultipleChoiceActivity";
import Unit5SpellingCompletionActivity, {
  componentKey as unit5SpellingCompletionKey,
} from "@/components/learn/practiceActivities/unit5/SpellingCompletionActivity";
import Unit5MatchingActivity, {
  componentKey as unit5MatchingKey,
} from "@/components/learn/practiceActivities/unit5/MatchingActivity";
import Unit5ListeningDictationActivity, {
  componentKey as unit5ListeningDictationKey,
} from "@/components/learn/practiceActivities/unit5/ListeningDictationActivity";
import Unit6IntroductionActivity, {
  componentKey as unit6IntroductionKey,
} from "@/components/learn/practiceActivities/unit6/IntroductionActivity";
import Unit6VocabularyTableActivity, {
  componentKey as unit6VocabularyTableKey,
} from "@/components/learn/practiceActivities/unit6/VocabularyTableActivity";
import Unit6MultipleChoiceActivity, {
  componentKey as unit6MultipleChoiceKey,
} from "@/components/learn/practiceActivities/unit6/MultipleChoiceActivity";
import Unit6MatchingActivity, {
  componentKey as unit6MatchingKey,
} from "@/components/learn/practiceActivities/unit6/MatchingActivity";
import Unit6SpellingCompletionActivity, {
  componentKey as unit6SpellingCompletionKey,
} from "@/components/learn/practiceActivities/unit6/SpellingCompletionActivity";
import Unit6ListeningDictationActivity, {
  componentKey as unit6ListeningDictationKey,
} from "@/components/learn/practiceActivities/unit6/ListeningDictationActivity";
import VocabularyFillInActivity, {
  componentKey as vocabularyFillInKey,
} from "@/components/learn/practiceActivities/unit1/VocabularyFillInActivity";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { Activity } from "@/data/lessons";
import React from "react";
import { StyleSheet } from "react-native";

export type PracticeActivityLike = {
  id: string;
  type?: string;
  componentKey?: string;
  contentRef?: string;
};

export default function PracticeActivityRenderer({
  activity,
  title,
  onActivityComplete,
}: {
  activity: PracticeActivityLike;
  title?: string;
  onActivityComplete: () => void;
}) {
  const registry: Record<string, React.ComponentType<any>> = {
    [multipleChoiceKey]: MultipleChoiceActivity,
    [listeningDictationKey]: ListeningDictationActivity,
    [vocabularyFillInKey]: VocabularyFillInActivity,
    [alphabetVocabularyTableKey]: AlphabetVocabularyTableActivity,
    [numbersIntroductionKey]: NumbersIntroductionActivity,
    [numbersTableKey]: NumbersTableActivity,
    [numbersListeningKey]: NumbersListeningActivity,
    [numbersTranslationKey]: NumbersTranslationActivity,
    [unit5IntroductionKey]: Unit5IntroductionActivity,
    [unit5VocabularyTableKey]: Unit5VocabularyTableActivity,
    [unit5MultipleChoiceKey]: Unit5MultipleChoiceActivity,
    [unit5SpellingCompletionKey]: Unit5SpellingCompletionActivity,
    [unit5MatchingKey]: Unit5MatchingActivity,
    [unit5ListeningDictationKey]: Unit5ListeningDictationActivity,
    [unit6IntroductionKey]: Unit6IntroductionActivity,
    [unit6VocabularyTableKey]: Unit6VocabularyTableActivity,
    [unit6MultipleChoiceKey]: Unit6MultipleChoiceActivity,
    [unit6MatchingKey]: Unit6MatchingActivity,
    [unit6SpellingCompletionKey]: Unit6SpellingCompletionActivity,
    [unit6ListeningDictationKey]: Unit6ListeningDictationActivity,
    introduction: TimeIntroductionActivity,
    "vocabulary-table": TimeVocabularyTableActivity,
    matching: TimeMatchingActivity,
    "spelling-completion": TimeSpellingCompletionActivity,
    "conversation-practice": TimeConversationPracticeActivity,
    dialogue: TimeDialogueActivity,
    flashcard: FlashcardActivity,
  };

  const selectionKey = activity.componentKey || activity.type || "";

  // The existing activity components are typed around the local Activity model.
  // For practice we pass a minimal shape and allow components to fetch/use contentRef later.
  const activityAsActivity = activity as unknown as Activity & {
    componentKey?: string;
    contentRef?: string;
  };

  // Special routing: unit-3 listening dictation uses contentRef like "activity-time-14".
  if (
    selectionKey === listeningDictationKey &&
    typeof activity.contentRef === "string" &&
    activity.contentRef.startsWith("activity-time-")
  ) {
    return (
      <TimeListeningDictationActivity
        key={activityAsActivity.id}
        activity={activityAsActivity}
        onComplete={onActivityComplete}
      />
    );
  }

  const Component = registry[selectionKey];

  if (!Component) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>
          Unknown practice activity component: {selectionKey}
        </ThemedText>
      </ThemedView>
    );
  }

  if (selectionKey === "flashcard") {
    return (
      <FlashcardActivity
        key={activityAsActivity.id}
        activity={activityAsActivity}
        phrase={title || "Practice"}
        meaning={""}
        onComplete={onActivityComplete}
      />
    );
  }

  return (
    <Component
      key={activityAsActivity.id}
      activity={activityAsActivity}
      onComplete={onActivityComplete}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },
});
