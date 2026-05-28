"use client";

import Link from "next/link";
import { Rocket } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";

export function FinalCta() {
  const { user } = useAuth();
  const href = user ? "/caption" : "/sign-up";

  return (
    <section aria-labelledby="final-cta-heading">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="flex flex-col items-center gap-6 rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--bg-surface)] px-6 py-16 text-center sm:py-20">
          <h2
            id="final-cta-heading"
            className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
          >
            Ready to Experience AI Vision?
          </h2>
          <p className="max-w-2xl text-pretty text-[var(--fg-secondary)]">
            Join users who are already using CapIt to make their content more
            accessible and their world more understandable.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-2 uppercase tracking-[0.18em]"
          >
            <Link href={href}>
              <Rocket aria-hidden="true" className="size-5" />
              <span>Start now — It&apos;s free</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
