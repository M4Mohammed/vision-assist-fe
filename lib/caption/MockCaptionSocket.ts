import { liveCaptions, type MockCaption } from "@/lib/mock/captions";

export type CaptionEvent =
  | { type: "open" }
  | { type: "caption"; caption: MockCaption }
  | { type: "error"; message: string }
  | { type: "close" };

export type CaptionListener = (event: CaptionEvent) => void;

export class MockCaptionSocket {
  private listeners = new Set<CaptionListener>();
  private connected = false;
  private cursor = 0;
  private pending = new Set<ReturnType<typeof setTimeout>>();

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

  async connect(): Promise<void> {
    if (this.connected) return;
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        this.connected = true;
        this.emit({ type: "open" });
        resolve();
      }, 200),
    );
  }

  sendFrame(): void {
    if (!this.connected) return;
    const jitter = 600 + Math.floor(Math.random() * 300);
    const next = liveCaptions[this.cursor % liveCaptions.length];
    this.cursor += 1;
    const handle = setTimeout(() => {
      this.pending.delete(handle);
      if (!this.connected || !next) return;
      this.emit({
        type: "caption",
        caption: {
          text: next.text,
          confidence: clamp(next.confidence + (Math.random() - 0.5) * 0.02),
        },
      });
    }, jitter);
    this.pending.add(handle);
  }

  close(): void {
    if (!this.connected) return;
    this.connected = false;
    for (const handle of this.pending) {
      clearTimeout(handle);
    }
    this.pending.clear();
    this.emit({ type: "close" });
  }

  isConnected(): boolean {
    return this.connected;
  }
}

function clamp(value: number, min = 0.85, max = 0.99): number {
  return Math.min(max, Math.max(min, value));
}
