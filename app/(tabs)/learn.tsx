import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LessonsTab } from "@/components/learn/LessonsTab";
import { PracticeTab } from "@/components/learn/PracticeTab";
import { StoriesTab } from "@/components/learn/StoriesTab";
import { useLessonProgress } from "@/contexts/LessonProgressContext";
import { useUserProgress } from "@/contexts/UserProgressContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createMaterialTopTabNavigator();

const ContinueButton: React.FC = () => {
  const { progress } = useUserProgress();
  const { totalXP, currentStreak } = progress;
  const { activeLesson, startLesson, nextLessonId } = useLessonProgress();
  const router = useRouter();

  const handleContinue = () => {
    let target = activeLesson?.lessonId;
    if (!target) {
      target = nextLessonId();
      if (target) startLesson(target);
    }
    if (target) {
      router.push(`/learn/lesson/${target}` as any);
    } else {
      console.warn("No lessons available");
    }
  };

  return (
    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
      <ThemedView style={styles.continueContent}>
        <View style={styles.continueInfo}>
          <ThemedText type="defaultSemiBold" style={styles.continueTitle}>
            Continue Learning
          </ThemedText>
          <ThemedText type="default" style={styles.continueSubtitle}>
            {activeLesson
              ? `Resuming ${activeLesson.lessonId}`
              : "Start Next Lesson"}
          </ThemedText>
        </View>
        <View style={styles.continueStats}>
          <View style={styles.statItem}>
            <ThemedText type="default" style={styles.statLabel}>
              🔥 {currentStreak}
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="default" style={styles.statLabel}>
              ⭐ {totalXP}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default function LearnScreen() {
  const colorScheme = useColorScheme();

  const tabBarOptions = {
    tabBarStyle: {
      backgroundColor: colorScheme === "dark" ? "#1C1C1E" : "#F2F2F7",
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === "dark" ? "#333" : "#E5E5EA",
    },
    tabBarIndicatorStyle: {
      backgroundColor: "#4A90E2",
      height: 3,
      borderRadius: 1.5,
    },
    tabBarLabelStyle: {
      fontSize: 14,
      fontWeight: "600" as const,
      textTransform: "none" as const,
    },
    tabBarActiveTintColor: "#4A90E2",
    tabBarInactiveTintColor: colorScheme === "dark" ? "#8E8E93" : "#6D6D70",
  } as const;

  const isWeb = Platform.OS === "web";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">Learn 📖</ThemedText>
        <ThemedText type="subtitle" style={styles.headerSubtitle}>
          Master African languages through structured learning
        </ThemedText>
      </View>

      <ContinueButton />

      <Tab.Navigator
        screenOptions={() => ({
          ...tabBarOptions,
          // Disable swipe on web
          swipeEnabled: !isWeb,
          lazy: true,
          sceneStyle: { backgroundColor: "transparent" },
        })}
        style={styles.tabNavigator}
      >
        <Tab.Screen
          name="Lessons"
          component={LessonsTab}
          options={{ tabBarLabel: "Lessons" }}
        />
        <Tab.Screen
          name="Practice"
          component={PracticeTab}
          options={{ tabBarLabel: "Practice" }}
        />
        <Tab.Screen
          name="Stories"
          component={StoriesTab}
          options={{ tabBarLabel: "Stories" }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: "center",
  },
  headerSubtitle: {
    marginTop: 4,
    textAlign: "center",
    opacity: 0.8,
  },
  continueButton: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  continueContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(74, 144, 226, 0.3)",
  },
  continueInfo: {
    flex: 1,
  },
  continueTitle: {
    color: "#4A90E2",
    fontSize: 16,
  },
  continueSubtitle: {
    color: "#4A90E2",
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  continueStats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    color: "#4A90E2",
    fontSize: 12,
    fontWeight: "600",
  },
  tabNavigator: {
    flex: 1,
  },
});
