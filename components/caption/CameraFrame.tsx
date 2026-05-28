"use client";

import { Camera, Radio } from "lucide-react";
import type { Ref } from "react";
import { Button } from "@/components/ui/Button";
import type { CameraStatus } from "@/lib/caption/useCameraStream";

interface CameraFrameProps {
  videoRef: Ref<HTMLVideoElement>;
  status: CameraStatus;
  errorMessage: string | null;
  onStart: () => void;
  onStop: () => void;
}

export function CameraFrame({
  videoRef,
  status,
  errorMessage,
  onStart,
  onStop,
}: CameraFrameProps) {
  const isActive = status === "active";

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--stroke)] bg-black">
        <div className="relative aspect-[3/4] w-full sm:aspect-video">
          <video
            ref={videoRef}
            className="absolute inset-0 size-full object-cover"
            playsInline
            muted
            autoPlay
          />
          {!isActive ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 text-center">
              <Camera
                aria-hidden="true"
                className="size-10 text-white/70"
              />
              <p className="max-w-xs px-6 text-sm text-[var(--fg-secondary)]">
                {status === "denied"
                  ? (errorMessage ?? "Camera access was blocked.")
                  : status === "unsupported"
                    ? "Your browser does not support camera capture."
                    : status === "error"
                      ? (errorMessage ?? "We could not start your camera.")
                      : status === "requesting"
                        ? "Requesting camera access…"
                        : "Tap start to begin streaming the camera."}
              </p>
            </div>
          ) : null}

          {isActive ? (
            <span
              aria-hidden="true"
              className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white"
            >
              <Radio className="size-3 animate-pulse" />
              REC
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {isActive ? (
          <Button variant="secondary" size="md" onClick={onStop}>
            Stop captioning
          </Button>
        ) : (
          <Button
            size="md"
            onClick={onStart}
            disabled={status === "requesting"}
            loading={status === "requesting"}
          >
            <Camera aria-hidden="true" className="size-4" />
            <span>Start camera</span>
          </Button>
        )}
        {status === "denied" || status === "error" ? (
          <p
            role="alert"
            className="text-sm text-red-400"
          >
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
