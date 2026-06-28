import { getAccessToken } from "@/lib/auth/tokenStore";
import { WS_BASE_URL } from "@/lib/config/env";

export interface CaptionClassification {
  /** "SAFE" or "DANGEROUS". */
  label: string;
  reason: string;
}

export interface LiveCaption {
  text: string;
  classification: CaptionClassification | null;
  latencyMs: number | null;
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
          this.emit({
            type: "caption",
            caption: {
              text: msg.caption,
              classification: msg.classification ?? null,
              latencyMs: msg.latencyMs ?? null,
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
      this.emit({ type: "close" });
    };
  }

  sendFrame(blob: Blob): void {
    const ws = this.ws;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    void blobToBase64(blob).then((data) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "frame", data, ts: Date.now() }));
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
