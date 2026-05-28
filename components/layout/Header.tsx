"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils/cn";

interface NavLinkProps {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}

function NavLink({ href, label, active, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "text-sm font-semibold uppercase tracking-[0.18em] transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85 focus-visible:rounded-md",
        active ? "text-white" : "text-[var(--fg-secondary)] hover:text-white",
      )}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--stroke)] bg-[var(--bg-base)]/85 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg-base)]/65">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-10 md:flex"
        >
          <NavLink href="/" label="Home" active={pathname === "/"} />
          {user ? (
            <NavLink
              href="/caption"
              label="Caption"
              active={pathname?.startsWith("/caption") ?? false}
            />
          ) : null}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <NavLink
                href="/profile"
                label="Profile"
                active={pathname?.startsWith("/profile") ?? false}
              />
              <Button size="sm" variant="ghost" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <NavLink
                href="/sign-in"
                label="Sign In"
                active={pathname === "/sign-in"}
              />
              <Button asChild size="sm">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-full text-white hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <X aria-hidden="true" className="size-6" />
          ) : (
            <Menu aria-hidden="true" className="size-6" />
          )}
        </button>
      </div>

      {menuOpen ? (
        <div
          id="primary-mobile-nav"
          className="border-t border-[var(--stroke)] bg-[var(--bg-base)] md:hidden"
        >
          <nav
            aria-label="Mobile primary"
            className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4"
          >
            <NavLink
              href="/"
              label="Home"
              active={pathname === "/"}
              onClick={close}
            />
            {user ? (
              <>
                <NavLink
                  href="/caption"
                  label="Caption"
                  active={pathname?.startsWith("/caption") ?? false}
                  onClick={close}
                />
                <NavLink
                  href="/profile"
                  label="Profile"
                  active={pathname?.startsWith("/profile") ?? false}
                  onClick={close}
                />
                <Button
                  size="md"
                  variant="secondary"
                  className="mt-3 w-full"
                  onClick={() => {
                    close();
                    signOut();
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <NavLink
                  href="/sign-in"
                  label="Sign In"
                  active={pathname === "/sign-in"}
                  onClick={close}
                />
                <Button asChild size="md" className="mt-3 w-full">
                  <Link href="/sign-up" onClick={close}>
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
