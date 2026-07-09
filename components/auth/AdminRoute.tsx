"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isStrictAdmin } from "@/lib/authRules";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status, user } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }

    if (status === "authenticated" && !isStrictAdmin(user)) {
      router.replace("/");
    }
  }, [router, status, user]);

  if (status !== "authenticated" || !isStrictAdmin(user)) {
    return (
      <div
        className="container-page flex min-h-[50vh] items-center justify-center py-20 text-center"
        suppressHydrationWarning
      >
        <div suppressHydrationWarning>
          <div className="mx-auto h-10 w-10 animate-pulse rounded-full border-2 border-[#0f172a]" />
          <p className="mt-4 text-sm text-[#64748b]">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
