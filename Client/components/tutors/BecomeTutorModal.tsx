import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ChatMessage = {
  id: string;
  from: "user";
  text: string;
  createdAt: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  initialDraft?: string;
};

export function BecomeTutorModal({ visible, onClose, initialDraft }: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const normalizedInitialDraft = useMemo(
    () => initialDraft ?? "",
    [initialDraft]
  );
  const [draft, setDraft] = useState(normalizedInitialDraft);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    if (!visible) return;

    setDraft(normalizedInitialDraft);
    // keep any existing messages in this session
    requestAnimationFrame(() =>
      scrollRef.current?.scrollToEnd({ animated: false })
    );
  }, [visible, normalizedInitialDraft]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    const next: ChatMessage = {
      id: `${Date.now()}`,
      from: "user",
      text,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, next]);
    setDraft("");

    requestAnimationFrame(() =>
      scrollRef.current?.scrollToEnd({ animated: true })
    );
  };

  const isSendDisabled = draft.trim().length === 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalRoot}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colorScheme === "dark" ? "#1C1C1E" : "#FFFFFF",
              paddingBottom: Math.max(12, insets.bottom),
            },
          ]}
        >
          {/* Handle */}
          <View style={styles.handleWrap}>
            <View
              style={[
                styles.handle,
                {
                  backgroundColor:
                    colorScheme === "dark" ? "#2C2C2E" : "#E5E5EA",
                },
              ]}
            />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <ThemedText style={styles.headerTitle}>
                Customer Service
              </ThemedText>
              <ThemedText
                style={[styles.headerSubtitle, { color: `${colors.icon}` }]}
              >
                Tutor onboarding chat
              </ThemedText>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={10}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView
            ref={(r) => {
              scrollRef.current = r;
            }}
            style={styles.messages}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.systemMessageWrap}>
              <View
                style={[
                  styles.systemBubble,
                  {
                    backgroundColor:
                      colorScheme === "dark" ? "#2C2C2E" : "#F2F2F7",
                  },
                ]}
              >
                <ThemedText style={styles.systemText}>
                  Send a message and our team will help you get started.
                </ThemedText>
              </View>
            </View>

            {messages.map((m) => (
              <View key={m.id} style={styles.userMessageRow}>
                <View style={styles.userBubble}>
                  <ThemedText style={styles.userText}>{m.text}</ThemedText>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Composer */}
          <View
            style={[
              styles.composer,
              {
                borderTopColor: colorScheme === "dark" ? "#2C2C2E" : "#E5E5EA",
              },
            ]}
          >
            <View
              style={[
                styles.inputWrap,
                {
                  backgroundColor:
                    colorScheme === "dark" ? "#2C2C2E" : "#F2F2F7",
                },
              ]}
            >
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Write a message..."
                placeholderTextColor={colors.icon}
                style={[styles.input, { color: colors.text }]}
                multiline
                autoCorrect
              />

              <TouchableOpacity
                onPress={handleSend}
                disabled={isSendDisabled}
                style={[
                  styles.sendButton,
                  {
                    opacity: isSendDisabled ? 0.5 : 1,
                    backgroundColor: "#4A90E2",
                  },
                ]}
              >
                <Ionicons name="send" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    maxHeight: "85%",
  },
  handleWrap: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 6,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 13,
    opacity: 0.8,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  messages: {
    flexGrow: 0,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  systemMessageWrap: {
    paddingTop: 4,
    paddingBottom: 10,
  },
  systemBubble: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    maxWidth: "92%",
  },
  systemText: {
    fontSize: 13,
    opacity: 0.85,
  },
  userMessageRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 6,
  },
  userBubble: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderTopRightRadius: 6,
    maxWidth: "92%",
  },
  userText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
  },
  composer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 16,
    paddingLeft: 12,
    paddingVertical: 10,
    paddingRight: 8,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    maxHeight: 110,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
