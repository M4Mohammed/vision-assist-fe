import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { ReactNode } from "react";

export function SrOnly({ children }: { children: ReactNode }) {
  return <VisuallyHidden>{children}</VisuallyHidden>;
}
