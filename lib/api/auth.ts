import { request } from "./client";
import type { AuthResponse, BackendUser } from "./types";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/** POST /api/auth/register — public; returns tokens + user (auto-login). */
export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/register", { method: "POST", body: payload });
}

/** POST /api/auth/login — public. */
export function login(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", { method: "POST", body: payload });
}

/** POST /api/auth/logout — revokes the refresh token (best-effort). */
export function logout(refreshToken: string): Promise<void> {
  return request<void>("/api/auth/logout", {
    method: "POST",
    body: { refreshToken },
    auth: true,
  });
}

/** GET /api/auth/me — validates the current session. */
export function me(): Promise<BackendUser> {
  return request<BackendUser>("/api/auth/me", { auth: true });
}
