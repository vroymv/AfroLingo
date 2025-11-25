import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileHeader() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4A90E2", "#357ABD", "#2C5F99"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientCard}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={["#FFD700", "#FFA500", "#FF8C00"]}
              style={styles.avatarGradient}
            >
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarEmoji}>👤</ThemedText>
              </View>
            </LinearGradient>
            <TouchableOpacity style={styles.editBadge}>
              <ThemedText style={styles.editIcon}>✏️</ThemedText>
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.name}>Sarah Johnson</ThemedText>
          <View style={styles.levelBadge}>
            <ThemedText style={styles.levelText}>🌟 Beginner</ThemedText>
          </View>
          <ThemedText style={styles.language}>Learning Yoruba</ThemedText>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  gradientCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 4,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 46,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEmoji: {
    fontSize: 48,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4A90E2",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  editIcon: {
    fontSize: 14,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  levelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  language: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
});
