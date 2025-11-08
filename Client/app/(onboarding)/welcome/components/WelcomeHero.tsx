import { ThemedText } from "@/components/ThemedText";
import { Animated, StyleSheet } from "react-native";

interface WelcomeHeroProps {
  fadeAnim: Animated.Value;
  translateAnim: Animated.Value;
}

export default function WelcomeHero({
  fadeAnim,
  translateAnim,
}: WelcomeHeroProps) {
  return (
    <Animated.View
      style={[
        styles.heroSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: Animated.multiply(translateAnim, 0.6) }],
        },
      ]}
    >
      <ThemedText type="subtitle" style={styles.heroTitle}>
        Reconnect with Your Heritage
      </ThemedText>
      <ThemedText style={styles.heroDescription}>
        Learn authentic African languages from native speakers. Connect with
        your roots and embrace your cultural identity.
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    marginBottom: 28,
  },
  heroTitle: {
    textAlign: "center",
    marginBottom: 14,
    fontSize: 24,
    lineHeight: 30,
  },
  heroDescription: {
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.9,
    fontSize: 15,
  },
});
