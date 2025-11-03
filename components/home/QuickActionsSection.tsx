import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

interface QuickActionsSectionProps {
  selectedLanguage: string | null;
  onQuickAction: (action: string) => void;
}

export default function QuickActionsSection({
  selectedLanguage,
  onQuickAction,
}: QuickActionsSectionProps) {
  const getGrammarTip = () => {
    const tips = {
      swahili: [
        "In Swahili, noun classes determine agreement patterns!",
        "Use 'na' to connect ideas, like 'mimi na wewe' (me and you).",
        "Swahili verbs change prefixes based on who's doing the action.",
      ],
      zulu: [
        "isiZulu uses clicks! The 'c' makes a dental click sound.",
        "Respect is shown through language - use 'nkosi' for sir/madam.",
        "Zulu nouns have classes that affect the whole sentence structure.",
      ],
      xhosa: [
        "isiXhosa has three types of clicks: c, q, and x sounds!",
        "The prefix 'uku-' often indicates an infinitive verb form.",
        "Tone is important - the same word can mean different things!",
      ],
      lingala: [
        "Lingala uses tones to distinguish meaning between words.",
        "The word order is usually Subject-Verb-Object, like English.",
        "Respect levels change the pronouns you use for others.",
      ],
    };

    const languageTips = tips[selectedLanguage as keyof typeof tips] || [
      "Practice makes perfect - consistency beats intensity!",
      "Learn phrases, not just words, for better fluency.",
      "Listen to native speakers to improve your accent.",
    ];

    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000
    );
    return languageTips[dayOfYear % languageTips.length];
  };

  return (
    <ThemedView style={styles.quickActions}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Quick Practice
      </ThemedText>

      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => onQuickAction("Listening")}
        >
          <View
            style={[
              styles.actionIconContainer,
              { backgroundColor: "rgba(52, 199, 89, 0.15)" },
            ]}
          >
            <ThemedText style={[styles.actionIcon, { color: "#34C759" }]}>
              🎧
            </ThemedText>
          </View>
          <ThemedText style={styles.actionTitle}>Practice Listening</ThemedText>
          <ThemedText style={styles.actionSubtitle}>Train your ear</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => onQuickAction("Pronunciation")}
        >
          <View
            style={[
              styles.actionIconContainer,
              { backgroundColor: "rgba(255, 149, 0, 0.15)" },
            ]}
          >
            <ThemedText style={[styles.actionIcon, { color: "#FF9500" }]}>
              🗣️
            </ThemedText>
          </View>
          <ThemedText style={styles.actionTitle}>
            Pronunciation Drill
          </ThemedText>
          <ThemedText style={styles.actionSubtitle}>
            Perfect your speech
          </ThemedText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.grammarTipCard}
        onPress={() => onQuickAction("Grammar")}
      >
        <View style={styles.grammarTipIcon}>
          <ThemedText style={styles.grammarTipIconText}>📚</ThemedText>
        </View>
        <View style={styles.grammarTipContent}>
          <ThemedText style={styles.grammarTipTitle}>
            Grammar Tip of the Day
          </ThemedText>
          <ThemedText style={styles.grammarTipText}>
            {getGrammarTip()}
          </ThemedText>
        </View>
        <ThemedText style={styles.grammarTipArrow}>→</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  quickActions: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: "rgba(0, 122, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.1)",
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
  },
  grammarTipCard: {
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 193, 7, 0.2)",
  },
  grammarTipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  grammarTipIconText: {
    fontSize: 16,
  },
  grammarTipContent: {
    flex: 1,
  },
  grammarTipTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#B8860B",
  },
  grammarTipText: {
    fontSize: 12,
    opacity: 0.8,
    lineHeight: 16,
  },
  grammarTipArrow: {
    fontSize: 16,
    color: "#B8860B",
  },
});
