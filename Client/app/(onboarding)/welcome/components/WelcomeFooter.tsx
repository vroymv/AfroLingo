import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface WelcomeFooterProps {
  tintColor: string;
  onGetStarted: () => void;
}

export default function WelcomeFooter({
  tintColor,
  onGetStarted,
}: WelcomeFooterProps) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Get started selecting your language"
        style={[styles.getStartedButton, { backgroundColor: tintColor }]}
        onPress={onGetStarted}
        activeOpacity={0.85}
      >
        <ThemedText style={styles.getStartedButtonText}>Get Started</ThemedText>
      </TouchableOpacity>
      <ThemedText style={styles.footerText}>
        Join thousands discovering their heritage languages
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    gap: 14,
  },
  getStartedButton: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: 220,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  getStartedButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footerText: {
    textAlign: "center",
    opacity: 0.65,
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 300,
  },
});
