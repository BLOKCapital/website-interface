import type { CSSProperties } from "react";
import { Badge } from "@/components/ui/Badge";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { scenarios, type Verdict } from "@/lib/data/scenarios";
import { cn } from "@/lib/utils";
import { ScanToggle } from "./ScanToggle";

/** The rules demo's verdict stamps, in the same words and marks. */
const stamp: Record<Verdict, { label: string; mark: string; cls: string }> = {
  allow: { label: "Allowed", mark: "✓", cls: "border-leaf/45 bg-leaf/10 text-leaf" },
  block: { label: "Blocked", mark: "✕", cls: "border-negative/45 bg-negative/10 text-negative" },
  hold: { label: "Held", mark: "‖", cls: "border-caution/45 bg-caution/10 text-caution" },
};

/** The checks every scenario runs through, as the demo's traces state them. */
const checks = ["Owner's signature", "2% drift trigger", "0.5% value-loss cap", "±10% price band", "DAO-approved code"];

/**
 * The rules, at a glance (after Safe Pro's transaction scanner): the rules
 * demo's five scenarios slide through a "Garden checks" line and come out
 * stamped Allowed, Blocked or Held. It says "the contract says no" in a few
 * seconds on the home page; the full, traceable console is on /security.
 *
 * Pure CSS (globals.css, "Guard scanner"): server HTML, no JavaScript. The
 * still frame is the base style: with reduced motion or Pause motion the
 * five stamped chips sit in a row. Paused off screen (data-loop), on hover
 * and by its own Pause (ScanToggle, the one client piece). The scenarios
 * are illustrative, and the badge says so.
 */
export function GuardScanner({ className }: { className?: string }) {
  return (
    <div data-scan="" className={cn("theme-dark overflow-hidden rounded-panel border border-subtle bg-canvas", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-subtle px-5 py-3">
        <p className="flex items-center gap-2 font-mono text-caption text-fg-muted">
          <span aria-hidden className="size-1.5 rounded-full bg-leaf" />
          garden.checks
        </p>
        <span className="flex items-center gap-2">
          <Badge status="example" />
          <ScanToggle />
        </span>
      </div>
      <div data-loop="" className="scan-lane">
        <div aria-hidden className="scan-line">
          <span className="scan-line-label label-caps">Garden checks</span>
        </div>
        <ul className="scan-list">
          {scenarios.map((s, i) => {
            const v = stamp[s.verdict.kind];
            return (
              <li key={s.id} className="scan-chip rounded-card border border-subtle bg-card px-4 py-3" style={{ "--i": i } as CSSProperties}>
                <span className="block font-mono text-label text-fg-subtle">→ {s.caption}</span>
                <span className="mt-1 flex items-center justify-between gap-3">
                  <span className="text-small font-medium text-fg">{s.label}</span>
                  <span className={cn("scan-stamp inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-label uppercase tracking-caps", v.cls)}>
                    <span aria-hidden>{v.mark}</span>
                    {v.label}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col gap-3 border-t border-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-label text-fg-subtle">
          {checks.map((c, i) => (
            <span key={c} className="whitespace-nowrap">
              {i > 0 && (
                <span aria-hidden className="mr-3 text-leaf/60">
                  ·
                </span>
              )}
              {c}
            </span>
          ))}
        </p>
        <ArrowLink href="/security#rules" className="shrink-0">
          Run the full simulation
        </ArrowLink>
      </div>
    </div>
  );
}
