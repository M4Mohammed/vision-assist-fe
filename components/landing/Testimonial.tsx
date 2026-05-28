import { Camera, Quote } from "lucide-react";

export function Testimonial() {
  return (
    <section
      aria-label="Customer testimonial"
      className="border-b border-[var(--stroke)]"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <figure className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--bg-surface)]">
          <div
            aria-hidden="true"
            className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1a1f] via-[#0c0c11] to-[#000] sm:h-72"
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 80px)",
              }}
            />
            <Camera className="size-16 text-white/40" />
          </div>
          <div className="flex flex-col gap-4 p-8">
            <Quote
              aria-hidden="true"
              className="size-6 text-white/40"
            />
            <blockquote className="text-2xl font-medium leading-tight text-white sm:text-3xl">
              &ldquo;CapIt has completely changed how I interact with visual
              content in my daily life.&rdquo;
            </blockquote>
            <figcaption className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">
              Early access tester
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}
