import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

// Import home components
import CommunitySection from "@/components/home/CommunitySection";
import CulturalNuggetCard from "@/components/home/CulturalNuggetCard";
import DailyGoalCard from "@/components/home/DailyGoalCard";
import HeaderSection from "@/components/home/HeaderSection";
import HeritageJourneySection from "@/components/home/HeritageJourneySection";
import QuickActionsSection from "@/components/home/QuickActionsSection";
import { useLessonProgress } from "@/contexts/LessonProgressContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { state } = useOnboarding();
  const colorScheme = useColorScheme();
  const { activeLesson, startLesson, nextLessonId } = useLessonProgress();

  console.log("Onboarding State in HomeScreen:", state);

  useEffect(() => {
    if (!state.isCompleted) {
      setTimeout(() => {
        router.push("/(onboarding)/welcome" as any);
      }, 100);
    }
  }, [state.isCompleted, router]);

  if (!state.isCompleted) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Setting up your learning experience...</ThemedText>
      </ThemedView>
    );
  }

  const handleTodayLesson = () => {
    // If already have an active (not completed) lesson, resume, else pick next lesson
    let targetLessonId = activeLesson?.lessonId;
    if (!targetLessonId) {
      targetLessonId = nextLessonId();
      if (targetLessonId) {
        startLesson(targetLessonId);
      }
    }
    if (targetLessonId) {
      router.push(`/learn/lesson/${targetLessonId}` as any);
    } else {
      console.warn("No lessons available");
    }
  };

  const handleQuickAction = (action: string) => {
    // Handle quick actions
    console.log(`Starting ${action} practice...`);
  };

  const handleLessonPress = (lessonName: string) => {
    // Navigate to specific lesson
    console.log(`Opening lesson: ${lessonName}`);
  };

  const handleNavigateToCommunity = () => {
    console.log("Navigate to Community tab");
  };

  return (
    <SafeAreaView
      style={[
        styles.safeContainer,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <StatusBar style="auto" />
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <HeaderSection selectedLanguage={state.selectedLanguage} />

        <DailyGoalCard onContinueLesson={handleTodayLesson} />

        <QuickActionsSection
          selectedLanguage={state.selectedLanguage}
          onQuickAction={handleQuickAction}
        />

        <CommunitySection
          selectedLanguage={state.selectedLanguage}
          onNavigateToCommunity={handleNavigateToCommunity}
        />

        <HeritageJourneySection
          selectedLanguage={state.selectedLanguage}
          selectedLevel={state.selectedLevel}
          onLessonPress={handleLessonPress}
        />

        <CulturalNuggetCard selectedLanguage={state.selectedLanguage} />

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: {
    paddingTop: 2,
    flex: 1,
  },
  bottomPadding: {
    height: 40,
  },
});
