import type { ProposalView } from "@/lib/data/proposals";
import { DrawBar } from "@/components/ui/DrawBar";
import { cn } from "@/lib/utils";

/**
 * Renders governance proposals passed in from a server component (already
 * fetched + formatted). Synchronous and SSR-stable, so it can be used inside
 * both server and client parents without hydration mismatches.
 */
export function ProposalFeed({ proposals }: { proposals: ProposalView[] }) {
  if (proposals.length === 0) {
    return (
      <p className="mt-5 text-[13px] leading-relaxed text-ink-subtle">
        Proposals load from the DAO on-chain. Check back shortly.
      </p>
    );
  }

  return (
    <ul className="mt-5 space-y-4">
      {proposals.map((p, i) => (
        <li key={p.id} className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[10px] tracking-wide text-ink-subtle">
                {p.id}
              </p>
              <p className="text-[13.5px] leading-snug text-ink">{p.title}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide",
                p.passing
                  ? "border-moss/40 bg-moss/10 text-moss-deep"
                  : "border-clay/40 bg-clay/10 text-clay-deep",
              )}
            >
              {p.statusLabel}
            </span>
          </div>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-paper-deep">
            <DrawBar
              delay={i * 0.08}
              className={cn(
                "absolute inset-y-0 left-0 rounded-full",
                p.passing ? "bg-moss" : "bg-clay",
              )}
              style={{ width: `${p.forPct.toFixed(1)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11.5px] text-ink-muted">
            <span className="font-mono tabular-nums">For {p.forPct.toFixed(1)}%</span>
            <span className="font-mono tabular-nums">{p.totalLabel}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
