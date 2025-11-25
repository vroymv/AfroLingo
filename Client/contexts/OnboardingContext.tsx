import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import {
  OnboardingState,
  OnboardingAction,
  OnboardingContextType,
  OnboardingProviderProps,
} from "@/types/contexts";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

const initialState: OnboardingState = {
  isCompleted: false,
  currentStep: 1,
  selectedLanguage: null,
  selectedLevel: null,
  placementTestScore: null,
  personalization: null,
  userId: null,
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState {
  switch (action.type) {
    case "LOAD_STATE":
      return action.payload || initialState;
    case "SET_LANGUAGE":
      return { ...state, selectedLanguage: action.payload };
    case "SET_LEVEL":
      return { ...state, selectedLevel: action.payload };
    case "SET_PLACEMENT_SCORE":
      return { ...state, placementTestScore: action.payload };
    case "SET_PERSONALIZATION":
      return { ...state, personalization: action.payload };
    case "SET_CURRENT_STEP":
      return { ...state, currentStep: action.payload };
    case "COMPLETE_ONBOARDING":
      return { ...state, isCompleted: true };
    case "RESET":
      return initialState;
    case "SET_USER_ID":
      return { ...state, userId: action.payload };
    default:
      return state;
  }
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(onboardingReducer, {
    ...initialState,
    userId: user?.id || null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Set userId in state when user changes
  useEffect(() => {
    if (user?.id && state.userId !== user.id) {
      dispatch({ type: "SET_USER_ID", payload: user.id });
    }
  }, [user?.id, state.userId]);

  // Fetch onboarding state from backend when userId changes
  useEffect(() => {
    const fetchOnboardingState = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/onboarding/${user.id}`);
        if (!response.ok) throw new Error("Failed to fetch onboarding state");
        const result = await response.json();
        console.log("Fetched onboarding state:", result);
        if (result.success && result.data) {
          // Compose onboarding state from API response
          dispatch({
            type: "LOAD_STATE",
            payload: {
              ...initialState,
              ...result.data,
              userId: user.id,
              currentStep: 1, // Optionally set to 1 or infer from data
            },
          });
        }
      } catch (error) {
        console.error("error occurred while fetching onboarding state", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOnboardingState();
  }, [user?.id]);

  // Save onboarding data to backend when completed
  useEffect(() => {
    if (state.isCompleted) {
      const saveOnboardingData = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/onboarding/${state.userId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                selectedLanguage: state.selectedLanguage,
                selectedLevel: state.selectedLevel,
                placementTestScore: state.placementTestScore,
                personalization: state.personalization,
                currentStep: state.currentStep,
              }),
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (error) {
          console.error("Failed to save onboarding data:", error);
        }
      };
      saveOnboardingData();
    }
  }, [
    state.isCompleted,
    state.userId,
    state.selectedLanguage,
    state.selectedLevel,
    state.placementTestScore,
    state.personalization,
    state.currentStep,
  ]);

  return (
    <OnboardingContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}

// Helper hooks for specific actions
export function useOnboardingActions() {
  const { dispatch } = useOnboarding();

  return {
    setLanguage: (language: string) =>
      dispatch({ type: "SET_LANGUAGE", payload: language }),
    setLevel: (level: string) =>
      dispatch({ type: "SET_LEVEL", payload: level }),
    setPlacementScore: (score: number) =>
      dispatch({ type: "SET_PLACEMENT_SCORE", payload: score }),
    setCurrentStep: (step: number) =>
      dispatch({ type: "SET_CURRENT_STEP", payload: step }),
    completeOnboarding: () => dispatch({ type: "COMPLETE_ONBOARDING" }),
    resetOnboarding: () => dispatch({ type: "RESET" }),
  };
}
