import React, { createContext, ReactNode, useContext, useReducer } from "react";

interface OnboardingState {
  isCompleted: boolean;
  currentStep: number;
  selectedLanguage: string | null;
  selectedLevel: string | null;
  placementTestScore: number | null;
  personalization: {
    reasons: string[];
    timeCommitment: string;
  } | null;
}

interface OnboardingAction {
  type:
    | "SET_LANGUAGE"
    | "SET_LEVEL"
    | "SET_PLACEMENT_SCORE"
    | "SET_PERSONALIZATION"
    | "SET_CURRENT_STEP"
    | "COMPLETE_ONBOARDING"
    | "RESET";
  payload?: any;
}

const initialState: OnboardingState = {
  isCompleted: false,
  currentStep: 1,
  selectedLanguage: null,
  selectedLevel: null,
  placementTestScore: null,
  personalization: null,
};

const OnboardingContext = createContext<{
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
} | null>(null);

function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState {
  switch (action.type) {
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
    default:
      return state;
  }
}

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  return (
    <OnboardingContext.Provider value={{ state, dispatch }}>
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
