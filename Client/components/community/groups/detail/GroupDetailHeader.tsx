import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

type ThemeColors = (typeof Colors)["light"];

type Props = {
  title: string;
  subtitle?: string;
  colors: ThemeColors;
  onBack: () => void;
  right?: React.ReactNode;
};

export function GroupDetailHeader({
  title,
  subtitle,
  colors,
  onBack,
  right,
}: Props) {
  return (
    <View
      style={[
        styles.header,
        {
          borderBottomColor: `${colors.icon}20`,
          backgroundColor: colors.background,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onBack}
        style={({ pressed }) => [
          styles.headerIcon,
          { backgroundColor: pressed ? `${colors.icon}10` : "transparent" },
        ]}
      >
        <ThemedText style={[styles.headerIconText, { color: colors.text }]}>
          ‹
        </ThemedText>
      </Pressable>

      <View style={styles.headerTitleWrap}>
        <ThemedText style={styles.headerTitle} numberOfLines={1}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText
            style={[styles.headerSubtitle, { color: colors.icon }]}
            numberOfLines={1}
          >
            {subtitle}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.headerRight}>
        {right ?? <View style={styles.headerIcon} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconText: {
    fontSize: 18,
    fontWeight: "800",
    opacity: 0.85,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.8,
  },
  headerRight: {
    width: 74,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
