/**
 * Client-readable configuration. `NEXT_PUBLIC_*` vars are inlined at build time,
 * so this falls back to the local backend default when unset.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

/**
 * WebSocket base URL for live captioning. Defaults to the API base with the scheme swapped
 * (http→ws, https→wss) when an explicit override isn't provided.
 */
export const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_BASE_URL ?? API_BASE_URL.replace(/^http/, "ws");
