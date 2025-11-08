import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export function LoadingScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

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
  }, [spinValue, fadeValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

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
        <ThemedText style={styles.tagline}>
          Connect with your roots through language
        </ThemedText>

        <View style={styles.loadingDots}>
          <ThemedText style={[styles.dot, { color: tintColor }]}>●</ThemedText>
          <ThemedText style={[styles.dot, { color: tintColor }]}>●</ThemedText>
          <ThemedText style={[styles.dot, { color: tintColor }]}>●</ThemedText>
        </View>
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
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 32,
  },
  loadingDots: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    fontSize: 8,
  },
});
