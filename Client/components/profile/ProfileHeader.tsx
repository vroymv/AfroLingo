import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { Image, StyleSheet, View, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { User } from "@/types/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import ImagePickerComponent from "@/components/ui/ImagePicker";
import { OnboardingData } from "@/services/profile";

interface ProfileHeaderProps {
  user: User;
  onboardingData: OnboardingData | null;
  isLoading?: boolean;
}

// Language display names
const LANGUAGE_NAMES: Record<string, string> = {
  sw: "Swahili",
  zu: "Zulu",
  ln: "Lingala",
  xh: "Xhosa",
  yo: "Yoruba",
  ig: "Igbo",
  ha: "Hausa",
};

// Level display names
const LEVEL_NAMES: Record<string, string> = {
  "absolute-beginner": "Absolute Beginner",
  beginner: "Beginner",
  refresher: "Refresher",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function ProfileHeader({
  user,
  onboardingData,
  isLoading,
}: ProfileHeaderProps) {
  const { updateProfile } = useAuth();

  const handleImageUploaded = async (url: string) => {
    try {
      await updateProfile({ avatar: url });
    } catch (error) {
      console.error("Failed to update profile with new image:", error);
    }
  };

  // Get display names for language and level
  const languageName = onboardingData?.selectedLanguage
    ? LANGUAGE_NAMES[onboardingData.selectedLanguage] ||
      onboardingData.selectedLanguage
    : null;

  const levelName = onboardingData?.selectedLevel
    ? LEVEL_NAMES[onboardingData.selectedLevel] || onboardingData.selectedLevel
    : "Beginner";

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
                {user?.avatar ? (
                  <Image
                    source={{ uri: user.avatar }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.avatar}>
                    <ThemedText style={styles.avatarEmoji}>👤</ThemedText>
                  </View>
                )}
              </ImagePickerComponent>
            </LinearGradient>
          </View>
          <ThemedText style={styles.name}>{user.name || "User"}</ThemedText>
          <View style={styles.levelBadge}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <ThemedText style={styles.levelText}>
                🌟 {levelName}
              </ThemedText>
            )}
          </View>
          {languageName && (
            <ThemedText style={styles.language}>
              Learning {languageName}
            </ThemedText>
          )}
          {!languageName && !isLoading && (
            <ThemedText style={styles.language}>
              Complete onboarding to start learning
            </ThemedText>
          )}
          <ThemedText style={styles.memberSince}>
            Member since{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </ThemedText>
          {!user.emailVerified && (
            <View style={styles.verificationBadge}>
              <ThemedText style={styles.verificationText}>
                ⚠️ Email not verified
              </ThemedText>
            </View>
          )}
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
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 46,
    backgroundColor: "#FFF",
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
  memberSince: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 4,
  },
  verificationBadge: {
    backgroundColor: "rgba(255, 152, 0, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  verificationText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "500",
  },
});
