import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

export default function TutorsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Tutors 👩🏾‍🏫</ThemedText>
          <ThemedText type="subtitle">
            One-on-one lessons with native speakers
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold">Your Upcoming Sessions</ThemedText>
          <ThemedView style={styles.sessionCard}>
            <ThemedView style={styles.sessionHeader}>
              <ThemedText type="defaultSemiBold">
                Conversation Practice
              </ThemedText>
              <ThemedText type="default">Tomorrow, 2:00 PM</ThemedText>
            </ThemedView>
            <ThemedText type="default">
              with Amara (Yoruba native speaker)
            </ThemedText>
            <TouchableOpacity style={styles.sessionButton}>
              <ThemedText type="default">Join Session</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold">Featured Tutors</ThemedText>

          <ThemedView style={styles.tutorCard}>
            <ThemedView style={styles.tutorHeader}>
              <ThemedText type="defaultSemiBold">👩🏾‍🏫 Amara O.</ThemedText>
              <ThemedText type="default">⭐ 4.9 (127 reviews)</ThemedText>
            </ThemedView>
            <ThemedText type="default">
              Native Yoruba speaker from Lagos, Nigeria
            </ThemedText>
            <ThemedText type="default">
              Specializes in: Conversational Yoruba, Business Language
            </ThemedText>
            <ThemedView style={styles.tutorDetails}>
              <ThemedText type="default">
                💰 $25/hour • 🕐 Available now
              </ThemedText>
            </ThemedView>
            <TouchableOpacity style={styles.bookButton}>
              <ThemedText type="default">Book Lesson</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.tutorCard}>
            <ThemedView style={styles.tutorHeader}>
              <ThemedText type="defaultSemiBold">👨🏿‍🏫 Kwame A.</ThemedText>
              <ThemedText type="default">⭐ 4.8 (89 reviews)</ThemedText>
            </ThemedView>
            <ThemedText type="default">
              Native Twi speaker from Accra, Ghana
            </ThemedText>
            <ThemedText type="default">
              Specializes in: Grammar, Cultural Context, Pronunciation
            </ThemedText>
            <ThemedView style={styles.tutorDetails}>
              <ThemedText type="default">
                💰 $22/hour • 🕐 Next available: 6 PM
              </ThemedText>
            </ThemedView>
            <TouchableOpacity style={styles.bookButton}>
              <ThemedText type="default">Book Lesson</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.tutorCard}>
            <ThemedView style={styles.tutorHeader}>
              <ThemedText type="defaultSemiBold">👩🏽‍🏫 Fatou D.</ThemedText>
              <ThemedText type="default">⭐ 4.9 (156 reviews)</ThemedText>
            </ThemedView>
            <ThemedText type="default">
              Native Wolof speaker from Dakar, Senegal
            </ThemedText>
            <ThemedText type="default">
              Specializes in: Beginner Friendly, Cultural Immersion
            </ThemedText>
            <ThemedView style={styles.tutorDetails}>
              <ThemedText type="default">
                💰 $20/hour • 🕐 Available tomorrow
              </ThemedText>
            </ThemedView>
            <TouchableOpacity style={styles.bookButton}>
              <ThemedText type="default">Book Lesson</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold">Browse by Language</ThemedText>
          <ThemedView style={styles.languageContainer}>
            <TouchableOpacity style={styles.languageCard}>
              <ThemedText type="default">🇳🇬 Yoruba</ThemedText>
              <ThemedText type="default">24 tutors</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.languageCard}>
              <ThemedText type="default">🇿🇦 Zulu</ThemedText>
              <ThemedText type="default">18 tutors</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.languageCard}>
              <ThemedText type="default">🇰🇪 Swahili</ThemedText>
              <ThemedText type="default">31 tutors</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.languageCard}>
              <ThemedText type="default">🇸🇳 Wolof</ThemedText>
              <ThemedText type="default">12 tutors</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold">Lesson Types</ThemedText>
          <ThemedView style={styles.lessonTypesContainer}>
            <TouchableOpacity style={styles.lessonTypeCard}>
              <ThemedText type="default">🗣️ Conversation Practice</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lessonTypeCard}>
              <ThemedText type="default">📝 Grammar Focus</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lessonTypeCard}>
              <ThemedText type="default">🎭 Cultural Immersion</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lessonTypeCard}>
              <ThemedText type="default">💼 Business Language</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  section: {
    marginBottom: 24,
  },
  sessionCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0, 200, 100, 0.1)",
  },
  sessionHeader: {
    marginBottom: 8,
  },
  sessionButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0, 200, 100, 0.3)",
    alignItems: "center",
  },
  tutorCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  tutorHeader: {
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tutorDetails: {
    marginTop: 8,
    marginBottom: 12,
  },
  bookButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0, 150, 255, 0.2)",
    alignItems: "center",
  },
  languageContainer: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  languageCard: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
  },
  lessonTypesContainer: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  lessonTypeCard: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
  },
});
