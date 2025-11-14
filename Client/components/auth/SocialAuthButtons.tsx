import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface SocialAuthButtonsProps {
  onGooglePress: () => void;
  onApplePress: () => void;
  isGoogleLoading?: boolean;
  isAppleLoading?: boolean;
  disabled?: boolean;
}

export function SocialAuthButtons({
  onGooglePress,
  onApplePress,
  isGoogleLoading = false,
  isAppleLoading = false,
  disabled = false,
}: SocialAuthButtonsProps) {
  const tintColor = useThemeColor({}, "tint");

  return (
    <View style={styles.socialButtons}>
      <TouchableOpacity
        style={[styles.socialButton, { borderColor: tintColor + "30" }]}
        onPress={onGooglePress}
        disabled={isGoogleLoading || disabled}
        activeOpacity={0.7}
      >
        {isGoogleLoading ? (
          <ActivityIndicator size="small" color={tintColor} />
        ) : (
          <>
            <ThemedText style={styles.socialIcon}>G</ThemedText>
            <ThemedText style={styles.socialButtonText}>Google</ThemedText>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.socialButton, { borderColor: tintColor + "30" }]}
        onPress={onApplePress}
        disabled={isAppleLoading || disabled}
        activeOpacity={0.7}
      >
        {isAppleLoading ? (
          <ActivityIndicator size="small" color={tintColor} />
        ) : (
          <>
            <ThemedText style={styles.socialIcon}></ThemedText>
            <ThemedText style={styles.socialButtonText}>Apple</ThemedText>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  socialButtons: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    gap: 8,
  },
  socialIcon: {
    fontSize: 20,
    fontWeight: "bold",
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
