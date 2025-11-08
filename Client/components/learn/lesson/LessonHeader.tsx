import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import LessonProgressBar from "./LessonProgressBar";

interface LessonHeaderProps {
  unitTitle: string;
  currentActivity: number;
  totalActivities: number;
  onClose: () => void;
}

export default function LessonHeader({
  unitTitle,
  currentActivity,
  totalActivities,
  onClose,
}: LessonHeaderProps) {
  return (
    <View style={styles.customHeader}>
      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color="#666" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <ThemedText style={styles.unitBadge}>{unitTitle}</ThemedText>
        </View>
        <View style={styles.placeholder} />
      </View>

      <LessonProgressBar
        currentActivity={currentActivity}
        totalActivities={totalActivities}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  customHeader: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
    alignItems: "center",
  },
  unitBadge: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A90E2",
    backgroundColor: "#EBF5FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: "hidden",
  },
  placeholder: {
    width: 40,
  },
});
