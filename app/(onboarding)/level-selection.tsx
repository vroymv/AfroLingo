import { OnboardingProgress } from "@/components/OnboardingProgress";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface LevelOption {
  id: "absolute-beginner" | "beginner" | "refresher";
  title: string;
  description: string;
  icon: string;
  examples: string[];
  timeEstimate: string;
}

const LEVEL_OPTIONS: LevelOption[] = [
  {
    id: "absolute-beginner",
    title: "Absolute Beginner",
    description: "I have no knowledge of this language",
    icon: "🌱",
    examples: [
      "Learn basic greetings and introductions",
      "Master fundamental pronunciation",
      "Understand family and household terms",
    ],
    timeEstimate: "2-3 months to conversational basics",
  },
  {
    id: "beginner",
    title: "Beginner",
    description: "I know a few words or phrases",
    icon: "🌿",
    examples: [
      "Build on existing vocabulary",
      "Form complete sentences",
      "Navigate daily conversations",
    ],
    timeEstimate: "1-2 months to build confidence",
  },
  {
    id: "refresher",
    title: "Refresher",
    description: "I used to know more but need to refresh",
    icon: "🌳",
    examples: [
      "Restore forgotten vocabulary",
      "Master cultural nuances",
      "Achieve fluency in conversations",
    ],
    timeEstimate: "2-4 weeks to regain fluency",
  },
];

export default function LevelSelectionScreen() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  // Set current step on mount
  useEffect(() => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 4 });
  }, [dispatch]);

  const handleLevelSelect = (levelId: string) => {
    setSelectedLevel(levelId);
  };

  const handleContinue = () => {
    if (selectedLevel) {
      dispatch({
        type: "SET_LEVEL",
        payload: selectedLevel as
          | "absolute-beginner"
          | "beginner"
          | "refresher",
      });
      router.push("./personalization");
    }
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

        <OnboardingProgress currentStep={4} totalSteps={5} />

        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.title}>
            Your {getLanguageName(state.selectedLanguage || "")} Level
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Choose the level that best describes your current knowledge
          </ThemedText>
        </View>
      </View>

      {/* Level Options */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.levelGrid}>
          {LEVEL_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.levelCard,
                selectedLevel === option.id && {
                  backgroundColor: tintColor + "15",
                  borderColor: tintColor,
                  borderWidth: 2,
                },
              ]}
              onPress={() => handleLevelSelect(option.id)}
              activeOpacity={0.7}
            >
              {/* Card Header */}
              <View style={styles.levelHeader}>
                <View
                  style={[
                    styles.levelIcon,
                    { backgroundColor: tintColor + "20" },
                  ]}
                >
                  <ThemedText style={styles.levelIconText}>
                    {option.icon}
                  </ThemedText>
                </View>

                <View style={styles.levelTitleContainer}>
                  <ThemedText type="defaultSemiBold" style={styles.levelTitle}>
                    {option.title}
                  </ThemedText>
                  <ThemedText style={styles.levelDescription}>
                    {option.description}
                  </ThemedText>
                </View>

                {selectedLevel === option.id && (
                  <View
                    style={[styles.checkmark, { backgroundColor: tintColor }]}
                  >
                    <ThemedText style={styles.checkmarkText}>✓</ThemedText>
                  </View>
                )}
              </View>

              {/* Time Estimate */}
              <View style={styles.timeEstimate}>
                <ThemedText style={[styles.timeText, { color: tintColor }]}>
                  ⏱️ {option.timeEstimate}
                </ThemedText>
              </View>

              {/* Examples */}
              <View style={styles.examplesContainer}>
                <ThemedText type="defaultSemiBold" style={styles.examplesTitle}>
                  What you&apos;ll learn:
                </ThemedText>
                {option.examples.map((example, index) => (
                  <View key={index} style={styles.exampleItem}>
                    <ThemedText
                      style={[styles.exampleDot, { color: tintColor }]}
                    >
                      •
                    </ThemedText>
                    <ThemedText style={styles.exampleText}>
                      {example}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Help text */}
        <View style={styles.helpSection}>
          <ThemedText style={styles.helpText}>
            💡 Don&apos;t worry if you&apos;re not sure - you can always adjust
            your level as you learn!
          </ThemedText>
        </View>
      </ScrollView>

      {/* Continue Button */}
      {selectedLevel && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: tintColor }]}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
          </TouchableOpacity>
        </View>
      )}
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
  levelGrid: {
    gap: 20,
  },
  levelCard: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  levelIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  levelIconText: {
    fontSize: 20,
  },
  levelTitleContainer: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  timeEstimate: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 12,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  examplesContainer: {
    gap: 8,
  },
  examplesTitle: {
    fontSize: 15,
    marginBottom: 8,
  },
  exampleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  exampleDot: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 2,
    fontWeight: "bold",
  },
  exampleText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
    flex: 1,
  },
  helpSection: {
    marginTop: 32,
    marginBottom: 24,
    alignItems: "center",
  },
  helpText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    fontStyle: "italic",
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
