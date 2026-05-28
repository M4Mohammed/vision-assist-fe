"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/caption");
    }
  }, [user, isLoading, router]);

  return <div className="min-h-dvh bg-[var(--bg-base)]">{children}</div>;
}
