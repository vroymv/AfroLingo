import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface ConversationLine {
  speaker: string;
  text: string;
  translation: string;
}

interface ConversationPracticeActivityProps {
  activity: {
    question?: string;
    description?: string;
    conversation?: ConversationLine[];
  };
  onComplete: () => void;
}

export default function ConversationPracticeActivity({
  activity,
  onComplete,
}: ConversationPracticeActivityProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);

  const conversation = activity.conversation || [];
  const isLastLine = currentLine >= conversation.length - 1;

  const handleNext = () => {
    if (isLastLine) {
      onComplete();
    } else {
      setCurrentLine(currentLine + 1);
      setShowTranslation(false);
    }
  };

  const handlePrevious = () => {
    if (currentLine > 0) {
      setCurrentLine(currentLine - 1);
      setShowTranslation(false);
    }
  };

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  if (conversation.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No conversation data available</ThemedText>
      </ThemedView>
    );
  }

  const line = conversation[currentLine];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {activity.question || "Practice Conversation"}
          </ThemedText>
          {activity.description && (
            <ThemedText type="default" style={styles.description}>
              {activity.description}
            </ThemedText>
          )}
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <ThemedText type="default" style={styles.progressText}>
            Line {currentLine + 1} of {conversation.length}
          </ThemedText>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentLine + 1) / conversation.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Conversation Line */}
        <View style={styles.conversationCard}>
          {/* Speaker */}
          <View style={styles.speakerContainer}>
            <ThemedText type="defaultSemiBold" style={styles.speaker}>
              {line.speaker}
            </ThemedText>
          </View>

          {/* Swahili Text */}
          <View style={styles.textContainer}>
            <ThemedText type="default" style={styles.swahiliText}>
              {line.text}
            </ThemedText>
          </View>

          {/* Translation Toggle */}
          <TouchableOpacity
            style={styles.translationButton}
            onPress={toggleTranslation}
          >
            <ThemedText style={styles.translationButtonText}>
              {showTranslation ? "Hide Translation" : "Show Translation"}
            </ThemedText>
          </TouchableOpacity>

          {/* Translation */}
          {showTranslation && (
            <View style={styles.translationContainer}>
              <ThemedText type="default" style={styles.translationText}>
                {line.translation}
              </ThemedText>
            </View>
          )}
        </View>

        {/* All Conversation Lines Preview */}
        <View style={styles.previewContainer}>
          <ThemedText type="defaultSemiBold" style={styles.previewTitle}>
            Full Conversation:
          </ThemedText>
          {conversation.map((convLine, index) => (
            <View
              key={index}
              style={[
                styles.previewLine,
                index === currentLine && styles.previewLineCurrent,
              ]}
            >
              <ThemedText
                type="default"
                style={[
                  styles.previewSpeaker,
                  index === currentLine && styles.previewTextCurrent,
                ]}
              >
                {convLine.speaker}:
              </ThemedText>
              <ThemedText
                type="default"
                style={[
                  styles.previewText,
                  index === currentLine && styles.previewTextCurrent,
                ]}
              >
                {convLine.text}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.previousButton,
              currentLine === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePrevious}
            disabled={currentLine === 0}
          >
            <ThemedText style={styles.navButtonText}>← Previous</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNext}
          >
            <ThemedText style={styles.navButtonText}>
              {isLastLine ? "Complete ✓" : "Next →"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    textAlign: "center",
    marginBottom: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4A90E2",
    borderRadius: 3,
  },
  conversationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  speakerContainer: {
    marginBottom: 12,
  },
  speaker: {
    fontSize: 18,
    color: "#4A90E2",
  },
  textContainer: {
    marginBottom: 16,
  },
  swahiliText: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
  },
  translationButton: {
    backgroundColor: "#E3F2FD",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  translationButtonText: {
    color: "#1976D2",
    fontSize: 14,
    fontWeight: "600",
  },
  translationContainer: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
  },
  translationText: {
    fontSize: 16,
    fontStyle: "italic",
    opacity: 0.8,
  },
  previewContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  previewLine: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  previewLineCurrent: {
    backgroundColor: "#E3F2FD",
  },
  previewSpeaker: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
    opacity: 0.7,
  },
  previewText: {
    fontSize: 14,
    opacity: 0.6,
  },
  previewTextCurrent: {
    opacity: 1,
    color: "#1976D2",
  },
  navigationContainer: {
    flexDirection: "row",
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  previousButton: {
    backgroundColor: "#6C757D",
  },
  nextButton: {
    backgroundColor: "#4A90E2",
  },
  navButtonDisabled: {
    backgroundColor: "#CCCCCC",
    opacity: 0.5,
  },
  navButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
