"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MediaUploadProps {
  kind: "image" | "video";
  onLoaded: () => void;
  onCleared: () => void;
}

export function MediaUpload({ kind, onLoaded, onCleared }: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const accept = kind === "image" ? "image/*" : "video/*";
  const headline =
    kind === "image"
      ? "Drop a still image to caption"
      : "Drop a recorded clip to caption";

  const onFile = (file: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFileName(file.name);
    onLoaded();
  };

  const clear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
    onCleared();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--bg-surface)]">
        <div className="relative aspect-video w-full">
          {previewUrl ? (
            kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={fileName ?? "Selected image preview"}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                className="absolute inset-0 size-full object-cover"
              />
            )
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-transparent text-center text-[var(--fg-secondary)] transition-colors hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/85"
              aria-label={headline}
            >
              <ImagePlus aria-hidden="true" className="size-10" />
              <p className="max-w-xs px-6 text-sm">{headline}</p>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">
                Tap to select
              </span>
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
        }}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="md"
          onClick={() => inputRef.current?.click()}
        >
          <Upload aria-hidden="true" className="size-4" />
          <span>{previewUrl ? "Choose another file" : "Choose file"}</span>
        </Button>
        {previewUrl ? (
          <Button size="md" variant="secondary" onClick={clear}>
            <X aria-hidden="true" className="size-4" />
            <span>Clear</span>
          </Button>
        ) : null}
        {fileName ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)]">
            {fileName}
          </p>
        ) : null}
      </div>
    </div>
  );
}
