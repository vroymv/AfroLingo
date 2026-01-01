import { Stack } from "expo-router";

export default function OnboardingLayout() {
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
