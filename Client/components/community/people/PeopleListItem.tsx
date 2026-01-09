import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { getLanguageFlag } from "@/utils/language";
import type { User } from "@/data/community";

type Props = {
  user: User;
  isConnected: boolean;
  onPress?: () => void;
  onToggleConnect: () => void;
};

function roleLabel(userType: User["userType"]) {
  if (userType === "native") return "Native speaker";
  if (userType === "tutor") return "Tutor";
  return "Learner";
}

function roleIcon(userType: User["userType"]) {
  if (userType === "native") return "🌟";
  if (userType === "tutor") return "👨‍🏫";
  return "🎓";
}

export function PeopleListItem({
  user,
  isConnected,
  onPress,
  onToggleConnect,
}: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const avatarStr = user.avatar ?? "";
  const isAvatarUrl = /^https?:\/\//i.test(avatarStr);
  const avatarFallback =
    avatarStr.trim().length > 0
      ? avatarStr
      : user.name?.trim().length > 0
      ? user.name.trim().charAt(0).toUpperCase()
      : "👤";

  const separatorColor = `${colors.icon}20`;
  const subtleBg = `${colors.icon}12`;

  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: separatorColor }]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.avatar, { backgroundColor: subtleBg }]}>
        {isAvatarUrl ? (
          <Image
            source={{ uri: avatarStr }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        ) : (
          <ThemedText style={styles.avatarEmoji}>{avatarFallback}</ThemedText>
        )}
      </View>

      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <ThemedText style={styles.name} numberOfLines={1}>
            {user.name}
          </ThemedText>
          <View style={[styles.rolePill, { backgroundColor: subtleBg }]}>
            <ThemedText style={styles.roleText}>
              {roleIcon(user.userType)} {roleLabel(user.userType)}
            </ThemedText>
          </View>
        </View>

        <View style={styles.rowBottom}>
          <ThemedText style={styles.meta} numberOfLines={1}>
            {user.languages
              .map((lang) => `${getLanguageFlag(lang)} ${lang}`)
              .join("  •  ")}
          </ThemedText>
          <ThemedText style={styles.xp}>{user.xp} XP</ThemedText>
        </View>

        {user.bio ? (
          <ThemedText style={styles.bio} numberOfLines={2}>
            {user.bio}
          </ThemedText>
        ) : null}
      </View>

      <TouchableOpacity
        style={[
          styles.connectButton,
          isConnected
            ? {
                backgroundColor: subtleBg,
                borderColor: colors.tint,
              }
            : {
                backgroundColor: colors.tint,
                borderColor: colors.tint,
              },
        ]}
        onPress={onToggleConnect}
        activeOpacity={0.85}
      >
        <ThemedText
          style={[
            styles.connectText,
            isConnected ? { color: colors.tint } : { color: colors.background },
          ]}
        >
          {isConnected ? "Connected" : "Connect"}
        </ThemedText>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  rowBody: {
    flex: 1,
    paddingRight: 10,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 6,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
  rolePill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.85,
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  meta: {
    flex: 1,
    fontSize: 12,
    opacity: 0.65,
    marginRight: 10,
  },
  xp: {
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.7,
  },
  bio: {
    fontSize: 13,
    opacity: 0.75,
    lineHeight: 18,
  },
  connectButton: {
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  connectText: {
    fontSize: 12,
    fontWeight: "800",
  },
});
