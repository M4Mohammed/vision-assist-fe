"use client";

import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

interface ProfileHeaderProps {
  userSystemId: string;
}

export function ProfileHeader({ userSystemId }: ProfileHeaderProps) {
  const { toast } = useToast();

  return (
    <section
      aria-labelledby="profile-heading"
      className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="flex flex-col gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--fg-muted)]">
          USER_SYSTEM_ID // {userSystemId}
        </p>
        <h1
          id="profile-heading"
          className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl"
        >
          Profile Summary
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="md"
          className="uppercase tracking-[0.18em]"
          onClick={() =>
            toast({
              title: "Export started",
              description: "Your logs are being prepared in the background.",
              tone: "info",
            })
          }
        >
          Export_Logs
        </Button>
        <Button
          variant="secondary"
          size="md"
          className="uppercase tracking-[0.18em]"
          onClick={() =>
            toast({
              title: "Settings coming soon",
              description: "Per-user preferences will land in a later release.",
              tone: "info",
            })
          }
        >
          Settings
        </Button>
      </div>
    </section>
  );
}
