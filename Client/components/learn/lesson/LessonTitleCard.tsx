import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { StyleSheet, View } from "react-native";

interface LessonTitleCardProps {
  phrase: string;
  meaning: string;
}

export default function LessonTitleCard({
  phrase,
  meaning,
}: LessonTitleCardProps) {
  return (
    <View style={styles.titleCard}>
      <ThemedText type="title" style={styles.lessonTitle}>
        {phrase}
      </ThemedText>
      <ThemedText style={styles.lessonMeaning}>{meaning}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  titleCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lessonTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  lessonMeaning: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
});
