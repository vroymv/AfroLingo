import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { Platform } from "react-native";
import { ENV } from "../config/env";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  emailVerified?: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to convert Firebase user to our User type
const convertFirebaseUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    name:
      firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
    avatar: firebaseUser.photoURL || undefined,
    createdAt: firebaseUser.metadata.creationTime
      ? new Date(firebaseUser.metadata.creationTime)
      : new Date(),
    emailVerified: firebaseUser.emailVerified,
  };
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    token: null,
    error: null,
  });

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const user = convertFirebaseUser(firebaseUser);
        const token = await firebaseUser.getIdToken();

        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        // User is signed out
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = convertFirebaseUser(userCredential.user);
      const token = await userCredential.user.getIdToken();

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      // Determine user-friendly error message
      let errorMessage = "Login failed. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password";
      }

      // Update state with error - keep user logged out
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });

      throw new Error(errorMessage);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Create user account in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name in Firebase
      await firebaseUpdateProfile(userCredential.user, {
        displayName: name,
      });

      // Send email verification
      try {
        await sendEmailVerification(userCredential.user);
        console.log("Verification email sent successfully");
      } catch (verificationError) {
        console.warn("Failed to send verification email:", verificationError);
        // Don't throw here - account creation was successful
      }

      const user = convertFirebaseUser(userCredential.user);
      const token = await userCredential.user.getIdToken();

      // Send user data to your backend
      try {
        const response = await fetch(ENV.API_ENDPOINTS.USERS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firebaseUid: userCredential.user.uid,
            email: userCredential.user.email,
            name: name,
            createdAt: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          console.warn("Failed to sync user with backend:", response.status);
        }
      } catch (backendError) {
        console.warn("Backend sync error:", backendError);
      }

      setState({
        user: { ...user, name },
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      // Determine user-friendly error message
      let errorMessage = "Signup failed. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters";
      }

      // Update state with error - keep user logged out
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });

      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      await signOut(auth);

      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || "Logout failed. Please try again.";
      setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        throw new Error("No account found with this email");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address");
      } else {
        throw new Error("Failed to send reset email. Please try again.");
      }
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!auth.currentUser) throw new Error("No user logged in");

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Update Firebase profile
      const profileUpdates: any = {};
      if (updates.name) profileUpdates.displayName = updates.name;
      if (updates.avatar) profileUpdates.photoURL = updates.avatar;

      await firebaseUpdateProfile(auth.currentUser, profileUpdates);

      const updatedUser = { ...state.user!, ...updates };

      setState((prev) => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to update profile. Please try again.";
      setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const provider = new GoogleAuthProvider();

      // Use popup for web, redirect for mobile
      let userCredential;
      if (Platform.OS === "web") {
        userCredential = await signInWithPopup(auth, provider);
      } else {
        // For React Native, we'll need to implement this differently
        // For now, use redirect which works on web
        await signInWithRedirect(auth, provider);
        // The result will be handled by onAuthStateChanged
        return;
      }

      const user = convertFirebaseUser(userCredential.user);
      const token = await userCredential.user.getIdToken();

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      // Determine user-friendly error message
      let errorMessage = "Google sign in failed. Please try again.";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign in was cancelled";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup was blocked. Please allow popups for this site.";
      }

      // Update state with error - keep user logged out
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });

      throw new Error(errorMessage);
    }
  };

  const loginWithApple = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Apple Sign In will be implemented when you get Apple Developer account
      // For now, show a message
      const errorMessage =
        "Apple Sign In requires an Apple Developer account. Coming soon!";

      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });

      throw new Error(errorMessage);
    } catch (error) {
      // Ensure state is properly set even if error is re-thrown
      if (state.isLoading) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "An error occurred",
        }));
      }
      throw error;
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const sendVerificationEmail = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user is currently signed in");
      }

      if (currentUser.emailVerified) {
        throw new Error("Email is already verified");
      }

      await sendEmailVerification(currentUser);
      console.log("Verification email sent successfully");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to send verification email";
      setState((prev) => ({ ...prev, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    loginWithGoogle,
    loginWithApple,
    logout,
    resetPassword,
    sendVerificationEmail,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
