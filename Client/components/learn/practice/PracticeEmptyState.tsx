import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { StyleSheet, View } from "react-native";

export function PracticeEmptyState({
  emoji,
  title,
  message,
}: {
  emoji: string;
  title: string;
  message: string;
}) {
  return (
    <View style={styles.emptyState}>
      <ThemedText style={styles.emptyEmoji}>{emoji}</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
        {title}
      </ThemedText>
      <ThemedText type="default" style={styles.emptyText}>
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 54,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
});
