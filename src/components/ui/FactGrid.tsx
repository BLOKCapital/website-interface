import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A page's key facts as a two-column grid of label/value pairs, for a
 * PageHero aside. Hairline dividers come from the 1px gaps over a subtle
 * line tint, so the list stays a plain <dl> of <div>s (valid for axe).
 * Only facts the page itself states: this is a summary, not new claims.
 */
export function FactGrid({ items, className }: { items: [label: string, value: ReactNode][]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-card border border-subtle bg-line/8 text-small", className)}>
      {items.map(([k, v]) => (
        <div key={k} className="bg-card p-4">
          <dt className="text-caption text-fg-subtle">{k}</dt>
          <dd className="mt-1 text-fg">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
