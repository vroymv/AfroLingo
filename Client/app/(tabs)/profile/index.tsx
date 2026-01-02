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
  fetchProfileStats,
  fetchOnboardingData,
  ProfileStats,
  OnboardingData,
} from "@/services/profile";

export default function ProfileScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const iconColor = useThemeColor({}, "text");
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [profileStats, setProfileStats] = React.useState<ProfileStats | null>(
    null
  );
  const [onboardingData, setOnboardingData] =
    React.useState<OnboardingData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadProfileData = React.useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const [statsResponse, onboardingResponse] = await Promise.all([
        fetchProfileStats(user.id),
        fetchOnboardingData(user.id),
      ]);

      if (statsResponse.success && statsResponse.data) {
        setProfileStats(statsResponse.data);
      } else {
        console.warn("Failed to fetch profile stats:", statsResponse.message);
      }

      if (onboardingResponse.success && onboardingResponse.data) {
        setOnboardingData(onboardingResponse.data);
      } else {
        console.warn(
          "Failed to fetch onboarding data:",
          onboardingResponse.message
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
        {/* Hamburger Menu Button */}
        <TouchableOpacity
          style={styles.hamburgerButton}
          onPress={() => setDrawerVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={26} color={iconColor} />
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
  hamburgerButton: {
    position: "absolute",
    top: 10,
    left: 12,
    zIndex: 1000,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
});
