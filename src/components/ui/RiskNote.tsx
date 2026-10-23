import { IntentLink } from "@/components/ui/IntentLink";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * One-line risk statement for the places a newcomer weighs the product
 * (home hero facts, index pages, token page), linking to the full fees and
 * risks section (CRO-07, SEC-20). Server-safe; place it, don't restyle it.
 */
// Pending counsel review (SEC-13, D-03)
export function RiskNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-small text-fg-muted", className)}>
      {/* The space stays in this text node: a lone {" "} after React's text
          marker drops out of Chrome's accessibility tree. */}
      {"Crypto prices fall as well as rise, and code can fail. "}
      <IntentLink
        href="/protocol#fees"
        className="group/risk inline-flex items-center gap-1 whitespace-nowrap rounded-xs font-medium text-leaf underline decoration-leaf/40 underline-offset-[3px] transition-colors duration-fast can-hover:hover:decoration-leaf"
      >
        Read what can go wrong
        <Icon name="arrow-right" size="sm" className="transition-transform duration-fast can-hover:group-hover/risk:translate-x-0.5" />
      </IntentLink>
    </p>
  );
}
