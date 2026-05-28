import Link from "next/link";
import { Logo } from "./Logo";

interface FooterLink {
  href: string;
  label: string;
}

const links: FooterLink[] = [
  { href: "/", label: "Home" },
  { href: "/caption", label: "Caption" },
  { href: "#privacy", label: "Privacy" },
  { href: "#terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--stroke)] bg-[var(--bg-base)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-12 sm:px-6 lg:px-8">
        <Logo size="sm" />
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10"
        >
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-[0.22em] text-[var(--fg-secondary)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85 focus-visible:rounded-md"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-center text-xs text-[var(--fg-muted)]">
          © {new Date().getFullYear()} CapIt. AI-powered real-time visual
          captioning for everyone.
        </p>
      </div>
    </footer>
  );
}
