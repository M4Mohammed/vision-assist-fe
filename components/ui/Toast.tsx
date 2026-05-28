"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils/cn";

type ToastTone = "info" | "success" | "error";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
  duration: number;
}

interface ToastContextValue {
  toast: (input: {
    title: string;
    description?: string;
    tone?: ToastTone;
    duration?: number;
  }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toneClasses: Record<ToastTone, string> = {
  info: "border-[var(--stroke)] bg-[var(--bg-surface)]",
  success: "border-emerald-500/40 bg-emerald-950/40",
  error: "border-red-500/40 bg-red-950/40",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback<ToastContextValue["toast"]>((input) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setItems((prev) => [
      ...prev,
      {
        id,
        title: input.title,
        description: input.description,
        tone: input.tone ?? "info",
        duration: input.duration ?? 4500,
      },
    ]);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {items.map((item) => (
          <ToastPrimitive.Root
            key={item.id}
            duration={item.duration}
            onOpenChange={(open) => {
              if (!open) remove(item.id);
            }}
            className={cn(
              "pointer-events-auto flex w-[calc(100vw-2rem)] max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-xl shadow-black/30",
              "data-[state=open]:animate-in data-[state=open]:slide-in-from-right-4 data-[state=open]:fade-in",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out",
              toneClasses[item.tone],
            )}
          >
            <div className="flex flex-1 flex-col gap-1">
              <ToastPrimitive.Title className="text-sm font-semibold text-white">
                {item.title}
              </ToastPrimitive.Title>
              {item.description ? (
                <ToastPrimitive.Description className="text-sm text-[var(--fg-secondary)]">
                  {item.description}
                </ToastPrimitive.Description>
              ) : null}
            </div>
            <ToastPrimitive.Close
              aria-label="Dismiss"
              className="grid size-7 place-items-center rounded-full text-[var(--fg-secondary)] hover:bg-white/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85"
            >
              <X aria-hidden="true" className="size-4" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-auto flex-col gap-2" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}
