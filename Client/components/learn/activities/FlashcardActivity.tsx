import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Activity } from "@/data/lessons";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface FlashcardActivityProps {
  activity: Activity;
  phrase: string;
  meaning: string;
  pronunciation?: string;
  onComplete: () => void;
}

export default function FlashcardActivity({
  activity,
  phrase,
  meaning,
  pronunciation,
  onComplete,
}: FlashcardActivityProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleContinue = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    } else if (!showExplanation && activity.explanation) {
      setShowExplanation(true);
    } else {
      onComplete();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.question}>{activity.question}</ThemedText>

        <TouchableOpacity
          style={[styles.flashcard, isFlipped && styles.flashcardFlipped]}
          onPress={handleFlip}
          activeOpacity={0.9}
        >
          {!isFlipped ? (
            <View style={styles.cardFront}>
              <View style={styles.languageLabel}>
                <ThemedText style={styles.labelText}>Swahili</ThemedText>
              </View>
              <ThemedText style={styles.phrase}>{phrase}</ThemedText>
              {pronunciation && (
                <View style={styles.pronunciationContainer}>
                  <Ionicons
                    name="volume-medium-outline"
                    size={16}
                    color="#666"
                  />
                  <ThemedText style={styles.pronunciation}>
                    [{pronunciation}]
                  </ThemedText>
                </View>
              )}
              <View style={styles.flipHint}>
                <Ionicons name="sync-outline" size={16} color="#999" />
                <ThemedText style={styles.tapHint}>Tap to flip</ThemedText>
              </View>
            </View>
          ) : (
            <View style={styles.cardBack}>
              <View style={styles.languageLabel}>
                <ThemedText style={styles.labelText}>English</ThemedText>
              </View>
              <ThemedText style={styles.meaning}>{meaning}</ThemedText>
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={32} color="#2E7D32" />
              </View>
            </View>
          )}
        </TouchableOpacity>

        {showExplanation && activity.explanation && (
          <View style={styles.explanation}>
            <View style={styles.explanationHeader}>
              <Ionicons name="information-circle" size={20} color="#4A90E2" />
              <ThemedText style={styles.explanationTitle}>
                Did you know?
              </ThemedText>
            </View>
            <ThemedText style={styles.explanationText}>
              {activity.explanation}
            </ThemedText>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <ThemedText style={styles.continueButtonText}>
          {!isFlipped
            ? "Show Answer"
            : showExplanation || !activity.explanation
            ? "Continue"
            : "Learn More"}
        </ThemedText>
        <Ionicons
          name={isFlipped ? "arrow-forward" : "eye-outline"}
          size={20}
          color="white"
        />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    paddingVertical: 24,
    minHeight: 500,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  question: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    fontWeight: "600",
  },
  flashcard: {
    width: "100%",
    minHeight: 280,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#4A90E2",
  },
  flashcardFlipped: {
    borderColor: "#2E7D32",
  },
  cardFront: {
    alignItems: "center",
    width: "100%",
  },
  cardBack: {
    alignItems: "center",
    width: "100%",
  },
  languageLabel: {
    backgroundColor: "#EBF5FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4A90E2",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  phrase: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 12,
    textAlign: "center",
  },
  pronunciationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  pronunciation: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
  meaning: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 16,
  },
  flipHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  tapHint: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  checkmark: {
    marginTop: 8,
  },
  explanation: {
    backgroundColor: "#EBF5FF",
    padding: 20,
    borderRadius: 16,
    marginTop: 16,
    width: "100%",
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  explanationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A90E2",
  },
  explanationText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
  continueButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
