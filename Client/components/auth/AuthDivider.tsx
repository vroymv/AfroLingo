import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, View } from "react-native";

export function AuthDivider() {
  const tintColor = useThemeColor({}, "tint");

  return (
    <View style={styles.divider}>
      <View
        style={[styles.dividerLine, { backgroundColor: tintColor + "30" }]}
      />
      <ThemedText style={styles.dividerText}>or</ThemedText>
      <View
        style={[styles.dividerLine, { backgroundColor: tintColor + "30" }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    opacity: 0.6,
  },
});
