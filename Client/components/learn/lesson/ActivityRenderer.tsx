import AlphabetActivity, {
  componentKey as alphabetKey,
} from "@/components/learn/activities/unit1/AlphabetActivity";
import AlphabetVocabularyTableActivity, {
  componentKey as alphabetVocabularyTableKey,
} from "@/components/learn/activities/unit1/AlphabetVocabularyTableActivity";
import ConversationPracticeActivity from "@/components/learn/activities/ConversationPracticeActivity";
import DialogueActivity from "@/components/learn/activities/DialogueActivity";
import FlashcardActivity from "@/components/learn/activities/FlashcardActivity";
import AlphabetIntroductionActivity, {
  componentKey as introductionKey,
} from "@/components/learn/activities/unit1/AlphabetIntroductionActivity";
import ListeningDictationActivity, {
  componentKey as listeningDictationKey,
} from "@/components/learn/activities/unit1/ListeningDictationActivity";
import MatchingActivity from "@/components/learn/activities/MatchingActivity";
import MultipleChoiceActivity from "@/components/learn/activities/unit2/MultipleChoiceActivity";
import NumbersIntroductionActivity, {
  componentKey as numbersIntroductionKey,
} from "@/components/learn/activities/unit2/NumbersIntroductionActivity";
import NumbersListeningActivity from "@/components/learn/activities/unit2/NumbersListeningActivity";
import NumbersTableActivity from "@/components/learn/activities/unit2/NumbersTableActivity";
import NumbersTranslationActivity from "@/components/learn/activities/unit2/NumbersTranslationActivity";
import SpellingCompletionActivity from "@/components/learn/activities/SpellingCompletionActivity";
import VocabularyFillInActivity, {
  componentKey as vocabularyFillInKey,
} from "@/components/learn/activities/unit1/VocabularyFillInActivity";
import VocabularyTableActivity from "@/components/learn/activities/VocabularyTableActivity";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Activity } from "@/data/lessons";
import React from "react";
import { StyleSheet } from "react-native";

interface LessonMeta {
  alphabetImage?: string;
  audio?: string;
  phrase: string;
  meaning: string;
  unitTitle: string;
}

interface ActivityRendererProps {
  activity: Activity;
  lessonMeta: LessonMeta;
  onActivityComplete: () => void;
}

export default function ActivityRenderer({
  activity,
  lessonMeta,
  onActivityComplete,
}: ActivityRendererProps) {
  // Registry keyed by componentKey or fallback to activity.type
  const registry: Record<string, React.ComponentType<any>> = {
    [introductionKey]: AlphabetIntroductionActivity,
    [alphabetKey]: AlphabetActivity,
    flashcard: FlashcardActivity,
    "multiple-choice": MultipleChoiceActivity,
    [listeningDictationKey]: ListeningDictationActivity,
    [vocabularyFillInKey]: VocabularyFillInActivity,
    [alphabetVocabularyTableKey]: AlphabetVocabularyTableActivity,
    [numbersIntroductionKey]: NumbersIntroductionActivity,
    "numbers-table": NumbersTableActivity,
    "numbers-listening": NumbersListeningActivity,
    "numbers-translation": NumbersTranslationActivity,
    "vocabulary-table": VocabularyTableActivity,
    matching: MatchingActivity,
    "spelling-completion": SpellingCompletionActivity,
    "conversation-practice": ConversationPracticeActivity,
    dialogue: DialogueActivity,
  };

  // Support newly added componentKey coming from backend seed. Extend type locally.
  const extended = activity as Activity & { componentKey?: string };
  const key = extended.componentKey || extended.type;
  const Component = registry[key];

  if (!Component) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Unknown activity component: {key}</ThemedText>
      </ThemedView>
    );
  }

  // Special prop handling for flashcard activity
  if (key === "flashcard") {
    return (
      <FlashcardActivity
        activity={activity}
        phrase={lessonMeta.phrase}
        meaning={lessonMeta.meaning}
        onComplete={onActivityComplete}
      />
    );
  }

  return <Component activity={extended} onComplete={onActivityComplete} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },
});
