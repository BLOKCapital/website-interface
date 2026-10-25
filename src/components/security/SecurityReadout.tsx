import type { ReactNode } from "react";
import { auditStatus } from "@/lib/data/audits";
import { cn } from "@/lib/utils";
import { readiness, readinessSummary, type ReadinessStatus } from "./readiness";


/** A readiness item as a meter segment: shape, not colour alone (as LaunchReadiness). */
const seg: Record<ReadinessStatus, string> = {
  done: "bg-success",
  progress: "bg-[linear-gradient(90deg,rgb(var(--progress))_50%,transparent_50%)] ring-1 ring-inset ring-progress/60",
  planned: "border border-dashed border-line/30",
};

/**
 * The /security hero's readout: the page's state on one sheet of
 * paper, every value read from the data files the page's own sections use,
 * so it can't claim more than they do. The readiness meter is one segment per LaunchReadiness item; the release
 * steps are typed on a strip pinned under it (the pipeline Fig 3 draws).
 */
export function SecurityReadout({ release, className }: { release: string[]; className?: string }) {
  // One line each in the hero's aside column: short values, the detail lives in the sections.
  const rows: [string, ReactNode][] = [
    ["Network", "Arbitrum One"],
    ["Custody", "Your keys only"],
    ["Audits", `New audits ${auditStatus.label.toLowerCase()}`],
    ["Addresses", "Published in the docs"],
    ["Upgrades", "DAO-approved only"],
  ];
  return (
    <div className={cn("relative", className)}>
      <div className="relative rounded-panel border border-subtle bg-card pb-9 shadow-soft">
        <div className="flex items-center justify-between gap-3 px-5 pb-2 pt-5">
          <p className="eyebrow">Readout</p>
        </div>
        <dl className="divide-y divide-subtle px-5">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 py-2">
              <dt className="label-caps pt-0.5">{k}</dt>
              <dd className="text-small font-semibold text-fg">{v}</dd>
            </div>
          ))}
          <div className="py-3">
            <dt className="label-caps">Readiness</dt>
            <dd className="mt-2">
              <span aria-hidden className="flex gap-1">
                {readiness.map((r) => (
                  <span key={r.id} title={r.criterion} className={cn("h-2 flex-1 rounded-full", seg[r.status])} />
                ))}
              </span>
              <span className="mt-1.5 block text-caption text-fg-muted">
                {readinessSummary()}
              </span>
            </dd>
          </div>
        </dl>
      </div>
      {/* The release steps, typed on a strip pinned across the sheet's foot. */}
      <div className="strip relative -mt-6 ml-4 mr-6 block">
        <p className="text-cobalt">release steps</p>
        <ol className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 uppercase tracking-caps">
          {release.map((s, i) => (
            <li key={s}>
              {s}
              {i < release.length - 1 && (
                <span aria-hidden className="ml-2 text-fg-subtle">
                  ›
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
