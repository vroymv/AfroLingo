import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  colorScheme: "light" | "dark" | null;
  languages: string[];
  selectedLanguage: string | null;
  onSelectLanguage: (language: string | null) => void;
};

export function TutorLanguageFilter({
  colorScheme,
  languages,
  selectedLanguage,
  onSelectLanguage,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
    >
      <TouchableOpacity
        style={[
          styles.filterChip,
          {
            backgroundColor:
              selectedLanguage === null
                ? "#4A90E2"
                : colorScheme === "dark"
                ? "#2C2C2E"
                : "#F2F2F7",
          },
        ]}
        onPress={() => onSelectLanguage(null)}
      >
        <ThemedText
          style={[
            styles.filterChipText,
            selectedLanguage === null && styles.filterChipTextActive,
          ]}
        >
          All Languages
        </ThemedText>
      </TouchableOpacity>

      {languages.map((lang) => {
        const isActive = selectedLanguage === lang;

        return (
          <TouchableOpacity
            key={lang}
            style={[
              styles.filterChip,
              {
                backgroundColor: isActive
                  ? "#4A90E2"
                  : colorScheme === "dark"
                  ? "#2C2C2E"
                  : "#F2F2F7",
              },
            ]}
            onPress={() => onSelectLanguage(lang)}
          >
            <ThemedText
              style={[
                styles.filterChipText,
                isActive && styles.filterChipTextActive,
              ]}
            >
              {lang}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    maxHeight: 50,
    marginBottom: 12,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
});
