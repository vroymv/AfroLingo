import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, View } from "react-native";

interface HeaderSectionProps {
  selectedLanguage: string | null;
}

export default function HeaderSection({
  selectedLanguage,
}: HeaderSectionProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();

    // Get greeting in selected language with cultural flair
    const getLocalizedGreeting = () => {
      if (hour < 12) {
        switch (selectedLanguage) {
          case "sw":
            return "Habari za asubuhi"; // Good morning
          case "zu":
            return "Sawubona"; // Hello/Good morning
          case "ln":
            return "Mbote na ntongo"; // Good morning
          default:
            return "Good morning";
        }
      } else if (hour < 17) {
        switch (selectedLanguage) {
          case "sw":
            return "Habari za mchana"; // Good afternoon
          case "zu":
            return "Sawubona"; // Hello
          case "ln":
            return "Mbote na pokwa"; // Good afternoon
          default:
            return "Good afternoon";
        }
      } else {
        switch (selectedLanguage) {
          case "sw":
            return "Habari za jioni"; // Good evening
          case "zu":
            return "Sawubona"; // Hello
          case "ln":
            return "Mbote na mpokwa"; // Good evening
          default:
            return "Good evening";
        }
      }
    };

    return getLocalizedGreeting();
  };

  const getMotivationalPhrase = () => {
    const phrases = [
      "Keep your heritage alive today! 🌍",
      "Every word connects you to your roots ✨",
      "Your ancestors' wisdom flows through language 🌳",
      "Today, speak the language of your heart 💛",
      "Culture lives in every conversation 🗣️",
      "Honor your heritage, one lesson at a time 👑",
    ];

    // Rotate based on day of year to keep it fresh
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000
    );
    return phrases[dayOfYear % phrases.length];
  };

  const getLanguageFlag = (language: string | null) => {
    switch (language) {
      case "sw":
        return "🇹🇿";
      case "zu":
        return "🇿🇦";
      case "ln":
        return "🇨🇩";
      default:
        return "🌍";
    }
  };

  return (
    <ThemedView style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.greeting}>{getGreeting()}, Roy!</ThemedText>
          <ThemedText style={styles.motivationalPhrase}>
            {getMotivationalPhrase()}
          </ThemedText>
        </View>
        <ThemedText style={styles.languageFlag}>
          {getLanguageFlag(selectedLanguage)}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 16,
    // backgroundColor: "black",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  motivationalPhrase: {
    fontSize: 16,
    opacity: 0.8,
    fontStyle: "italic",
    lineHeight: 22,
  },
  languageFlag: {
    fontSize: 22,
  },
});
