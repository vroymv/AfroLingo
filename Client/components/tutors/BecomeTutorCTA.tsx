import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  colorScheme: "light" | "dark" | null;
  onPress: () => void;
};

export function BecomeTutorCTA({ colorScheme, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.becomeTutorCard,
        {
          backgroundColor: colorScheme === "dark" ? "#2C5F2D" : "#E8F5E9",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.becomeTutorContent}>
        <View style={styles.becomeTutorTextContainer}>
          <ThemedText style={styles.becomeTutorTitle}>
            Become a Tutor 🌟
          </ThemedText>
          <ThemedText style={styles.becomeTutorSubtitle}>
            Share your language expertise and earn money
          </ThemedText>
        </View>
        <Ionicons
          name="arrow-forward-circle"
          size={32}
          color={colorScheme === "dark" ? "#81C784" : "#2E7D32"}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  becomeTutorCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  becomeTutorContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  becomeTutorTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  becomeTutorTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  becomeTutorSubtitle: {
    fontSize: 13,
    opacity: 0.8,
  },
});
