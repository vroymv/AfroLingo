import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet } from "react-native";

export default function LanguageProgress() {
  return (
    <ThemedView style={styles.section}>
      <ThemedText type="defaultSemiBold">Language Progress</ThemedText>
      <ThemedView style={styles.languageCard}>
        <ThemedView style={styles.languageHeader}>
          <ThemedText type="defaultSemiBold">🇳🇬 Yoruba</ThemedText>
          <ThemedText type="default">Beginner</ThemedText>
        </ThemedView>
        <ThemedView style={styles.skillsContainer}>
          <ThemedView style={styles.skillRow}>
            <ThemedText type="default">Speaking</ThemedText>
            <ThemedView style={styles.skillBar}>
              <ThemedView style={[styles.skillFill, { width: "40%" }]} />
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.skillRow}>
            <ThemedText type="default">Listening</ThemedText>
            <ThemedView style={styles.skillBar}>
              <ThemedView style={[styles.skillFill, { width: "55%" }]} />
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.skillRow}>
            <ThemedText type="default">Reading</ThemedText>
            <ThemedView style={styles.skillBar}>
              <ThemedView style={[styles.skillFill, { width: "35%" }]} />
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.skillRow}>
            <ThemedText type="default">Writing</ThemedText>
            <ThemedView style={styles.skillBar}>
              <ThemedView style={[styles.skillFill, { width: "30%" }]} />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  languageCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  languageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  skillsContainer: {
    gap: 12,
  },
  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skillBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginLeft: 16,
  },
  skillFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#2196F3",
  },
});
