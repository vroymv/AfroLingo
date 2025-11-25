import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet } from "react-native";

export default function ProfileHeader() {
  return (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.avatar}>
        <ThemedText type="title">👤</ThemedText>
      </ThemedView>
      <ThemedText type="title">Sarah Johnson</ThemedText>
      <ThemedText type="subtitle">
        Learning Yoruba • Beginner Level
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
});
