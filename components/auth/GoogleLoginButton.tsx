"use client";

import { useState } from "react";
import { AtSign, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { openGoogleAuthPopup } from "@/lib/googleAuth";

type GoogleLoginButtonProps = {
  nextPath?: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  fullWidth?: boolean;
  onSuccess?: () => void;
};

export function GoogleLoginButton({
  nextPath = "/account",
  className,
  variant = "primary",
  fullWidth = false,
  onSuccess,
}: GoogleLoginButtonProps) {
  const { refreshSession, setShowLoginModal } = useAuth();
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const result = await openGoogleAuthPopup(nextPath);
      const restoredUser = await refreshSession();

      if (!restoredUser) {
        throw new Error("Google sign-in completed, but the session could not be restored. Please try again.");
      }

      setShowLoginModal(false);
      toast.success(result.message || "Signed in with Google");
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign-in could not be completed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className={fullWidth ? `w-full ${className || ""}`.trim() : className} variant={variant} onClick={signIn} disabled={loading}>
      {loading ? <Loader2 className="animate-spin" size={18} /> : <AtSign size={18} />}
      Continue with Google
    </Button>
  );
}
