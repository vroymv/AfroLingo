import { Stack } from "expo-router";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function OnboardingLayout() {
  const { state } = useOnboarding();
  console.log("Onboarding context data:", state);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen name="welcome/index" />
      <Stack.Screen name="language-selection" />
      <Stack.Screen name="choose-path" />
      <Stack.Screen name="level-selection" />
      <Stack.Screen name="placement-test" />
      <Stack.Screen name="personalization" />
      <Stack.Screen name="setup-loading" />
    </Stack>
  );
}
