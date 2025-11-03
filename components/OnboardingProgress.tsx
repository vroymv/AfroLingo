import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  showStepCounter?: boolean;
  style?: any;
}

export function OnboardingProgress({
  currentStep,
  totalSteps,
  showStepCounter = true,
  style,
}: OnboardingProgressProps) {
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const progressPercentage = (currentStep / totalSteps) * 100;

  useEffect(() => {
    // Animate progress bar fill
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [progressPercentage, progressAnim, fadeAnim]);

  return (
    <Animated.View style={[styles.container, style, { opacity: fadeAnim }]}>
      {showStepCounter && (
        <View style={styles.stepCounter}>
          <ThemedText style={[styles.stepText, { color: textColor }]}>
            Step {currentStep} of {totalSteps}
          </ThemedText>
        </View>
      )}

      <View
        style={[styles.progressTrack, { backgroundColor: `${tintColor}15` }]}
      >
        <Animated.View
          style={[
            styles.progressFill,
            {
              backgroundColor: tintColor,
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
                extrapolate: "clamp",
              }),
            },
          ]}
        />

        {/* Progress dots for visual enhancement */}
        <View style={styles.dotsContainer}>
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber <= currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <View
                key={stepNumber}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: isCompleted ? tintColor : `${tintColor}25`,
                    transform: [{ scale: isCurrent ? 1.2 : 1 }],
                    shadowOpacity: isCurrent ? 0.3 : 0,
                    shadowColor: tintColor,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  stepCounter: {
    alignItems: "center",
    marginBottom: 12,
  },
  stepText: {
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.7,
  },
  progressTrack: {
    height: 8,
    borderRadius: 6,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dotsContainer: {
    position: "absolute",
    top: -2,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "white",
  },
});
