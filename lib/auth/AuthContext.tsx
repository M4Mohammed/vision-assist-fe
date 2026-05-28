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

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

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
  signOut: () => void;
}

const STORAGE_KEY = "capit:auth";
const STUB_DELAY_MS = 400;

const AuthContext = createContext<AuthContextValue | null>(null);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let hydratedUser: AuthUser | null = null;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        hydratedUser = JSON.parse(raw) as AuthUser;
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    // Hydrate from sessionStorage on first mount. The cascading render is
    // intentional: SSR has to render with user=null and the client then catches
    // up. This is the documented React hydration pattern for browser-only state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(hydratedUser);
    setIsLoading(false);
  }, []);

  const persist = useCallback((next: AuthUser | null) => {
    setUser(next);
    if (next) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const signUp = useCallback<AuthContextValue["signUp"]>(
    async (input) => {
      await sleep(STUB_DELAY_MS);
      const next: AuthUser = {
        id: `user_${Date.now()}`,
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
      };
      persist(next);
      return next;
    },
    [persist],
  );

  const signIn = useCallback<AuthContextValue["signIn"]>(
    async (input) => {
      await sleep(STUB_DELAY_MS);
      const next: AuthUser = {
        id: `user_${Date.now()}`,
        email: input.email,
        firstName: "Jane",
        lastName: "Doe",
      };
      persist(next);
      return next;
    },
    [persist],
  );

  const signOut = useCallback(() => {
    persist(null);
  }, [persist]);

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
