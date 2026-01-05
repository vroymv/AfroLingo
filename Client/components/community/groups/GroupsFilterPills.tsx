import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import type { GroupsFilter } from "@/hooks/community/useGroups";

type Props = {
  value: GroupsFilter;
  onChange: (next: GroupsFilter) => void;
};

export function GroupsFilterPills({ value, onChange }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const options: Array<{ key: GroupsFilter; label: string; icon: string }> = [
    { key: "all", label: "All", icon: "🌐" },
    { key: "my", label: "My Groups", icon: "⭐" },
    { key: "public", label: "Public", icon: "🔓" },
  ];

  return (
    <View style={styles.wrap}>
      {options.map((opt) => {
        const isActive = opt.key === value;
        const bg = isActive ? `${colors.tint}22` : `${colors.icon}12`;
        const borderColor = isActive ? `${colors.tint}55` : "transparent";

        return (
          <TouchableOpacity
            key={opt.key}
            style={[styles.pill, { backgroundColor: bg, borderColor }]}
            activeOpacity={0.85}
            onPress={() => onChange(opt.key)}
          >
            <ThemedText
              style={[
                styles.pillText,
                isActive
                  ? { color: colors.tint, opacity: 1 }
                  : { opacity: 0.75 },
              ]}
            >
              {opt.icon} {opt.label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
