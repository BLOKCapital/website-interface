import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * The index contracts' audit status, exactly as /security#audits states
 * it, with a link there (SEO-16). Sits under RiskNote on the index pages,
 * in the same type and link style.
 */
export function AuditNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-small text-fg-muted", className)}>
      {/* The space stays in this text node (see RiskNote). */}
      {"The index and rebalancer contracts haven't had a published audit yet; they get one before anyone's money depends on them. "}
      <Link
        href="/security#audits"
        prefetch={false}
        className="group/audit inline-flex items-center gap-1 whitespace-nowrap rounded-xs font-medium text-leaf underline decoration-leaf/40 underline-offset-[3px] transition-colors duration-fast can-hover:hover:decoration-leaf"
      >
        See the audits
        <Icon name="arrow-right" size="sm" className="transition-transform duration-fast can-hover:group-hover/audit:translate-x-0.5" />
      </Link>
    </p>
  );
}
