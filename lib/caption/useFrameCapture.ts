"use client";

import { useEffect, useRef } from "react";

interface UseFrameCaptureOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  intervalMs: number;
  enabled: boolean;
  onFrame: (frame: Blob) => void;
}

export function useFrameCapture({
  videoRef,
  intervalMs,
  enabled,
  onFrame,
}: UseFrameCaptureOptions): void {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onFrameRef = useRef(onFrame);

  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }

    const tick = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) onFrameRef.current(blob);
        },
        "image/jpeg",
        0.75,
      );
    };

    timerRef.current = setInterval(tick, intervalMs);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, intervalMs, videoRef]);
}
