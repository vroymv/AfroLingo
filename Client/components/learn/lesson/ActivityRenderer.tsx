import AlphabetActivity, {
  componentKey as alphabetKey,
} from "@/components/learn/activities/unit1/AlphabetActivity";
import AlphabetVocabularyTableActivity, {
  componentKey as alphabetVocabularyTableKey,
} from "@/components/learn/activities/unit1/AlphabetVocabularyTableActivity";
import FlashcardActivity from "@/components/learn/activities/FlashcardActivity";
import AlphabetIntroductionActivity, {
  componentKey as introductionKey,
} from "@/components/learn/activities/unit1/AlphabetIntroductionActivity";
import ListeningDictationActivity, {
  componentKey as listeningDictationKey,
} from "@/components/learn/activities/unit1/ListeningDictationActivity";
import MultipleChoiceActivity from "@/components/learn/activities/unit2/MultipleChoiceActivity";
import NumbersIntroductionActivity, {
  componentKey as numbersIntroductionKey,
} from "@/components/learn/activities/unit2/NumbersIntroductionActivity";
import NumbersListeningActivity from "@/components/learn/activities/unit2/NumbersListeningActivity";
import NumbersTableActivity from "@/components/learn/activities/unit2/NumbersTableActivity";
import NumbersTranslationActivity from "@/components/learn/activities/unit2/NumbersTranslationActivity";
import VocabularyFillInActivity, {
  componentKey as vocabularyFillInKey,
} from "@/components/learn/activities/unit1/VocabularyFillInActivity";
import TimeIntroductionActivity, {
  componentKey as timeIntroductionKey,
} from "@/components/learn/activities/unit3/IntroductionActivity";
import TimeListeningDictationActivity from "@/components/learn/activities/unit3/ListeningDictationActivity";
import TimeMatchingActivity, {
  componentKey as timeMatchingKey,
} from "@/components/learn/activities/unit3/MatchingActivity";
import TimeSpellingCompletionActivity, {
  componentKey as timeSpellingCompletionKey,
} from "@/components/learn/activities/unit3/SpellingCompletionActivity";
import TimeVocabularyTableActivity, {
  componentKey as timeVocabularyTableKey,
} from "@/components/learn/activities/unit3/VocabularyTableActivity";
import TimeConversationPracticeActivity, {
  componentKey as timeConversationPracticeKey,
} from "@/components/learn/activities/unit3/ConversationPracticeActivity";
import TimeDialogueActivity, {
  componentKey as timeDialogueKey,
} from "@/components/learn/activities/unit3/DialogueActivity";
import GreetingsIntroductionActivity, {
  componentKey as greetingsIntroductionKey,
} from "@/components/learn/activities/unit4/IntroductionActivity";
import GreetingsVocabularyTableActivity, {
  componentKey as greetingsVocabularyTableKey,
} from "@/components/learn/activities/unit4/VocabularyTableActivity";
import GreetingsMultipleChoiceActivity, {
  componentKey as greetingsMultipleChoiceKey,
} from "@/components/learn/activities/unit4/MultipleChoiceActivity";
import GreetingsSpellingCompletionActivity, {
  componentKey as greetingsSpellingCompletionKey,
} from "@/components/learn/activities/unit4/SpellingCompletionActivity";
import GreetingsListeningDictationActivity, {
  componentKey as greetingsListeningDictationKey,
} from "@/components/learn/activities/unit4/ListeningDictationActivity";
import GreetingsMatchingActivity, {
  componentKey as greetingsMatchingKey,
} from "@/components/learn/activities/unit4/MatchingActivity";
import GreetingsConversationPracticeActivity, {
  componentKey as greetingsConversationPracticeKey,
} from "@/components/learn/activities/unit4/ConversationPracticeActivity";
import GreetingsDialogueActivity, {
  componentKey as greetingsDialogueKey,
} from "@/components/learn/activities/unit4/DialogueActivity";
import Unit5IntroductionActivity, {
  componentKey as unit5IntroductionKey,
} from "@/components/learn/activities/unit5/IntroductionActivity";
import Unit5VocabularyTableActivity, {
  componentKey as unit5VocabularyTableKey,
} from "@/components/learn/activities/unit5/VocabularyTableActivity";
import Unit5MultipleChoiceActivity, {
  componentKey as unit5MultipleChoiceKey,
} from "@/components/learn/activities/unit5/MultipleChoiceActivity";
import Unit5SpellingCompletionActivity, {
  componentKey as unit5SpellingCompletionKey,
} from "@/components/learn/activities/unit5/SpellingCompletionActivity";
import Unit5MatchingActivity, {
  componentKey as unit5MatchingKey,
} from "@/components/learn/activities/unit5/MatchingActivity";
import Unit5ListeningDictationActivity, {
  componentKey as unit5ListeningDictationKey,
} from "@/components/learn/activities/unit5/ListeningDictationActivity";
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
    [timeIntroductionKey]: TimeIntroductionActivity,
    flashcard: FlashcardActivity,
    "multiple-choice": MultipleChoiceActivity,
    [listeningDictationKey]: ListeningDictationActivity,
    [vocabularyFillInKey]: VocabularyFillInActivity,
    [alphabetVocabularyTableKey]: AlphabetVocabularyTableActivity,
    [numbersIntroductionKey]: NumbersIntroductionActivity,
    "numbers-table": NumbersTableActivity,
    "numbers-listening": NumbersListeningActivity,
    "numbers-translation": NumbersTranslationActivity,
    [timeVocabularyTableKey]: TimeVocabularyTableActivity,
    [timeMatchingKey]: TimeMatchingActivity,
    [timeSpellingCompletionKey]: TimeSpellingCompletionActivity,
    [timeConversationPracticeKey]: TimeConversationPracticeActivity,
    [timeDialogueKey]: TimeDialogueActivity,

    // Unit 4 (Greetings)
    [greetingsIntroductionKey]: GreetingsIntroductionActivity,
    [greetingsVocabularyTableKey]: GreetingsVocabularyTableActivity,
    [greetingsMultipleChoiceKey]: GreetingsMultipleChoiceActivity,
    [greetingsSpellingCompletionKey]: GreetingsSpellingCompletionActivity,
    [greetingsListeningDictationKey]: GreetingsListeningDictationActivity,
    [greetingsMatchingKey]: GreetingsMatchingActivity,
    [greetingsConversationPracticeKey]: GreetingsConversationPracticeActivity,
    [greetingsDialogueKey]: GreetingsDialogueActivity,

    // Unit 5 (Occupations and Places)
    [unit5IntroductionKey]: Unit5IntroductionActivity,
    [unit5VocabularyTableKey]: Unit5VocabularyTableActivity,
    [unit5MultipleChoiceKey]: Unit5MultipleChoiceActivity,
    [unit5SpellingCompletionKey]: Unit5SpellingCompletionActivity,
    [unit5MatchingKey]: Unit5MatchingActivity,
    [unit5ListeningDictationKey]: Unit5ListeningDictationActivity,
  };

  // Support newly added componentKey coming from backend seed. Extend type locally.
  const extended = activity as Activity & { componentKey?: string };
  const key = extended.componentKey || extended.type;

  // Special routing: Unit 3 uses listening-dictation with contentRef like "activity-time-14".
  if (
    key === "listening-dictation" &&
    typeof (extended as any)?.contentRef === "string" &&
    String((extended as any).contentRef).startsWith("activity-time-")
  ) {
    return (
      <TimeListeningDictationActivity
        key={(extended as any).id}
        activity={extended as any}
        onComplete={onActivityComplete}
      />
    );
  }

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
        key={(extended as any).id}
        activity={activity}
        phrase={lessonMeta.phrase}
        meaning={lessonMeta.meaning}
        onComplete={onActivityComplete}
      />
    );
  }

  // Keyed by activity id to avoid state bleed between activities of same type.
  return (
    <Component
      key={(extended as any).id}
      activity={extended}
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
