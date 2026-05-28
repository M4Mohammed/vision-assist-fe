import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type CardVariant = "surface" | "elevated";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  asChild?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  surface: "bg-[var(--bg-surface)]",
  elevated: "bg-[var(--bg-elevated)]",
};

export function Card({
  className,
  variant = "surface",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-[var(--stroke)] p-6",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
