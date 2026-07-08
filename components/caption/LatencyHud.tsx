"use client";

import { useState } from "react";
import { Activity, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { CaptionLatency } from "@/lib/caption/CaptionSocket";

/** Rolling window of captions used for the averages. */
const WINDOW = 20;

/**
 * Raw segments arrive measured on their own hosts; the interesting quantities are the differences
 * between adjacent ones, clamped at 0 to absorb clock jitter.
 */
interface Breakdown {
  e2e: number | null;
  /** e2e - relay: browser<->server network + backend queueing. */
  network: number | null;
  /** relay - aiRequest: backend<->AI network hop. */
  hop: number | null;
  /** aiRequest - inference: AI-side decode/preprocess/classify overhead. */
  overhead: number | null;
  /** Pure GPU inference. */
  inference: number | null;
}

function derive(sample: CaptionLatency): Breakdown {
  const diff = (outer: number | null, inner: number | null) =>
    outer !== null && inner !== null ? Math.max(0, outer - inner) : null;
  return {
    e2e: sample.e2eMs,
    network: diff(sample.e2eMs, sample.relayMs),
    hop: diff(sample.relayMs, sample.aiRequestMs),
    overhead: diff(sample.aiRequestMs, sample.inferenceMs),
    inference: sample.inferenceMs,
  };
}

type SegmentKey = "network" | "hop" | "overhead" | "inference";

/**
 * Pipeline order, encoded by lightness only (dimmest at the browser edge, brightest at the GPU) —
 * on this monochrome design system that keeps segments distinguishable for every kind of color
 * vision, and each segment's swatch sits next to its text label in the rows below the bar.
 */
const SEGMENTS: Array<{ key: SegmentKey; label: string; swatch: string }> = [
  { key: "network", label: "Browser ↔ server", swatch: "bg-white/25" },
  { key: "hop", label: "Backend ↔ AI", swatch: "bg-white/45" },
  { key: "overhead", label: "AI overhead", swatch: "bg-white/70" },
  { key: "inference", label: "GPU inference", swatch: "bg-white" },
];

function fmt(value: number | null): string {
  return value === null ? "—" : `${Math.round(value)} ms`;
}

function average(history: Breakdown[], key: keyof Breakdown): number | null {
  const values = history.map((b) => b[key]).filter((v): v is number => v !== null);
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

interface LatencyHudProps {
  /** Latest caption's latency segments; a new object per caption. */
  sample: CaptionLatency | null;
}

export function LatencyHud({ sample }: LatencyHudProps) {
  const [open, setOpen] = useState(true);
  const [history, setHistory] = useState<Breakdown[]>([]);
  const [lastSample, setLastSample] = useState<CaptionLatency | null>(null);

  // Guarded render-phase state adjustment ("storing information from previous renders" pattern):
  // append each new sample once, keeping only the last WINDOW entries.
  if (sample && sample !== lastSample) {
    setLastSample(sample);
    setHistory((prev) => [...prev.slice(-(WINDOW - 1)), derive(sample)]);
  }

  const latest = history.length > 0 ? history[history.length - 1] : null;
  const barTotal = latest
    ? SEGMENTS.reduce((sum, s) => sum + (latest[s.key] ?? 0), 0)
    : 0;

  return (
    <section
      aria-label="Latency breakdown"
      className="rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--bg-surface)]"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-card)] px-6 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85"
      >
        <span className="flex items-center gap-3 text-base font-semibold text-white">
          <Activity aria-hidden="true" className="size-4" />
          Latency
        </span>
        <span className="flex items-center gap-3">
          {latest ? (
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">
              E2E {fmt(latest.e2e)}
            </span>
          ) : null}
          <ChevronDown
            aria-hidden="true"
            className={cn("size-4 text-[var(--fg-muted)] transition-transform", open && "rotate-180")}
          />
        </span>
      </button>

      {open ? (
        <div className="flex flex-col gap-4 px-6 pb-5">
          {history.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">
              Timing appears here once captions start arriving.
            </p>
          ) : (
            <>
              {latest && barTotal > 0 ? (
                <div
                  role="img"
                  aria-label={`Latency share of the last caption: ${SEGMENTS.map(
                    (s) => `${s.label} ${fmt(latest[s.key])}`,
                  ).join(", ")}`}
                  className="flex h-1.5 gap-0.5 overflow-hidden rounded-full"
                >
                  {SEGMENTS.map((s) => {
                    const value = latest[s.key] ?? 0;
                    if (value <= 0) return null;
                    return (
                      <div
                        key={s.key}
                        title={`${s.label}: ${fmt(value)}`}
                        className={cn("h-full", s.swatch)}
                        style={{ width: `${(value / barTotal) * 100}%` }}
                      />
                    );
                  })}
                </div>
              ) : null}

              <dl className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-6 gap-y-2">
                <dt className="sr-only">Segment</dt>
                <dd className="text-right font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">
                  Last
                </dd>
                <dd className="text-right font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">
                  Avg
                </dd>

                {SEGMENTS.map((s) => (
                  <div key={s.key} className="col-span-3 grid grid-cols-subgrid items-center">
                    <dt className="flex items-center gap-2.5 text-sm text-[var(--fg-secondary)]">
                      <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", s.swatch)} />
                      {s.label}
                    </dt>
                    <dd className="text-right font-mono text-sm tabular-nums text-white">
                      {fmt(latest ? latest[s.key] : null)}
                    </dd>
                    <dd className="text-right font-mono text-sm tabular-nums text-[var(--fg-muted)]">
                      {fmt(average(history, s.key))}
                    </dd>
                  </div>
                ))}

                <div className="col-span-3 grid grid-cols-subgrid items-center border-t border-[var(--stroke)] pt-2">
                  <dt className="text-sm font-semibold text-white">End-to-end</dt>
                  <dd className="text-right font-mono text-sm tabular-nums text-white">
                    {fmt(latest ? latest.e2e : null)}
                  </dd>
                  <dd className="text-right font-mono text-sm tabular-nums text-[var(--fg-muted)]">
                    {fmt(average(history, "e2e"))}
                  </dd>
                </div>
              </dl>

              <p className="text-xs text-[var(--fg-muted)]">
                Averages cover the last {Math.min(history.length, WINDOW)} caption
                {history.length === 1 ? "" : "s"}. “—” means that segment isn’t reported by the
                current deployment.
              </p>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
