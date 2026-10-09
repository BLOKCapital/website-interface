import type { Milestone } from "@/lib/data/milestones";
import { cn } from "@/lib/utils";

/**
 * The token's road ahead on a vertical rail: each milestone a node with its
 * quarter, the next one marked. Order is as given (soonest first).
 */
export function TokenTimeline({ items }: { items: Milestone[] }) {
  const next = items.findIndex((m) => m.status !== "done");
  return (
    <div className="h-full rounded-[28px] border border-line/[0.08] bg-card p-6 sm:p-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">Timeline</p>
      <ol className="relative mt-6">
        <span aria-hidden className="absolute bottom-3 left-[7px] top-2 w-px bg-line/12" />
        {items.map((m, i) => {
          const isNext = i === next;
          return (
            <li key={m.id} className="relative grid grid-cols-[15px_1fr] gap-4 pb-7 last:pb-0">
              <span
                aria-hidden
                className={cn(
                  "relative z-10 mt-1 size-[15px] rounded-full border-2",
                  m.status === "done" ? "border-leaf bg-leaf" : isNext ? "border-leaf bg-card shadow-[0_0_0_5px_rgb(var(--leaf)/0.12)]" : "border-line/25 bg-card",
                )}
              />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-mono text-[11.5px] tracking-wide text-leaf">{m.quarter}</span>
                  {isNext && (
                    <span className="rounded-full border border-leaf/30 bg-leaf/10 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-leaf">
                      Next
                    </span>
                  )}
                </p>
                <h3 className="mt-1 text-[16px] font-medium text-fg">{m.label}</h3>
                <p className="mt-1 text-small text-fg-muted">{m.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
