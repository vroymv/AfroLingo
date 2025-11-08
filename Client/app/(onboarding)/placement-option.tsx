import { OnboardingProgress } from "@/components/OnboardingProgress";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  useOnboarding,
  useOnboardingActions,
} from "@/contexts/OnboardingContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface LevelOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  examples: string[];
}

const LEVEL_OPTIONS: LevelOption[] = [
  {
    id: "absolute-beginner",
    title: "Absolute Beginner",
    description: "I have no knowledge of this language",
    icon: "🌱",
    examples: [
      "Start from the very basics",
      "Learn greetings and simple words",
      "Understand pronunciation",
    ],
  },
  {
    id: "beginner",
    title: "Beginner",
    description: "I know a few words or phrases",
    icon: "🌿",
    examples: [
      "Basic conversations",
      "Family and food vocabulary",
      "Simple sentence structures",
    ],
  },
  {
    id: "refresher",
    title: "Refresher",
    description: "I used to know more but need to refresh",
    icon: "🌳",
    examples: [
      "Restore forgotten vocabulary",
      "Improve pronunciation",
      "Cultural context and idioms",
    ],
  },
  {
    id: "placement-test",
    title: "Take Placement Test",
    description: "Let us determine your level",
    icon: "🎯",
    examples: [
      "5-8 quick questions",
      "Personalized recommendations",
      "Find your perfect starting point",
    ],
  },
];

export default function PlacementOptionScreen() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const { setLevel, completeOnboarding } = useOnboardingActions();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  // Set current step on mount
  useEffect(() => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 5 });
  }, [dispatch]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleContinue = () => {
    if (selectedOption) {
      if (selectedOption === "placement-test") {
        // Navigate to placement test - using relative path
        router.push("./placement-test");
      } else {
        // Save level and complete onboarding
        setLevel(selectedOption);
        completeOnboarding();
        // Skip to main app with selected level
        router.push("/(tabs)");
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getLanguageName = (languageId: string | null) => {
    if (!languageId) return "Your Language";
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

        <OnboardingProgress currentStep={5} totalSteps={5} />

        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.title}>
            Your {getLanguageName(state.selectedLanguage)} Level
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Help us personalize your learning experience
          </ThemedText>
        </View>
      </View>

      {/* Options */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsGrid}>
          {LEVEL_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedOption === option.id && {
                  backgroundColor: tintColor + "20",
                  borderColor: tintColor,
                  borderWidth: 2,
                },
              ]}
              onPress={() => handleOptionSelect(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.optionHeader}>
                <View style={styles.optionIconContainer}>
                  <ThemedText style={styles.optionIcon}>
                    {option.icon}
                  </ThemedText>
                </View>

                <View style={styles.optionContent}>
                  <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
                    {option.title}
                  </ThemedText>
                  <ThemedText style={styles.optionDescription}>
                    {option.description}
                  </ThemedText>
                </View>

                {selectedOption === option.id && (
                  <View
                    style={[styles.checkmark, { backgroundColor: tintColor }]}
                  >
                    <ThemedText style={styles.checkmarkText}>✓</ThemedText>
                  </View>
                )}
              </View>

              <View style={styles.examplesContainer}>
                {option.examples.map((example, index) => (
                  <View key={index} style={styles.exampleItem}>
                    <ThemedText style={styles.exampleBullet}>•</ThemedText>
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
            Don&apos;t worry - you can always change your level later as you
            progress!
          </ThemedText>
        </View>
      </ScrollView>

      {/* Continue Button */}
      {selectedOption && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: tintColor }]}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.continueButtonText}>
              {selectedOption === "placement-test"
                ? "Start Test"
                : "Start Learning"}
            </ThemedText>
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
    marginBottom: 24,
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
  optionsGrid: {
    gap: 20,
  },
  optionCard: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  optionIconContainer: {
    marginRight: 16,
  },
  optionIcon: {
    fontSize: 28,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  examplesContainer: {
    gap: 8,
  },
  exampleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  exampleBullet: {
    fontSize: 14,
    opacity: 0.6,
    marginRight: 8,
    marginTop: 2,
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
