import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/contexts/AuthContext";
import ImagePickerComponent from "@/components/ui/ImagePicker";

export default function ProfileHeader() {
  const { user, updateProfile } = useAuth();

  const handleImageUploaded = async (url: string) => {
    try {
      await updateProfile({ avatar: url });
    } catch (error) {
      console.error("Failed to update profile with new image:", error);
    }
  };

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
              <ImagePickerComponent
                currentImageUrl={user?.avatar}
                userId={user?.id || "guest"}
                onImageUploaded={handleImageUploaded}
                size={92}
                showEditBadge={true}
              >
                <View style={styles.avatar}>
                  <ThemedText style={styles.avatarEmoji}>👤</ThemedText>
                </View>
              </ImagePickerComponent>
            </LinearGradient>
          </View>
          <ThemedText style={styles.name}>{user?.name || "User"}</ThemedText>
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
