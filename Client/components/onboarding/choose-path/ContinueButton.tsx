import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

interface ContinueButtonProps {
  selectedPath: string | null;
  onPress: () => void;
}

export function ContinueButton({ selectedPath, onPress }: ContinueButtonProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const tintColor = useThemeColor({}, "tint");

  // Animate button when path is selected
  useEffect(() => {
    if (selectedPath) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedPath, fadeAnim, scaleAnim]);

  if (!selectedPath) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.footer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: tintColor }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.continueButtonText}>
          {selectedPath === "find-level" ? "Start Assessment" : "Choose Level"}
        </ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  continueButton: {
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
