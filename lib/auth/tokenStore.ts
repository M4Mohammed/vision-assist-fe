/**
 * localStorage-backed session store for the authenticated user and JWT tokens.
 *
 * It is the single source of truth shared by the API client (reads the access token, performs
 * refresh) and the AuthProvider (reflects the session in React state). Mutations notify same-tab
 * subscribers directly and cross-tab subscribers via the `storage` event, so sign-out/refresh in
 * one place (or another tab) propagates everywhere.
 */

const STORAGE_KEY = "capit:auth";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  /** Epoch millis when the access token expires (for future proactive refresh). */
  expiresAt: number;
  user: AuthUser;
}

type Listener = (session: StoredSession | null) => void;

const listeners = new Set<Listener>();

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function read(): StoredSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed?.accessToken || !parsed?.refreshToken || !parsed?.user) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function write(session: StoredSession): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  notify(session);
}

export function clear(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  notify(null);
}

export function getAccessToken(): string | null {
  return read()?.accessToken ?? null;
}

export function getRefreshToken(): string | null {
  return read()?.refreshToken ?? null;
}

function notify(session: StoredSession | null): void {
  listeners.forEach((listener) => listener(session));
}

/** Subscribe to session changes (same-tab mutations and cross-tab `storage` events). */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      listener(read());
    }
  };
  if (isBrowser()) {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    listeners.delete(listener);
    if (isBrowser()) {
      window.removeEventListener("storage", onStorage);
    }
  };
}
