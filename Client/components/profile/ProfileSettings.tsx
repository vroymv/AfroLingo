import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";

export default function ProfileSettings() {
  const { logout } = useAuth();
  const router = useRouter();
  const settings = [
    {
      icon: "settings-outline",
      label: "App Preferences",
      color: "#4A90E2",
      action: "preferences",
    },
    {
      icon: "notifications-outline",
      label: "Notifications",
      color: "#FF9500",
      action: "notifications",
    },
    {
      icon: "globe-outline",
      label: "Language Settings",
      color: "#34C759",
      action: "language",
    },
    {
      icon: "shield-checkmark-outline",
      label: "Privacy & Security",
      color: "#AF52DE",
      action: "privacy",
    },
    {
      icon: "help-circle-outline",
      label: "Help & Support",
      color: "#00C7BE",
      action: "support",
    },
  ];

  const dangerActions = [
    {
      icon: "log-out-outline",
      label: "Sign Out",
      color: "#FF3B30",
      action: "logout",
    },
  ];

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace("/(auth)/login");
          } catch (error) {
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>⚙️ Settings</ThemedText>

      <View style={styles.settingsGroup}>
        {settings.map((setting, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingItem}
            activeOpacity={0.7}
          >
            <View style={styles.settingContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${setting.color}20` },
                ]}
              >
                <Ionicons
                  name={setting.icon as any}
                  size={22}
                  color={setting.color}
                />
              </View>
              <ThemedText style={styles.settingLabel}>
                {setting.label}
              </ThemedText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="rgba(255, 255, 255, 0.4)"
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.dangerGroup}>
        {dangerActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.settingItem, styles.dangerItem]}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <View style={styles.settingContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${action.color}20` },
                ]}
              >
                <Ionicons
                  name={action.icon as any}
                  size={22}
                  color={action.color}
                />
              </View>
              <ThemedText
                style={[styles.settingLabel, { color: action.color }]}
              >
                {action.label}
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={action.color} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.appInfo}>
        <ThemedText style={styles.appInfoText}>AfroLingo v1.0.0</ThemedText>
        <ThemedText style={styles.appInfoText}>
          Made with ❤️ for language learners
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  settingsGroup: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 12,
  },
  dangerGroup: {
    backgroundColor: "rgba(255, 59, 48, 0.05)",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.2)",
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  appInfo: {
    alignItems: "center",
    paddingTop: 12,
    gap: 4,
  },
  appInfoText: {
    fontSize: 12,
    opacity: 0.5,
  },
});
