import { ThemedText } from "@/components/ThemedText";
import { Platform, StyleSheet, View } from "react-native";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface WelcomeFeaturesProps {
  tintColor: string;
}

const features: Feature[] = [
  {
    icon: "🎯",
    title: "Authentic Voices",
    description: "Learn from real native speakers",
  },
  {
    icon: "🌍",
    title: "Cultural Context",
    description: "Understand traditions and customs",
  },
  {
    icon: "👥",
    title: "Community",
    description: "Connect with learners worldwide",
  },
];

export default function WelcomeFeatures({ tintColor }: WelcomeFeaturesProps) {
  return (
    <View style={styles.featuresCard}>
      {features.map((f, idx) => (
        <View
          key={f.title}
          style={[
            styles.featureRow,
            idx !== features.length - 1 && styles.featureDivider,
          ]}
        >
          <View
            style={[styles.featureIconWrapper, { backgroundColor: tintColor }]}
          >
            <ThemedText style={styles.featureIconText}>{f.icon}</ThemedText>
          </View>
          <View style={styles.featureCopy}>
            <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
              {f.title}
            </ThemedText>
            <ThemedText style={styles.featureDescription}>
              {f.description}
            </ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  featuresCard: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    ...(Platform.OS === "android"
      ? { elevation: 2 }
      : {
          shadowColor: "#000",
          shadowOpacity: 0.07,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
        }),
    backdropFilter: "blur(6px)" as any,
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    gap: 16,
  },
  featureDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(120,120,120,0.25)",
  },
  featureIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureCopy: {
    flex: 1,
  },
  featureTitle: {
    marginBottom: 2,
  },
  featureDescription: {
    opacity: 0.7,
    fontSize: 14,
    lineHeight: 20,
  },
});
