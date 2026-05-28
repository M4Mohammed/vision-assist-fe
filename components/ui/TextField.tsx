"use client";

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  trailing?: ReactNode;
  containerClassName?: string;
  labelClassName?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      hideLabel,
      hint,
      error,
      trailing,
      id,
      className,
      containerClassName,
      labelClassName,
      ...props
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className={cn("flex flex-col gap-2", containerClassName)}>
        <label
          htmlFor={inputId}
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)]",
            hideLabel && "sr-only",
            labelClassName,
          )}
        >
          {label}
        </label>
        <div
          className={cn(
            "group relative flex h-12 items-center rounded-[var(--radius-input)] border bg-[var(--bg-elevated)] px-4",
            "border-[var(--stroke)] focus-within:border-white/40",
            error && "border-red-500/60 focus-within:border-red-400",
          )}
        >
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "h-full w-full bg-transparent text-base text-white outline-none placeholder:text-[var(--fg-muted)]",
              className,
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              [hintId, errorId].filter(Boolean).join(" ") || undefined
            }
            {...props}
          />
          {trailing ? (
            <span className="ml-2 flex items-center text-[var(--fg-muted)]">
              {trailing}
            </span>
          ) : null}
        </div>
        {hint && !error ? (
          <p
            id={hintId}
            className="text-xs text-[var(--fg-muted)]"
          >
            {hint}
          </p>
        ) : null}
        {error ? (
          <p
            id={errorId}
            className="text-xs text-red-400"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
