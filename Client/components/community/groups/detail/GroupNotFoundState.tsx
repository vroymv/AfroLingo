import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GroupDetailHeader } from "@/components/community/groups/detail/GroupDetailHeader";

type ThemeColors = (typeof Colors)["light"];

type Props = {
  colors: ThemeColors;
  onBack: () => void;
  onGoToGroups: () => void;
};

export function GroupNotFoundState({ colors, onBack, onGoToGroups }: Props) {
  return (
    <View style={styles.container}>
      <GroupDetailHeader title="Group" colors={colors} onBack={onBack} />

      <View style={styles.emptyWrap}>
        <ThemedText style={styles.emptyIcon}>👥</ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
          Group not found
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={onGoToGroups}
          style={[styles.primaryButton, { backgroundColor: colors.tint }]}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[styles.primaryButtonText, { color: colors.background }]}
          >
            Back to Groups
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 10,
  },
  emptyIcon: {
    fontSize: 44,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  primaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 160,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "800",
  },
});
