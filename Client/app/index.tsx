import { Redirect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function Index() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { state: onboardingState, isLoading: onboardingLoading } =
    useOnboarding();

  if (authLoading || onboardingLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!onboardingState.isCompleted) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}
