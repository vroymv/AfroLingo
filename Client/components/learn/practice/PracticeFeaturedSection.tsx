import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import type { PracticeFeaturedMode, PracticeKind } from "./practiceTypes";
import { PracticeSectionHeader } from "./PracticeSectionHeader";

export function PracticeFeaturedSection({
  modes,
  onSelectKind,
}: {
  modes: PracticeFeaturedMode[];
  onSelectKind: (kind: PracticeKind) => void;
}) {
  return (
    <View>
      <PracticeSectionHeader title="Featured" meta="Tap to filter" />

      <View style={styles.featuredGrid}>
        {modes.map((m) => (
          <TouchableOpacity
            key={m.id}
            onPress={() => onSelectKind(m.kind)}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${m.title}`}
            style={styles.featuredCardTouch}
          >
            <ThemedView style={styles.featuredCard}>
              <View style={styles.featuredTopRow}>
                <ThemedText style={styles.featuredEmoji}>{m.emoji}</ThemedText>
                <View style={styles.featuredBadge}>
                  <ThemedText style={styles.featuredBadgeText}>
                    {m.title}
                  </ThemedText>
                </View>
              </View>
              <ThemedText type="default" style={styles.featuredSubtitle}>
                {m.subtitle}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  featuredGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  featuredCardTouch: {
    flex: 1,
  },
  featuredCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(74, 144, 226, 0.18)",
    minHeight: 92,
  },
  featuredTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  featuredEmoji: {
    fontSize: 20,
  },
  featuredBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(74, 144, 226, 0.12)",
  },
  featuredBadgeText: {
    fontSize: 11,
    color: "#4A90E2",
    fontWeight: "700",
  },
  featuredSubtitle: {
    fontSize: 12,
    opacity: 0.75,
    lineHeight: 18,
  },
});
