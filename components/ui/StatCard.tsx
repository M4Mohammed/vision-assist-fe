import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface StatCardProps {
  label: string;
  value: ReactNode;
  caption?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  caption,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--bg-surface)] p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)]">
          {label}
        </p>
        {icon ? (
          <span aria-hidden="true" className="text-[var(--fg-muted)]">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="font-sans text-4xl font-semibold leading-none text-white">
        {value}
      </p>
      {caption ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)]">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
