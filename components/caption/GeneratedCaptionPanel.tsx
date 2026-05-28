"use client";

import { Copy, Download, Volume2, VolumeX } from "lucide-react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Button } from "@/components/ui/Button";
import { ConfidenceCard } from "./ConfidenceCard";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils/cn";

interface GeneratedCaptionPanelProps {
  caption: string | null;
  confidence: number | null;
  speakSupported: boolean;
  autoSpeak: boolean;
  onToggleAutoSpeak: (next: boolean) => void;
  onSpeak: () => void;
  speaking: boolean;
  busy?: boolean;
}

export function GeneratedCaptionPanel({
  caption,
  confidence,
  speakSupported,
  autoSpeak,
  onToggleAutoSpeak,
  onSpeak,
  speaking,
  busy,
}: GeneratedCaptionPanelProps) {
  const { toast } = useToast();

  const onCopy = async () => {
    if (!caption) return;
    try {
      await navigator.clipboard.writeText(caption);
      toast({ title: "Caption copied", tone: "success" });
    } catch {
      toast({
        title: "Copy failed",
        description: "Clipboard access was blocked.",
        tone: "error",
      });
    }
  };

  const onExport = () => {
    toast({
      title: "Export queued",
      description: "We're preparing a PDF of your captioning session.",
      tone: "info",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <article
        aria-labelledby="generated-caption-heading"
        className="flex flex-col gap-5 rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--bg-surface)] p-6"
      >
        <header className="flex items-center justify-between gap-3">
          <h2
            id="generated-caption-heading"
            className="text-base font-semibold text-white"
          >
            Generated Caption
          </h2>
          {busy ? (
            <span
              aria-live="polite"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]"
            >
              <span
                aria-hidden="true"
                className="size-2 animate-pulse rounded-full bg-white"
              />
              Listening
            </span>
          ) : null}
        </header>

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="min-h-[120px] rounded-2xl border border-[var(--stroke)] bg-[var(--bg-elevated)] p-5 text-base leading-relaxed text-white"
        >
          {caption ? (
            <p className="text-pretty">&ldquo;{caption}&rdquo;</p>
          ) : (
            <p className="text-[var(--fg-muted)]">
              Captions will appear here as soon as analysis begins.
            </p>
          )}
        </div>

        {speakSupported ? (
          <label className="flex items-center justify-between gap-3 rounded-full border border-[var(--stroke)] bg-[var(--bg-elevated)] px-4 py-2.5">
            <span className="flex items-center gap-3 text-sm text-white">
              <Volume2 aria-hidden="true" className="size-4" />
              Speak captions aloud
            </span>
            <SwitchPrimitive.Root
              checked={autoSpeak}
              onCheckedChange={onToggleAutoSpeak}
              className={cn(
                "relative h-6 w-11 shrink-0 cursor-pointer rounded-full bg-white/10 outline-none transition-colors",
                "data-[state=checked]:bg-white",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85",
              )}
            >
              <SwitchPrimitive.Thumb
                className={cn(
                  "block size-5 rounded-full bg-white shadow transition-transform",
                  "translate-x-0.5 will-change-transform",
                  "data-[state=checked]:translate-x-[1.4rem] data-[state=checked]:bg-[var(--fg-inverse)]",
                )}
              />
            </SwitchPrimitive.Root>
          </label>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSpeak}
            aria-label={speaking ? "Stop reading caption" : "Read caption aloud"}
            disabled={!caption || !speakSupported}
            className="grid size-11 place-items-center rounded-full border border-[var(--stroke)] bg-[var(--bg-elevated)] text-white hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {speaking ? (
              <VolumeX aria-hidden="true" className="size-5" />
            ) : (
              <Volume2 aria-hidden="true" className="size-5" />
            )}
          </button>
          <button
            type="button"
            onClick={onCopy}
            aria-label="Copy caption"
            disabled={!caption}
            className="grid size-11 place-items-center rounded-full border border-[var(--stroke)] bg-[var(--bg-elevated)] text-white hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Copy aria-hidden="true" className="size-5" />
          </button>
          <Button
            className="ml-auto"
            size="md"
            onClick={onExport}
            disabled={!caption}
          >
            <Download aria-hidden="true" className="size-4" />
            <span>Export PDF</span>
          </Button>
        </div>
      </article>

      <ConfidenceCard confidence={confidence} />
    </div>
  );
}
