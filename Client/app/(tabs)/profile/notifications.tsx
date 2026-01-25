import ProfileSubscreenLayout from "@/components/profile/ProfileSubscreenLayout";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchNotificationPreferences,
  patchNotificationPreferences,
  type NotificationPreferences,
} from "@/services/notificationPreferences";
import { syncDailyReminderFromPreferences } from "@/services/localDailyReminder";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

function hhmmToDate(hhmm: string): Date {
  const match = hhmm.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  const hour = match ? Number(match[1]) : 9;
  const minute = match ? Number(match[2]) : 0;
  const d = new Date();
  d.setHours(Number.isFinite(hour) ? hour : 9);
  d.setMinutes(Number.isFinite(minute) ? minute : 0);
  d.setSeconds(0, 0);
  return d;
}

function toHHMM(date: Date): string {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  return `${hh}:${mm}`;
}

function formatHHMMForDisplay(hhmm: string): string {
  const d = hhmmToDate(hhmm);
  try {
    return d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return hhmm;
  }
}

type NativeDateTimePickerComponent = React.ComponentType<{
  mode: "time";
  value: Date;
  onChange: (event: any, selected?: Date) => void;
  display?: "spinner";
}>;

export default function NotificationsScreen() {
  const { user } = useAuth();

  const [NativeDateTimePicker, setNativeDateTimePicker] =
    React.useState<NativeDateTimePickerComponent | null>(null);

  React.useEffect(() => {
    void (async () => {
      try {
        const mod = await import("@react-native-community/datetimepicker");
        setNativeDateTimePicker(() => (mod.default ?? null) as any);
      } catch {
        setNativeDateTimePicker(null);
      }
    })();
  }, []);

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences | null>(
    null,
  );

  const [timePickerVisible, setTimePickerVisible] = React.useState(false);
  const [iosPendingTime, setIosPendingTime] = React.useState<Date>(() =>
    hhmmToDate("09:00"),
  );

  const dailyReminder = prefs?.dailyReminderEnabled ?? true;
  const streakAlerts = prefs?.streakAlertsEnabled ?? true;
  const weeklySummary = prefs?.weeklySummaryEnabled ?? false;
  const achievementUnlocked =
    prefs?.achievementUnlockedNotificationsEnabled ?? true;
  const communityActivity =
    prefs?.communityActivityNotificationsEnabled ?? false;
  const reactivationNudges = prefs?.reactivationNudgesEnabled ?? true;
  const tutorChatMessages = prefs?.tutorChatMessageNotificationsEnabled ?? true;
  const groupMessages = prefs?.groupMessageNotificationsEnabled ?? true;
  const newFollower = prefs?.newFollowerNotificationsEnabled ?? true;
  const dailyReminderTime = prefs?.dailyReminderTime ?? "09:00";

  const loadPrefs = React.useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetchNotificationPreferences({ userId: user.id });
      if (res.success) {
        setPrefs(res.data.preferences);
        void syncDailyReminderFromPreferences({
          dailyReminderEnabled: res.data.preferences.dailyReminderEnabled,
          dailyReminderTime: res.data.preferences.dailyReminderTime,
          requestPermissionIfNeeded: false,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  React.useEffect(() => {
    void loadPrefs();
  }, [loadPrefs]);

  const updatePref = React.useCallback(
    async (patch: Partial<NotificationPreferences>) => {
      if (!user?.id) return;

      setPrefs((prev) => ({
        ...(prev ?? {
          dailyReminderEnabled: true,
          dailyReminderTime: "09:00",
          streakAlertsEnabled: true,
          reactivationNudgesEnabled: true,
          tutorChatMessageNotificationsEnabled: true,
          groupMessageNotificationsEnabled: true,
          newFollowerNotificationsEnabled: true,
          weeklySummaryEnabled: false,
          achievementUnlockedNotificationsEnabled: true,
          communityActivityNotificationsEnabled: false,
        }),
        ...patch,
      }));

      setSaving(true);
      const res = await patchNotificationPreferences({
        userId: user.id,
        patch,
      });
      setSaving(false);

      if (res.success) {
        setPrefs(res.data.preferences);

        const shouldRequestPermission =
          ("dailyReminderEnabled" in patch || "dailyReminderTime" in patch) &&
          res.data.preferences.dailyReminderEnabled;

        void syncDailyReminderFromPreferences({
          dailyReminderEnabled: res.data.preferences.dailyReminderEnabled,
          dailyReminderTime: res.data.preferences.dailyReminderTime,
          requestPermissionIfNeeded: shouldRequestPermission,
        });
        return;
      }

      // Best-effort: reload to reconcile.
      void loadPrefs();
    },
    [loadPrefs, user?.id],
  );

  const openTimePicker = () => {
    if (!NativeDateTimePicker) {
      Alert.alert(
        "Time picker unavailable",
        "This screen uses a native time picker. Rebuild the app (expo run:ios / expo run:android) and restart the dev server.",
      );
      return;
    }
    setIosPendingTime(hhmmToDate(dailyReminderTime));
    setTimePickerVisible(true);
  };

  const onAndroidTimeChange = (event: any, selected?: Date) => {
    if (event.type === "dismissed") {
      setTimePickerVisible(false);
      return;
    }

    setTimePickerVisible(false);
    if (selected) {
      void updatePref({ dailyReminderTime: toHHMM(selected) });
    }
  };

  return (
    <ProfileSubscreenLayout
      title="Notifications"
      subtitle="Manage reminders and learning nudges"
    >
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
          <ThemedText style={styles.loadingText}>
            Loading preferences…
          </ThemedText>
        </View>
      ) : null}

      {/* Learning Reminders */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Learning Reminders</ThemedText>
        <ThemedView style={styles.card}>
          <NotificationRow
            icon="alarm"
            iconColor="#F39C12"
            label="Daily Reminder"
            description="Get reminded to practice every day"
            value={dailyReminder}
            onValueChange={(value) =>
              updatePref({ dailyReminderEnabled: value })
            }
            showDivider
          />
          <NotificationRow
            icon="flame"
            iconColor="#E74C3C"
            label="Streak Protection"
            description="Alert when your streak is at risk"
            value={streakAlerts}
            onValueChange={(value) =>
              updatePref({ streakAlertsEnabled: value })
            }
            showDivider
          />
          <NotificationRow
            icon="time"
            iconColor="#E67E22"
            label="Reactivation Nudges"
            description="Remind you after 3/7/14 days inactive"
            value={reactivationNudges}
            onValueChange={(value) =>
              updatePref({ reactivationNudgesEnabled: value })
            }
          />
        </ThemedView>
        {dailyReminder && (
          <TouchableOpacity
            style={styles.timeButton}
            activeOpacity={0.7}
            onPress={openTimePicker}
          >
            <ThemedText style={styles.timeButtonText}>
              ⏰ Remind me at {formatHHMMForDisplay(dailyReminderTime)}
            </ThemedText>
            <Ionicons name="chevron-forward" size={16} color="#4A90E2" />
          </TouchableOpacity>
        )}

        {dailyReminder ? (
          Platform.OS === "android" ? (
            timePickerVisible ? (
              NativeDateTimePicker ? (
                <NativeDateTimePicker
                  mode="time"
                  value={hhmmToDate(dailyReminderTime)}
                  onChange={onAndroidTimeChange}
                />
              ) : null
            ) : null
          ) : (
            <Modal
              transparent
              visible={timePickerVisible}
              animationType="fade"
              onRequestClose={() => setTimePickerVisible(false)}
            >
              <Pressable
                style={styles.pickerBackdrop}
                onPress={() => setTimePickerVisible(false)}
              />
              <View style={styles.pickerSheetWrap}>
                <ThemedView style={styles.pickerSheet}>
                  <View style={styles.pickerHeader}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.pickerTitle}
                    >
                      Daily reminder time
                    </ThemedText>
                    <Pressable
                      onPress={() => {
                        setTimePickerVisible(false);
                        void updatePref({
                          dailyReminderTime: toHHMM(iosPendingTime),
                        });
                      }}
                      style={({ pressed }) => [
                        styles.pickerDone,
                        pressed && { opacity: 0.7 },
                      ]}
                    >
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.pickerDoneText}
                      >
                        Done
                      </ThemedText>
                    </Pressable>
                  </View>
                  {NativeDateTimePicker ? (
                    <NativeDateTimePicker
                      mode="time"
                      display="spinner"
                      value={iosPendingTime}
                      onChange={(_, selected) => {
                        if (selected) setIosPendingTime(selected);
                      }}
                    />
                  ) : (
                    <View style={styles.pickerFallback}>
                      <ThemedText style={styles.pickerFallbackText}>
                        Time picker requires a rebuilt app.
                      </ThemedText>
                    </View>
                  )}
                </ThemedView>
              </View>
            </Modal>
          )
        ) : null}
      </View>

      {/* Progress Updates */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Progress Updates</ThemedText>
        <ThemedView style={styles.card}>
          <NotificationRow
            icon="trophy"
            iconColor="#F1C40F"
            label="Achievement Unlocked"
            description="Celebrate your milestones"
            value={achievementUnlocked}
            onValueChange={(value) =>
              updatePref({ achievementUnlockedNotificationsEnabled: value })
            }
            showDivider
          />
          <NotificationRow
            icon="stats-chart"
            iconColor="#3498DB"
            label="Weekly Summary"
            description="Review your progress every Sunday"
            value={weeklySummary}
            onValueChange={(value) =>
              updatePref({ weeklySummaryEnabled: value })
            }
          />
        </ThemedView>
      </View>

      {/* Social */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Social</ThemedText>
        <ThemedView style={styles.card}>
          <NotificationRow
            icon="people"
            iconColor="#9B59B6"
            label="Community Activity"
            description="Likes, comments, and replies to your posts"
            value={communityActivity}
            onValueChange={(value) =>
              updatePref({ communityActivityNotificationsEnabled: value })
            }
            showDivider
          />
          <NotificationRow
            icon="person-add"
            iconColor="#8E44AD"
            label="New Followers"
            description="When someone connects with you"
            value={newFollower}
            onValueChange={(value) =>
              updatePref({ newFollowerNotificationsEnabled: value })
            }
          />
        </ThemedView>
      </View>

      {/* Messages */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Messages</ThemedText>
        <ThemedView style={styles.card}>
          <NotificationRow
            icon="chatbubbles"
            iconColor="#2ECC71"
            label="Tutor Chat"
            description="New messages from a tutor"
            value={tutorChatMessages}
            onValueChange={(value) =>
              updatePref({ tutorChatMessageNotificationsEnabled: value })
            }
            showDivider
          />
          <NotificationRow
            icon="chatbox"
            iconColor="#16A085"
            label="Group Messages"
            description="New messages in your groups"
            value={groupMessages}
            onValueChange={(value) =>
              updatePref({ groupMessageNotificationsEnabled: value })
            }
          />
        </ThemedView>
      </View>

      {saving ? (
        <View style={styles.savingWrap}>
          <ThemedText style={styles.savingText}>Saving…</ThemedText>
        </View>
      ) : null}
    </ProfileSubscreenLayout>
  );
}

type NotificationRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  showDivider?: boolean;
};

function NotificationRow({
  icon,
  iconColor,
  label,
  description,
  value,
  onValueChange,
  showDivider,
}: NotificationRowProps) {
  return (
    <View style={[styles.row, showDivider && styles.rowWithDivider]}>
      <View style={[styles.iconBox, { backgroundColor: `${iconColor}20` }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.rowContent}>
        <ThemedText style={styles.rowLabel}>{label}</ThemedText>
        <ThemedText style={styles.rowDescription}>{description}</ThemedText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#767577", true: iconColor }}
        thumbColor="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    opacity: 0.7,
  },
  savingWrap: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  savingText: {
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    opacity: 0.6,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  rowWithDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rowContent: {
    flex: 1,
    marginLeft: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  rowDescription: {
    fontSize: 13,
    opacity: 0.6,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(74, 144, 226, 0.3)",
  },
  timeButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4A90E2",
  },

  pickerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  pickerSheetWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  pickerSheet: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 12,
    overflow: "hidden",
  },
  pickerHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerTitle: {
    fontSize: 15,
  },
  pickerDone: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pickerDoneText: {
    color: "#4A90E2",
  },

  pickerFallback: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: "center",
  },
  pickerFallbackText: {
    opacity: 0.75,
  },
});
