/**
 * Error thrown by the API client for non-2xx responses. Carries the HTTP status and any
 * per-field validation errors so callers can surface them inline (see sign-in/sign-up pages).
 */
export class ApiClientError extends Error {
  readonly status: number;
  readonly fieldErrors?: Record<string, string>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}
