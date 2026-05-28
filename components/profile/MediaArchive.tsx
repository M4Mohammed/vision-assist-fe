"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Copy,
  Download,
  FileText,
  Image as ImageIcon,
  Radio,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { MediaItem, MediaKind } from "@/lib/mock/profile";
import { cn } from "@/lib/utils/cn";
import { useToast } from "@/components/ui/Toast";

const kindIcon: Record<MediaKind, LucideIcon> = {
  VIDEO_FILE: Video,
  IMAGE_STATIC: ImageIcon,
  STREAM_BUFFER: Radio,
  LOG_SEQUENCE: FileText,
};

interface MediaArchiveProps {
  items: MediaItem[];
}

export function MediaArchive({ items }: MediaArchiveProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const { toast } = useToast();
  const active = items.find((item) => item.id === activeId) ?? items[0];

  if (!active) {
    return null;
  }

  const onCopy = async () => {
    const text = active.transcript
      .map((line) => `${line.timestamp}  ${line.text}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Transcript copied",
        tone: "success",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Your browser blocked clipboard access.",
        tone: "error",
      });
    }
  };

  const onDownload = () => {
    toast({
      title: "Download queued",
      description: "Your transcript will be ready shortly.",
      tone: "info",
    });
  };

  const selectItem = (id: string) => {
    setActiveId(id);
    setMobileView("detail");
  };

  return (
    <article
      aria-labelledby="media-archive-heading"
      className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--bg-surface)]"
    >
      <h2 id="media-archive-heading" className="sr-only">
        Media archive
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_1fr]">
        <nav
          aria-label="Media files"
          className={cn(
            "border-b border-[var(--stroke)] p-6 lg:border-b-0 lg:border-r",
            mobileView === "detail" && "hidden lg:block",
          )}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)]">
            MEDIA_ARCHIVE
          </p>
          <ul className="mt-6 flex flex-col gap-2">
            {items.map((item) => {
              const Icon = kindIcon[item.kind];
              const selected = item.id === active.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => selectItem(item.id)}
                    aria-current={selected ? "true" : undefined}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85",
                      selected
                        ? "border-white/30 bg-[var(--bg-elevated)]"
                        : "border-transparent hover:border-[var(--stroke)] hover:bg-[var(--bg-elevated)]/60",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="grid size-9 place-items-center rounded-full bg-[var(--bg-elevated)] text-white/80"
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-white">
                          {item.name}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">
                          {item.kind} | {item.duration}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      aria-hidden="true"
                      className={cn(
                        "size-4 text-[var(--fg-muted)] transition-opacity",
                        selected ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className={cn(
            "flex min-h-[260px] flex-col p-6",
            mobileView === "list" && "hidden lg:flex",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileView("list")}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-[var(--fg-secondary)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85 lg:hidden"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to files
            </button>
            <div className="flex items-center gap-2 text-sm">
              <FileText
                aria-hidden="true"
                className="size-4 text-[var(--fg-muted)]"
              />
              <span className="font-semibold text-white">{active.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-muted)]">
                — Transcribed_Output
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onDownload}
                aria-label="Download transcript"
                className="grid size-9 place-items-center rounded-full text-[var(--fg-secondary)] hover:bg-white/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85"
              >
                <Download aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                onClick={onCopy}
                aria-label="Copy transcript"
                className="grid size-9 place-items-center rounded-full text-[var(--fg-secondary)] hover:bg-white/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85"
              >
                <Copy aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>

          <ol className="mt-6 flex flex-col gap-4">
            {active.transcript.map((line) => (
              <li
                key={`${line.timestamp}-${line.text.slice(0, 16)}`}
                className="grid gap-3 text-sm leading-relaxed sm:grid-cols-[88px_1fr]"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)]">
                  {line.timestamp}
                </span>
                <span className="text-[var(--fg-secondary)]">{line.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}
