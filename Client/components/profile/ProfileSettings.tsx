import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function ProfileSettings() {
  return (
    <ThemedView style={styles.section}>
      <ThemedText type="defaultSemiBold">Settings</ThemedText>
      <ThemedView style={styles.settingsContainer}>
        <TouchableOpacity style={styles.settingItem}>
          <ThemedText type="default">📱 App Preferences</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <ThemedText type="default">🔔 Notifications</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <ThemedText type="default">🌍 Language Settings</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <ThemedText type="default">👥 Privacy</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <ThemedText type="default">📞 Support</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <ThemedText type="default">🚪 Sign Out</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  settingsContainer: {
    marginTop: 12,
  },
  settingItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 8,
  },
});
