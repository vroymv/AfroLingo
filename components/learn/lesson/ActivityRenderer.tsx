import AlphabetActivity from "@/components/learn/activities/AlphabetActivity";
import AlphabetVocabularyTableActivity from "@/components/learn/activities/AlphabetVocabularyTableActivity";
import ConversationPracticeActivity from "@/components/learn/activities/ConversationPracticeActivity";
import FlashcardActivity from "@/components/learn/activities/FlashcardActivity";
import IntroductionActivity from "@/components/learn/activities/IntroductionActivity";
import ListeningDictationActivity from "@/components/learn/activities/ListeningDictationActivity";
import MatchingActivity from "@/components/learn/activities/MatchingActivity";
import MultipleChoiceActivity from "@/components/learn/activities/MultipleChoiceActivity";
import NumbersListeningActivity from "@/components/learn/activities/NumbersListeningActivity";
import NumbersTableActivity from "@/components/learn/activities/NumbersTableActivity";
import NumbersTranslationActivity from "@/components/learn/activities/NumbersTranslationActivity";
import SpellingCompletionActivity from "@/components/learn/activities/SpellingCompletionActivity";
import VocabularyFillInActivity from "@/components/learn/activities/VocabularyFillInActivity";
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
  switch (activity.type) {
    case "introduction":
      return (
        <IntroductionActivity
          activity={activity}
          onComplete={onActivityComplete}
        />
      );
    case "alphabet":
      return (
        <AlphabetActivity
          activity={activity}
          alphabetImage={lessonMeta.alphabetImage}
          audio={lessonMeta.audio}
          onComplete={onActivityComplete}
        />
      );
    case "flashcard":
      return (
        <FlashcardActivity
          activity={activity}
          phrase={lessonMeta.phrase}
          meaning={lessonMeta.meaning}
          onComplete={onActivityComplete}
        />
      );
    case "multiple-choice":
      return (
        <MultipleChoiceActivity
          activity={activity}
          onComplete={onActivityComplete}
        />
      );
    case "listening-dictation":
      return (
        <ListeningDictationActivity
          activity={activity}
          onComplete={onActivityComplete}
        />
      );
    case "vocabulary-fill-in":
      return (
        <VocabularyFillInActivity
          activity={activity}
          onComplete={onActivityComplete}
        />
      );
    case "alphabet-vocabulary-table":
      return (
        <AlphabetVocabularyTableActivity
          activity={activity}
          onComplete={onActivityComplete}
        />
      );
    case "numbers-table":
      return (
        <NumbersTableActivity
          activity={activity}
          onComplete={onActivityComplete}
        />
      );
    case "numbers-listening":
      return (
        <NumbersListeningActivity
          activity={activity}
          onComplete={onActivityComplete}
        />
      );
    case "numbers-translation":
      return (
        <NumbersTranslationActivity
          activity={activity}
          onComplete={onActivityComplete}
        />
      );
    case "vocabulary-table":
      return (
        <VocabularyTableActivity
          activity={activity}
          onComplete={onActivityComplete}
        />
      );
    case "matching":
      return (
        <MatchingActivity activity={activity} onComplete={onActivityComplete} />
      );
    case "spelling-completion":
      return (
        <SpellingCompletionActivity
          activity={activity}
          onComplete={onActivityComplete}
        />
      );
    case "conversation-practice":
      return (
        <ConversationPracticeActivity
          activity={activity}
          onComplete={onActivityComplete}
        />
      );
    default:
      return (
        <ThemedView style={styles.center}>
          <ThemedText>Unknown activity type: {activity.type}</ThemedText>
        </ThemedView>
      );
  }
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },
});
