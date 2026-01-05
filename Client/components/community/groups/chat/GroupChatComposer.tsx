import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  enabled: boolean;
  placeholder?: string;
  onSend: (text: string) => void;
  bottomInset?: number;
};

export function GroupChatComposer({
  enabled,
  placeholder = "Message",
  onSend,
}: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [text, setText] = useState("");

  const canSend = useMemo(
    () => enabled && text.trim().length > 0,
    [enabled, text]
  );

  const handleSend = () => {
    if (!canSend) return;
    const trimmed = text.trim();
    setText("");
    onSend(trimmed);
  };

  return (
    <View style={[styles.wrap, { borderTopColor: `${colors.icon}20` }]}>
      <View
        style={[
          styles.inner,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View
          style={[styles.inputWrap, { backgroundColor: `${colors.icon}10` }]}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor={colors.icon}
            style={[styles.input, { color: colors.text }]}
            editable={enabled}
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            activeOpacity={0.85}
            style={[
              styles.send,
              {
                backgroundColor: canSend ? colors.tint : `${colors.icon}18`,
              },
            ]}
          >
            <ThemedText
              style={{
                fontSize: 14,
                fontWeight: "900",
                color: canSend ? colors.background : colors.text,
                opacity: canSend ? 1 : 0.5,
              }}
            >
              ↑
            </ThemedText>
          </TouchableOpacity>
        </View>
        {!enabled ? (
          <ThemedText style={[styles.hint, { color: colors.icon }]}>
            Join this group to send messages.
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
  },
  inner: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  inputWrap: {
    borderRadius: 18,
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    maxHeight: 110,
  },
  send: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
});
