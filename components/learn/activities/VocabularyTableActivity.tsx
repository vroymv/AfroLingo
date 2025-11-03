import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Activity } from "@/data/lessons";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface VocabularyItem {
  swahili: string;
  english: string;
  pronunciation: string;
}

interface VocabularyTableActivityProps {
  activity: Activity & {
    items?: VocabularyItem[];
  };
  onComplete: () => void;
}

export default function VocabularyTableActivity({
  activity,
  onComplete,
}: VocabularyTableActivityProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const items = activity.items || [];

  const playAudio = async (audioPath?: string) => {
    if (!audioPath || isPlaying) return;

    setIsPlaying(true);
    // TODO: Implement audio playback with expo-audio
    // For now, just simulate playback
    setTimeout(() => {
      setIsPlaying(false);
    }, 1000);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {activity.question}
          </ThemedText>
          {activity.description && (
            <ThemedText type="default" style={styles.description}>
              {activity.description}
            </ThemedText>
          )}
          {activity.audio && (
            <TouchableOpacity
              style={styles.audioButton}
              onPress={() => playAudio(activity.audio)}
            >
              <Ionicons name="volume-high" size={20} color="#fff" />
              <ThemedText style={styles.audioButtonText}>Play All</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Vocabulary Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={[styles.tableCell, styles.headerCell]}>
              <ThemedText type="defaultSemiBold" style={styles.headerText}>
                Swahili
              </ThemedText>
            </View>
            <View style={[styles.tableCell, styles.headerCell]}>
              <ThemedText type="defaultSemiBold" style={styles.headerText}>
                English
              </ThemedText>
            </View>
            <View style={[styles.tableCell, styles.headerCell]}>
              <ThemedText type="defaultSemiBold" style={styles.headerText}>
                Pronunciation
              </ThemedText>
            </View>
          </View>

          {/* Table Rows */}
          {items.map((item, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow,
              ]}
            >
              <View style={styles.tableCell}>
                <ThemedText type="default" style={styles.cellText}>
                  {item.swahili}
                </ThemedText>
              </View>
              <View style={styles.tableCell}>
                <ThemedText type="default" style={styles.cellText}>
                  {item.english}
                </ThemedText>
              </View>
              <View style={styles.tableCell}>
                <ThemedText type="default" style={styles.pronunciationText}>
                  {item.pronunciation}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={onComplete}>
          <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 16,
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    marginTop: 8,
  },
  audioButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  table: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
  },
  headerCell: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    paddingVertical: 12,
  },
  evenRow: {
    backgroundColor: "#fff",
  },
  oddRow: {
    backgroundColor: "#F8F9FA",
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: 14,
    textAlign: "center",
  },
  pronunciationText: {
    fontSize: 13,
    opacity: 0.7,
    fontStyle: "italic",
    textAlign: "center",
  },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  continueButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
