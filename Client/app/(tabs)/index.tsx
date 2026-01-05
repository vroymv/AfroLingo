import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

// Import home components
import CommunitySection from "@/components/home/CommunitySection";
import DailyGoalCard from "@/components/home/DailyGoalCard";
import HeaderSection from "@/components/home/HeaderSection";
import HeritageJourneySection from "@/components/home/HeritageJourneySection";
import QuickActionsSection from "@/components/home/QuickActionsSection";
import { SafeAreaView } from "react-native-safe-area-context";
import { getResumeUnit } from "@/services/units";

export default function HomeScreen() {
  const router = useRouter();
  const { state } = useOnboarding();
  const { user } = useAuth();
  const colorScheme = useColorScheme();

  const [refreshing, setRefreshing] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);

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

  const handleTodayLesson = async () => {
    if (!user?.id) {
      router.push("/(tabs)/learn" as any);
      return;
    }

    const result = await getResumeUnit(user.id);

    const unitId = result.success ? result.data?.unitId : undefined;
    if (unitId) {
      router.push({
        pathname: "/learn/lesson/[unitId]",
        params: { unitId },
      });
      return;
    }

    router.push("/(tabs)/learn" as any);
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshSignal((prev) => prev + 1);

    // Allow child components time to re-fetch.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setRefreshing(false);
  }, []);

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <HeaderSection selectedLanguage={state.selectedLanguage} />

        <DailyGoalCard
          onContinueLesson={handleTodayLesson}
          refreshSignal={refreshSignal}
        />

        <QuickActionsSection
          selectedLanguage={state.selectedLanguage}
          onQuickAction={handleQuickAction}
          refreshSignal={refreshSignal}
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
