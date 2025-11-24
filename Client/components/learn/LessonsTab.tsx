import { ThemedView } from "@/components/ThemedView";
import { ScrollView, StyleSheet, View } from "react-native";
import { ProgressTracker } from "./ProgressTracker";
import { UnitsList } from "./UnitsList";

export const LessonsTab: React.FC = () => {
  // Placeholder for activeLesson
  // Dummy lessonsData
  const lessonsData = {
    units: [
      {
        id: "unit1",
        title: "Introduction",
        level: "Absolute Beginner" as "Absolute Beginner",
        progress: 100,
        totalLessons: 5,
        completedLessons: 5,
        icon: "🚀",
        color: "#4CAF50",
        lessons: [
          {
            id: "l1",
            phrase: "Hello",
            meaning: "A greeting",
            audio: undefined,
            pronunciation: "heh-loh",
            example: "Hello, world!",
            exampleTranslation: "Hello, world!",
            alphabetImage: undefined,
            activities: [],
          },
        ],
        xpReward: 100,
      },
      {
        id: "unit2",
        title: "Basics",
        level: "Beginner" as "Beginner",
        progress: 50,
        totalLessons: 8,
        completedLessons: 4,
        icon: "📘",
        color: "#2196F3",
        lessons: [
          {
            id: "l2",
            phrase: "Goodbye",
            meaning: "A farewell",
            audio: undefined,
            pronunciation: "good-bye",
            example: "Goodbye, friend!",
            exampleTranslation: "Goodbye, friend!",
            alphabetImage: undefined,
            activities: [],
          },
        ],
        xpReward: 200,
      },
      {
        id: "unit3",
        title: "Advanced",
        level: "Advanced" as "Advanced",
        progress: 0,
        totalLessons: 10,
        completedLessons: 0,
        icon: "🏆",
        color: "#FFC107",
        lessons: [
          {
            id: "l3",
            phrase: "Congratulations",
            meaning: "An expression of praise",
            audio: undefined,
            pronunciation: "con-gra-tu-la-tions",
            example: "Congratulations on your achievement!",
            exampleTranslation: "Congratulations on your achievement!",
            alphabetImage: undefined,
            activities: [],
          },
        ],
        xpReward: 300,
      },
    ],
  };
  // Dummy progressStats
  const progressStats = {
    totalXP: 1200,
    streakDays: 5,
    completedUnits: 1,
    inProgressUnits: 1,
    totalUnits: 3,
    milestones: [
      { id: "m1", title: "Start", progress: 100, color: "#4CAF50", icon: "🚀" },
      { id: "m2", title: "Basics", progress: 50, color: "#2196F3", icon: "📘" },
      {
        id: "m3",
        title: "Advanced",
        progress: 0,
        color: "#FFC107",
        icon: "🏆",
      },
    ],
  };
  // Removed unused loading and error variables

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProgressTracker stats={progressStats} />
        <UnitsList units={lessonsData.units} onUnitPress={() => {}} />
        <View style={styles.bottomPadding} />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bottomPadding: {
    height: 100,
  },
});
