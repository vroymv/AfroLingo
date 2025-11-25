import { AuthContextType, User } from "@/types/AuthContext";
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Convert Firebase user to our User type
  const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    name: firebaseUser.displayName || "",
    avatar: firebaseUser.photoURL || undefined,
    createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
    emailVerified: firebaseUser.emailVerified,
  });

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(mapFirebaseUser(firebaseUser));
        // Get ID token
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
      } else {
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with name if provided
      if (name && userCredential.user) {
        await firebaseUpdateProfile(userCredential.user, {
          displayName: name,
        });
      }

      // Send verification email
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || "Failed to login");
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      setError(err.message || "Failed to logout");
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
      throw err;
    }
  };

  // Send verification email
  const sendVerificationEmail = async () => {
    try {
      setError(null);
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send verification email");
      throw err;
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<User>) => {
    try {
      setError(null);
      if (auth.currentUser) {
        // Map User properties to Firebase profile properties
        const firebaseUpdates: { displayName?: string; photoURL?: string } = {};
        if (updates.name !== undefined)
          firebaseUpdates.displayName = updates.name;
        if (updates.avatar !== undefined)
          firebaseUpdates.photoURL = updates.avatar;

        if (Object.keys(firebaseUpdates).length > 0) {
          await firebaseUpdateProfile(auth.currentUser, firebaseUpdates);
        }

        // Update local user state
        setUser((prev) => (prev ? { ...prev, ...updates } : null));
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      throw err;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || "Failed to login with Google");
      throw err;
    }
  };

  // Login with Apple (placeholder - requires additional setup)
  const loginWithApple = async () => {
    try {
      setError(null);
      // Apple sign-in implementation would go here
      throw new Error("Apple sign-in not yet implemented");
    } catch (err: any) {
      setError(err.message || "Failed to login with Apple");
      throw err;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    token,
    error,
    login,
    signup,
    logout,
    resetPassword,
    sendVerificationEmail,
    updateProfile,
    loginWithGoogle,
    loginWithApple,
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
