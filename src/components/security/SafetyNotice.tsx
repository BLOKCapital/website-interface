import { IntentLink } from "@/components/ui/IntentLink";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * "Stay safe": the anti-impersonation rule a visitor can check a scammer
 * against (SEC-09). Discord tickets are the only support channel, which is
 * exactly the pretext fake-support DMs use, so say plainly what the team
 * never does. Reusable: /security#disclosure today; /contact, the FAQ and
 * the footer can place it as is. Copy from H §3.5, no new facts.
 */
const officialLink =
  "rounded-xs font-medium text-leaf underline decoration-leaf/40 underline-offset-[3px] transition-colors duration-fast can-hover:hover:decoration-leaf";

// Pending owner confirmation (SEC-09)
/**
 * `stacked`: the same rule as a tall card (a stamp, the headline rule, the
 * rest, the link at the foot), for a column beside a taller card (/contact).
 */
export function SafetyNotice({ className, stacked = false }: { className?: string; stacked?: boolean }) {
  if (stacked) {
    return (
      <div role="note" aria-label="Stay safe" className={cn("flex flex-col rounded-panel border border-warning/35 bg-warning/6 p-6 sm:p-7", className)}>
        <span className="stamp ml-1 self-start text-warning-text">
          <Icon name="shield" size="sm" className="-ml-0.5 mr-1.5" />
          Stay safe
        </span>
        <p className="display mt-6 text-h3 text-fg">
          We&apos;ll never <em>DM you first.</em>
        </p>
        <p className="mt-3 text-small text-fg-muted">
          {"The BLOK Capital team never asks for your seed phrase, private keys or Google login, or for you to sign a transaction or ‘verify’ a wallet. Support happens only in tickets inside our Discord server."}
        </p>
        <IntentLink href="/security#official" className={cn("mt-auto self-start pt-5", officialLink)}>
          Official links are listed here.
        </IntentLink>
      </div>
    );
  }
  return (
    <div
      role="note"
      aria-label="Stay safe"
      className={cn("flex gap-3.5 rounded-card border border-warning/35 bg-warning/6 p-5", className)}
    >
      <Icon name="shield" className="mt-0.5 text-warning-text" />
      <p className="text-small text-fg-muted">
        <strong className="font-medium text-fg">{"Stay safe. "}</strong>
        {"The BLOK Capital team will never DM you first, and never asks for your seed phrase, private keys or Google login, or for you to sign a transaction or ‘verify’ a wallet. Support happens only in tickets inside our Discord server. "}
        <IntentLink href="/security#official" className={officialLink}>
          Official links are listed here.
        </IntentLink>
      </p>
    </div>
  );
}
