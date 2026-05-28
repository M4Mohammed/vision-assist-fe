import type { LexicalUnit } from "@/lib/mock/profile";

interface LexicalUnitsChartProps {
  units: LexicalUnit[];
}

export function LexicalUnitsChart({ units }: LexicalUnitsChartProps) {
  const max = Math.max(...units.map((u) => u.uses), 1);
  return (
    <article
      aria-labelledby="lexical-units-heading"
      className="rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--bg-surface)] p-6 sm:p-8"
    >
      <h2
        id="lexical-units-heading"
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)]"
      >
        5_MOST_FREQUENT_LEXICAL_UNITS
      </h2>

      <ul className="mt-8 flex flex-col gap-7">
        {units.map((unit) => {
          const percent = (unit.uses / max) * 100;
          return (
            <li key={unit.word} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-base font-medium text-white">
                  {unit.word}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)]">
                  {unit.uses.toLocaleString()} USES
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={`${unit.word} usage`}
                aria-valuenow={unit.uses}
                aria-valuemin={0}
                aria-valuemax={max}
                className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]"
              >
                <span
                  aria-hidden="true"
                  className="block h-full rounded-full bg-white"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
