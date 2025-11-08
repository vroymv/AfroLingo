import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface LessonCompletionCardProps {
  xpEarned: number;
  onBackToLearn: () => void;
  onNextLesson: () => void;
}

export default function LessonCompletionCard({
  xpEarned,
  onBackToLearn,
  onNextLesson,
}: LessonCompletionCardProps) {
  return (
    <View style={styles.completionCard}>
      <View style={styles.completionHeader}>
        <View style={styles.celebrationIcon}>
          <Ionicons name="trophy" size={32} color="#FFD700" />
        </View>
        <ThemedText type="subtitle" style={styles.completionTitle}>
          Lesson Complete! 🎉
        </ThemedText>
        <ThemedText style={styles.completionSubtitle}>
          +{xpEarned} XP earned
        </ThemedText>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryBtn} onPress={onBackToLearn}>
          <Ionicons name="home-outline" size={20} color="#4A90E2" />
          <ThemedText style={styles.secondaryBtnText}>Back to Learn</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} onPress={onNextLesson}>
          <ThemedText style={styles.primaryBtnText}>Next Lesson</ThemedText>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  completionCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  completionHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  celebrationIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF9E6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  completionSubtitle: {
    fontSize: 16,
    color: "#4A90E2",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 2,
    borderColor: "#4A90E2",
  },
  secondaryBtnText: {
    color: "#4A90E2",
    fontWeight: "700",
    fontSize: 16,
  },
});
