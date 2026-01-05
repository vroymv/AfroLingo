import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  onPick: (emoji: string) => void;
  onClose: () => void;
  align: "left" | "right";
};

const REACTIONS = ["❤️", "👍", "👎", "😂", "‼️", "❓"];

export function GroupChatReactionPicker({ onPick, onClose, align }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View
      style={[
        styles.wrap,
        align === "right" ? styles.right : styles.left,
        {
          backgroundColor: colors.background,
          borderColor: `${colors.icon}20`,
        },
      ]}
    >
      {REACTIONS.map((emoji) => (
        <TouchableOpacity
          key={emoji}
          onPress={() => {
            onPick(emoji);
            onClose();
          }}
          activeOpacity={0.85}
          style={styles.reactionButton}
        >
          <ThemedText style={styles.reaction}>{emoji}</ThemedText>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.85}
        style={styles.reactionButton}
      >
        <ThemedText style={[styles.reaction, { opacity: 0.7 }]}>✕</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  left: {
    marginLeft: 44,
  },
  right: {
    marginRight: 12,
    alignSelf: "flex-end",
  },
  reactionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  reaction: {
    fontSize: 18,
  },
});
