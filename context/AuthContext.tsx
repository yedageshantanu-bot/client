"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import type { User } from "@/lib/types";
import { getCurrentUser, logoutUser } from "@/lib/authApi";
import { isStrictAdmin, sanitizeInternalPath } from "@/lib/authRules";

type AuthContextValue = {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  showLoginModal: boolean;
  authRedirectPath: string;
  setShowLoginModal: (value: boolean) => void;
  requireLogin: (nextPath?: string) => void;
  isAdmin: boolean;
  refreshSession: () => Promise<User | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authRedirectPath, setAuthRedirectPath] = useState("/account");

  const refreshSession = useCallback(async () => {
    setStatus((currentStatus) =>
      currentStatus === "authenticated" ? currentStatus : "loading",
    );

    try {
      const response = await getCurrentUser();
      if (!response?.user) {
        throw new Error("No authenticated user returned");
      }

      setUser(response.user);
      setStatus("authenticated");
      setShowLoginModal(false);
      return response.user;
    } catch {
      setUser(null);
      setStatus("unauthenticated");
      return null;
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void refreshSession();
    });
  }, [refreshSession]);

  useEffect(() => {
    const refreshWhenActive = () => {
      if (document.visibilityState === "visible") {
        void refreshSession();
      }
    };

    window.addEventListener("focus", refreshWhenActive);
    document.addEventListener("visibilitychange", refreshWhenActive);
    window.addEventListener("online", refreshWhenActive);

    return () => {
      window.removeEventListener("focus", refreshWhenActive);
      document.removeEventListener("visibilitychange", refreshWhenActive);
      window.removeEventListener("online", refreshWhenActive);
    };
  }, [refreshSession]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setStatus("unauthenticated");
      toast.success("Signed out");
    }
  }, []);

  const requireLogin = useCallback((nextPath = "/account") => {
    setAuthRedirectPath(sanitizeInternalPath(nextPath, "/account"));
    setShowLoginModal(true);
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      isAdmin: isStrictAdmin(user),
      showLoginModal,
      authRedirectPath,
      setShowLoginModal,
      requireLogin,
      refreshSession,
      logout,
    }),
    [authRedirectPath, logout, refreshSession, requireLogin, showLoginModal, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
