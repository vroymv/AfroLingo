import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function LanguageProgress() {
  const skills = [
    {
      name: "Speaking",
      percentage: 40,
      icon: "🗣️",
      color: ["#FF6B6B", "#EE5A6F"],
    },
    {
      name: "Listening",
      percentage: 55,
      icon: "👂",
      color: ["#4ECDC4", "#44A08D"],
    },
    {
      name: "Reading",
      percentage: 35,
      icon: "📖",
      color: ["#A8E6CF", "#56AB91"],
    },
    {
      name: "Writing",
      percentage: 30,
      icon: "✍️",
      color: ["#FFD93D", "#F4A261"],
    },
  ];

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>🇳🇬 Language Progress</ThemedText>
      <View style={styles.languageCard}>
        <View style={styles.languageHeader}>
          <View style={styles.languageInfo}>
            <ThemedText style={styles.languageName}>Yoruba</ThemedText>
            <ThemedText style={styles.languageDescription}>
              Nigerian Language • West African
            </ThemedText>
          </View>
          <View style={styles.levelBadge}>
            <ThemedText style={styles.levelText}>Beginner</ThemedText>
          </View>
        </View>

        <View style={styles.skillsContainer}>
          {skills.map((skill, index) => (
            <View key={index} style={styles.skillRow}>
              <View style={styles.skillHeader}>
                <ThemedText style={styles.skillIcon}>{skill.icon}</ThemedText>
                <ThemedText style={styles.skillName}>{skill.name}</ThemedText>
              </View>
              <View style={styles.skillBarContainer}>
                <View style={styles.skillBarBackground}>
                  <LinearGradient
                    colors={skill.color}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.skillBarFill,
                      { width: `${skill.percentage}%` },
                    ]}
                  />
                </View>
                <ThemedText style={styles.skillPercentage}>
                  {skill.percentage}%
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.overallProgress}>
          <View style={styles.overallHeader}>
            <ThemedText style={styles.overallLabel}>
              Overall Proficiency
            </ThemedText>
            <ThemedText style={styles.overallValue}>40%</ThemedText>
          </View>
          <View style={styles.overallBarBackground}>
            <LinearGradient
              colors={["#4A90E2", "#357ABD", "#2C5F99"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.overallBarFill, { width: "40%" }]}
            />
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  languageCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  languageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  languageDescription: {
    fontSize: 13,
    opacity: 0.7,
  },
  levelBadge: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
  },
  skillsContainer: {
    gap: 20,
    marginBottom: 24,
  },
  skillRow: {
    gap: 12,
  },
  skillHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  skillIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  skillName: {
    fontSize: 15,
    fontWeight: "600",
  },
  skillBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  skillBarBackground: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  skillBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  skillPercentage: {
    fontSize: 13,
    fontWeight: "bold",
    width: 40,
    textAlign: "right",
  },
  overallProgress: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  overallHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  overallLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  overallValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  overallBarBackground: {
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  overallBarFill: {
    height: "100%",
    borderRadius: 8,
  },
});
