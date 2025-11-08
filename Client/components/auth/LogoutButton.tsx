import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface LogoutButtonProps {
  variant?: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
  showIcon?: boolean;
  onLogoutComplete?: () => void;
}

export function LogoutButton({
  variant = "contained",
  size = "medium",
  showIcon = true,
  onLogoutComplete,
}: LogoutButtonProps) {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              await logout();
              onLogoutComplete?.();
            } catch {
              Alert.alert("Error", "Failed to logout. Please try again.", [
                { text: "OK" },
              ]);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { paddingHorizontal: 12, paddingVertical: 8, fontSize: 13 };
      case "large":
        return { paddingHorizontal: 24, paddingVertical: 14, fontSize: 16 };
      default:
        return { paddingHorizontal: 16, paddingVertical: 12, fontSize: 14 };
    }
  };

  const getVariantStyles = () => {
    const sizeStyles = getSizeStyles();

    switch (variant) {
      case "text":
        return {
          container: { backgroundColor: "transparent" },
          text: { color: "#FF6B6B", fontSize: sizeStyles.fontSize },
        };
      case "outlined":
        return {
          container: {
            backgroundColor: "transparent",
            borderWidth: 1.5,
            borderColor: "#FF6B6B",
            ...sizeStyles,
          },
          text: { color: "#FF6B6B", fontSize: sizeStyles.fontSize },
        };
      default:
        return {
          container: {
            backgroundColor: "#FF6B6B",
            ...sizeStyles,
          },
          text: { color: "#fff", fontSize: sizeStyles.fontSize },
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      style={[styles.button, variantStyles.container]}
      onPress={handleLogout}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "contained" ? "#fff" : "#FF6B6B"}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {showIcon && (
            <Ionicons
              name="log-out-outline"
              size={variantStyles.text.fontSize + 4}
              color={variantStyles.text.color}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, variantStyles.text]}>Logout</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontWeight: "600",
  },
});
