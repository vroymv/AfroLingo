import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Activity } from "@/data/lessons";
import { useLessonRuntime } from "@/contexts/LessonRuntimeContext";
import { updateUserProgress } from "@/services/userprogress";
import { awardXP } from "@/services/xp";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Identifier used for dynamic activity rendering
export const componentKey = "numbers-table";

interface NumbersTableActivityProps {
  activity: Activity;
  onComplete: () => void;
}

interface NumberItem {
  number: string;
  swahili: string;
  pronunciation?: string;
}

// All Swahili numbers data
const ALL_NUMBERS_DATA: NumberItem[] = [
  // 1-20
  { number: "1", swahili: "moja", pronunciation: "MO-jah" },
  { number: "2", swahili: "mbili", pronunciation: "m-BEE-lee" },
  { number: "3", swahili: "tatu", pronunciation: "TAH-too" },
  { number: "4", swahili: "nne", pronunciation: "n-NEH" },
  { number: "5", swahili: "tano", pronunciation: "TAH-no" },
  { number: "6", swahili: "sita", pronunciation: "SEE-tah" },
  { number: "7", swahili: "saba", pronunciation: "SAH-bah" },
  { number: "8", swahili: "nane", pronunciation: "NAH-neh" },
  { number: "9", swahili: "tisa", pronunciation: "TEE-sah" },
  { number: "10", swahili: "kumi", pronunciation: "KOO-mee" },
  {
    number: "11",
    swahili: "kumi na moja",
    pronunciation: "KOO-mee nah MO-jah",
  },
  {
    number: "12",
    swahili: "kumi na mbili",
    pronunciation: "KOO-mee nah m-BEE-lee",
  },
  {
    number: "13",
    swahili: "kumi na tatu",
    pronunciation: "KOO-mee nah TAH-too",
  },
  {
    number: "14",
    swahili: "kumi na nne",
    pronunciation: "KOO-mee nah n-NEH",
  },
  {
    number: "15",
    swahili: "kumi na tano",
    pronunciation: "KOO-mee nah TAH-no",
  },
  {
    number: "16",
    swahili: "kumi na sita",
    pronunciation: "KOO-mee nah SEE-tah",
  },
  {
    number: "17",
    swahili: "kumi na saba",
    pronunciation: "KOO-mee nah SAH-bah",
  },
  {
    number: "18",
    swahili: "kumi na nane",
    pronunciation: "KOO-mee nah NAH-neh",
  },
  {
    number: "19",
    swahili: "kumi na tisa",
    pronunciation: "KOO-mee nah TEE-sah",
  },
  { number: "20", swahili: "ishirini", pronunciation: "ee-shee-REE-nee" },
  // Tens (30-100)
  {
    number: "30",
    swahili: "thelathini",
    pronunciation: "theh-lah-THEE-nee",
  },
  { number: "40", swahili: "arobaini", pronunciation: "ah-ro-bah-EE-nee" },
  { number: "50", swahili: "hamsini", pronunciation: "hahm-SEE-nee" },
  { number: "60", swahili: "sitini", pronunciation: "see-TEE-nee" },
  { number: "70", swahili: "sabini", pronunciation: "sah-BEE-nee" },
  { number: "80", swahili: "themanini", pronunciation: "theh-mah-NEE-nee" },
  { number: "90", swahili: "tisini", pronunciation: "tee-SEE-nee" },
  {
    number: "100",
    swahili: "mia (moja)",
    pronunciation: "MEE-ah (MO-jah)",
  },
  // Hundreds and thousands
  {
    number: "200",
    swahili: "mia mbili",
    pronunciation: "MEE-ah m-BEE-lee",
  },
  { number: "300", swahili: "mia tatu", pronunciation: "MEE-ah TAH-too" },
  { number: "400", swahili: "mia nne", pronunciation: "MEE-ah n-NEH" },
  { number: "500", swahili: "mia tano", pronunciation: "MEE-ah TAH-no" },
  {
    number: "1000",
    swahili: "elfu (moja)",
    pronunciation: "EL-foo (MO-jah)",
  },
];

// Row component
function NumberRow({ item }: { item: NumberItem }) {
  return (
    <View style={styles.tableRow}>
      {/* Number */}
      <View style={styles.numberCell}>
        <Text style={styles.numberText}>{item.number}</Text>
      </View>

      {/* Swahili Word */}
      <View style={[styles.swahiliCell, styles.flexCell]}>
        <Text style={styles.swahiliText}>{item.swahili}</Text>
        {item.pronunciation && (
          <Text style={styles.pronunciationText}>({item.pronunciation})</Text>
        )}
      </View>
    </View>
  );
}

