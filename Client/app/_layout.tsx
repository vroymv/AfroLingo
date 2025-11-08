import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Redirect, Stack } from "expo-router";
import "react-native-reanimated";

import { LoadingScreen } from "@/components/LoadingScreen";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LessonProgressProvider } from "@/contexts/LessonProgressContext";
import {
  OnboardingProvider,
  useOnboarding,
} from "@/contexts/OnboardingContext";
import { UserProgressProvider } from "@/contexts/UserProgressContext";
import { useColorScheme } from "@/hooks/useColorScheme";

function RootNavigator() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { state: onboardingState } = useOnboarding();

  // Show loading screen while checking auth state
  if (authLoading) {
    return <LoadingScreen />;
  }

  // Not authenticated - redirect to auth screens
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Authenticated but onboarding not complete - redirect to onboarding
  if (!onboardingState.isCompleted) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  // Authenticated and onboarding complete - show main app
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="learn/lesson/[lessonId]"
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

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <OnboardingProvider>
        <UserProgressProvider>
          <LessonProgressProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(onboarding)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                  name="learn/lesson/[lessonId]"
                  options={{ headerShown: true }}
                />
              </Stack>
              <RootNavigator />
            </ThemeProvider>
          </LessonProgressProvider>
        </UserProgressProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}
