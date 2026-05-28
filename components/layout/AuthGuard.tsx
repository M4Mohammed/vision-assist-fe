"use client";

import type { ReactNode } from "react";
import { useRequireAuth } from "@/lib/auth/requireAuth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useRequireAuth();

  if (isLoading || !user) {
    return (
      <div
        className="flex min-h-dvh items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <span
          className="size-8 animate-spin rounded-full border-2 border-white/40 border-r-transparent"
          aria-hidden="true"
        />
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return <>{children}</>;
}
