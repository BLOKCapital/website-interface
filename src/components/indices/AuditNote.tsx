import { IntentLink } from "@/components/ui/IntentLink";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * The audits' status, exactly as /security#audits states it
 * (lib/data/audits.ts), with a link there (SEO-16). Sits under RiskNote on the index pages,
 * in the same type and link style.
 */
export function AuditNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-small text-fg-muted", className)}>
      {/* The space stays in this text node (see RiskNote). */}
      {"New independent audits are under way; each report is published in the docs once it's final. "}
      <IntentLink
        href="/security#audits"
        className="group/audit inline-flex items-center gap-1 whitespace-nowrap rounded-xs font-medium text-leaf underline decoration-leaf/40 underline-offset-[3px] transition-colors duration-fast can-hover:hover:decoration-leaf"
      >
        Audit status
        <Icon name="arrow-right" size="sm" className="transition-transform duration-fast can-hover:group-hover/audit:translate-x-0.5" />
      </IntentLink>
    </p>
  );
}
