import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import EmailVerificationBanner from "@/components/auth/EmailVerificationBanner";
import React from "react";
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import LearningStats from "@/components/profile/LearningStats";
import WeeklyGoals from "@/components/profile/WeeklyGoals";
import Achievements from "@/components/profile/Achievements";
import LanguageProgress from "@/components/profile/LanguageProgress";
import SettingsDrawer from "@/components/profile/SettingsDrawer";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { user } = useAuth();
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      // If you later add profile stats from an API, re-fetch them here.
      // For now, this provides the expected pull-to-refresh UX.
      await new Promise((resolve) => setTimeout(resolve, 400));
    } finally {
      setRefreshing(false);
    }
  }, []);

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
    <SafeAreaView style={{ flex: 1 }}>
      {/* Hamburger Menu Button */}
      <TouchableOpacity
        style={styles.hamburgerButton}
        onPress={() => setDrawerVisible(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="menu" size={28} color="#fff" />
      </TouchableOpacity>
      <ThemedView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* <EmailVerificationBanner /> */}
          <ProfileHeader user={user} />
          <LearningStats user={user} />
          <WeeklyGoals user={user} />
          <Achievements user={user} />
          <LanguageProgress user={user} />
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
  container: {
    flex: 1,
  },
  hamburgerButton: {
    position: "absolute",
    top: 50,
    left: 10,
    zIndex: 1000,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
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
