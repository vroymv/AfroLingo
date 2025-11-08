import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface CulturalNuggetCardProps {
  selectedLanguage: string | null;
}

export default function CulturalNuggetCard({
  selectedLanguage,
}: CulturalNuggetCardProps) {
  const getCulturalNugget = () => {
    const culturalFacts = {
      swahili: [
        "The word 'safari' comes from Swahili meaning 'journey'. It reflects the nomadic traditions of East African cultures.",
        "Swahili poetry, called 'Utendi', has been passed down for over 600 years, preserving ancient wisdom and stories.",
        "The greeting 'Hujambo' literally means 'you have no troubles' - reflecting the ubuntu philosophy of shared humanity.",
        "Swahili has words like 'Harambee' (pulling together) that embody the spirit of community cooperation.",
      ],
      zulu: [
        "The Zulu greeting 'Sawubona' means 'I see you' - acknowledging the full humanity and dignity of the person.",
        "Traditional Zulu praise poetry, called 'Izibongo', celebrates ancestors and passes down family histories.",
        "The concept of 'Ubuntu' originated from Bantu languages: 'I am because we are' - emphasizing interconnectedness.",
        "Zulu beadwork tells stories - different colors and patterns convey messages about love, status, and family.",
      ],
      xhosa: [
        "Xhosa click sounds come from ancient interactions with Khoisan peoples, preserving linguistic diversity.",
        "The tradition of 'Imbongi' (praise singers) keeps oral history alive through powerful spoken word performances.",
        "Nelson Mandela spoke Xhosa - his clan name 'Madiba' means 'father of the family' in Xhosa tradition.",
        "Xhosa traditional ceremonies honor ancestors who are believed to guide and protect the living.",
      ],
      lingala: [
        "Lingala developed as a trade language along the Congo River, connecting diverse Central African cultures.",
        "The phrase 'Mokili ezali mokuse' means 'the world is small' - reflecting how language connects distant communities.",
        "Lingala music, especially Soukous, spread African rhythm and culture across the world through the diaspora.",
        "In Lingala culture, storytelling around the fire preserves ancient wisdom, moral lessons, and family histories.",
      ],
    };

    const defaultFacts = [
      "African languages have influenced global culture - words like 'jazz', 'banjo', and 'zombie' have African origins.",
      "There are over 2,000 languages spoken in Africa, representing incredible linguistic and cultural diversity.",
      "Many African languages use tone to change meaning - the same sequence of sounds can mean different things.",
      "Ubuntu philosophy teaches us that our humanity is interconnected - what affects one, affects all.",
    ];

    const facts =
      culturalFacts[selectedLanguage as keyof typeof culturalFacts] ||
      defaultFacts;
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000
    );
    return facts[dayOfYear % facts.length];
  };

  return (
    <ThemedView style={styles.culturalNuggetCard}>
      <View style={styles.culturalNuggetHeader}>
        <ThemedText style={styles.culturalNuggetEmoji}>🌍</ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.culturalNuggetTitle}>
          Cultural Nugget
        </ThemedText>
      </View>
      <ThemedText style={styles.culturalNuggetLabel}>Did you know?</ThemedText>
      <ThemedText style={styles.culturalNuggetText}>
        {getCulturalNugget()}
      </ThemedText>
      <TouchableOpacity style={styles.culturalNuggetButton}>
        <ThemedText style={styles.culturalNuggetButtonText}>
          Learn More About This Culture
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  culturalNuggetCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(138, 43, 226, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(138, 43, 226, 0.2)",
  },
  culturalNuggetHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  culturalNuggetEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  culturalNuggetTitle: {
    fontSize: 18,
    color: "#8A2BE2",
  },
  culturalNuggetLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#8A2BE2",
  },
  culturalNuggetText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.9,
  },
  culturalNuggetButton: {
    backgroundColor: "rgba(138, 43, 226, 0.15)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  culturalNuggetButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8A2BE2",
  },
});
