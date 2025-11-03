import { OnboardingProgress } from "@/components/OnboardingProgress";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface PersonalizationOption {
  id: string;
  label: string;
  icon: string;
}

const LEARNING_REASONS: PersonalizationOption[] = [
  { id: "heritage", label: "Connect with my heritage", icon: "🏛️" },
  { id: "family", label: "Communicate with family", icon: "👨‍👩‍👧‍👦" },
  { id: "travel", label: "Travel to Africa", icon: "✈️" },
  { id: "education", label: "Academic/school requirement", icon: "🎓" },
  { id: "culture", label: "Love for African culture", icon: "🎭" },
  { id: "career", label: "Professional development", icon: "💼" },
];

const TIME_COMMITMENTS: PersonalizationOption[] = [
  { id: "5min", label: "5 minutes/day", icon: "⚡" },
  { id: "15min", label: "15 minutes/day", icon: "🚀" },
  { id: "30min", label: "30 minutes/day", icon: "🔥" },
  { id: "60min", label: "1 hour/day", icon: "💪" },
];

export default function PersonalizationScreen() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  // Set current step on mount
  useEffect(() => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 5 });
  }, [dispatch]);

  const handleReasonToggle = (reasonId: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reasonId)
        ? prev.filter((id) => id !== reasonId)
        : [...prev, reasonId]
    );
  };

  const handleTimeSelect = (timeId: string) => {
    setSelectedTime(timeId);
  };

  const handleFinish = () => {
    // Save personalization data
    dispatch({
      type: "SET_PERSONALIZATION",
      payload: {
        reasons: selectedReasons,
        timeCommitment: selectedTime || "15min",
      },
    });

    // Complete onboarding
    dispatch({ type: "COMPLETE_ONBOARDING" });

    // Navigate to main app
    router.push("/(tabs)");
  };

  const handleSkip = () => {
    // Complete onboarding without personalization
    dispatch({ type: "COMPLETE_ONBOARDING" });
    router.push("/(tabs)");
  };

  const handleBack = () => {
    router.back();
  };

  const getLanguageName = (languageId: string) => {
    const languages: Record<string, string> = {
      sw: "Swahili",
      zu: "Zulu",
      ln: "Lingala",
      xh: "Xhosa",
    };
    return languages[languageId] || "Unknown";
  };

  const getLevelDisplay = (level: string) => {
    const levels: Record<string, string> = {
      "absolute-beginner": "Absolute Beginner",
      beginner: "Beginner",
      refresher: "Refresher",
    };
    return levels[level] || level;
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <StatusBar style="auto" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ThemedText style={[styles.backButtonText, { color: tintColor }]}>
            ← Back
          </ThemedText>
        </TouchableOpacity>

        <OnboardingProgress currentStep={5} totalSteps={5} />

        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.title}>
            Personalize Your Journey
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Help us create the perfect learning experience for you
          </ThemedText>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Selection Summary */}
        <View style={[styles.summaryCard, { borderColor: tintColor }]}>
          <ThemedText type="defaultSemiBold" style={styles.summaryTitle}>
            Your Learning Plan
          </ThemedText>
          <View style={styles.summaryDetails}>
            <ThemedText style={styles.summaryText}>
              📚 Language: {getLanguageName(state.selectedLanguage || "")}
            </ThemedText>
            <ThemedText style={styles.summaryText}>
              🎯 Level: {getLevelDisplay(state.selectedLevel || "")}
            </ThemedText>
          </View>
        </View>

        {/* Learning Reasons */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Why are you learning?
          </ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Select all that apply - this helps us personalize your content
          </ThemedText>

          <View style={styles.optionsGrid}>
            {LEARNING_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason.id}
                style={[
                  styles.reasonCard,
                  selectedReasons.includes(reason.id) && {
                    backgroundColor: tintColor + "15",
                    borderColor: tintColor,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => handleReasonToggle(reason.id)}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.reasonIcon}>{reason.icon}</ThemedText>
                <ThemedText style={styles.reasonLabel}>
                  {reason.label}
                </ThemedText>
                {selectedReasons.includes(reason.id) && (
                  <View
                    style={[
                      styles.miniCheckmark,
                      { backgroundColor: tintColor },
                    ]}
                  >
                    <ThemedText style={styles.miniCheckmarkText}>✓</ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Commitment */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            How much time can you dedicate?
          </ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Choose what works best for your schedule
          </ThemedText>

          <View style={styles.timeGrid}>
            {TIME_COMMITMENTS.map((timeOption) => (
              <TouchableOpacity
                key={timeOption.id}
                style={[
                  styles.timeCard,
                  selectedTime === timeOption.id && {
                    backgroundColor: tintColor + "15",
                    borderColor: tintColor,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => handleTimeSelect(timeOption.id)}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.timeIcon}>
                  {timeOption.icon}
                </ThemedText>
                <ThemedText style={styles.timeLabel}>
                  {timeOption.label}
                </ThemedText>
                {selectedTime === timeOption.id && (
                  <View
                    style={[
                      styles.miniCheckmark,
                      { backgroundColor: tintColor },
                    ]}
                  >
                    <ThemedText style={styles.miniCheckmarkText}>✓</ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Motivation Message */}
        <View style={styles.motivationSection}>
          <ThemedText style={styles.motivationText}>
            🌟 You&apos;re about to embark on an amazing journey connecting with
            your roots and heritage. Every step forward is progress!
          </ThemedText>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.skipButtonText, { color: tintColor }]}>
            Skip for now
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.finishButton, { backgroundColor: tintColor }]}
          onPress={handleFinish}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.finishButtonText}>
            Start Learning! 🚀
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  headerContent: {
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryCard: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 32,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  summaryTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  summaryDetails: {
    gap: 4,
  },
  summaryText: {
    fontSize: 14,
    opacity: 0.8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
    lineHeight: 20,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  reasonCard: {
    flexBasis: "48%",
    aspectRatio: 2.2,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  reasonIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  reasonLabel: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 16,
    opacity: 0.9,
  },
  timeGrid: {
    gap: 12,
  },
  timeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    position: "relative",
  },
  timeIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  timeLabel: {
    fontSize: 16,
    flex: 1,
  },
  miniCheckmark: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  miniCheckmarkText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  motivationSection: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 16,
    marginBottom: 24,
  },
  motivationText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    opacity: 0.8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    gap: 12,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  finishButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  finishButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
