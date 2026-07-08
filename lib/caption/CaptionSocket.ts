import { getAccessToken } from "@/lib/auth/tokenStore";
import { WS_BASE_URL } from "@/lib/config/env";

export interface CaptionClassification {
  /** "SAFE" or "DANGEROUS". */
  label: string;
  reason: string;
}

/**
 * Per-caption latency segments, innermost to outermost. Each is measured on its own host's clock
 * (never subtracting a browser timestamp from a server one): e2eMs here, relayMs on the backend,
 * aiRequestMs/inferenceMs on the AI service. Differences between adjacent segments attribute time
 * to network hops and overhead.
 */
export interface CaptionLatency {
  /** Full loop on this browser's clock: frame sent -> caption received. */
  e2eMs: number | null;
  /** Backend wall time around its AI call (BE<->AI network + AI handling). */
  relayMs: number | null;
  /** AI service's total handler time (decode + preprocess + inference + classify). */
  aiRequestMs: number | null;
  /** GPU inference (model.generate()) only. */
  inferenceMs: number | null;
}

export interface LiveCaption {
  text: string;
  classification: CaptionClassification | null;
  latencyMs: number | null;
  latency: CaptionLatency | null;
}

export type CaptionEvent =
  | { type: "open" }
  | { type: "caption"; caption: LiveCaption }
  | { type: "error"; message: string }
  | { type: "close" };

export type CaptionListener = (event: CaptionEvent) => void;

/**
 * Real captioning socket: connects to the backend relay, streams JPEG frames as base64, and emits
 * the caption + danger classification that comes back. Exposes a connect / sendFrame / close / on
 * surface so the page wiring stays simple.
 *
 * The JWT travels in the `?token=` query param because the browser WebSocket API can't set an
 * Authorization header; the backend validates it during the handshake.
 */
export class CaptionSocket {
  private ws: WebSocket | null = null;
  private listeners = new Set<CaptionListener>();
  /**
   * performance.now() at send time for in-flight frames, keyed by the frame's ts (echoed back as
   * frameTs). Frames the backend drops under back-pressure never resolve, so the map is pruned by
   * size instead of waiting on replies.
   */
  private pending = new Map<number, number>();
  private static readonly MAX_PENDING = 20;

  on(listener: CaptionListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(event: CaptionEvent) {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  connect(): void {
    if (this.ws) return;

    const token = getAccessToken();
    if (!token) {
      this.emit({ type: "error", message: "You need to be signed in to start captioning." });
      return;
    }

    const url = `${WS_BASE_URL}/ws/caption?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(url);
    this.ws = ws;

    ws.onopen = () => this.emit({ type: "open" });

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string);
        if (msg.type === "caption") {
          // End-to-end is measured entirely on this browser's clock via the frameTs echo.
          let e2eMs: number | null = null;
          if (typeof msg.frameTs === "number") {
            const sentAt = this.pending.get(msg.frameTs);
            if (sentAt !== undefined) {
              e2eMs = performance.now() - sentAt;
              this.pending.delete(msg.frameTs);
            }
          }
          // Report it back so the server can histogram the one client-clock metric (Prometheus).
          if (e2eMs !== null && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "stats", e2eMs: Math.round(e2eMs) }));
          }
          this.emit({
            type: "caption",
            caption: {
              text: msg.caption,
              classification: msg.classification ?? null,
              latencyMs: msg.latencyMs ?? null,
              latency: {
                e2eMs,
                relayMs: typeof msg.relayMs === "number" ? msg.relayMs : null,
                aiRequestMs: typeof msg.aiRequestMs === "number" ? msg.aiRequestMs : null,
                inferenceMs: typeof msg.latencyMs === "number" ? msg.latencyMs : null,
              },
            },
          });
        } else if (msg.type === "error") {
          this.emit({ type: "error", message: msg.message ?? "Captioning error." });
        }
      } catch {
        // ignore malformed frames
      }
    };

    ws.onerror = () => this.emit({ type: "error", message: "Live captioning connection failed." });

    ws.onclose = () => {
      this.ws = null;
      this.pending.clear();
      this.emit({ type: "close" });
    };
  }

  sendFrame(blob: Blob): void {
    const ws = this.ws;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    void blobToBase64(blob).then((data) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const ts = Date.now();
        this.pending.set(ts, performance.now());
        if (this.pending.size > CaptionSocket.MAX_PENDING) {
          const oldest = this.pending.keys().next().value;
          if (oldest !== undefined) this.pending.delete(oldest);
        }
        this.ws.send(JSON.stringify({ type: "frame", data, ts }));
      }
    });
  }

  close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}
