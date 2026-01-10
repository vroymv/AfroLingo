import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  isLoading: boolean;
  loadError: string | null;
  isSignedIn: boolean;
  tintColor: string;
  onRetry: () => void;
};

export function FeedEmptyState({
  isLoading,
  loadError,
  isSignedIn,
  tintColor,
  onRetry,
}: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (isLoading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator />
        <ThemedText style={styles.stateText}>Loading feed…</ThemedText>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.stateContainer}>
        <ThemedText style={styles.stateTitle}>Couldn’t load feed</ThemedText>
        <ThemedText style={styles.stateText}>{loadError}</ThemedText>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: tintColor }]}
          onPress={onRetry}
          activeOpacity={0.85}
        >
          <ThemedText style={styles.retryText}>Retry</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.stateContainer}>
      <ThemedText style={styles.stateTitle}>No posts yet</ThemedText>
      <ThemedText style={styles.stateText}>
        {isSignedIn
          ? "Be the first to share something with the community."
          : "Sign in to create the first post."}
      </ThemedText>
      <View style={[styles.hintPill, { backgroundColor: colors.icon + "10" }]}>
        <ThemedText style={styles.hintText}>Pull to refresh</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stateContainer: {
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  stateText: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0B1220",
  },
  hintPill: {
    marginTop: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hintText: {
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.7,
  },
});
