import { OnboardingProgress } from "@/components/OnboardingProgress";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  ContinueButton,
  PathCard,
  type PathOption,
} from "@/components/onboarding/choose-path";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PATH_OPTIONS: PathOption[] = [
  {
    id: "know-level",
    title: "I know my level",
    description: "Choose your starting point directly",
    icon: "🎯",
    subtitle: "For confident learners",
    benefits: ["Jump to your level", "Skip assessment", "Start immediately"],
    imagePrompt: "Person confidently pointing at level chart or dashboard",
    image: require("@/assets/images/icons/find-my-level.png"),
  },
  {
    id: "find-level",
    title: "Help me find my level",
    description: "Take a quick placement test",
    icon: "🧭",
    subtitle: "Recommended path",
    benefits: [
      "Personalized assessment",
      "Cultural questions",
      "Perfect starting point",
    ],
    imagePrompt: "Student taking test or exploring with compass/map imagery",
    disabled: true,
  },
];

export default function ChoosePathScreen() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  // Set current step on mount
  useEffect(() => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 3 });
  }, [dispatch]);

  const handleContinue = () => {
    if (selectedPath === "know-level") {
      router.push("./level-selection");
    } else if (selectedPath === "find-level") {
      router.push("./placement-test");
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
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          {/* <AnimatedLinearHeader tintColor={tintColor} onBack={handleBack} /> */}
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ThemedText style={[styles.backButtonText, { color: tintColor }]}>
              ← Back
            </ThemedText>
          </TouchableOpacity>

          <OnboardingProgress
            currentStep={3}
            totalSteps={5}
            style={styles.progressBar}
          />

          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.title}>
              Choose Your Path
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Learning {getLanguageName(state.selectedLanguage || "")}
            </ThemedText>
          </View>
        </View>

        {/* Path Options */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.pathGrid}>
            {PATH_OPTIONS.map((option) => (
              <PathCard
                key={option.id}
                option={option}
                isSelected={selectedPath === option.id}
                onSelect={setSelectedPath}
              />
            ))}
          </View>
        </ScrollView>

        {/* Continue Button */}
        <ContinueButton selectedPath={selectedPath} onPress={handleContinue} />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  header: {
    paddingHorizontal: 24,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  progressBar: {},
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 24,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  pathGrid: {
    gap: 24,
  },
});
