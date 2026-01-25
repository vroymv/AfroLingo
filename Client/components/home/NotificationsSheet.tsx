import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  timeLabel: string;
  read: boolean;
  href?: string;
};

export function NotificationsSheet({
  visible,
  notifications,
  loading,
  error,
  onRetry,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onPressNotification,
}: {
  visible: boolean;
  notifications: AppNotification[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onPressNotification?: (notification: AppNotification) => void;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const translateY = useRef(new Animated.Value(0)).current;

  const sheetHeight = 520;

  useEffect(() => {
    if (!visible) return;
    translateY.setValue(sheetHeight);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [sheetHeight, translateY, visible]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const closeWithAnimation = () => {
    Animated.timing(translateY, {
      toValue: sheetHeight,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onClose();
    });
  };

  const renderItem = ({ item }: { item: AppNotification }) => {
    const handlePress = () => {
      if (onPressNotification) {
        onPressNotification(item);
        return;
      }
      onMarkRead(item.id);
    };

    return (
      <Swipeable
        overshootRight={false}
        renderRightActions={() => (
          <Pressable
            onPress={() => onMarkRead(item.id)}
            style={[
              styles.swipeAction,
              { backgroundColor: `${colors.icon}12` },
            ]}
          >
            <ThemedText
              style={[styles.swipeActionText, { color: colors.text }]}
              type="defaultSemiBold"
            >
              Mark read
            </ThemedText>
          </Pressable>
        )}
        onSwipeableOpen={() => onMarkRead(item.id)}
      >
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [
            styles.rowPress,
            pressed && { opacity: 0.7 },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                borderBottomColor: `${colors.icon}12`,
              },
            ]}
          >
            <View style={styles.rowBody}>
              <View style={styles.rowTitleLine}>
                <ThemedText
                  type="defaultSemiBold"
                  style={[styles.rowTitle, item.read && { opacity: 0.75 }]}
                >
                  {item.title}
                </ThemedText>
                {!item.read ? (
                  <View
                    style={[styles.unreadDot, { backgroundColor: colors.text }]}
                  />
                ) : null}
              </View>
              <ThemedText style={styles.rowBodyText}>{item.body}</ThemedText>
              <ThemedText style={styles.rowTime}>{item.timeLabel}</ThemedText>
            </View>
          </View>
        </Pressable>
      </Swipeable>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeWithAnimation}
    >
      <Pressable style={styles.backdrop} onPress={closeWithAnimation} />

      <Animated.View
        style={[
          styles.sheetWrap,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <ThemedView
          style={[
            styles.sheet,
            {
              borderTopColor: `${colors.icon}18`,
            },
          ]}
        >
          <View style={styles.grabber}>
            <View
              style={[
                styles.grabberBar,
                { backgroundColor: `${colors.icon}35` },
              ]}
            />
          </View>

          <View style={styles.sheetHeader}>
            <ThemedText type="defaultSemiBold" style={styles.sheetTitle}>
              Notifications
            </ThemedText>
            <Pressable
              onPress={unreadCount ? onMarkAllRead : undefined}
              style={({ pressed }) => [
                styles.headerAction,
                pressed && unreadCount ? { opacity: 0.7 } : null,
                !unreadCount ? { opacity: 0.35 } : null,
              ]}
            >
              <ThemedText type="default" style={styles.headerActionText}>
                Mark all read
              </ThemedText>
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.empty}>
              <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
                Loading…
              </ThemedText>
              <ThemedText style={styles.emptyBody}>
                Fetching your latest notifications.
              </ThemedText>
            </View>
          ) : error ? (
            <View style={styles.empty}>
              <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
                Couldn’t load notifications
              </ThemedText>
              <ThemedText style={styles.emptyBody}>{error}</ThemedText>
              {onRetry ? (
                <Pressable
                  onPress={onRetry}
                  style={({ pressed }) => [
                    styles.retryCta,
                    {
                      backgroundColor: `${colors.icon}12`,
                      borderColor: `${colors.icon}18`,
                    },
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.retryCtaText}
                  >
                    Retry
                  </ThemedText>
                </Pressable>
              ) : null}
            </View>
          ) : notifications.length === 0 ? (
            <View style={styles.empty}>
              <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
                You’re all caught up
              </ThemedText>
              <ThemedText style={styles.emptyBody}>
                New updates will show up here.
              </ThemedText>
            </View>
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={(n) => n.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}

          <Pressable
            onPress={closeWithAnimation}
            style={({ pressed }) => [
              styles.closeCta,
              {
                backgroundColor: `${colors.icon}12`,
                borderColor: `${colors.icon}18`,
              },
              pressed && { opacity: 0.75 },
            ]}
          >
            <ThemedText type="defaultSemiBold" style={styles.closeCtaText}>
              Close
            </ThemedText>
          </Pressable>
        </ThemedView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheetWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1,
    paddingBottom: 14,
    maxHeight: 520,
  },
  grabber: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 6,
  },
  grabberBar: {
    width: 44,
    height: 5,
    borderRadius: 999,
  },
  sheetHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sheetTitle: {
    fontSize: 16,
  },
  headerAction: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  headerActionText: {
    fontSize: 13,
    opacity: 0.9,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  rowPress: {
    borderRadius: 12,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  rowBody: {
    gap: 3,
  },
  rowTitleLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  rowTitle: {
    fontSize: 14,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.9,
  },
  rowBodyText: {
    fontSize: 13,
    opacity: 0.75,
    lineHeight: 18,
  },
  rowTime: {
    fontSize: 12,
    opacity: 0.55,
  },
  swipeAction: {
    width: 110,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginVertical: 4,
    marginRight: 16,
  },
  swipeActionText: {
    fontSize: 12,
  },
  empty: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
  },
  emptyBody: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: "center",
  },
  closeCta: {
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  closeCtaText: {
    fontSize: 14,
  },

  retryCta: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  retryCtaText: {
    fontSize: 14,
  },
});
