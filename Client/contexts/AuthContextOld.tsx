import React, { createContext, useContext } from "react";
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

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Static user data for development/testing
  const staticUser: User = {
    id: "static-uid-123",
    email: "testuser@example.com",
    name: "Test User",
    avatar: undefined,
    createdAt: new Date(),
    emailVerified: true,
  };

  // Provide static values for all auth context properties
  const value: AuthContextType = {
    user: staticUser,
    isLoading: false,
    isAuthenticated: true,
    token: "static-token-123",
    error: null,
    login: async () => {},
    signup: async () => {},
    logout: async () => {},
    resetPassword: async () => {},
    sendVerificationEmail: async () => {},
    updateProfile: async () => {},
    loginWithGoogle: async () => {},
    loginWithApple: async () => {},
    clearError: () => {},
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
