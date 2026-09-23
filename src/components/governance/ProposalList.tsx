import { Badge } from "@/components/ui/Badge";
import { links } from "@/lib/data/socials";
import type { GovernanceSnapshot } from "@/lib/data/proposals";
import { cn } from "@/lib/utils";

/**
 * On-chain proposals from the build-time snapshot. Each row: title, status,
 * a For bar and turnout. The empty state points to Aragon instead of implying
 * the data is loading.
 */
export function ProposalList({
  governance,
  limit,
  className,
}: {
  governance: GovernanceSnapshot;
  limit?: number;
  className?: string;
}) {
  const list = limit ? governance.proposals.slice(0, limit) : governance.proposals;

  if (list.length === 0) {
    return (
      <p className={cn("rounded-xl border border-dashed border-line/15 p-5 text-small text-fg-muted", className)}>
        Proposals couldn&apos;t be loaded when this page was built.{" "}
        <a href={links.aragon} target="_blank" rel="noopener noreferrer" className="text-leaf underline underline-offset-2">
          See them on Aragon
        </a>
        .
      </p>
    );
  }

  return (
    <ul className={cn("space-y-5", className)}>
      {list.map((p) => (
        <li key={p.id}>
          <div className="flex items-start justify-between gap-4">
            <p className="text-[15px] leading-snug text-fg">{p.title}</p>
            <Badge tone={p.active ? "live" : p.passing ? "done" : "neutral"}>{p.statusLabel}</Badge>
          </div>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-line/[0.08]"
            role="img"
            aria-label={`${p.forPct.toFixed(1)}% voted for`}
          >
            <div className="h-full rounded-full bg-leaf" style={{ width: `${p.forPct}%` }} />
          </div>
          <p className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 font-mono text-[12px] text-fg-subtle tabular">
            <span>For {p.forPct.toFixed(1)}%</span>
            <span>
              Turnout {p.turnoutPct.toFixed(1)}%{p.endLabel && ` · ${p.active ? "ends" : "ended"} ${p.endLabel}`}
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
}
