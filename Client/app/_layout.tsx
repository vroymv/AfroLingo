import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
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
