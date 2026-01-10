import { ThemedText } from "@/components/ThemedText";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  isLoadingMore: boolean;
  loadMoreError: string | null;
  hasMore: boolean;
  tintColor: string;
  onRetry: () => void;
};

export function FeedFooter({
  isLoadingMore,
  loadMoreError,
  hasMore,
  tintColor,
  onRetry,
}: Props) {
  return (
    <View style={styles.footerContainer}>
      {loadMoreError ? (
        <View style={styles.footerErrorRow}>
          <ThemedText style={styles.footerText}>{loadMoreError}</ThemedText>
          <TouchableOpacity
            style={[styles.footerRetryButton, { borderColor: tintColor }]}
            onPress={onRetry}
            disabled={isLoadingMore}
            activeOpacity={0.85}
          >
            <ThemedText style={[styles.footerRetryText, { color: tintColor }]}>
              Retry
            </ThemedText>
          </TouchableOpacity>
        </View>
      ) : isLoadingMore ? (
        <View style={styles.footerLoadingRow}>
          <ActivityIndicator />
          <ThemedText style={styles.footerText}>Loading…</ThemedText>
        </View>
      ) : !hasMore ? (
        <ThemedText style={styles.footerText}>You’re all caught up</ThemedText>
      ) : (
        <View style={styles.footerSpacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    paddingTop: 12,
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  footerLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  footerErrorRow: {
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: "center",
  },
  footerRetryButton: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  footerRetryText: {
    fontSize: 13,
    fontWeight: "800",
  },
  footerSpacer: {
    height: 1,
  },
});
