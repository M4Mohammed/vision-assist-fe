import { Sparkles } from "lucide-react";

interface ConfidenceCardProps {
  confidence: number | null;
}

export function ConfidenceCard({ confidence }: ConfidenceCardProps) {
  const display = confidence !== null ? `${(confidence * 100).toFixed(1)}%` : "—";
  return (
    <div className="flex items-center gap-4 rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--bg-surface)] p-5">
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-full bg-white text-[var(--fg-inverse)]"
      >
        <Sparkles className="size-5" />
      </span>
      <div className="flex flex-col">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">
          Confidence Score
        </p>
        <p className="text-2xl font-semibold text-white">{display}</p>
      </div>
    </div>
  );
}
