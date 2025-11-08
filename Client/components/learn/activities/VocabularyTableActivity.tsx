import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Activity } from "@/data/lessons";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface VocabularyItem {
  swahili: string;
  english: string;
  pronunciation: string;
  image?: string;
  audio?: string;
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
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const items = activity.items || [];

  // Helper function to get image source from path
  const getImageSource = (imagePath?: string) => {
    if (!imagePath) return null;

    // Extract filename from path
    const filename = imagePath.split("/").pop()?.replace(".png", "");

    // Map of available images
    const imageMap: Record<string, any> = {
      // Places
      "place-class": require("@/assets/images/vocab/place-class.png"),
      "place-house": require("@/assets/images/vocab/place-house.png"),
      "place-library": require("@/assets/images/vocab/place-library.png"),
      "place-airport": require("@/assets/images/vocab/place-airport.png"),
      "place-market": require("@/assets/images/vocab/place-market.png"),
      "place-office": require("@/assets/images/vocab/place-office.png"),
      "place-pharmacy": require("@/assets/images/vocab/place-pharmacy.png"),
      "place-hospital": require("@/assets/images/vocab/place-hospital.png"),
      "place-bank": require("@/assets/images/vocab/place-bank.png"),
      "place-school": require("@/assets/images/vocab/place-school.png"),

      // Occupations (map keys to actual files in assets/images/vocab)
      "occupation-teacher": require("@/assets/images/vocab/occupation-teacher.png"),
      "occupation-cashier": require("@/assets/images/vocab/occupation-cashier.png"),
      "occupation-waiter": require("@/assets/images/vocab/occupation-watier.png"), // asset is misspelled in repo (watier)
      "occupation-watier": require("@/assets/images/vocab/occupation-watier.png"), // support both
      "occupation-lawyer": require("@/assets/images/vocab/occupation-lawyer.png"),
      "occupation-barber": require("@/assets/images/vocab/occupation-barber.png"),
      "occupation-police": require("@/assets/images/vocab/occupation-police.png"),
      "occupation-driver": require("@/assets/images/vocab/occupation-driver.png"),
      "occupation-doctor": require("@/assets/images/vocab/occupation-doctor.png"),
      "occupation-pharmacist": require("@/assets/images/vocab/occupation-pharmacist.png"),
      "occupation-farmer": require("@/assets/images/vocab/occupation-farmer.png"),

      // Legacy / other icons
      teacher: require("@/assets/images/vocab/teacher.png"),
    };

    return filename ? imageMap[filename] : null;
  };

  const playAudio = async (audioPath?: string, index?: number) => {
    if (!audioPath || playingIndex !== null) return;

    setPlayingIndex(index ?? null);
    // TODO: Implement audio playback with expo-audio
    // For now, just simulate playback
    setTimeout(() => {
      setPlayingIndex(null);
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
          {/* Table Rows */}
          {items.map((item, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow,
              ]}
            >
              {/* Image Column */}
              {item.image && (
                <View style={styles.imageCell}>
                  <View style={styles.imageContainer}>
                    {getImageSource(item.image) ? (
                      <Image
                        source={getImageSource(item.image)}
                        style={styles.itemImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <ThemedText style={styles.imagePlaceholder}>
                        🖼️
                      </ThemedText>
                    )}
                  </View>
                </View>
              )}

              {/* Content Column */}
              <View style={styles.contentCell}>
                <View style={styles.textRow}>
                  <ThemedText type="defaultSemiBold" style={styles.swahiliText}>
                    {item.swahili}
                  </ThemedText>
                </View>
                <View style={styles.textRow}>
                  <ThemedText type="default" style={styles.englishText}>
                    {item.english}
                  </ThemedText>
                </View>
                <View style={styles.textRow}>
                  <ThemedText type="default" style={styles.pronunciationText}>
                    [{item.pronunciation}]
                  </ThemedText>
                </View>
              </View>

              {/* Play Button Column */}
              <View style={styles.playCell}>
                <TouchableOpacity
                  style={[
                    styles.playButton,
                    playingIndex === index && styles.playButtonActive,
                  ]}
                  onPress={() => playAudio(item.audio, index)}
                  disabled={playingIndex !== null}
                >
                  <Ionicons
                    name={playingIndex === index ? "pause" : "play"}
                    size={20}
                    color="#fff"
                  />
                </TouchableOpacity>
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
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  evenRow: {
    backgroundColor: "#fff",
  },
  oddRow: {
    backgroundColor: "#F8F9FA",
  },
  imageCell: {
    width: 80,
    marginRight: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#E8F4FD",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B8D8F0",
  },
  imagePlaceholder: {
    fontSize: 40,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  contentCell: {
    flex: 1,
    paddingHorizontal: 8,
  },
  textRow: {
    marginBottom: 4,
  },
  swahiliText: {
    fontSize: 18,
    color: "#1A1A1A",
  },
  englishText: {
    fontSize: 14,
    color: "#666",
  },
  pronunciationText: {
    fontSize: 13,
    color: "#999",
    fontStyle: "italic",
  },
  playCell: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playButtonActive: {
    backgroundColor: "#357ABD",
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
