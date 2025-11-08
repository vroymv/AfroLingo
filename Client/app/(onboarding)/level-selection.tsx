import { OnboardingProgress } from "@/components/OnboardingProgress";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface LevelOption {
  id: "absolute-beginner" | "beginner" | "refresher";
  title: string;
  subtitle: string;
  icon: string;
  gradient: string[];
  features: { icon: string; label: string }[];
  imagePlaceholder: string;
}

const LEVEL_OPTIONS: LevelOption[] = [
  {
    id: "absolute-beginner",
    title: "Absolute Beginner",
    subtitle: "Start from scratch",
    icon: "🌱",
    gradient: ["#4CAF50", "#8BC34A"],
    features: [
      { icon: "👋", label: "Greetings" },
      { icon: "🔤", label: "Alphabet" },
      { icon: "👨‍👩‍👧‍👦", label: "Family" },
    ],
    imagePlaceholder: "beginner-illustration.png",
  },
  {
    id: "beginner",
    title: "Beginner",
    subtitle: "Build your foundation",
    icon: "🌿",
    gradient: ["#2196F3", "#03A9F4"],
    features: [
      { icon: "💬", label: "Conversations" },
      { icon: "📝", label: "Sentences" },
      { icon: "📚", label: "Vocabulary" },
    ],
    imagePlaceholder: "intermediate-illustration.png",
  },
  {
    id: "refresher",
    title: "Refresher",
    subtitle: "Polish your skills",
    icon: "🌳",
    gradient: ["#9C27B0", "#E91E63"],
    features: [
      { icon: "🎯", label: "Fluency" },
      { icon: "🌍", label: "Culture" },
      { icon: "⚡", label: "Advanced" },
    ],
    imagePlaceholder: "advanced-illustration.png",
  },
];

export default function LevelSelectionScreen() {
  const router = useRouter();
  const { dispatch } = useOnboarding();
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
            Choose Your Level
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Select the path that fits you best
          </ThemedText>
        </View>
      </View>

      {/* Level Options */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.levelGrid}>
          {LEVEL_OPTIONS.map((option, index) => {
            const isDisabled = option.id !== "absolute-beginner";

            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.levelCard,
                  selectedLevel === option.id && styles.levelCardSelected,
                  isDisabled && styles.levelCardDisabled,
                ]}
                onPress={() => !isDisabled && handleLevelSelect(option.id)}
                activeOpacity={isDisabled ? 1 : 0.7}
                disabled={isDisabled}
              >
                <LinearGradient
                  colors={option.gradient as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.gradientBackground,
                    isDisabled && styles.gradientDisabled,
                  ]}
                >
                  {/* Disabled Badge */}
                  {isDisabled && (
                    <View style={styles.disabledBadge}>
                      <ThemedText style={styles.disabledBadgeText}>
                        Coming Soon
                      </ThemedText>
                    </View>
                  )}

                  {/* Selection Indicator */}
                  {selectedLevel === option.id && (
                    <View style={styles.selectedBadge}>
                      <ThemedText style={styles.selectedBadgeText}>
                        ✓
                      </ThemedText>
                    </View>
                  )}

                  {/* Icon */}
                  <View style={styles.iconContainer}>
                    <ThemedText style={styles.largeIcon}>
                      {option.icon}
                    </ThemedText>
                  </View>

                  {/* Title */}
                  <ThemedText style={styles.cardTitle}>
                    {option.title}
                  </ThemedText>
                  <ThemedText style={styles.cardSubtitle}>
                    {option.subtitle}
                  </ThemedText>
                </LinearGradient>

                {/* Features Grid */}
                <View style={styles.featuresContainer}>
                  {option.features.map((feature, featureIndex) => (
                    <View key={featureIndex} style={styles.featureItem}>
                      <ThemedText style={styles.featureIcon}>
                        {feature.icon}
                      </ThemedText>
                      <ThemedText style={styles.featureLabel}>
                        {feature.label}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Visual Help Section */}
        <View style={styles.helpSection}>
          <View style={styles.helpCard}>
            <ThemedText style={styles.helpIcon}>💡</ThemedText>
            <ThemedText style={styles.helpText}>
              You can change your level anytime
            </ThemedText>
          </View>
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
    marginBottom: 24,
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
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  levelGrid: {
    gap: 24,
  },
  levelCard: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  levelCardSelected: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  levelCardDisabled: {
    opacity: 0.6,
  },
  gradientBackground: {
    padding: 32,
    alignItems: "center",
    position: "relative",
  },
  gradientDisabled: {
    opacity: 0.7,
  },
  disabledBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
  },
  selectedBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedBadgeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  largeIcon: {
    fontSize: 48,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  featureItem: {
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  featureIcon: {
    fontSize: 32,
  },
  featureLabel: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.8,
    textAlign: "center",
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  levelImage: {
    width: "100%",
    height: 120,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.6,
    marginBottom: 4,
  },
  placeholderHint: {
    fontSize: 11,
    opacity: 0.4,
    fontStyle: "italic",
  },
  helpSection: {
    marginTop: 32,
    marginBottom: 24,
    alignItems: "center",
  },
  helpCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  helpIcon: {
    fontSize: 24,
  },
  helpText: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  continueButton: {
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
