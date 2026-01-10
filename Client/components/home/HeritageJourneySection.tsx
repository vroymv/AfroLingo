import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import {
  getHeritageJourney,
  type HeritageJourneyLesson,
} from "@/services/home";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface HeritageJourneySectionProps {
  selectedLanguage: string | null;
  selectedLevel: string | null;
  onLessonPress: (unitId: string) => void;
  refreshSignal?: number;
}

export default function HeritageJourneySection({
  selectedLanguage,
  selectedLevel,
  onLessonPress,
  refreshSignal,
}: HeritageJourneySectionProps) {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<HeritageJourneyLesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchJourney = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setErrorMessage(null);

    const result = await getHeritageJourney(user.id);
    if (!result.success) {
      setErrorMessage(result.message || "Failed to load your journey");
      setIsLoading(false);
      return;
    }

    setLessons(result.data?.lessons ?? []);
    setIsLoading(false);
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchJourney();
    }, [fetchJourney])
  );

  useEffect(() => {
    if (typeof refreshSignal !== "number") return;
    fetchJourney();
  }, [fetchJourney, refreshSignal]);

  const getLanguageName = (language: string | null) => {
    if (!language) return "your chosen language";
    return language.charAt(0).toUpperCase() + language.slice(1);
  };

  const effectiveLanguage = useMemo(() => {
    return selectedLanguage;
  }, [selectedLanguage]);

  const emptySubtitle = useMemo(() => {
    if (!selectedLevel) return "";
    if (selectedLevel === "absolute-beginner")
      return "Start with your first steps";
    if (selectedLevel === "beginner") return "Keep building your foundation";
    return "Keep sharpening your skills";
  }, [selectedLevel]);

  return (
    <ThemedView style={styles.recentLessons}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Your Heritage Journey
      </ThemedText>
      <ThemedText style={styles.heritageSubtitle}>
        Continue connecting with your roots through{" "}
        {getLanguageName(effectiveLanguage)}
      </ThemedText>

      {!user?.id ? (
        <ThemedText style={styles.helperText}>
          Sign in to see your personalized journey.
        </ThemedText>
      ) : isLoading && lessons.length === 0 ? (
        <ThemedText style={styles.helperText}>Loading your journey…</ThemedText>
      ) : errorMessage ? (
        <View style={styles.errorRow}>
          <ThemedText style={styles.helperText}>{errorMessage}</ThemedText>
          <TouchableOpacity onPress={fetchJourney} style={styles.retryButton}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      ) : lessons.length === 0 ? (
        <ThemedText style={styles.helperText}>
          {emptySubtitle || "No lessons available yet."}
        </ThemedText>
      ) : (
        lessons.map((lesson) => {
          const isInProgress =
            !lesson.isCompleted &&
            lesson.progress !== "Not started" &&
            lesson.completedActivities > 0;

          const dotColor = lesson.isCompleted
            ? "#34C759"
            : isInProgress
            ? "#007AFF"
            : "#007AFF";

          const dotOpacity = lesson.isCompleted ? 1 : isInProgress ? 0.9 : 0.65;

          return (
            <TouchableOpacity
              key={lesson.unitId}
              style={styles.lessonItem}
              onPress={() => onLessonPress(lesson.unitId)}
            >
              <View
                style={[
                  styles.lessonDot,
                  {
                    backgroundColor: dotColor,
                    opacity: dotOpacity,
                  },
                ]}
              />
              <View style={styles.lessonDetails}>
                <ThemedText style={styles.lessonName}>
                  {lesson.title}
                </ThemedText>
                <ThemedText style={styles.lessonProgress}>
                  {lesson.progress}
                </ThemedText>
              </View>
              <View style={styles.lessonMeta}>
                <ThemedText style={styles.lessonXP}>+{lesson.xp} XP</ThemedText>
                {lesson.isCompleted && (
                  <ThemedText style={styles.completedCheck}>✓</ThemedText>
                )}
              </View>
            </TouchableOpacity>
          );
        })
      )}
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
  helperText: {
    fontSize: 13,
    opacity: 0.7,
    lineHeight: 18,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(0, 122, 255, 0.12)",
  },
  retryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#007AFF",
  },
});
