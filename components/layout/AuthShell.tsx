import type { ReactNode } from "react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils/cn";

interface AuthShellSplitProps {
  variant: "split";
  eyebrow: string;
  heading: string;
  description: string;
  bullets?: string[];
  children: ReactNode;
}

interface AuthShellCenteredProps {
  variant: "centered";
  children: ReactNode;
}

type AuthShellProps = AuthShellSplitProps | AuthShellCenteredProps;

export function AuthShell(props: AuthShellProps) {
  if (props.variant === "centered") {
    return (
      <div className="flex min-h-dvh flex-col">
        <div className="px-4 pt-6 sm:px-6">
          <Logo />
        </div>
        <main
          id="main"
          className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6"
        >
          <div className="w-full max-w-md">{props.children}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
      <aside
        className={cn(
          "relative flex flex-col justify-between gap-10 overflow-hidden px-6 py-10 lg:px-12 lg:py-16",
          "bg-[var(--bg-base)]",
        )}
        aria-label="Product highlights"
      >
        <Logo />
        <div className="flex flex-col gap-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--fg-muted)]">
            {props.eyebrow}
          </p>
          <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight lg:text-6xl">
            {props.heading}
          </h1>
          <p className="max-w-md text-base text-[var(--fg-secondary)]">
            {props.description}
          </p>
          {props.bullets && props.bullets.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-3">
              {props.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-center gap-3 text-sm text-[var(--fg-secondary)]"
                >
                  <span
                    aria-hidden="true"
                    className="inline-block size-1.5 rounded-full bg-white/70"
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--fg-muted)]">
          v.0.1 // build_alpha
        </p>
      </aside>
      <main
        id="main"
        className="flex items-center justify-center bg-[var(--bg-surface)] px-4 py-10 sm:px-6 lg:px-12"
      >
        <div className="w-full max-w-md">{props.children}</div>
      </main>
    </div>
  );
}
