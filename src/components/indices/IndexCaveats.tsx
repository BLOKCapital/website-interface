import type { ReactNode } from "react";
import { RiskNote } from "@/components/ui/RiskNote";
import { AuditNote } from "@/components/indices/AuditNote";
import { cn } from "@/lib/utils";

/**
 * The two caveats every index page carries (CRO-07, SEO-16), set apart in
 * one tinted card so they read as deliberate, not as stray lines: the risk
 * line and the audit-scope line, plus an optional link after them.
 */
export function IndexCaveats({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={cn("rounded-card border border-emphasis/20 bg-emphasis/6 p-5", className)}>
      <p className="label-caps">Before you follow an index</p>
      <div className="mt-3 space-y-2">
        <RiskNote />
        <AuditNote />
      </div>
      {children}
    </div>
  );
}
