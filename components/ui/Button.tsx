"use client";

import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  /** Only honored when `asChild` is false. With `asChild`, compose icons inside the child element. */
  leadingIcon?: ReactNode;
  /** Only honored when `asChild` is false. With `asChild`, compose icons inside the child element. */
  trailingIcon?: ReactNode;
  /** Only honored when `asChild` is false. */
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-[var(--fg-inverse)] hover:bg-white/90 active:bg-white/80",
  secondary:
    "border border-[var(--stroke-strong)] bg-transparent text-white hover:bg-white/[0.04] active:bg-white/[0.08]",
  ghost: "bg-transparent text-white hover:bg-white/[0.06]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-11 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85 disabled:pointer-events-none disabled:opacity-50";

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled,
  children,
  type,
  ...props
}: ButtonProps) {
  const composed = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (asChild) {
    return (
      <Slot className={composed} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <button
      className={composed}
      type={type ?? "button"}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden="true"
        />
      ) : leadingIcon ? (
        <span aria-hidden="true" className="inline-flex">
          {leadingIcon}
        </span>
      ) : null}
      <span className="inline-flex items-center">{children}</span>
      {trailingIcon ? (
        <span aria-hidden="true" className="inline-flex">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
}
