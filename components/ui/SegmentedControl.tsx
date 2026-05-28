"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";

export const Segmented = TabsPrimitive.Root;
export const SegmentedContent = TabsPrimitive.Content;

export function SegmentedList({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-[var(--stroke)] bg-[var(--bg-surface)] p-1",
        className,
      )}
      {...props}
    />
  );
}

export function SegmentedTrigger({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-medium tracking-wide text-[var(--fg-secondary)]",
        "transition-colors duration-150 ease-out",
        "hover:text-white",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85",
        "data-[state=active]:bg-white data-[state=active]:text-[var(--fg-inverse)]",
        className,
      )}
      {...props}
    />
  );
}