export default function NumbersTableActivity({
  activity,
  onComplete,
}: NumbersTableActivityProps) {
  const { userId, unitId, currentActivityNumber, totalActivities } =
    useLessonRuntime();

  const isPracticeRuntime =
    typeof unitId === "string" && unitId.startsWith("practice:");

  // Report progress on mount (and when identifiers change)
  useEffect(() => {
    if (!userId) return; // Skip if user not authenticated yet
    if (isPracticeRuntime) return;
    updateUserProgress({
      userId,
      unitId,
      currentActivityNumber,
      totalActivities,
    }).catch((e) => console.warn("Failed to send progress", e));
  }, [
    userId,
    unitId,
    currentActivityNumber,
    totalActivities,
    isPracticeRuntime,
  ]);

  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [audioXPAwarded, setAudioXPAwarded] = useState(false);
  const [completionXPAwarded, setCompletionXPAwarded] = useState(false);

  const handlePlayAll = () => {
    // Placeholder for audio playback of all numbers
    setIsPlayingAll(true);
    setTimeout(async () => {
      setIsPlayingAll(false);

      // Award XP once after the (placeholder) audio finishes
      if (userId && !audioXPAwarded) {
        const result = await awardXP({
          userId,
          amount: 5,
          sourceType: "activity_completion",
          sourceId: `numbers-table-audio-${unitId}-${currentActivityNumber}`,
          metadata: {
            unitId,
            currentActivityNumber,
            totalActivities,
            screen: "NumbersTableActivity",
            reason: "audio_listened",
            note: "Play All Numbers finished (placeholder timer)",
          },
        });

        if (!result.success) {
          console.warn("XP award for audio failed", result.message);
        } else {
          setAudioXPAwarded(true);
        }
      }
    }, 3000);
    console.log(`Playing all numbers audio: ${activity.audio}`);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>
          {activity.question || "Swahili Numbers"}
        </ThemedText>
        <ThemedText style={styles.description}>
          {activity.description || "Learn to count in Swahili"}
        </ThemedText>
      </View>

      {/* Play All Button */}
      <View style={styles.playAllContainer}>
        <TouchableOpacity
          style={[
            styles.playAllButton,
            isPlayingAll && styles.playAllButtonActive,
          ]}
          onPress={handlePlayAll}
        >
          <Ionicons
            name={isPlayingAll ? "volume-high" : "play-circle"}
            size={32}
            color="#FFF"
          />
          <Text style={styles.playAllText}>
            {isPlayingAll ? "Playing..." : "Play All Numbers"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Numbers Table */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Number</Text>
            <Text style={[styles.headerCell, styles.flexCell]}>Swahili</Text>
          </View>

          {/* Table Rows */}
          {ALL_NUMBERS_DATA.map((item) => (
            <NumberRow key={item.number} item={item} />
          ))}
        </View>
      </ScrollView>

      {/* Complete Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={async () => {
            if (userId && !completionXPAwarded) {
              const result = await awardXP({
                userId,
                amount: 10,
                sourceType: "activity_completion",
                sourceId: `numbers-table-complete-${unitId}-${currentActivityNumber}`,
                metadata: {
                  unitId,
                  currentActivityNumber,
                  totalActivities,
                  screen: "NumbersTableActivity",
                  reason: "activity_completed",
                },
              });

              if (!result.success) {
                console.warn("XP award for completion failed", result.message);
              } else {
                setCompletionXPAwarded(true);
              }
            }

            onComplete();
          }}
        >
          <Text style={styles.completeButtonText}>Complete Activity</Text>
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
  header: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
  },

  // Play All Button
  playAllContainer: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  playAllButton: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playAllButtonActive: {
    backgroundColor: "#4CAF50",
  },
  playAllText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Table
  table: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
    width: 80,
  },

  // Table Rows
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#FFF",
  },
  flexCell: {
    flex: 1,
  },

  // Number Cell
  numberCell: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2196F3",
  },

  // Swahili Cell
  swahiliCell: {
    justifyContent: "center",
    paddingLeft: 12,
  },
  swahiliText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  pronunciationText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },

  // Footer
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
});
