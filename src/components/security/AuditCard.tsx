import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import type { Audit } from "@/lib/data/audits";

/** "Audited Nov 2024 · retested 28 Nov 2024 · report Dec 2024", from the data, so every date agrees. */
export function auditDates(a: Audit) {
  return [
    a.auditedOn && `Audited ${a.auditedOn}`,
    a.retestedOn && `retested ${a.retestedOn}`,
    a.reportDate && `report ${a.reportDate}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

/**
 * One audit or scanning tool (SEC-27, CRO-05). A report shows what it
 * covers, what it doesn't and its three dates, all from audits.ts. A tool
 * says up front that there's no public report (the first sentence of its
 * scope in the data) before it says what it does. Title and badge wrap
 * rather than clip at 768 (MOB-09b).
 */
export function AuditCard({ audit: a }: { audit: Audit }) {
  const report = a.kind === "report";
  // Tools: "Internal tooling · no public report. Automated security scan…"
  const [label, ...rest] = report ? [] : a.scope.split(/(?<=\.)\s+/);
  return (
    <Card className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <h3 className="display text-h3 text-fg">{a.partner}</h3>
        {report ? <Badge status="done" /> : <Badge tone="neutral">{a.date}</Badge>}
      </div>

      {report ? (
        <>
          <p className="mt-2 text-caption text-fg-subtle">{auditDates(a)}</p>
          <dl className="mt-4 flex-1 space-y-3 text-small">
            {a.coverage && (
              <div>
                <dt className="label-caps">Covers</dt>
                <dd className="mt-1 text-fg">{a.coverage.covered}</dd>
              </div>
            )}
            {a.coverage?.notCovered && (
              <div>
                <dt className="label-caps">Doesn&apos;t cover</dt>
                <dd className="mt-1 text-fg-muted">{a.coverage.notCovered}</dd>
              </div>
            )}
          </dl>
        </>
      ) : (
        <>
          <p className="label-caps mt-2">{label.replace(/\.$/, "")}</p>
          <p className="mt-3 flex-1 text-small text-fg-muted">{rest.join(" ")}</p>
        </>
      )}

      {a.url && (
        <a
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          data-cta={report ? "security_audit_report" : undefined}
          className="group/au mt-6 inline-flex items-center gap-1 self-start rounded-xs text-small font-medium text-leaf transition-colors duration-fast can-hover:hover:text-fg"
        >
          {report ? "Read the report" : `About ${a.partner}`}
          <Icon name="external" size="sm" className="transition-transform duration-fast can-hover:group-hover/au:-translate-y-0.5" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </Card>
  );
}
