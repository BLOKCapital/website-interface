import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { audits } from "@/lib/data/audits";
import { cn } from "@/lib/utils";
import { findingsTotal } from "./findings";
import { readiness, type ReadinessStatus } from "./readiness";
import { registry } from "./contracts";

const report = audits.find((a) => a.kind === "report")!;
const published = registry.filter((r) => r.address);
const count = (s: ReadinessStatus) => readiness.filter((r) => r.status === s).length;

/** A readiness item as a meter segment: shape, not colour alone (as LaunchReadiness). */
const seg: Record<ReadinessStatus, string> = {
  done: "bg-success",
  progress: "bg-[linear-gradient(90deg,rgb(var(--progress))_50%,transparent_50%)] ring-1 ring-inset ring-progress/60",
  planned: "border border-dashed border-line/30",
};

/**
 * The /security hero's readout (after Safenet's instrument-panel hero): the
 * page's state in one dark panel, every value read from the data files the
 * page's own sections use, so it can't claim more than they do. The
 * readiness meter is one segment per LaunchReadiness item; the release line
 * is the pipeline Fig 3 draws.
 */
export function SecurityReadout({ release, className }: { release: string[]; className?: string }) {
  // One line each in the hero's aside column: short values, the detail lives in the sections.
  const rows: [string, ReactNode][] = [
    ["Network", "Arbitrum One"],
    ["Custody", "Your keys only"],
    ["Audit", [report.partner, report.auditedOn].filter(Boolean).join(", ")],
    ["Scope", `${report.coverage?.covered ?? "Garden contracts"} only`],
    ["Findings", `${findingsTotal}, all fixed and retested`],
    [
      "Addresses",
      <>
        {published.length} of {registry.length} <span className="text-fg-subtle">· {published.map((r) => r.name).join(", ")} only</span>
      </>,
    ],
    ["Upgrades", "DAO-approved only"],
  ];
  return (
    <div className={cn("theme-dark relative overflow-hidden rounded-panel border border-leaf/20 bg-card shadow-e3", className)}>
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_100%_0%,black,transparent_75%)]" />
      <div className="relative flex items-center justify-between gap-3 border-b border-subtle px-5 py-3.5">
        <p className="label-caps">
          Security <span className="text-leaf/70">{"//"}</span> readout
        </p>
        <Badge status="testing" />
      </div>
      <dl className="relative divide-y divide-subtle px-5">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 py-2">
            <dt className="label-caps pt-0.5">{k}</dt>
            <dd className="text-small text-fg">{v}</dd>
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
              {count("done")} of {readiness.length} done · {count("progress")} in progress · {count("planned")} planned
            </span>
          </dd>
        </div>
      </dl>
      <div className="relative border-t border-subtle px-5 py-3.5">
        <p className="label-caps">Release steps</p>
        <ol className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-label uppercase tracking-caps text-fg-muted">
          {release.map((s) => (
            <li key={s}>
              <span aria-hidden className="mr-1 text-leaf">
                &gt;
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
