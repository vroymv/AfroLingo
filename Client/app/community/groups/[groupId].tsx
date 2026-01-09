import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useLocalSearchParams, useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useGroupsStore } from "@/contexts/community/GroupsContext";
import { GroupChatComposer } from "@/components/community/groups/chat/GroupChatComposer";
import type { GroupChatMessageViewModel } from "@/components/community/groups/chat/GroupChatMessageItem";
import { GroupDetailHeader } from "@/components/community/groups/detail/GroupDetailHeader";
import { GroupMessagesList } from "@/components/community/groups/detail/GroupMessagesList";
import { GroupNotFoundState } from "@/components/community/groups/detail/GroupNotFoundState";

export default function GroupDetailScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const {
    joinGroup,
    leaveGroup,
    currentUser,
    usersById,
    getGroupById,
    getMessagesForGroup,
    loadMessagesForGroup,
    sendMessage,
    reactToMessage,
  } = useGroupsStore();

  const group = typeof groupId === "string" ? getGroupById(groupId) : undefined;

  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  const activeGroupId = group?.id;

  useEffect(() => {
    if (!activeGroupId) return;
    void loadMessagesForGroup(activeGroupId);
  }, [activeGroupId, loadMessagesForGroup]);

  const messages = useMemo(() => {
    return activeGroupId ? getMessagesForGroup(activeGroupId) : [];
  }, [activeGroupId, getMessagesForGroup]);

  const messageVMs = useMemo<GroupChatMessageViewModel[]>(() => {
    return messages.map((m) => {
      const sender = usersById[m.senderId];
      return {
        ...m,
        senderName: sender?.name ?? "Member",
        senderAvatar: sender?.avatar ?? "🙂",
      };
    });
  }, [messages, usersById]);

  if (!group) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={["top", "bottom"]}
      >
        <ThemedView style={styles.container}>
          <GroupNotFoundState
            colors={colors}
            onBack={() => router.back()}
            onGoToGroups={() => router.push("/(tabs)/community/groups")}
          />
        </ThemedView>
      </SafeAreaView>
    );
  }

  const actionBg = group.isMember ? `${colors.icon}12` : `${colors.tint}18`;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <ThemedView style={styles.container}>
        <GroupDetailHeader
          title={group.name}
          colors={colors}
          onBack={() => router.back()}
          right={
            <Pressable
              accessibilityRole="button"
              style={[styles.headerPill, { backgroundColor: actionBg }]}
              onPress={() =>
                group.isMember ? leaveGroup(group.id) : joinGroup(group.id)
              }
            >
              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.headerPillText,
                  { color: group.isMember ? colors.text : colors.tint },
                ]}
              >
                {group.isMember ? "Leave" : "Join"}
              </ThemedText>
            </Pressable>
          }
        />

        <KeyboardAvoidingView
          style={styles.chatWrap}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={insets.top + 52}
        >
          <GroupMessagesList
            group={group}
            colors={colors}
            currentUserId={currentUser.id}
            messages={messageVMs}
            activeMessageId={activeMessageId}
            onToggleMessageActions={(messageId) =>
              setActiveMessageId((cur) =>
                cur === messageId ? null : messageId
              )
            }
            onCloseActions={() => setActiveMessageId(null)}
            onPickReaction={(messageId, emoji) => {
              reactToMessage(group.id, messageId, emoji);
              setActiveMessageId(null);
            }}
            bottomInset={insets.bottom}
          />

          <GroupChatComposer
            enabled={group.isMember}
            bottomInset={insets.bottom}
            onSend={(text) => {
              sendMessage(group.id, text);
            }}
          />
        </KeyboardAvoidingView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    minWidth: 56,
    alignItems: "center",
  },
  headerPillText: {
    fontSize: 13,
    fontWeight: "800",
  },
  chatWrap: {
    flex: 1,
  },
});
