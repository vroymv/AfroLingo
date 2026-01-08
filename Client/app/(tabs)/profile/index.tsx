import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  View,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import LearningStats from "@/components/profile/LearningStats";
import WeeklyGoals from "@/components/profile/WeeklyGoals";
import Achievements from "@/components/profile/Achievements";
import LanguageProgress from "@/components/profile/LanguageProgress";
import SettingsDrawer from "@/components/profile/SettingsDrawer";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  ProfileStats,
  OnboardingData,
  fetchProfileOverview,
  updateCommunityProfile,
  CommunityUserType,
  CommunityProfile,
} from "@/services/profile";
import { AuthInput } from "@/components/auth/AuthInput";

export default function ProfileScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const iconColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [profileStats, setProfileStats] = React.useState<ProfileStats | null>(
    null
  );
  const [onboardingData, setOnboardingData] =
    React.useState<OnboardingData | null>(null);
  const [communityProfile, setCommunityProfile] =
    React.useState<CommunityProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const [userType, setUserType] = React.useState<CommunityUserType>("LEARNER");
  const [languagesText, setLanguagesText] = React.useState("");
  const [countryCode, setCountryCode] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [savingCommunityProfile, setSavingCommunityProfile] =
    React.useState(false);

  const didInitCommunityForm = React.useRef(false);

  const loadProfileData = React.useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      const overviewResponse = await fetchProfileOverview(user.id);

      if (overviewResponse.success && overviewResponse.data) {
        setProfileStats(overviewResponse.data.stats);
        setOnboardingData(overviewResponse.data.onboarding);
        setCommunityProfile(overviewResponse.data.communityProfile);

        // Initialize form once (avoid overwriting user edits)
        if (!didInitCommunityForm.current) {
          didInitCommunityForm.current = true;
          setUserType(
            overviewResponse.data.communityProfile.userType || "LEARNER"
          );
          setLanguagesText(
            (overviewResponse.data.communityProfile.languages || []).join(", ")
          );
          setCountryCode(
            overviewResponse.data.communityProfile.countryCode || ""
          );
          setBio(overviewResponse.data.communityProfile.bio || "");
        }
      } else {
        console.warn(
          "Failed to fetch profile overview:",
          overviewResponse.message
        );
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
      Alert.alert(
        "Error",
        "Failed to load profile data. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const normalizedLanguages = React.useMemo(() => {
    return languagesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20);
  }, [languagesText]);

  const handleSaveCommunityProfile = React.useCallback(async () => {
    if (!user?.id) return;

    try {
      setSavingCommunityProfile(true);

      const updates = {
        userType,
        languages: normalizedLanguages,
        countryCode: countryCode.trim()
          ? countryCode.trim().toUpperCase()
          : null,
        bio: bio.trim() ? bio.trim() : null,
        // Keep in sync with the existing avatar field (emoji or URL)
        profileImageUrl: user.avatar ?? null,
        name: user.name,
      } as const;

      const result = await updateCommunityProfile(user.id, updates);

      if (result.success && result.data) {
        setCommunityProfile(result.data);
        Alert.alert("Saved", "Your community profile was updated.");
      } else {
        Alert.alert(
          "Could not save",
          result.message || "Failed to update community profile."
        );
      }
    } catch (error) {
      console.error("Error saving community profile:", error);
      Alert.alert("Error", "Failed to save. Please try again later.");
    } finally {
      setSavingCommunityProfile(false);
    }
  }, [
    bio,
    countryCode,
    normalizedLanguages,
    user?.avatar,
    user?.id,
    user?.name,
    userType,
  ]);

  // Load profile data on mount
  React.useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await loadProfileData();
    } finally {
      setRefreshing(false);
    }
  }, [loadProfileData]);

  // Show loading state if user is not loaded yet
  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        />
        {/* Settings Button */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setDrawerVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={24} color={iconColor} />
        </TouchableOpacity>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* <EmailVerificationBanner /> */}
          <ProfileHeader
            user={user}
            onboardingData={onboardingData}
            isLoading={isLoading}
          />
          <LearningStats
            user={user}
            profileStats={profileStats}
            isLoading={isLoading}
          />
          <WeeklyGoals
            user={user}
            profileStats={profileStats}
            isLoading={isLoading}
          />
          <Achievements
            user={user}
            profileStats={profileStats}
            isLoading={isLoading}
          />
          <LanguageProgress
            user={user}
            profileStats={profileStats}
            onboardingData={onboardingData}
            isLoading={isLoading}
          />

          <View style={styles.sectionCard}>
            <ThemedText style={styles.sectionTitle}>
              Community Profile
            </ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              These details show up in Community → Find People.
            </ThemedText>

            <View style={styles.userTypeRow}>
              <ThemedText style={styles.userTypeLabel}>Role</ThemedText>
              <View style={styles.userTypeButtons}>
                {(
                  [
                    { key: "LEARNER", label: "Learner" },
                    { key: "NATIVE", label: "Native" },
                    { key: "TUTOR", label: "Tutor" },
                  ] as const
                ).map((opt) => {
                  const active = userType === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      onPress={() => setUserType(opt.key)}
                      activeOpacity={0.85}
                      style={[
                        styles.userTypeButton,
                        {
                          borderColor: tintColor + "40",
                          backgroundColor: active
                            ? tintColor + "20"
                            : "transparent",
                        },
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.userTypeButtonText,
                          { color: active ? tintColor : textColor },
                        ]}
                      >
                        {opt.label}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <AuthInput
              label="Languages (comma-separated)"
              icon="chatbubbles-outline"
              value={languagesText}
              onChangeText={setLanguagesText}
              placeholder="e.g. Yoruba, English"
              autoCapitalize="words"
              autoCorrect={false}
            />

            <AuthInput
              label="Country code"
              icon="flag-outline"
              value={countryCode}
              onChangeText={setCountryCode}
              placeholder="e.g. US"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={2}
            />

            <View style={styles.bioGroup}>
              <ThemedText style={styles.bioLabel}>Bio</ThemedText>
              <View
                style={[styles.bioInputWrap, { borderColor: tintColor + "30" }]}
              >
                <TextInput
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell people a bit about you"
                  placeholderTextColor={textColor + "60"}
                  style={[styles.bioInput, { color: textColor }]}
                  multiline
                  textAlignVertical="top"
                  maxLength={1000}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                {
                  backgroundColor: savingCommunityProfile
                    ? tintColor + "60"
                    : tintColor,
                },
              ]}
              onPress={handleSaveCommunityProfile}
              activeOpacity={0.85}
              disabled={savingCommunityProfile}
            >
              <ThemedText style={styles.saveButtonText}>
                {savingCommunityProfile ? "Saving…" : "Save Community Profile"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* Settings Drawer */}
        <SettingsDrawer
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  settingsButton: {
    position: "absolute",
    top: 16,
    right: 20,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 56,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 40,
  },
  loadingText: {
    flex: 1,
    textAlign: "center",
    marginTop: 100,
    fontSize: 16,
  },

  sectionCard: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 16,
  },
  userTypeRow: {
    marginBottom: 18,
  },
  userTypeLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  userTypeButtons: {
    flexDirection: "row",
    gap: 10,
  },
  userTypeButton: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  userTypeButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
  bioGroup: {
    marginBottom: 18,
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  bioInputWrap: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 120,
  },
  bioInput: {
    fontSize: 16,
    lineHeight: 22,
  },
  saveButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#fff",
  },
});
