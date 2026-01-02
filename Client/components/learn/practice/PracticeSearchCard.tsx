import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export function PracticeSearchCard({
  query,
  onChangeQuery,
  onClear,
}: {
  query: string;
  onChangeQuery: (next: string) => void;
  onClear: () => void;
}) {
  const colorScheme = useColorScheme() ?? "light";
  const dividerColor =
    colorScheme === "dark"
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(0, 0, 0, 0.06)";

  return (
    <ThemedView style={styles.searchCard}>
      <View style={styles.searchRow}>
        <View style={styles.searchIconCircle}>
          <ThemedText style={styles.searchIcon}>🔎</ThemedText>
        </View>

        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Search practice (listening, pronunciation, quiz…)"
          placeholderTextColor={
            colorScheme === "dark"
              ? "rgba(236, 237, 238, 0.55)"
              : "rgba(17, 24, 28, 0.45)"
          }
          style={[styles.searchInput, { color: Colors[colorScheme].text }]}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {query.length > 0 ? (
          <TouchableOpacity
            onPress={onClear}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            style={styles.clearButton}
          >
            <ThemedText style={styles.clearButtonText}>✕</ThemedText>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={[styles.searchDivider, { backgroundColor: dividerColor }]} />

      <View style={styles.searchHintRow}>
        <ThemedText type="default" style={styles.searchHint}>
          Try: “audio”, “daily”, “conversation”
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  searchCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 18,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(74, 144, 226, 0.12)",
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
  },
  clearButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  clearButtonText: {
    fontSize: 14,
    opacity: 0.8,
  },
  searchDivider: {
    height: 1,
    marginTop: 12,
    marginBottom: 10,
  },
  searchHintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchHint: {
    fontSize: 12,
    opacity: 0.65,
  },
});
