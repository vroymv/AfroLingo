import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { Image, StyleSheet, View, ActivityIndicator } from "react-native";
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
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <ImagePickerComponent
              currentImageUrl={user?.avatar}
              userId={user?.id || "guest"}
              onImageUploaded={handleImageUploaded}
              size={96}
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
                  <ThemedText style={styles.avatarText}>👤</ThemedText>
                </View>
              )}
            </ImagePickerComponent>
          </View>
          <ThemedText style={styles.name}>{user.name || "User"}</ThemedText>
          <View style={styles.infoRow}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#4A90E2" />
            ) : (
              <View style={styles.levelBadge}>
                <ThemedText style={styles.levelText}>{levelName}</ThemedText>
              </View>
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
                Email not verified
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: "rgba(74, 144, 226, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(74, 144, 226, 0.15)",
  },
  header: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#E8F4FD",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#4A90E2",
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FFF",
  },
  avatarText: {
    fontSize: 40,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoRow: {
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: "rgba(74, 144, 226, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A90E2",
  },
  language: {
    fontSize: 15,
    opacity: 0.7,
  },
  memberSince: {
    fontSize: 13,
    opacity: 0.5,
    marginTop: 4,
  },
  verificationBadge: {
    backgroundColor: "rgba(255, 152, 0, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 152, 0, 0.3)",
  },
  verificationText: {
    fontSize: 12,
    color: "#FF9800",
    fontWeight: "500",
  },
});
