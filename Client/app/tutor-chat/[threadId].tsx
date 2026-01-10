import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationBadge } from "@/contexts/community/NotificationBadgeContext";

import type { TutorChatMessage } from "@/types/TutorChat";
import {
  fetchTutorChatMessages,
  markTutorChatThreadRead,
  sendTutorChatMessage,
} from "@/services/tutorChat";

function createClientMessageId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function TutorChatScreen() {
  const { threadId, title } = useLocalSearchParams<{
    threadId: string;
    title?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const surfaceColor = colorScheme === "dark" ? "#1C1C1E" : "#FFFFFF";
  const borderColor = colorScheme === "dark" ? "#2C2C2E" : "#E5E5EA";

  const { user, token, isAuthenticated } = useAuth();
  const { socket } = useNotificationBadge();

  const [messages, setMessages] = useState<TutorChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextCursorRef = useRef<string | null>(null);

  const safeThreadId = typeof threadId === "string" ? threadId : "";

  const headerTitle = useMemo(() => {
    if (typeof title === "string" && title.trim().length > 0) return title;
    return "Tutor Chat";
  }, [title]);

  const refresh = useCallback(async () => {
    if (!safeThreadId) return;

    setError(null);
    setLoading(true);

    const res = await fetchTutorChatMessages({
      threadId: safeThreadId,
      limit: 30,
      token: token ?? undefined,
    });

    if (!res.success) {
      setMessages([]);
      nextCursorRef.current = null;
      setError(res.message ?? "Failed to load messages");
      setLoading(false);
      return;
    }

    setMessages(res.data?.items ?? []);
    nextCursorRef.current = res.data?.nextCursor ?? null;
    setLoading(false);
  }, [safeThreadId, token]);

  const loadMore = useCallback(async () => {
    if (!safeThreadId) return;
    if (!nextCursorRef.current) return;
    if (loadingMore) return;

    setLoadingMore(true);
    try {
      const res = await fetchTutorChatMessages({
        threadId: safeThreadId,
        cursor: nextCursorRef.current ?? undefined,
        limit: 30,
        token: token ?? undefined,
      });

      if (!res.success) return;

      const older = res.data?.items ?? [];
      if (older.length > 0) {
        setMessages((prev) => {
          const seen = new Set(prev.map((m) => m.id));
          const merged = [...prev];
          for (const msg of older) {
            if (!seen.has(msg.id)) merged.push(msg);
          }
          return merged;
        });
      }
      nextCursorRef.current = res.data?.nextCursor ?? null;
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, safeThreadId, token]);

  const markRead = useCallback(async () => {
    if (!isAuthenticated || !user?.id || !safeThreadId) return;

    await markTutorChatThreadRead({
      threadId: safeThreadId,
      userId: user.id,
      token: token ?? undefined,
    });
  }, [isAuthenticated, safeThreadId, token, user?.id]);

  useEffect(() => {
    void refresh();
    void markRead();
  }, [markRead, refresh]);

  useEffect(() => {
    if (!socket || !safeThreadId) return;

    const onNew = (payload: any) => {
      if (!payload || payload.threadId !== safeThreadId) return;
      const msg = payload.message as TutorChatMessage | undefined;
      if (!msg) return;

      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [msg, ...prev];
      });

      // Best-effort: mark as read when open
      void markRead();
    };

    socket.on("tutor_chat:message:new", onNew);
    return () => {
      socket.off("tutor_chat:message:new", onNew);
    };
  }, [markRead, safeThreadId, socket]);

  const onSend = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setError("Please sign in to chat.");
      return;
    }

    const trimmed = input.trim();
    if (!trimmed || !safeThreadId) return;

    setSending(true);
    setError(null);

    const clientMessageId = createClientMessageId();
    const optimistic: TutorChatMessage = {
      id: `local-${clientMessageId}`,
      threadId: safeThreadId,
      senderId: user.id,
      body: trimmed,
      clientMessageId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [optimistic, ...prev]);
    setInput("");

    try {
      const res = await sendTutorChatMessage({
        threadId: safeThreadId,
        senderId: user.id,
        body: trimmed,
        clientMessageId,
        token: token ?? undefined,
      });

      if (!res.success || !res.data) {
        setError(res.message ?? "Failed to send message");
        return;
      }

      setMessages((prev) => {
        // Replace optimistic entry if present
        const replaced = prev.map((m) =>
          m.id === optimistic.id ? res.data! : m
        );
        // Ensure server message exists
        if (!replaced.some((m) => m.id === res.data!.id)) {
          return [res.data!, ...replaced];
        }
        return replaced;
      });

      void markRead();
    } finally {
      setSending(false);
    }
  }, [input, isAuthenticated, markRead, safeThreadId, token, user?.id]);

  const renderItem = useCallback(
    ({ item }: { item: TutorChatMessage }) => {
      const isMine = item.senderId === user?.id;

      return (
        <View
          style={[
            styles.messageRow,
            { justifyContent: isMine ? "flex-end" : "flex-start" },
          ]}
        >
          <View
            style={[
              styles.bubble,
              {
                backgroundColor: isMine ? colors.tint : surfaceColor,
                borderColor: isMine ? colors.tint : borderColor,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.bubbleText,
                { color: isMine ? "#FFFFFF" : colors.text },
              ]}
            >
              {item.body}
            </ThemedText>
          </View>
        </View>
      );
    },
    [borderColor, colors.text, colors.tint, surfaceColor, user?.id]
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backText}>Back</ThemedText>
        </Pressable>
        <ThemedText
          type="subtitle"
          numberOfLines={1}
          style={styles.headerTitle}
        >
          {headerTitle}
        </ThemedText>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        <View style={styles.stateWrap}>
          <ActivityIndicator />
          <ThemedText style={styles.stateText}>Loading…</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.stateWrap}>
          <ThemedText style={styles.stateText}>{error}</ThemedText>
          <Pressable onPress={() => void refresh()} style={styles.retryButton}>
            <ThemedText style={styles.retryText}>Retry</ThemedText>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          inverted
          contentContainerStyle={[styles.listContent, { paddingBottom: 12 }]}
          onEndReachedThreshold={0.2}
          onEndReached={() => void loadMore()}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loadingMore}>
                <ActivityIndicator />
              </View>
            ) : null
          }
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.bottom + 8}
      >
        <View
          style={[
            styles.composer,
            {
              borderTopColor: borderColor,
              paddingBottom: Math.max(insets.bottom, 8),
              backgroundColor: colors.background,
            },
          ]}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={isAuthenticated ? "Message…" : "Sign in to chat"}
            placeholderTextColor={colors.text + "80"}
            editable={isAuthenticated && !sending}
            style={[
              styles.input,
              {
                backgroundColor: surfaceColor,
                color: colors.text,
                borderColor,
              },
            ]}
            multiline
          />
          <Pressable
            onPress={() => void onSend()}
            disabled={!isAuthenticated || sending || input.trim().length === 0}
            style={[
              styles.sendButton,
              {
                backgroundColor:
                  !isAuthenticated || sending || input.trim().length === 0
                    ? borderColor
                    : colors.tint,
              },
            ]}
          >
            <ThemedText style={styles.sendText}>
              {sending ? "…" : "Send"}
            </ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 52,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: { paddingVertical: 8, paddingHorizontal: 8 },
  backText: { fontSize: 16, fontWeight: "600" },
  headerTitle: { flex: 1, textAlign: "center", paddingHorizontal: 8 },
  headerRight: { width: 48 },

  listContent: { paddingHorizontal: 12, paddingTop: 12 },
  messageRow: { flexDirection: "row", marginBottom: 10 },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  bubbleText: { fontSize: 15, lineHeight: 20 },

  composer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  sendButton: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: { color: "#FFFFFF", fontWeight: "700" },

  stateWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  stateText: { opacity: 0.75, textAlign: "center" },
  retryButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: { fontWeight: "700" },

  loadingMore: { paddingVertical: 16 },
});
