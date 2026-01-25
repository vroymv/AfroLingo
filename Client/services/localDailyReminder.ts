import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import type { NotificationTriggerInput } from "expo-notifications";

type ExpoNotifications = typeof import("expo-notifications");

async function getNotificationsModule(): Promise<ExpoNotifications | null> {
  try {
    return (await import("expo-notifications")) as ExpoNotifications;
  } catch (e) {
    console.warn(
      "[localDailyReminder] expo-notifications not available (rebuild dev client if needed)",
      e,
    );
    return null;
  }
}

const STORAGE_KEY = "localNotifications:dailyReminder:v1";

type StoredSchedule = {
  id: string;
  time: string; // HH:mm
};

function parseHHMM(hhmm: string): { hour: number; minute: number } | null {
  const match = hhmm.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  return { hour, minute };
}

async function getStored(): Promise<StoredSchedule | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredSchedule>;
    if (typeof parsed.id !== "string" || typeof parsed.time !== "string") {
      return null;
    }
    return { id: parsed.id, time: parsed.time };
  } catch {
    return null;
  }
}

async function setStored(next: StoredSchedule | null): Promise<void> {
  if (!next) {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return;
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;

  const Notifications = await getNotificationsModule();
  if (!Notifications) return;

  await Notifications.setNotificationChannelAsync("daily-reminder", {
    name: "Daily Reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: "default",
    vibrationPattern: [0, 250],
    lightColor: "#4A90E2",
  });
}

export async function ensureNotificationPermissions(): Promise<boolean> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return false;

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  return false;
}

export async function cancelDailyReminder(): Promise<void> {
  const stored = await getStored();
  if (stored?.id) {
    try {
      const Notifications = await getNotificationsModule();
      if (Notifications) {
        await Notifications.cancelScheduledNotificationAsync(stored.id);
      }
    } catch {
      // Best-effort.
    }
  }
  await setStored(null);
}

export async function scheduleDailyReminder(params: {
  time: string; // HH:mm
  requestPermissionIfNeeded?: boolean;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  const { time, requestPermissionIfNeeded = true } = params;

  const Notifications = await getNotificationsModule();
  if (!Notifications) {
    return {
      ok: false,
      reason:
        "Local notifications module not available (rebuild the dev client and restart)",
    };
  }

  const parsed = parseHHMM(time);
  if (!parsed) {
    return { ok: false, reason: "Invalid time format (expected HH:mm)" };
  }

  const current = await Notifications.getPermissionsAsync();
  if (!current.granted) {
    if (!requestPermissionIfNeeded) {
      return { ok: false, reason: "Notification permissions not granted" };
    }

    const requested = await Notifications.requestPermissionsAsync();
    if (!requested.granted) {
      return { ok: false, reason: "Notification permissions not granted" };
    }
  }

  await ensureAndroidChannel();

  const stored = await getStored();
  if (stored?.id && stored.time === time) {
    return { ok: true };
  }

  // Reschedule from scratch (simpler + avoids drift).
  await cancelDailyReminder();

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to practice",
      body: "Do a quick lesson today and keep your streak alive.",
      sound: "default",
      data: {
        kind: "DAILY_REMINDER",
      },
    },
    trigger: {
      hour: parsed.hour,
      minute: parsed.minute,
      repeats: true,
      channelId: Platform.OS === "android" ? "daily-reminder" : undefined,
    } as NotificationTriggerInput,
  });

  await setStored({ id, time });
  return { ok: true };
}

export async function syncDailyReminderFromPreferences(prefs: {
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  requestPermissionIfNeeded?: boolean;
}): Promise<void> {
  if (!prefs.dailyReminderEnabled) {
    await cancelDailyReminder();
    return;
  }

  await scheduleDailyReminder({
    time: prefs.dailyReminderTime,
    requestPermissionIfNeeded: prefs.requestPermissionIfNeeded,
  });
}
