"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "@/lib/api/auth";
import * as tokenStore from "@/lib/auth/tokenStore";
import type { AuthUser, StoredSession } from "@/lib/auth/tokenStore";
import type { AuthResponse } from "@/lib/api/types";

export type { AuthUser };

export interface SignUpInput {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signUp: (input: SignUpInput) => Promise<AuthUser>;
  signIn: (input: SignInInput) => Promise<AuthUser>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toSession(response: AuthResponse): StoredSession {
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    expiresAt: Date.now() + response.expiresIn * 1000,
    user: response.user,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on first mount (browser-only), then validate the session
  // against the backend in the background. SSR renders with user=null; the client catches up.
  useEffect(() => {
    const session = tokenStore.read();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(session?.user ?? null);
    setIsLoading(false);

    if (!session) return;

    authApi
      .me()
      .then((freshUser) => {
        // Persist any server-side changes to the user; keep the existing tokens.
        const current = tokenStore.read();
        if (current) {
          tokenStore.write({ ...current, user: freshUser });
        }
        setUser(freshUser);
      })
      .catch(() => {
        // me() already attempted a refresh; if it still failed the store is cleared.
        setUser(null);
      });
  }, []);

  // Reflect token-store changes (refresh failure → sign-out, and cross-tab sign-in/out).
  useEffect(() => {
    return tokenStore.subscribe((session) => setUser(session?.user ?? null));
  }, []);

  const signUp = useCallback<AuthContextValue["signUp"]>(async (input) => {
    const response = await authApi.register(input);
    tokenStore.write(toSession(response));
    setUser(response.user);
    return response.user;
  }, []);

  const signIn = useCallback<AuthContextValue["signIn"]>(async (input) => {
    const response = await authApi.login(input);
    tokenStore.write(toSession(response));
    setUser(response.user);
    return response.user;
  }, []);

  const signOut = useCallback<AuthContextValue["signOut"]>(async () => {
    const refreshToken = tokenStore.getRefreshToken();
    tokenStore.clear();
    setUser(null);
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // Best-effort: the client is already signed out locally.
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, signUp, signIn, signOut }),
    [user, isLoading, signUp, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
