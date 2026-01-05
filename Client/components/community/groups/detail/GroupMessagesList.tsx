import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import {
  GroupChatMessageItem,
  type GroupChatMessageViewModel,
} from "@/components/community/groups/chat/GroupChatMessageItem";
import { GroupChatReactionPicker } from "@/components/community/groups/chat/GroupChatReactionPicker";
import { GroupBanner } from "@/components/community/groups/detail/GroupBanner";
import type { GroupRow } from "@/hooks/community/useGroups";
import { Colors } from "@/constants/Colors";

type ThemeColors = (typeof Colors)["light"];

type Props = {
  group: GroupRow;
  colors: ThemeColors;
  currentUserId: string;
  messages: GroupChatMessageViewModel[];
  activeMessageId: string | null;
  onToggleMessageActions: (messageId: string) => void;
  onCloseActions: () => void;
  onPickReaction: (messageId: string, emoji: string) => void;
  bottomInset: number;
};

export function GroupMessagesList({
  group,
  colors,
  currentUserId,
  messages,
  activeMessageId,
  onToggleMessageActions,
  onCloseActions,
  onPickReaction,
  bottomInset,
}: Props) {
  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => {
        const isMine = item.senderId === currentUserId;
        const prev = index > 0 ? messages[index - 1] : null;
        const showSender =
          !isMine && (!prev || prev.senderId !== item.senderId);
        const align = isMine ? "right" : "left";

        return (
          <View style={styles.messageRow}>
            <GroupChatMessageItem
              message={item}
              isMine={isMine}
              showSender={showSender}
              onLongPress={() => onToggleMessageActions(item.id)}
            />
            {activeMessageId === item.id ? (
              <GroupChatReactionPicker
                align={align}
                onClose={onCloseActions}
                onPick={(emoji) => onPickReaction(item.id, emoji)}
              />
            ) : null}
          </View>
        );
      }}
      contentContainerStyle={[
        styles.messagesContent,
        { paddingBottom: 72 + bottomInset },
      ]}
      showsVerticalScrollIndicator={false}
      onScrollBeginDrag={onCloseActions}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={<GroupBanner group={group} colors={colors} />}
    />
  );
}

const styles = StyleSheet.create({
  messagesContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  messageRow: {
    marginBottom: 6,
  },
});
