import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.75;

interface SettingsDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsDrawer({
  visible,
  onClose,
}: SettingsDrawerProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const [shouldRender, setShouldRender] = React.useState(visible);
  const iconColor = useThemeColor({}, "text");

  const navigateTo = React.useCallback(
    (action: string) => {
      const routes: Record<string, string> = {
        preferences: "/(tabs)/profile/preferences",
        notifications: "/(tabs)/profile/notifications",
        language: "/(tabs)/profile/language",
        privacy: "/(tabs)/profile/privacy",
        support: "/(tabs)/profile/support",
      };

      const route = routes[action];
      if (!route) return;

      onClose();
      // Allow the close animation/state update to start before navigating.
      setTimeout(() => {
        router.push(route as any);
      }, 200);
    },
    [onClose, router]
  );

  React.useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setShouldRender(false);
      });
    }
    // slideAnim is a ref and doesn't need to be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

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
            onClose();
            router.replace("/(auth)/login");
          } catch {
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  if (!shouldRender) return null;

  return (
    <Modal
      visible={shouldRender}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <ThemedView style={styles.drawerContent}>
            {/* Header */}
            <View style={styles.header}>
              <ThemedText style={styles.headerTitle}>⚙️ Settings</ThemedText>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={iconColor} />
              </TouchableOpacity>
            </View>

            {/* Settings List */}
            <View style={styles.settingsGroup}>
              {settings.map((setting, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.settingItem}
                  activeOpacity={0.7}
                  onPress={() => navigateTo(setting.action)}
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

            {/* Sign Out */}
            <View style={styles.dangerGroup}>
              <TouchableOpacity
                style={[styles.settingItem, styles.dangerItem]}
                activeOpacity={0.7}
                onPress={handleLogout}
              >
                <View style={styles.settingContent}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "rgba(255, 59, 48, 0.2)" },
                    ]}
                  >
                    <Ionicons
                      name="log-out-outline"
                      size={22}
                      color="#FF3B30"
                    />
                  </View>
                  <ThemedText style={[styles.settingLabel, styles.dangerText]}>
                    Sign Out
                  </ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>

            {/* App Info */}
            <View style={styles.appInfo}>
              <ThemedText style={styles.appInfoText}>
                AfroLingo v1.0.0
              </ThemedText>
              <ThemedText style={styles.appInfoText}>
                Made with ❤️ for language learners
              </ThemedText>
            </View>
          </ThemedView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: "row",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  drawerContent: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
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
  dangerText: {
    color: "#FF3B30",
  },
  appInfo: {
    alignItems: "center",
    paddingTop: 12,
    gap: 4,
    marginTop: "auto",
  },
  appInfoText: {
    fontSize: 12,
    opacity: 0.5,
  },
});
