import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Activity } from "@/data/lessons";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AlphabetVocabularyTableActivityProps {
  activity: Activity;
  onComplete: () => void;
}

interface AlphabetItem {
  letter: string;
  word: string;
  translation: string;
  imageName?: string;
}

// Image mapping - add your actual images here
const imageMap: Record<string, any> = {
  asante: require("@/assets/images/vocab/asante.png"),
  baba: require("@/assets/images/vocab/baba.png"),
  chai: require("@/assets/images/vocab/chai.png"),
  dada: require("@/assets/images/vocab/dada.png"),
  embe: require("@/assets/images/vocab/embe.png"),
  farasi: require("@/assets/images/vocab/farasi.png"),
  gari: require("@/assets/images/vocab/gari.png"),
  // habari: require("@/assets/images/vocab/habari.png"), // No image available
  injini: require("@/assets/images/vocab/injini.png"),
  jina: require("@/assets/images/vocab/jina.png"),
  karibu: require("@/assets/images/vocab/karibu.png"),
  leo: require("@/assets/images/vocab/leo.png"),
  mama: require("@/assets/images/vocab/mama.png"),
  // nani: require("@/assets/images/vocab/nani.png"), // No image available
  ondoka: require("@/assets/images/vocab/ondoka.png"),
  pole: require("@/assets/images/vocab/pole.png"),
  rafiki: require("@/assets/images/vocab/rafiki.png"),
  samaki: require("@/assets/images/vocab/samaki.png"),
  tafadhali: require("@/assets/images/vocab/tafadhali.png"),
  uji: require("@/assets/images/vocab/uji.png"),
  viatu: require("@/assets/images/vocab/viatu.png"),
  wapi: require("@/assets/images/vocab/wapi.png"),
  yai: require("@/assets/images/vocab/yai.png"),
  ziwa: require("@/assets/images/vocab/ziwa.png"),
};

// Swahili alphabet vocabulary data
const alphabetData: AlphabetItem[] = [
  {
    letter: "A",
    word: "Asante",
    translation: "Thank you",
    imageName: "asante",
  },
  {
    letter: "B",
    word: "Baba",
    translation: "Father",
    imageName: "baba",
  },
  {
    letter: "C",
    word: "Chai",
    translation: "Tea",
    imageName: "chai",
  },
  {
    letter: "D",
    word: "Dada",
    translation: "Sister",
    imageName: "dada",
  },
  {
    letter: "E",
    word: "Embe",
    translation: "Mango",
    imageName: "embe",
  },
  {
    letter: "F",
    word: "Farasi",
    translation: "Horse",
    imageName: "farasi",
  },
  {
    letter: "G",
    word: "Gari",
    translation: "Car",
    imageName: "gari",
  },
  {
    letter: "H",
    word: "Habari",
    translation: "News/Hello",
    imageName: "habari",
  },
  {
    letter: "I",
    word: "Injini",
    translation: "Engine",
    imageName: "injini",
  },
  {
    letter: "J",
    word: "Jina",
    translation: "Name",
    imageName: "jina",
  },
  {
    letter: "K",
    word: "Karibu",
    translation: "Welcome",
    imageName: "karibu",
  },
  {
    letter: "L",
    word: "Leo",
    translation: "Today",
    imageName: "leo",
  },
  {
    letter: "M",
    word: "Mama",
    translation: "Mother",
    imageName: "mama",
  },
  {
    letter: "N",
    word: "Nani",
    translation: "Who",
    imageName: "nani",
  },
  {
    letter: "O",
    word: "Ondoka",
    translation: "Leave",
    imageName: "ondoka",
  },
  {
    letter: "P",
    word: "Pole",
    translation: "Sorry",
    imageName: "pole",
  },
  {
    letter: "R",
    word: "Rafiki",
    translation: "Friend",
    imageName: "rafiki",
  },
  {
    letter: "S",
    word: "Samaki",
    translation: "Fish",
    imageName: "samaki",
  },
  {
    letter: "T",
    word: "Tafadhali",
    translation: "Please",
    imageName: "tafadhali",
  },
  {
    letter: "U",
    word: "Uji",
    translation: "Porridge",
    imageName: "uji",
  },
  {
    letter: "V",
    word: "Viatu",
    translation: "Shoes",
    imageName: "viatu",
  },
  {
    letter: "W",
    word: "Wapi",
    translation: "Where",
    imageName: "wapi",
  },
  {
    letter: "Y",
    word: "Yai",
    translation: "Egg",
    imageName: "yai",
  },
  {
    letter: "Z",
    word: "Ziwa",
    translation: "Lake",
    imageName: "ziwa",
  },
];

// Row component with its own audio player
function AlphabetRow({ item }: { item: AlphabetItem }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Note: Audio files will need to be added to /assets/audio/alphabet/
  // Format: {letter}-{word}.mp3 (e.g., a-asante.mp3)

  const handlePlayAudio = () => {
    // Placeholder for audio playback
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 1000);
    console.log(`Playing audio for: ${item.word}`);
  };

  return (
    <View style={styles.tableRow}>
      {/* Letter */}
      <View style={styles.letterCell}>
        <Text style={styles.letterText}>{item.letter}</Text>
      </View>

      {/* Word & Translation */}
      <View style={[styles.wordCell, styles.flexCell]}>
        <Text style={styles.wordText}>{item.word}</Text>
        <Text style={styles.translationText}>{item.translation}</Text>
      </View>

      {/* Image */}
      <View style={styles.imageCell}>
        {item.imageName && imageMap[item.imageName] ? (
          <Image source={imageMap[item.imageName]} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={24} color="#999" />
          </View>
        )}
      </View>

      {/* Audio Button */}
      <View style={styles.audioCell}>
        <TouchableOpacity
          style={[styles.playButton, isPlaying && styles.playButtonActive]}
          onPress={handlePlayAudio}
        >
          <Ionicons
            name={isPlaying ? "volume-high" : "play-circle"}
            size={28}
            color={isPlaying ? "#4CAF50" : "#007AFF"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AlphabetVocabularyTableActivity({
  activity,
  onComplete,
}: AlphabetVocabularyTableActivityProps) {
  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>{activity.question}</ThemedText>
        <ThemedText style={styles.description}>
          {(activity as any).description ||
            "Tap the play button to hear each word"}
        </ThemedText>
      </View>

      {/* Alphabet Table */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Letter</Text>
            <Text style={[styles.headerCell, styles.flexCell]}>Word</Text>
            <Text style={styles.headerCell}>Image</Text>
            <Text style={styles.headerCell}>Audio</Text>
          </View>

          {/* Table Rows */}
          {alphabetData.map((item) => (
            <AlphabetRow key={item.letter} item={item} />
          ))}
        </View>
      </ScrollView>

      {/* Complete Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
          <Text style={styles.completeButtonText}>Complete Activity</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

// Identifier used for dynamic activity rendering
export const componentKey = "alphabet-vocabulary-table";

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
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
    width: 60,
  },
  flexCell: {
    flex: 1,
    width: "auto",
  },

  // Table Rows
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    minHeight: 70,
  },

  // Letter Cell
  letterCell: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  letterText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4CAF50",
  },

  // Word Cell
  wordCell: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  wordText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  translationText: {
    fontSize: 14,
    color: "#666",
  },

  // Image Cell
  imageCell: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },

  // Audio Cell
  audioCell: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    padding: 4,
  },
  playButtonActive: {
    transform: [{ scale: 1.1 }],
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
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
