// api is api/users/setup

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { setupUserProfile } from "@/services/userSetup";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function SetupLoadingScreen() {
  const router = useRouter();
  const { state } = useOnboarding();
  const [loadingMessage, setLoadingMessage] = useState(
    "Setting up your personalized experience..."
  );

  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const dotAnimation1 = useRef(new Animated.Value(0)).current;
  const dotAnimation2 = useRef(new Animated.Value(0)).current;
  const dotAnimation3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Spin animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Animated loading dots
    const animateDots = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotAnimation1, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnimation2, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnimation3, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(dotAnimation1, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(dotAnimation2, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(dotAnimation3, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    animateDots();
  }, [spinValue, fadeValue, dotAnimation1, dotAnimation2, dotAnimation3]);

  useEffect(() => {
    // Function to setup user profile
    const setupUserProfileAsync = async () => {
      try {
        setLoadingMessage("Creating your learning profile...");

        // Call API to setup user profile
        const result = await setupUserProfile({
          language: state.selectedLanguage,
          level: state.selectedLevel,
          placementScore: state.placementTestScore,
          personalization: state.personalization,
          currentStep: state.currentStep,
          isCompleted: state.isCompleted,
        });

        if (result.success) {
          setLoadingMessage("Personalizing your dashboard...");
          await new Promise((resolve) => setTimeout(resolve, 1000));

          setLoadingMessage("Preparing your first lesson...");
          await new Promise((resolve) => setTimeout(resolve, 1000));

          setLoadingMessage("Almost ready...");
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Navigate to main app
          router.replace("/(tabs)");
        } else {
          console.error("Setup failed:", result.message);
          // Even on error, navigate to main app (for now)
          // In production, you might want to show an error message
          router.replace("/(tabs)");
        }
      } catch (error) {
        console.error("Error setting up user profile:", error);
        // Even on error, navigate to main app (for now)
        // In production, you might want to show an error message
        router.replace("/(tabs)");
      }
    };

    setupUserProfileAsync();
  }, [router, state]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const getDotOpacity = (animation: Animated.Value) => {
    return animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });
  };

  const getDotScale = (animation: Animated.Value) => {
    return animation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.3],
    });
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <LinearGradient
        colors={[tintColor + "15", backgroundColor]}
        style={styles.gradient}
      />

      <Animated.View style={[styles.content, { opacity: fadeValue }]}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              backgroundColor: tintColor + "20",
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <ThemedText style={styles.logoIcon}>🌍</ThemedText>
        </Animated.View>

        <ThemedText style={styles.appName}>AfroLingo</ThemedText>

        <View style={styles.messageContainer}>
          <ThemedText style={styles.message}>{loadingMessage}</ThemedText>
        </View>

        <View style={styles.loadingDots}>
          <Animated.View
            style={{
              opacity: getDotOpacity(dotAnimation1),
              transform: [{ scale: getDotScale(dotAnimation1) }],
            }}
          >
            <ThemedText style={[styles.dot, { color: tintColor }]}>
              ●
            </ThemedText>
          </Animated.View>
          <Animated.View
            style={{
              opacity: getDotOpacity(dotAnimation2),
              transform: [{ scale: getDotScale(dotAnimation2) }],
            }}
          >
            <ThemedText style={[styles.dot, { color: tintColor }]}>
              ●
            </ThemedText>
          </Animated.View>
          <Animated.View
            style={{
              opacity: getDotOpacity(dotAnimation3),
              transform: [{ scale: getDotScale(dotAnimation3) }],
            }}
          >
            <ThemedText style={[styles.dot, { color: tintColor }]}>
              ●
            </ThemedText>
          </Animated.View>
        </View>

        <ThemedText style={styles.patientText}>
          Please be patient while we set up your interface
        </ThemedText>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoIcon: {
    fontSize: 60,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 32,
  },
  messageContainer: {
    minHeight: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
  loadingDots: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    fontSize: 24,
  },
  patientText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    fontStyle: "italic",
  },
});
