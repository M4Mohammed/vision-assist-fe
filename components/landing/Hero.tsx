"use client";

import Link from "next/link";
import { Camera } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const { user } = useAuth();
  const captureHref = user ? "/caption" : "/sign-up";

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-[var(--stroke)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 sm:py-24 lg:py-32">
        <span
          aria-hidden="true"
          className="inline-block size-2.5 rounded-full bg-white/80 shadow-[0_0_24px_rgba(255,255,255,0.6)]"
        />
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--fg-muted)]">
          Making the world more inclusive
        </p>
        <h1
          id="hero-heading"
          className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
        >
          Real-Time Visual AI
          <br />
          Captioning
        </h1>
        <p className="max-w-2xl text-pretty text-base text-[var(--fg-secondary)] sm:text-lg">
          Transform your camera feed into intelligent descriptions instantly.
          Experience the future of visual accessibility with our advanced AI
          technology.
        </p>
        <div className="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Button
            asChild
            size="lg"
            className="w-full uppercase tracking-[0.18em] sm:w-auto"
          >
            <Link href={captureHref}>
              <Camera aria-hidden="true" className="size-5" />
              <span>Start Captioning</span>
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="w-full uppercase tracking-[0.18em] sm:w-auto"
          >
            <Link href="#capabilities">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
