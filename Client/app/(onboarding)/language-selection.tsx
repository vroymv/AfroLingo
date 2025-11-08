import { OnboardingProgress } from "@/components/OnboardingProgress";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Language {
  id: string;
  name: string;
  nativeName: string;
  description: string;
  icon: any; // Image source
}

const SUPPORTED_LANGUAGES: Language[] = [
  {
    id: "sw",
    name: "Swahili",
    nativeName: "Kiswahili",
    description: "East Africa • 200M+ speakers",
    icon: require("@/assets/images/icons/swahili-icon.png"),
  },
  {
    id: "zu",
    name: "Zulu",
    nativeName: "isiZulu",
    description: "South Africa • 27M+ speakers",
    icon: require("@/assets/images/icons/zulu-icon.png"), // Placeholder
  },
  {
    id: "ln",
    name: "Lingala",
    nativeName: "Lingála",
    description: "Central Africa • 15M+ speakers",
    icon: require("@/assets/images/icons/lingala-icon.png"), // Placeholder
  },
];

interface LanguageCardProps {
  language: Language;
  selected: boolean;
  tintColor: string;
  onSelect: (id: string) => void;
  index?: number;
  disabled?: boolean;
}

function LanguageCard({
  language,
  selected,
  tintColor,
  onSelect,
  index = 0,
  disabled = false,
}: LanguageCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay: index * 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        delay: index * 150,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, index]);

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    Haptics.selectionAsync();
    onSelect(language.id);
    AccessibilityInfo.announceForAccessibility?.(`${language.name} selected`);
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale }, { translateY }],
        opacity: disabled ? 0.4 : opacity,
      }}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled }}
        style={({ pressed }) => [
          styles.languageCard,
          {
            borderColor: selected ? tintColor : "rgba(0,0,0,0.08)",
            backgroundColor: selected ? tintColor + "15" : "rgba(0,0,0,0.035)",
            shadowOpacity: pressed || selected ? 0.25 : 0.1,
            shadowRadius: pressed || selected ? 12 : 8,
            shadowOffset: { width: 0, height: pressed || selected ? 6 : 4 },
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        {/* Language icon */}
        <View style={styles.languageImagePlaceholder}>
          <Image
            source={language.icon}
            style={styles.languageIcon}
            resizeMode="contain"
          />
          {disabled && (
            <View style={styles.comingSoonBadge}>
              <ThemedText style={styles.comingSoonText}>Coming Soon</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.languageContent}>
          <View style={styles.languageNames}>
            <ThemedText type="defaultSemiBold" style={styles.languageName}>
              {language.name}
            </ThemedText>
            <ThemedText style={styles.languageNativeName}>
              {language.nativeName}
            </ThemedText>
          </View>

          <View style={styles.languageStats}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statIcon}>🌍</ThemedText>
              <ThemedText style={styles.statText}>
                {language.description}
              </ThemedText>
            </View>
          </View>

          {selected && (
            <Animated.View
              style={[styles.checkmark, { backgroundColor: tintColor }]}
            >
              <ThemedText style={styles.checkmarkText}>✓</ThemedText>
            </Animated.View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const { dispatch } = useOnboarding();

  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  // Set current step on mount
  useEffect(() => {
    dispatch({ type: "SET_CURRENT_STEP", payload: 2 });
  }, [dispatch]);

  const handleLanguageSelect = useCallback((languageId: string) => {
    setSelectedLanguage(languageId);
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedLanguage) {
      dispatch({ type: "SET_LANGUAGE", payload: selectedLanguage });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push("./choose-path");
    }
  }, [dispatch, router, selectedLanguage]);

  const handleBack = () => {
    router.back();
  };
  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.headerWrapper}>
          <AnimatedLinearHeader tintColor={tintColor} onBack={handleBack} />
          <OnboardingProgress
            currentStep={2}
            totalSteps={5}
            style={styles.progressBar}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.title}>
              Choose Your Language
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Start your African language journey
            </ThemedText>
          </View>

          <View style={styles.languageGrid}>
            {SUPPORTED_LANGUAGES.map((language, index) => (
              <LanguageCard
                key={language.id}
                language={language}
                selected={selectedLanguage === language.id}
                tintColor={tintColor}
                onSelect={handleLanguageSelect}
                index={index}
                disabled={language.id !== "sw"}
              />
            ))}
          </View>
        </ScrollView>

        <BlurView
          intensity={50}
          tint={textColor === "#ECEDEE" ? "dark" : "light"}
          style={styles.footerBlur}
        >
          <View style={styles.footerInner}>
            <Pressable
              disabled={!selectedLanguage}
              accessibilityRole="button"
              accessibilityState={{ disabled: !selectedLanguage }}
              onPress={handleContinue}
              style={({ pressed }) => [
                styles.continueButton,
                {
                  backgroundColor: selectedLanguage
                    ? tintColor
                    : "rgba(0,0,0,0.15)",
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <ThemedText style={styles.continueButtonText}>
                {selectedLanguage
                  ? "Continue Your Journey"
                  : "Select a language to continue"}
              </ThemedText>
            </Pressable>
          </View>
        </BlurView>
      </SafeAreaView>
    </ThemedView>
  );
}

// Animated gradient-ish header using simple overlay shapes (avoid extra deps)
function AnimatedLinearHeader({
  tintColor,
  onBack,
}: {
  tintColor: string;
  onBack: () => void;
}) {
  const fade = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fade]);

  return (
    <Animated.View style={[styles.header, { opacity: fade }]}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.backButton,
          { backgroundColor: pressed ? tintColor + "22" : "transparent" },
        ]}
      >
        <ThemedText style={[styles.backButtonText, { color: tintColor }]}>
          ← Back
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  headerWrapper: { paddingHorizontal: 20, paddingTop: 4 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: { paddingVertical: 6, paddingHorizontal: 4, borderRadius: 12 },
  backButtonText: { fontSize: 16, fontWeight: "600" },
  progressBar: {},
  progressBarTrack: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 14,
  },
  progressBarFill: { height: "100%", borderRadius: 4 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 160, paddingTop: 16 },
  headerContent: { alignItems: "center", marginBottom: 32 },
  title: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 24,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  languageGrid: { gap: 20 },
  languageCard: {
    borderRadius: 24,
    borderWidth: 2,
    shadowColor: "#000",
    backgroundColor: "rgba(0,0,0,0.04)",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  languageImagePlaceholder: {
    height: 140,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  languageIcon: {
    width: 80,
    height: 80,
  },
  languageFlag: { fontSize: 64 },
  comingSoonBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  comingSoonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  languageContent: {
    padding: 20,
  },
  languageNames: { marginBottom: 12 },
  languageName: { fontSize: 22, marginBottom: 4, fontWeight: "700" },
  languageNativeName: { fontSize: 15, opacity: 0.65, fontStyle: "italic" },
  languageStats: {
    gap: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statIcon: {
    fontSize: 16,
  },
  statText: {
    fontSize: 14,
    opacity: 0.75,
  },
  checkmark: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  checkmarkText: { color: "white", fontSize: 16, fontWeight: "bold" },
  featureGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
    marginBottom: 20,
  },
  featureCard: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    opacity: 0.8,
  },
  footerBlur: { position: "absolute", left: 0, right: 0, bottom: 0 },
  footerInner: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 34 },
  continueButton: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
