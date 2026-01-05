import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  title?: string;
  subtitle?: string;
};

export function GroupsEmptyState({
  title = "No groups found",
  subtitle = "Try a different search.",
}: Props) {
  return (
    <View style={styles.emptyState}>
      <ThemedText style={styles.emptyIcon}>👥</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
        {title}
      </ThemedText>
      <ThemedText style={styles.emptyText}>{subtitle}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
});
