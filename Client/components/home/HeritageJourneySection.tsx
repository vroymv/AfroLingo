import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface Lesson {
  name: string;
  progress: string;
  xp: number;
  isCompleted: boolean;
}

interface HeritageJourneySectionProps {
  selectedLanguage: string | null;
  selectedLevel: string | null;
  onLessonPress: (lessonName: string) => void;
}

export default function HeritageJourneySection({
  selectedLanguage,
  selectedLevel,
  onLessonPress,
}: HeritageJourneySectionProps) {
  const getPersonalizedLessons = (): Lesson[] => {
    // Return different lessons based on level
    if (selectedLevel === "absolute-beginner") {
      return [
        {
          name: "Basic Greetings",
          progress: "2/3 completed",
          xp: 15,
          isCompleted: false,
        },
        {
          name: "Numbers 1-10",
          progress: "Not started",
          xp: 20,
          isCompleted: false,
        },
        {
          name: "Family Words",
          progress: "Not started",
          xp: 25,
          isCompleted: false,
        },
      ];
    } else if (selectedLevel === "beginner") {
      return [
        {
          name: "Family Members",
          progress: "3/5 completed",
          xp: 20,
          isCompleted: false,
        },
        {
          name: "Numbers & Counting",
          progress: "Not started",
          xp: 25,
          isCompleted: false,
        },
        {
          name: "Food & Dining",
          progress: "Not started",
          xp: 30,
          isCompleted: false,
        },
      ];
    } else {
      return [
        {
          name: "Advanced Conversations",
          progress: "1/4 completed",
          xp: 35,
          isCompleted: false,
        },
        {
          name: "Cultural Expressions",
          progress: "Not started",
          xp: 40,
          isCompleted: false,
        },
        {
          name: "Business Terms",
          progress: "Not started",
          xp: 45,
          isCompleted: false,
        },
      ];
    }
  };

  const getLanguageName = (language: string | null) => {
    if (!language) return "your chosen language";
    return language.charAt(0).toUpperCase() + language.slice(1);
  };

  return (
    <ThemedView style={styles.recentLessons}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Your Heritage Journey
      </ThemedText>
      <ThemedText style={styles.heritageSubtitle}>
        Continue connecting with your roots through{" "}
        {getLanguageName(selectedLanguage)}
      </ThemedText>

      {getPersonalizedLessons().map((lesson, index) => (
        <TouchableOpacity
          key={index}
          style={styles.lessonItem}
          onPress={() => onLessonPress(lesson.name)}
        >
          <View
            style={[
              styles.lessonDot,
              {
                backgroundColor: lesson.progress.includes("completed")
                  ? "#34C759"
                  : "#007AFF",
                opacity: lesson.progress.includes("completed") ? 1 : 0.7,
              },
            ]}
          />
          <View style={styles.lessonDetails}>
            <ThemedText style={styles.lessonName}>{lesson.name}</ThemedText>
            <ThemedText style={styles.lessonProgress}>
              {lesson.progress}
            </ThemedText>
          </View>
          <View style={styles.lessonMeta}>
            <ThemedText style={styles.lessonXP}>+{lesson.xp} XP</ThemedText>
            {lesson.progress.includes("completed") && (
              <ThemedText style={styles.completedCheck}>✓</ThemedText>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  recentLessons: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  heritageSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
    lineHeight: 18,
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  lessonDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  lessonDetails: {
    flex: 1,
  },
  lessonName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  lessonProgress: {
    fontSize: 12,
    opacity: 0.6,
  },
  lessonMeta: {
    alignItems: "flex-end",
  },
  lessonXP: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "600",
  },
  completedCheck: {
    fontSize: 12,
    color: "#34C759",
    marginTop: 2,
  },
});
