import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";

import { LessonProgressProvider } from "@/contexts/LessonProgressContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { UserProgressProvider } from "@/contexts/UserProgressContext";
import { useColorScheme } from "@/hooks/useColorScheme";

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
    <OnboardingProvider>
      <UserProgressProvider>
        <LessonProgressProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="learn/lesson/[lessonId]"
                options={{ headerShown: true }}
              />
            </Stack>
          </ThemeProvider>
        </LessonProgressProvider>
      </UserProgressProvider>
    </OnboardingProvider>
  );
}
