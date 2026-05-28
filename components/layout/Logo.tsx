import { Aperture } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  href?: string;
  size?: "sm" | "md";
  className?: string;
}

export function Logo({ href = "/", size = "md", className }: LogoProps) {
  const iconSize = size === "sm" ? "size-5" : "size-6";
  const textSize = size === "sm" ? "text-lg" : "text-xl";
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 text-white",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85 focus-visible:rounded-md",
        className,
      )}
      aria-label="CapIt — home"
    >
      <Aperture aria-hidden="true" className={iconSize} />
      <span className={cn("font-bold tracking-tight", textSize)}>CapIt</span>
    </Link>
  );
}
