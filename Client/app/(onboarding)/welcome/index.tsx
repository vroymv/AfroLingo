import { ThemedView } from "@/components/ThemedView";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundDecoration from "./components/BackgroundDecoration";
import WelcomeFeatures from "./components/WelcomeFeatures";
import WelcomeFooter from "./components/WelcomeFooter";
import WelcomeHeader from "./components/WelcomeHeader";
import WelcomeHero from "./components/WelcomeHero";

export default function WelcomeScreen() {
  const router = useRouter();
  const { dispatch } = useOnboarding();
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Set current step to 1 on mount
    dispatch({ type: "SET_CURRENT_STEP", payload: 1 });

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateAnim, dispatch]);

  const handleGetStarted = () => {
    router.push("./language-selection");
  };

  return (
    <ThemedView style={[styles.root, { backgroundColor }]}>
      <StatusBar style="auto" />
      <BackgroundDecoration tintColor={tintColor} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces
        >
          <WelcomeHeader
            fadeAnim={fadeAnim}
            translateAnim={translateAnim}
            tintColor={tintColor}
          />
          <WelcomeHero fadeAnim={fadeAnim} translateAnim={translateAnim} />
          <WelcomeFeatures tintColor={tintColor} />
          <WelcomeFooter
            tintColor={tintColor}
            onGetStarted={handleGetStarted}
          />
          <View style={{ height: 12 }} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
});
