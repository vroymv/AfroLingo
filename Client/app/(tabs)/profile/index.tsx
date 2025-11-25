import { ThemedView } from "@/components/ThemedView";
import EmailVerificationBanner from "@/components/auth/EmailVerificationBanner";
import React from "react";
import { ScrollView } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import LearningStats from "@/components/profile/LearningStats";
import WeeklyGoals from "@/components/profile/WeeklyGoals";
import Achievements from "@/components/profile/Achievements";
import LanguageProgress from "@/components/profile/LanguageProgress";
import ProfileSettings from "@/components/profile/ProfileSettings";

export default function ProfileScreen() {
  const { user } = useAuth();
  console.log("Authenticated user:", user);
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <EmailVerificationBanner />
        <ProfileHeader />
        <LearningStats />
        <WeeklyGoals />
        <Achievements />
        <LanguageProgress />
        <ProfileSettings />
      </ScrollView>
    </ThemedView>
  );
}
