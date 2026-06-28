import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import type { CaptionClassification } from "@/lib/caption/CaptionSocket";
import { cn } from "@/lib/utils/cn";

interface ClassificationCardProps {
  classification: CaptionClassification | null;
}

export function ClassificationCard({ classification }: ClassificationCardProps) {
  const label = classification?.label?.toUpperCase() ?? null;
  const isDanger = label === "DANGEROUS";
  const isSafe = label === "SAFE";
  const Icon = isDanger ? ShieldAlert : isSafe ? ShieldCheck : Shield;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-4 rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--bg-surface)] p-5"
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-12 place-items-center rounded-full",
          isDanger
            ? "bg-red-500 text-white"
            : isSafe
              ? "bg-emerald-500 text-white"
              : "bg-white text-[var(--fg-inverse)]",
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="flex flex-col">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">
          Scene Safety
        </p>
        <p className="text-2xl font-semibold text-white">{label ?? "—"}</p>
        {classification?.reason ? (
          <p className="text-sm text-[var(--fg-secondary)]">{classification.reason}</p>
        ) : null}
      </div>
    </div>
  );
}
