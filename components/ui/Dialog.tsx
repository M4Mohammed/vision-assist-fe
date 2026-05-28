"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export const DialogRoot = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  title: string;
  description?: ReactNode;
  hideCloseButton?: boolean;
}

export function DialogContent({
  title,
  description,
  hideCloseButton,
  className,
  children,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2",
          "rounded-[var(--radius-card)] border border-[var(--stroke)] bg-[var(--bg-surface)] p-6 shadow-2xl shadow-black/40",
          "focus:outline-none",
          className,
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <DialogPrimitive.Title className="text-xl font-semibold text-white">
              {title}
            </DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="text-sm text-[var(--fg-secondary)]">
                {description}
              </DialogPrimitive.Description>
            ) : null}
          </div>
          {!hideCloseButton ? (
            <DialogPrimitive.Close
              aria-label="Close"
              className="grid size-9 shrink-0 place-items-center rounded-full text-[var(--fg-secondary)] hover:bg-white/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85"
            >
              <X aria-hidden="true" className="size-5" />
            </DialogPrimitive.Close>
          ) : null}
        </div>
        <div className="mt-4">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
