import { Redirect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function Index() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { state: onboardingState, isLoading: onboardingLoading } =
    useOnboarding();

  // Show loading while checking auth or onboarding state
  if (authLoading || onboardingLoading) {
    return <LoadingScreen />;
  }

  // Not authenticated - go to login
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Authenticated but onboarding not completed
  if (!onboardingState.isCompleted) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  // Authenticated and onboarding completed - go to main app
  return <Redirect href="/(tabs)" />;
}
