import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Custom hook for email verification functionality
 *
 * Usage:
 * ```typescript
 * const { isVerified, isLoading, message, resendEmail } = useEmailVerification();
 * ```
 */
export function useEmailVerification() {
  const { user, sendVerificationEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const isVerified = user?.emailVerified ?? false;

  const resendEmail = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await sendVerificationEmail();
      setMessage({
        text: "Verification email sent! Please check your inbox.",
        type: "success",
      });
      return true;
    } catch (error: any) {
      setMessage({
        text: error.message || "Failed to send email. Please try again.",
        type: "error",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage(null);
  };

  return {
    isVerified,
    isLoading,
    message,
    resendEmail,
    clearMessage,
  };
}
