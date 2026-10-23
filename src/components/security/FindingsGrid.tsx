import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { audits } from "@/lib/data/audits";
import { cn } from "@/lib/utils";
import { findings, findingsTotal } from "./findings";

const report = audits.find((a) => a.kind === "report")!;

/** Where each severity's marks start in the one tick sequence. */
const starts = findings.map((_, i) => findings.slice(0, i).reduce((n, f) => n + f.n, 0));

/**
 * The CredShields findings, one mark per finding, grouped by severity (after
 * Safe Foundation's grid of shields): 26 items read as "every one accounted
 * for" in a way a stacked bar can't. Each mark ticks to fixed in turn when
 * the card reveals (globals.css, "Audit findings"); without JS, with reduced
 * motion or paused, they're all ticked. The chips put the scope caveat next
 * to the number.
 */
export function FindingsGrid() {
  const label = `${findingsTotal} findings: ${findings.map((f) => `${f.n} ${f.k.toLowerCase()}`).join(", ")}. All fixed and retested.`;
  return (
    <Reveal>
      <Card>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="text-h4 font-medium text-fg">{report.partner} findings, by severity</h3>
          <p className="font-mono text-caption tabular-nums text-fg-subtle">{findingsTotal} findings</p>
        </div>
        <div role="img" aria-label={label} className="mt-6 flex flex-wrap gap-x-8 gap-y-5">
          {findings.map((f, g) => (
            <div key={f.k}>
              <p className="text-caption text-fg-muted">
                {f.k} <span className="font-mono tabular-nums text-fg">{f.n}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {f.n === 0 ? (
                  <span className="grid size-7 place-items-center rounded-control border border-dashed border-line/30 font-mono text-label text-fg-subtle">
                    0
                  </span>
                ) : (
                  Array.from({ length: f.n }, (_, i) => (
                    <span key={i} className={cn("grid size-7 place-items-center rounded-control", f.c)} style={{ "--i": starts[g] + i } as CSSProperties}>
                      <Icon name="check" size="sm" className="finding-tick text-canvas" />
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
        <ul className="mt-6 flex flex-wrap gap-2 text-caption">
          <li className="rounded-full border border-success/40 bg-success/10 px-3 py-1 text-success">0 critical</li>
          <li className="rounded-full border border-subtle px-3 py-1 text-fg-muted">All fixed and retested {report.retestedOn}</li>
          <li className="rounded-full border border-dashed border-line/30 px-3 py-1 text-fg-muted">
            Scope: {report.coverage?.covered ?? "Garden contracts"} only
          </li>
        </ul>
      </Card>
    </Reveal>
  );
}
