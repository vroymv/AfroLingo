import { ThemedText } from "@/components/ThemedText";
import { Animated, StyleSheet, View } from "react-native";

interface WelcomeHeaderProps {
  fadeAnim: Animated.Value;
  translateAnim: Animated.Value;
  tintColor: string;
}

export default function WelcomeHeader({
  fadeAnim,
  translateAnim,
  tintColor,
}: WelcomeHeaderProps) {
  return (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateAnim }],
        },
      ]}
    >
      <View style={styles.logoContainer}>
        <View style={[styles.logoPlaceholder, { backgroundColor: tintColor }]}>
          <ThemedText style={styles.logoText}>AL</ThemedText>
        </View>
      </View>
      <ThemedText type="title" style={styles.appName}>
        AfroLingo
      </ThemedText>
      <View style={[styles.taglinePill, { backgroundColor: tintColor }]}>
        <ThemedText style={styles.taglinePillText}>
          Heritage Learning
        </ThemedText>
      </View>
      <ThemedText style={styles.tagline}>
        Learn your roots. Speak your heritage.
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 36,
  },
  logoContainer: {
    marginBottom: 12,
  },
  logoPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "800",
    color: "white",
  },
  appName: {
    marginBottom: 4,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  taglinePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
    marginBottom: 10,
    alignSelf: "center",
  },
  taglinePillText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  tagline: {
    textAlign: "center",
    opacity: 0.75,
    fontStyle: "italic",
    fontSize: 15,
    lineHeight: 20,
  },
});
