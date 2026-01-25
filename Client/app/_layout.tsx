import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import React from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { LoadingScreen } from "@/components/LoadingScreen";
import { AppLifecycleReporter } from "@/components/AppLifecycleReporter";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { GroupsProvider } from "@/contexts/community/GroupsContext";
import { NotificationBadgeProvider } from "@/contexts/community/NotificationBadgeContext";
import {
  OnboardingProvider,
  useOnboarding,
} from "@/contexts/OnboardingContext";
import { useColorScheme } from "@/hooks/useColorScheme";

function AppNavigator() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { state: onboardingState, isLoading: onboardingLoading } =
    useOnboarding();

  if (authLoading || onboardingLoading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>
    );
  }

  if (!onboardingState.isCompleted) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="learn/lesson/[unitId]"
        options={{ headerShown: true }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  React.useEffect(() => {
    // Local notifications only (no push). Kept behind a dynamic import so dev builds
    // without the native module won't crash at startup.
    void (async () => {
      try {
        const Notifications = await import("expo-notifications");
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
          }),
        });
      } catch (e) {
        console.warn(
          "[notifications] expo-notifications not available (rebuild dev client if needed)",
          e,
        );
      }
    })();
  }, []);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <OnboardingProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <AppLifecycleReporter />
            <NotificationBadgeProvider>
              <GroupsProvider>
                <AppNavigator />
              </GroupsProvider>
            </NotificationBadgeProvider>
          </ThemeProvider>
        </OnboardingProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
