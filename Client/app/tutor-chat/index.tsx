import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationBadge } from "@/contexts/community/NotificationBadgeContext";

import type { TutorChatThread } from "@/types/TutorChat";
import { fetchTutorChatThreads } from "@/services/tutorChat";

function parseDate(value?: string | null): number {
  if (!value) return 0;
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : 0;
}

export default function TutorChatInboxScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const surfaceColor = colorScheme === "dark" ? "#1C1C1E" : "#FFFFFF";
  const borderColor = colorScheme === "dark" ? "#2C2C2E" : "#E5E5EA";

  const { user, token, isAuthenticated } = useAuth();
  const { socket } = useNotificationBadge();

  const [threads, setThreads] = useState<TutorChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user?.id) {
      setThreads([]);
      setLoading(false);
      return;
    }

    setError(null);
    const res = await fetchTutorChatThreads({
      userId: user.id,
      token: token ?? undefined,
    });

    if (!res.success) {
      setThreads([]);
      setError(res.message ?? "Failed to fetch chats");
      setLoading(false);
      return;
    }

    setThreads(res.data ?? []);
    setLoading(false);
  }, [token, user?.id]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  useEffect(() => {
    if (!socket) return;

    const onNew = () => {
      void load();
    };

    socket.on("tutor_chat:message:new", onNew);
    return () => {
      socket.off("tutor_chat:message:new", onNew);
    };
  }, [load, socket]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const sorted = useMemo(() => {
    return [...threads].sort((a, b) => {
      return parseDate(b.lastMessageAt) - parseDate(a.lastMessageAt);
    });
  }, [threads]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <ThemedText type="title">Tutor Chats</ThemedText>
        <ThemedText style={styles.subtitle}>Your 1:1 conversations</ThemedText>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {!isAuthenticated || !user?.id ? (
          <ThemedText style={styles.stateText}>
            Sign in to view your chats.
          </ThemedText>
        ) : loading ? (
          <View style={styles.stateWrap}>
            <ActivityIndicator />
            <ThemedText style={styles.stateText}>Loading…</ThemedText>
          </View>
        ) : error ? (
          <ThemedText style={styles.stateText}>{error}</ThemedText>
        ) : sorted.length === 0 ? (
          <ThemedText style={styles.stateText}>No chats yet.</ThemedText>
        ) : (
          sorted.map((t) => {
            const otherName = t.otherUser?.name ?? "Chat";

            const lastRead =
              user.id === t.learnerId
                ? parseDate(t.learnerLastReadAt)
                : parseDate(t.tutorLastReadAt);
            const lastMsg = parseDate(t.lastMessageAt);
            const unread = lastMsg > 0 && lastMsg > lastRead;

            return (
              <Pressable
                key={t.id}
                onPress={() =>
                  router.push({
                    pathname: "/tutor-chat/[threadId]" as any,
                    params: { threadId: t.id, title: otherName },
                  })
                }
                style={[
                  styles.threadRow,
                  {
                    borderColor: borderColor,
                    backgroundColor: surfaceColor,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.threadTitle} numberOfLines={1}>
                    {otherName}
                  </ThemedText>
                  <ThemedText style={styles.threadPreview} numberOfLines={1}>
                    {t.lastMessage?.body ?? ""}
                  </ThemedText>
                </View>

                {unread ? (
                  <View
                    style={[styles.unreadDot, { backgroundColor: colors.tint }]}
                  />
                ) : null}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  subtitle: { marginTop: 4, opacity: 0.7 },
  content: { padding: 20, paddingTop: 8, gap: 12 },

  threadRow: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  threadTitle: { fontSize: 16, fontWeight: "700" },
  threadPreview: { marginTop: 3, opacity: 0.7 },
  unreadDot: { width: 10, height: 10, borderRadius: 5 },

  stateWrap: { alignItems: "center", justifyContent: "center", gap: 10 },
  stateText: { opacity: 0.75, paddingVertical: 12 },
});
