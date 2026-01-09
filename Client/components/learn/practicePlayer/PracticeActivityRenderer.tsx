import AlphabetVocabularyTableActivity, {
  componentKey as alphabetVocabularyTableKey,
} from "@/components/learn/practiceActivities/unit1/AlphabetVocabularyTableActivity";
import ConversationPracticeActivity from "@/components/learn/practiceActivities/ConversationPracticeActivity";
import DialogueActivity from "@/components/learn/practiceActivities/DialogueActivity";
import FlashcardActivity from "@/components/learn/practiceActivities/FlashcardActivity";
import ListeningDictationActivity, {
  componentKey as listeningDictationKey,
} from "@/components/learn/practiceActivities/unit1/ListeningDictationActivity";
import MatchingActivity from "@/components/learn/practiceActivities/MatchingActivity";
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
import SpellingCompletionActivity from "@/components/learn/practiceActivities/SpellingCompletionActivity";
import VocabularyFillInActivity, {
  componentKey as vocabularyFillInKey,
} from "@/components/learn/practiceActivities/unit1/VocabularyFillInActivity";
import VocabularyTableActivity from "@/components/learn/practiceActivities/VocabularyTableActivity";
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
    "vocabulary-table": VocabularyTableActivity,
    matching: MatchingActivity,
    "spelling-completion": SpellingCompletionActivity,
    "conversation-practice": ConversationPracticeActivity,
    dialogue: DialogueActivity,
    flashcard: FlashcardActivity,
  };

  const selectionKey = activity.componentKey || activity.type || "";
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

  // The existing activity components are typed around the local Activity model.
  // For practice we pass a minimal shape and allow components to fetch/use contentRef later.
  const activityAsActivity = activity as unknown as Activity & {
    componentKey?: string;
    contentRef?: string;
  };

  if (selectionKey === "flashcard") {
    return (
      <FlashcardActivity
        activity={activityAsActivity}
        phrase={title || "Practice"}
        meaning={""}
        onComplete={onActivityComplete}
      />
    );
  }

  return (
    <Component activity={activityAsActivity} onComplete={onActivityComplete} />
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
