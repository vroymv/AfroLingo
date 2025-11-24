import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";

import { LoadingScreen } from "@/components/LoadingScreen";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import {
  OnboardingProvider,
  useOnboarding,
} from "@/contexts/OnboardingContext";
import { useColorScheme } from "@/hooks/useColorScheme";

// Inner component that consumes Auth/Onboarding contexts (must be inside providers)
function AppNavigator() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { state: onboardingState, isLoading: onboardingLoading } =
    useOnboarding();

  // Show loading while checking auth or onboarding state
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
        name="learn/lesson/[lessonId]"
        options={{ headerShown: true }}
      />
    </Stack>
  );
}

// Consolidated navigation & gating logic to avoid dual stacks + perpetual Redirect loop
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <AuthProvider>
      <OnboardingProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <AppNavigator />
        </ThemeProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}
