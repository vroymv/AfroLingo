import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationBadge } from "@/contexts/community/NotificationBadgeContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  AppNotification,
  NotificationsSheet,
} from "@/components/home/NotificationsSheet";
import {
  fetchCommunityNotifications,
  markCommunityNotificationRead,
  type ServerNotification,
} from "@/services/communityNotifications";

const formatTimeLabel = (date: Date): string => {
  const now = Date.now();
  const diffMs = now - date.getTime();
  if (diffMs < 60_000) return "Just now";
  if (diffMs < 60 * 60_000)
    return `${Math.max(1, Math.floor(diffMs / 60_000))}m`;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  if (date.getTime() >= startOfToday.getTime()) return "Today";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const toAppNotification = (n: ServerNotification): AppNotification => {
  const createdAt = new Date(n.createdAt);
  const read = Boolean(n.readAt);

  if (n.type === "GROUP_INVITE") {
    const invitedByName = String(n.data?.invitedByName ?? "Someone");
    const groupName = String(n.data?.groupName ?? "a group");
    const inviteId =
      typeof n.data?.inviteId === "string" ? n.data.inviteId : "";
    return {
      id: n.id,
      title: "Group invite",
      body: `${invitedByName} invited you to ${groupName}.`,
      timeLabel: formatTimeLabel(createdAt),
      read,
      href: inviteId
        ? `/community/groups/invites?inviteId=${inviteId}`
        : "/community/groups/invites",
    };
  }

  if (n.type === "GROUP_MESSAGE") {
    const preview = typeof n.data?.preview === "string" ? n.data.preview : "";
    const groupId = typeof n.data?.groupId === "string" ? n.data.groupId : "";
    return {
      id: n.id,
      title: "New group message",
      body: preview.trim().length ? preview : "You have a new message.",
      timeLabel: formatTimeLabel(createdAt),
      read,
      href: groupId ? `/community/groups/${groupId}` : undefined,
    };
  }

  return {
    id: n.id,
    title: "Update",
    body: "You have a new notification.",
    timeLabel: formatTimeLabel(createdAt),
    read,
  };
};

interface HeaderSectionProps {
  selectedLanguage: string | null;
}

export default function HeaderSection({
  selectedLanguage,
}: HeaderSectionProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const { user } = useAuth();
  const { unreadCount, refreshUnreadCount, socket } = useNotificationBadge();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState<string | null>(
    null,
  );

  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;
    setNotificationsLoading(true);
    setNotificationsError(null);
    try {
      const res = await fetchCommunityNotifications({
        userId: user.id,
        limit: 50,
      });
      if (!res.success) {
        setNotifications([]);
        setNotificationsError(res.message || "Failed to load notifications");
        return;
      }
      setNotifications(res.data.notifications.map(toAppNotification));
    } catch (e: any) {
      setNotifications([]);
      setNotificationsError(e?.message || "Failed to load notifications");
    } finally {
      setNotificationsLoading(false);
    }
  }, [user?.id]);

  // If a notification arrives while the sheet is open, refresh the list.
  useEffect(() => {
    if (!socket) return;

    const onNew = () => {
      if (!notificationsOpen) return;
      void loadNotifications();
    };

    socket.on("notification:new", onNew);
    return () => {
      socket.off("notification:new", onNew);
    };
  }, [loadNotifications, notificationsOpen, socket]);

  const getGreeting = () => {
    const hour = new Date().getHours();

    // Get greeting in selected language with cultural flair
    const getLocalizedGreeting = () => {
      if (hour < 12) {
        switch (selectedLanguage) {
          case "sw":
            return "Habari za asubuhi"; // Good morning
          case "zu":
            return "Sawubona"; // Hello/Good morning
          case "ln":
            return "Mbote na ntongo"; // Good morning
          default:
            return "Good morning";
        }
      } else if (hour < 17) {
        switch (selectedLanguage) {
          case "sw":
            return "Habari za mchana"; // Good afternoon
          case "zu":
            return "Sawubona"; // Hello
          case "ln":
            return "Mbote na pokwa"; // Good afternoon
          default:
            return "Good afternoon";
        }
      } else {
        switch (selectedLanguage) {
          case "sw":
            return "Habari za jioni"; // Good evening
          case "zu":
            return "Sawubona"; // Hello
          case "ln":
            return "Mbote na mpokwa"; // Good evening
          default:
            return "Good evening";
        }
      }
    };

    return getLocalizedGreeting();
  };

  const getMotivationalPhrase = () => {
    const phrases = [
      "Keep your heritage alive today! 🌍",
      "Every word connects you to your roots ✨",
      "Your ancestors' wisdom flows through language 🌳",
      "Today, speak the language of your heart 💛",
      "Culture lives in every conversation 🗣️",
      "Honor your heritage, one lesson at a time 👑",
    ];

    // Rotate based on day of year to keep it fresh
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000,
    );
    return phrases[dayOfYear % phrases.length];
  };

  const markRead = async (id: string) => {
    if (!user?.id) return;

    // Optimistic UI
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

    const res = await markCommunityNotificationRead({
      userId: user.id,
      notificationId: id,
    });

    if (!res.success) {
      // Best-effort: re-fetch to reconcile.
      void loadNotifications();
      return;
    }

    void refreshUnreadCount();
  };

  const markAllRead = async () => {
    if (!user?.id) return;

    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    // Optimistic UI
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    await Promise.all(
      unreadIds.map((id) =>
        markCommunityNotificationRead({ userId: user.id, notificationId: id }),
      ),
    );

    void refreshUnreadCount();
  };

  const onPressNotification = (n: AppNotification) => {
    markRead(n.id);
    setNotificationsOpen(false);
    if (n.href) {
      router.push(n.href as any);
    }
  };

  return (
    <ThemedView style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.greeting}>
            {getGreeting()}, {user?.name?.trim() ? user.name.trim() : "there"}!
          </ThemedText>
          <ThemedText style={styles.motivationalPhrase}>
            {getMotivationalPhrase()}
          </ThemedText>
        </View>

        <TouchableOpacity
          onPress={() => {
            setNotificationsOpen(true);
            void loadNotifications();
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Open notifications"
          style={[
            styles.notificationButton,
            { backgroundColor: `${colors.icon}10` },
          ]}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={colors.text}
          />
          {unreadCount > 0 ? (
            <View style={[styles.badgeDot, { backgroundColor: colors.text }]} />
          ) : null}
        </TouchableOpacity>
      </View>

      <NotificationsSheet
        visible={notificationsOpen}
        notifications={notifications}
        loading={notificationsLoading}
        error={notificationsError}
        onRetry={loadNotifications}
        onClose={() => setNotificationsOpen(false)}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
        onPressNotification={onPressNotification}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 16,
    // backgroundColor: "black",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  motivationalPhrase: {
    fontSize: 16,
    opacity: 0.8,
    fontStyle: "italic",
    lineHeight: 22,
  },
  languageFlag: {
    fontSize: 22,
  },

  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    opacity: 0.9,
  },
  badgeDot: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    opacity: 0.9,
  },
});
