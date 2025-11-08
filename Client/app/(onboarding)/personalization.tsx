import { OnboardingProgress } from "@/components/OnboardingProgress";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface PersonalizationOption {
  id: string;
  label: string;
  icon: string;
  image?: ImageSourcePropType;
  description?: string;
}

const LEARNING_REASONS: PersonalizationOption[] = [
  {
    id: "heritage",
    label: "Heritage",
    icon: "🏛️",
    description: "Connect with roots",
    // TODO: Add image - Traditional African artifacts, ancestral symbols, or cultural heritage scene
    // Suggested: assets/images/onboarding/heritage.png
  },
  {
    id: "family",
    label: "Family",
    icon: "👨‍👩‍👧‍👦",
    description: "Talk with loved ones",
    // TODO: Add image - African family gathering, multigenerational portrait
    // Suggested: assets/images/onboarding/family.png
  },
  {
    id: "travel",
    label: "Travel",
    icon: "✈️",
    description: "Explore Africa",
    // TODO: Add image - African landmarks (Table Mountain, Victoria Falls, etc.)
    // Suggested: assets/images/onboarding/travel.png
  },
  {
    id: "education",
    label: "Education",
    icon: "🎓",
    description: "Academic goals",
    // TODO: Add image - Student studying, graduation cap, books with African patterns
    // Suggested: assets/images/onboarding/education.png
  },
  {
    id: "culture",
    label: "Culture",
    icon: "🎭",
    description: "Art & traditions",
    // TODO: Add image - African music, dance, traditional art or masks
    // Suggested: assets/images/onboarding/culture.png
  },
  {
    id: "career",
    label: "Career",
    icon: "💼",
    description: "Professional growth",
    // TODO: Add image - Professional workspace, international business setting
    // Suggested: assets/images/onboarding/career.png
  },
];

const TIME_COMMITMENTS: PersonalizationOption[] = [
  {
    id: "5min",
    label: "5 min",
    icon: "⚡",
    description: "Quick daily practice",
  },
  { id: "15min", label: "15 min", icon: "🚀", description: "Steady progress" },
  { id: "30min", label: "30 min", icon: "🔥", description: "Deep learning" },
  { id: "60min", label: "1 hour", icon: "💪", description: "Intensive study" },
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
            ←
          </ThemedText>
        </TouchableOpacity>

        <OnboardingProgress currentStep={5} totalSteps={5} />

        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.title}>
            Personalize Your Journey
          </ThemedText>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Selection Summary */}
        <View style={[styles.summaryCard, { backgroundColor: tintColor }]}>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>
                {getLanguageName(state.selectedLanguage || "")}
              </ThemedText>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>
                {getLevelDisplay(state.selectedLevel || "")}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Learning Reasons */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Why learn?
          </ThemedText>

          <View style={styles.reasonsGrid}>
            {LEARNING_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason.id}
                style={[
                  styles.reasonCard,
                  selectedReasons.includes(reason.id) && {
                    backgroundColor: tintColor + "20",
                    borderColor: tintColor,
                    borderWidth: 2,
                    transform: [{ scale: 0.98 }],
                  },
                ]}
                onPress={() => handleReasonToggle(reason.id)}
                activeOpacity={0.7}
              >
                {/* TODO: Replace with actual image when available */}
                <View style={styles.reasonImagePlaceholder}>
                  <ThemedText style={styles.reasonIconLarge}>
                    {reason.icon}
                  </ThemedText>
                </View>
                <ThemedText style={styles.reasonLabelBold}>
                  {reason.label}
                </ThemedText>
                <ThemedText style={styles.reasonDescription}>
                  {reason.description}
                </ThemedText>
                {selectedReasons.includes(reason.id) && (
                  <View
                    style={[styles.checkmark, { backgroundColor: tintColor }]}
                  >
                    <ThemedText style={styles.checkmarkText}>✓</ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Commitment */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Daily goal
          </ThemedText>

          <View style={styles.timeGrid}>
            {TIME_COMMITMENTS.map((timeOption) => (
              <TouchableOpacity
                key={timeOption.id}
                style={[
                  styles.timeCard,
                  selectedTime === timeOption.id && {
                    backgroundColor: tintColor + "20",
                    borderColor: tintColor,
                    borderWidth: 2.5,
                  },
                ]}
                onPress={() => handleTimeSelect(timeOption.id)}
                activeOpacity={0.7}
              >
                <View style={styles.timeContent}>
                  <ThemedText style={styles.timeIconLarge}>
                    {timeOption.icon}
                  </ThemedText>
                  <View style={styles.timeTextContainer}>
                    <ThemedText style={styles.timeLabel}>
                      {timeOption.label}
                    </ThemedText>
                    <ThemedText style={styles.timeDescription}>
                      {timeOption.description}
                    </ThemedText>
                  </View>
                </View>
                {selectedTime === timeOption.id && (
                  <View
                    style={[styles.checkmark, { backgroundColor: tintColor }]}
                  >
                    <ThemedText style={styles.checkmarkText}>✓</ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.finishButton, { backgroundColor: tintColor }]}
          onPress={handleFinish}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.finishButtonText}>
            Start Learning 🚀
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.skipButtonText, { color: tintColor }]}>
            Skip
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
    marginBottom: 24,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 8,
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "600",
  },
  headerContent: {
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 28,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 16,
  },
  section: {
    marginBottom: 36,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 20,
  },
  reasonsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  reasonCard: {
    flexBasis: "48%",
    aspectRatio: 0.85,
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  reasonImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  reasonIconLarge: {
    fontSize: 32,
  },
  reasonLabelBold: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  reasonDescription: {
    fontSize: 11,
    textAlign: "center",
    opacity: 0.65,
  },
  timeGrid: {
    gap: 12,
  },
  timeCard: {
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.1)",
    position: "relative",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  timeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeIconLarge: {
    fontSize: 32,
    marginRight: 16,
  },
  timeTextContainer: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  timeDescription: {
    fontSize: 13,
    opacity: 0.65,
  },
  checkmark: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  checkmarkText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  motivationSection: {
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 20,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  motivationIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    opacity: 0.8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 32,
    gap: 12,
  },
  finishButton: {
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  finishButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: "500",
    opacity: 0.7,
  },
});
