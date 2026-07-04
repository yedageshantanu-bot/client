"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ children, nextPath }: { children: React.ReactNode; nextPath?: string }) {
  const pathname = usePathname();
  const { status, user, requireLogin } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const currentPath = nextPath || `${pathname}${search}`;
      requireLogin(currentPath);
    }
  }, [nextPath, pathname, requireLogin, status]);

  if (status !== "authenticated" || !user) {
    return (
      <div className="container-page flex min-h-[50vh] items-center justify-center py-20 text-center">
        <div>
          <div className="mx-auto h-10 w-10 animate-pulse rounded-full border border-gold" />
          <p className="mt-4 text-sm text-brand-muted">Preparing your account…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
