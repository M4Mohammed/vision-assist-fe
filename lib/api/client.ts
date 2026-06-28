import { API_BASE_URL } from "@/lib/config/env";
import * as tokenStore from "@/lib/auth/tokenStore";
import { ApiClientError } from "./ApiClientError";
import type { ApiErrorBody, AuthResponse } from "./types";

interface RequestOptions {
  method?: string;
  body?: unknown;
  /** Attach the Bearer access token and enable automatic refresh-on-401. */
  auth?: boolean;
  /** Internal: skip the refresh-on-401 retry (used by the refresh call itself). */
  skipRefresh?: boolean;
}

/**
 * Performs a JSON request against the backend. For authenticated requests, a 401 triggers a single
 * (deduplicated) refresh and one retry; if refresh fails the session is cleared (global sign-out).
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false, skipRefresh = false } = options;

  const response = await doFetch(path, method, body, auth);

  if (response.status === 401 && auth && !skipRefresh) {
    try {
      await refreshSession();
    } catch {
      // Refresh failed; the session has been cleared. Surface the original 401.
      throw await toError(response);
    }
    const retry = await doFetch(path, method, body, true);
    if (!retry.ok) throw await toError(retry);
    return readBody<T>(retry);
  }

  if (!response.ok) throw await toError(response);
  return readBody<T>(response);
}

let refreshInFlight: Promise<string> | null = null;

/**
 * Exchanges the stored refresh token for a new token pair (single-flight). On any failure the
 * session is cleared so the app signs the user out.
 */
export function refreshSession(): Promise<string> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = tokenStore.getRefreshToken();
    if (!refreshToken) throw new ApiClientError(401, "Session expired");
    try {
      const response = await doFetch("/api/auth/refresh", "POST", { refreshToken }, false);
      if (!response.ok) throw await toError(response);
      const data = await readBody<AuthResponse>(response);
      tokenStore.write({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: Date.now() + data.expiresIn * 1000,
        user: data.user,
      });
      return data.accessToken;
    } catch (error) {
      tokenStore.clear();
      throw error;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

function doFetch(path: string, method: string, body: unknown, auth: boolean): Promise<Response> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = tokenStore.getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function readBody<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function toError(response: Response): Promise<ApiClientError> {
  let parsed: ApiErrorBody | null = null;
  try {
    parsed = (await response.json()) as ApiErrorBody;
  } catch {
    // Non-JSON or empty error body.
  }
  const message = parsed?.message ?? response.statusText ?? "Request failed";
  return new ApiClientError(response.status, message, parsed?.fieldErrors);
}
