import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { MOCK_TUTORS } from "@/data/tutors";
import type { Tutor } from "@/types/Tutor";
import { BecomeTutorCTA } from "@/components/tutors/BecomeTutorCTA";
import { TutorSearchBar } from "@/components/tutors/TutorSearchBar";
import { TutorLanguageFilter } from "@/components/tutors/TutorLanguageFilter";
import { TutorCard } from "@/components/tutors/TutorCard";

export default function TutorsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const [query, setQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const languages = useMemo(
    () => Array.from(new Set(MOCK_TUTORS.map((t) => t.language))),
    []
  );

  const filteredTutors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return MOCK_TUTORS.filter((tutor) => {
      if (selectedLanguage && tutor.language !== selectedLanguage) return false;

      if (!normalizedQuery) return true;
      return (
        tutor.name.toLowerCase().includes(normalizedQuery) ||
        tutor.language.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, selectedLanguage]);

  const handleChat = (tutor: Tutor) => {
    console.log(`Starting chat with ${tutor.name}`);
    // Navigate to chat screen
  };

  const handleBecomeTutor = () => {
    console.log("Navigate to become a tutor flow");
    // Navigate to tutor application
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">Find a Tutor 👨‍🏫</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Connect with native speakers and expert teachers
        </ThemedText>
      </View>

      <BecomeTutorCTA colorScheme={colorScheme} onPress={handleBecomeTutor} />

      <TutorSearchBar
        value={query}
        onChangeText={setQuery}
        onClear={() => setQuery("")}
      />

      <TutorLanguageFilter
        colorScheme={colorScheme}
        languages={languages}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
      />

      {/* Tutors List */}
      <ScrollView
        style={styles.tutorsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tutorsListContent}
      >
        {filteredTutors.map((tutor) => (
          <TutorCard
            key={tutor.id}
            tutor={tutor}
            colorScheme={colorScheme}
            onChat={handleChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.7,
  },
  tutorsList: {
    flex: 1,
  },
  tutorsListContent: {
    padding: 20,
    paddingTop: 8,
  },
});
