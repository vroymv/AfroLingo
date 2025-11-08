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
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
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
  };
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    token: null,
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
        });
      } else {
        // User is signed out
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("[Auth] login userCredential", userCredential);
      const user = convertFirebaseUser(userCredential.user);
      const token = await userCredential.user.getIdToken();

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false }));

      // Provide user-friendly error messages
      if (error.code === "auth/user-not-found") {
        throw new Error("No account found with this email");
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Incorrect password");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address");
      } else if (error.code === "auth/user-disabled") {
        throw new Error("This account has been disabled");
      } else {
        throw new Error("Login failed. Please try again.");
      }
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Create user account in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("[Auth] signup userCredential", userCredential);

      // Update display name in Firebase
      await firebaseUpdateProfile(userCredential.user, {
        displayName: name,
      });

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
          // Don't throw error - Firebase user is already created
          // Backend sync can be retried later
        }
      } catch (backendError) {
        console.warn("Backend sync error:", backendError);
        // Don't throw error - Firebase user is already created
      }

      setState({
        user: { ...user, name }, // Use the provided name
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false }));

      // Provide user-friendly error messages
      if (error.code === "auth/email-already-in-use") {
        throw new Error("An account with this email already exists");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address");
      } else if (error.code === "auth/weak-password") {
        throw new Error("Password should be at least 6 characters");
      } else {
        throw new Error("Signup failed. Please try again.");
      }
    }
  };

  const logout = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      await signOut(auth);

      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw new Error(error.message || "Logout failed. Please try again.");
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

      setState((prev) => ({ ...prev, isLoading: true }));

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
      }));
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw new Error(
        error.message || "Failed to update profile. Please try again."
      );
    }
  };

  const loginWithGoogle = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const provider = new GoogleAuthProvider();

      // Use popup for web, redirect for mobile
      let userCredential;
      if (Platform.OS === "web") {
        userCredential = await signInWithPopup(auth, provider);
        console.log("[Auth] google login userCredential", userCredential);
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
      });
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false }));

      if (error.code === "auth/popup-closed-by-user") {
        throw new Error("Sign in was cancelled");
      } else if (error.code === "auth/popup-blocked") {
        throw new Error(
          "Popup was blocked. Please allow popups for this site."
        );
      } else {
        throw new Error("Google sign in failed. Please try again.");
      }
    }
  };

  const loginWithApple = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Apple Sign In will be implemented when you get Apple Developer account
      // For now, show a message
      setState((prev) => ({ ...prev, isLoading: false }));
      throw new Error(
        "Apple Sign In requires an Apple Developer account. Coming soon!"
      );
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
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
    updateProfile,
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
