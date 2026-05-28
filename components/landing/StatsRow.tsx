interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: "98.9%", label: "Accuracy" },
  { value: "<1s", label: "Response Time" },
  { value: "24/7", label: "Availability" },
  { value: "TTS", label: "Text-to-Speech" },
];

export function StatsRow() {
  return (
    <section aria-label="Platform stats" className="border-b border-[var(--stroke)]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-2 text-center"
          >
            <p className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {stat.value}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
