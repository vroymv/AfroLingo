import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { recordAppClose, recordAppOpen } from "@/services/appUsage";

export function AppLifecycleReporter() {
  const { user, isAuthenticated } = useAuth();
  const lastStateRef = useRef<AppStateStatus>(AppState.currentState);
  const didSendInitialOpenRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    if (didSendInitialOpenRef.current) return;

    didSendInitialOpenRef.current = true;
    void recordAppOpen(user.id);
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const subscription = AppState.addEventListener("change", (nextState) => {
      const prevState = lastStateRef.current;
      lastStateRef.current = nextState;

      // Active -> background/inactive
      if (prevState === "active" && nextState !== "active") {
        void recordAppClose(user.id);
      }

      // background/inactive -> active
      if (prevState !== "active" && nextState === "active") {
        void recordAppOpen(user.id);
      }
    });

    return () => subscription.remove();
  }, [isAuthenticated, user?.id]);

  return null;
}
