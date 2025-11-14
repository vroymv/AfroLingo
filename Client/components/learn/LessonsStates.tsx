import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading lessons...",
}) => {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <ThemedText style={styles.text}>{message}</ThemedText>
      </View>
    </ThemedView>
  );
};

interface ErrorStateProps {
  message?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Failed to load lessons. Please try again.",
}) => {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.errorText}>{message}</ThemedText>
      </View>
    </ThemedView>
  );
};

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No lessons available at the moment.",
}) => {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.text}>{message}</ThemedText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    color: "#FF6B6B",
  },
});
