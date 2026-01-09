import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState, type AppStateStatus } from "react-native";
import { io, type Socket } from "socket.io-client";

import { useAuth } from "@/contexts/AuthContext";

type NotificationBadgeContextValue = {
  unreadCount: number;
  isSocketConnected: boolean;
  socket: Socket | null;
  refreshUnreadCount: () => Promise<void>;
};

const NotificationBadgeContext =
  createContext<NotificationBadgeContextValue | null>(null);

function requireApiBaseUrl(): string {
  const base = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (!base) {
    throw new Error(
      "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in env."
    );
  }
  return base;
}

function socketUrlFromApiBaseUrl(apiBaseUrl: string): string {
  // Server mounts HTTP at /api/*, but socket.io is on the server root.
  // Example: http://localhost:3000/api -> http://localhost:3000
  return apiBaseUrl.replace(/\/api\/?$/i, "");
}

async function fetchUnreadCount(params: {
  userId: string;
  token: string;
}): Promise<number> {
  const baseUrl = requireApiBaseUrl();

  const res = await fetch(
    `${baseUrl}/community/notifications/${params.userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    }
  );

  const json = await res
    .json()
    .catch(() => ({ success: false, data: { unreadCount: 0 } }));

  if (!res.ok || json?.success === false) {
    return 0;
  }

  const count = Number(json?.data?.unreadCount);
  return Number.isFinite(count) ? count : 0;
}

export function NotificationBadgeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, isAuthenticated } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const socketRef = useRef<Socket | null>(null);

  const lastNotificationIdsRef = useRef<Set<string>>(new Set());

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated || !user?.id || !token) return;

    try {
      const count = await fetchUnreadCount({
        userId: user.id,
        token,
      });
      setUnreadCount(count);
    } catch {
      // best-effort
    }
  }, [isAuthenticated, token, user?.id]);

  const disconnectSocket = useCallback(() => {
    const existing = socketRef.current;
    if (existing) {
      existing.removeAllListeners();
      existing.disconnect();
    }
    socketRef.current = null;
    setSocket(null);
    setIsSocketConnected(false);
  }, []);

  const connectSocket = useCallback(() => {
    if (!isAuthenticated || !user?.id || !token) return;

    // Avoid creating multiple sockets if this runs twice.
    if (socketRef.current) return;

    const apiBaseUrl = requireApiBaseUrl();
    const socketUrl = socketUrlFromApiBaseUrl(apiBaseUrl);

    const socket = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: false,
      auth: {
        token,
      },
    });

    socketRef.current = socket;

    setSocket(socket);

    socket.on("connect", () => {
      setIsSocketConnected(true);
    });

    socket.on("disconnect", () => {
      setIsSocketConnected(false);
    });

    socket.on("notification:new", (payload: any) => {
      const id = payload?.notification?.id;
      if (typeof id === "string" && id.length > 0) {
        if (lastNotificationIdsRef.current.has(id)) return;
        lastNotificationIdsRef.current.add(id);
        // Keep the set bounded.
        if (lastNotificationIdsRef.current.size > 200) {
          lastNotificationIdsRef.current = new Set(
            Array.from(lastNotificationIdsRef.current).slice(-100)
          );
        }
      }

      // Optimistic bump, then reconcile via API.
      setUnreadCount((prev) => prev + 1);
      void refreshUnreadCount();
    });

    socket.connect();
  }, [isAuthenticated, refreshUnreadCount, token, user?.id]);

  // Initial fetch + socket lifecycle
  useEffect(() => {
    // Reset state on logout
    if (!isAuthenticated || !user?.id || !token) {
      disconnectSocket();
      setUnreadCount(0);
      lastNotificationIdsRef.current.clear();
      return;
    }

    void refreshUnreadCount();

    // Reconnect with new token/user
    disconnectSocket();
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, [
    connectSocket,
    disconnectSocket,
    isAuthenticated,
    refreshUnreadCount,
    token,
    user?.id,
  ]);

  // Refresh when app returns to foreground.
  useEffect(() => {
    const onChange = (state: AppStateStatus) => {
      if (state === "active") {
        void refreshUnreadCount();
      }
    };

    const sub = AppState.addEventListener("change", onChange);
    return () => sub.remove();
  }, [refreshUnreadCount]);

  const value = useMemo(
    () => ({ unreadCount, isSocketConnected, socket, refreshUnreadCount }),
    [unreadCount, isSocketConnected, socket, refreshUnreadCount]
  );

  return (
    <NotificationBadgeContext.Provider value={value}>
      {children}
    </NotificationBadgeContext.Provider>
  );
}

export function useNotificationBadge() {
  const ctx = useContext(NotificationBadgeContext);
  if (!ctx) {
    throw new Error(
      "useNotificationBadge must be used within NotificationBadgeProvider"
    );
  }
  return ctx;
}
