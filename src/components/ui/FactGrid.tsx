import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A page's key facts as pinned note cards (the brand posts' "brokers 24"):
 * a small mono label over a heavy value, each on its own dashed card, for a
 * PageHero aside. Still a plain <dl> of <div>s (valid for axe). Only facts
 * the page itself states: this is a summary, not new claims.
 */
export function FactGrid({ items, className }: { items: [label: string, value: ReactNode][]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-3", className)}>
      {items.map(([k, v]) => (
        <div key={k} className="note-card p-4">
          <dt className="font-mono text-label lowercase text-fg-subtle">{k}</dt>
          <dd className="mt-1.5 text-h4 font-extrabold leading-tight tracking-tight text-fg">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
