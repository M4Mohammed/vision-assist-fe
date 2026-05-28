import type { UsageSlice } from "@/lib/mock/profile";

interface UsageDonutProps {
  centerPercent: number;
  slices: UsageSlice[];
}

const RADIUS = 88;
const STROKE_WIDTH = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SIZE = (RADIUS + STROKE_WIDTH) * 2;

const segmentShades = ["#ffffff", "#9d9d9d", "#525252"];

export function UsageDonut({ centerPercent, slices }: UsageDonutProps) {
  const segments = slices.map((slice, index) => {
    const length = (slice.percent / 100) * CIRCUMFERENCE;
    const prefix = slices
      .slice(0, index)
      .reduce((sum, s) => sum + (s.percent / 100) * CIRCUMFERENCE, 0);
    return {
      ...slice,
      color: segmentShades[index % segmentShades.length],
      length,
      offset: -prefix,
    };
  });

  return (
    <article
      aria-labelledby="usage-donut-heading"
      className="flex flex-col gap-8 rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--bg-surface)] p-6 sm:p-8"
    >
      <header className="flex items-center justify-between">
        <h2
          id="usage-donut-heading"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)]"
        >
          MEDIA_USAGE_PORTIONS
        </h2>
      </header>

      <div className="flex justify-center">
        <svg
          role="img"
          aria-label={`${centerPercent}% system analyzed. Breakdown: ${slices.map((s) => `${s.label.replace("_", " ").toLowerCase()} ${s.percent}%`).join(", ")}.`}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full max-w-[260px]"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={STROKE_WIDTH}
          />
          <g
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeLinecap="butt"
          >
            {segments.map((seg) => (
              <circle
                key={seg.key}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={seg.color}
                strokeDasharray={`${seg.length} ${CIRCUMFERENCE - seg.length}`}
                strokeDashoffset={seg.offset}
              />
            ))}
          </g>
          <text
            x="50%"
            y="48%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white"
            style={{ font: "600 44px var(--font-geist-sans, sans-serif)" }}
          >
            {centerPercent}%
          </text>
          <text
            x="50%"
            y="62%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-[var(--fg-muted)]"
            style={{
              font: "500 10px var(--font-geist-mono, monospace)",
              letterSpacing: "0.22em",
            }}
          >
            SYSTEM ANALYZED
          </text>
        </svg>
      </div>

      <ul className="flex flex-col gap-3 border-t border-[var(--stroke)] pt-6">
        {segments.map((seg) => (
          <li
            key={seg.key}
            className="flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--fg-secondary)]">
              <span
                aria-hidden="true"
                className="inline-block size-2 rounded-full"
                style={{ background: seg.color }}
              />
              {seg.label}
            </span>
            <span className="text-sm font-semibold text-white">
              {seg.percent.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
