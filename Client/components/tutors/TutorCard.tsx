import { ThemedText } from "@/components/ThemedText";
import type { Tutor } from "@/types/Tutor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  tutor: Tutor;
  colorScheme: "light" | "dark" | null;
  onChat: (tutor: Tutor) => void;
};

export function TutorCard({ tutor, colorScheme, onChat }: Props) {
  return (
    <Pressable
      style={[
        styles.tutorCard,
        {
          backgroundColor: colorScheme === "dark" ? "#1C1C1E" : "#FFFFFF",
          borderColor: colorScheme === "dark" ? "#2C2C2E" : "#E5E5EA",
        },
      ]}
    >
      <View style={styles.tutorCardHeader}>
        {/* Avatar with Status */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: tutor.avatar }} style={styles.avatar} />
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  tutor.availability === "online"
                    ? "#4CAF50"
                    : tutor.availability === "away"
                    ? "#FFC107"
                    : "#9E9E9E",
              },
            ]}
          />
        </View>

        {/* Tutor Info */}
        <View style={styles.tutorInfo}>
          <View style={styles.tutorNameRow}>
            <ThemedText style={styles.tutorName}>{tutor.name}</ThemedText>
            {tutor.rating === 5.0 && (
              <Ionicons name="checkmark-circle" size={18} color="#4A90E2" />
            )}
          </View>

          <ThemedText style={styles.tutorLanguage}>
            {tutor.language} Tutor
          </ThemedText>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFB300" />
            <ThemedText style={styles.ratingText}>
              {tutor.rating.toFixed(1)}
            </ThemedText>
            <ThemedText style={styles.reviewCount}>
              ({tutor.reviewCount} reviews)
            </ThemedText>
            <ThemedText style={styles.lessonCount}>
              • {tutor.lessonsCompleted} lessons
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Bio */}
      <ThemedText style={styles.tutorBio} numberOfLines={2}>
        {tutor.bio}
      </ThemedText>

      {/* Specialties */}
      <View style={styles.specialtiesContainer}>
        {tutor.specialties.map((specialty) => (
          <View
            key={specialty}
            style={[
              styles.specialtyBadge,
              {
                backgroundColor: colorScheme === "dark" ? "#2C2C2E" : "#F2F2F7",
              },
            ]}
          >
            <ThemedText style={styles.specialtyText}>{specialty}</ThemedText>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.tutorCardFooter}>
        <View style={styles.priceContainer}>
          <ThemedText style={styles.price}>${tutor.hourlyRate}</ThemedText>
          <ThemedText style={styles.priceUnit}>/hour</ThemedText>
        </View>

        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => onChat(tutor)}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-ellipses" size={18} color="#FFFFFF" />
          <ThemedText style={styles.chatButtonText}>Chat</ThemedText>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tutorCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tutorCardHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E0E0E0",
  },
  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  tutorInfo: {
    flex: 1,
    justifyContent: "center",
  },
  tutorNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  tutorName: {
    fontSize: 18,
    fontWeight: "700",
  },
  tutorLanguage: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "600",
  },
  reviewCount: {
    fontSize: 12,
    opacity: 0.6,
  },
  lessonCount: {
    fontSize: 12,
    opacity: 0.6,
  },
  tutorBio: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 12,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  specialtyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: "600",
  },
  tutorCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4A90E2",
  },
  priceUnit: {
    fontSize: 14,
    opacity: 0.6,
    marginLeft: 4,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  chatButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
