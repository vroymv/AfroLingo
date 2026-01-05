import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";

export type GroupChatReactionMap = Record<string, string[]>;

export type GroupChatMessageViewModel = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  reactions: GroupChatReactionMap;
};

type Props = {
  message: GroupChatMessageViewModel;
  isMine: boolean;
  showSender: boolean;
  onLongPress: () => void;
};

function formatTime(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const hours12 = hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";
  return `${hours12}:${minutes} ${ampm}`;
}

function summarizeReactions(reactions: GroupChatReactionMap) {
  const entries = Object.entries(reactions)
    .map(([emoji, userIds]) => ({ emoji, count: userIds.length }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);

  return entries;
}

export function GroupChatMessageItem({
  message,
  isMine,
  showSender,
  onLongPress,
}: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const bubbleBg = isMine ? colors.tint : `${colors.icon}12`;
  const textColor = isMine ? colors.background : colors.text;

  const reactionSummary = useMemo(
    () => summarizeReactions(message.reactions),
    [message.reactions]
  );

  return (
    <View style={[styles.row, isMine ? styles.rowMine : styles.rowTheirs]}>
      {!isMine ? (
        <View style={styles.avatar}>
          <ThemedText style={styles.avatarText}>
            {message.senderAvatar}
          </ThemedText>
        </View>
      ) : (
        <View style={styles.avatarSpacer} />
      )}

      <View style={[styles.body, isMine ? styles.bodyMine : styles.bodyTheirs]}>
        {showSender && !isMine ? (
          <ThemedText style={styles.sender} numberOfLines={1}>
            {message.senderName}
          </ThemedText>
        ) : null}

        <Pressable onLongPress={onLongPress} delayLongPress={250}>
          <View style={[styles.bubble, { backgroundColor: bubbleBg }]}>
            <ThemedText style={[styles.text, { color: textColor }]}>
              {message.content}
            </ThemedText>
          </View>
        </Pressable>

        <View
          style={[
            styles.metaRow,
            isMine ? styles.metaRowMine : styles.metaRowTheirs,
          ]}
        >
          {reactionSummary.length > 0 ? (
            <View
              style={[
                styles.reactionsPill,
                {
                  backgroundColor: `${colors.background}EE`,
                  borderColor: `${colors.icon}20`,
                },
              ]}
            >
              {reactionSummary.slice(0, 3).map((r) => (
                <ThemedText key={r.emoji} style={styles.reactionText}>
                  {r.emoji} {r.count}
                </ThemedText>
              ))}
            </View>
          ) : null}

          <ThemedText style={styles.time}>
            {formatTime(message.timestamp)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "flex-end",
  },
  rowMine: {
    justifyContent: "flex-end",
  },
  rowTheirs: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  avatarText: {
    fontSize: 18,
  },
  avatarSpacer: {
    width: 40,
  },
  body: {
    maxWidth: "82%",
  },
  bodyMine: {
    alignItems: "flex-end",
  },
  bodyTheirs: {
    alignItems: "flex-start",
  },
  sender: {
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.6,
    marginBottom: 4,
    marginLeft: 2,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "500",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  metaRowMine: {
    justifyContent: "flex-end",
  },
  metaRowTheirs: {
    justifyContent: "flex-start",
  },
  reactionsPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  reactionText: {
    fontSize: 12,
    fontWeight: "800",
    opacity: 0.9,
  },
  time: {
    fontSize: 11,
    opacity: 0.5,
    fontWeight: "600",
  },
});
