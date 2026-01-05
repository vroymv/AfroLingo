import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getGrammarTipOfDay } from "@/services/grammarTips";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

interface QuickActionsSectionProps {
  selectedLanguage: string | null;
  onQuickAction: (action: string) => void;
  refreshSignal?: number;
}

export default function QuickActionsSection({
  selectedLanguage,
  onQuickAction,
  refreshSignal,
}: QuickActionsSectionProps) {
  const getLocalGrammarTip = (language: string | null) => {
    const tips: Record<string, string[]> = {
      sw: [
        "Swahili nouns belong to noun classes, and agreement shows up across the sentence.",
        "Verb prefixes can encode subject + tense + object in one word.",
        "The connector 'na' is commonly used for 'and/with'.",
      ],
      zu: [
        "isiZulu uses click consonants; the letter 'c' is a dental click.",
        "Zulu has noun classes—agreement affects verbs and adjectives.",
        "Politeness can change forms; listen for respectful language in context.",
      ],
      xh: [
        "isiXhosa uses three main click types: c, q, and x.",
        "The prefix 'uku-' commonly marks an infinitive verb form.",
        "Tone and stress matter—practice by copying native audio.",
      ],
      ln: [
        "Lingala often follows Subject–Verb–Object word order.",
        "Tone and rhythm can change meaning—practice listening closely.",
        "Pronouns and forms can vary with respect and familiarity.",
      ],
      general: [
        "Consistency beats intensity: a little every day adds up.",
        "Learn phrases, not just single words.",
        "Repeat after native audio to improve rhythm and pronunciation.",
      ],
    };

    const languageKey = language && tips[language] ? language : "general";
    const languageTips = tips[languageKey];

    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000
    );

    return languageTips[dayOfYear % languageTips.length];
  };

  const [grammarTip, setGrammarTip] = useState<string>(() =>
    getLocalGrammarTip(selectedLanguage)
  );

  const languageForTip = useMemo(() => {
    if (!selectedLanguage) return null;
    return selectedLanguage.toLowerCase();
  }, [selectedLanguage]);

  useEffect(() => {
    let cancelled = false;

    // Always show something immediately.
    setGrammarTip(getLocalGrammarTip(languageForTip));

    (async () => {
      const result = await getGrammarTipOfDay(languageForTip);
      if (cancelled) return;

      if (result.success && result.data?.text) {
        setGrammarTip(result.data.text);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [languageForTip, refreshSignal]);

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
          <ThemedText style={styles.grammarTipText}>{grammarTip}</ThemedText>
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
