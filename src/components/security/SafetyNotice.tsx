import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * "Stay safe": the anti-impersonation rule a visitor can check a scammer
 * against (SEC-09). Discord tickets are the only support channel, which is
 * exactly the pretext fake-support DMs use, so say plainly what the team
 * never does. Reusable: /security#disclosure today; /contact, the FAQ and
 * the footer can place it as is. Copy from H §3.5, no new facts.
 */
// Pending owner confirmation (SEC-09)
export function SafetyNotice({ className }: { className?: string }) {
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
        <Link
          href="/security#official"
          prefetch={false}
          className="rounded-xs font-medium text-leaf underline decoration-leaf/40 underline-offset-[3px] transition-colors duration-fast can-hover:hover:decoration-leaf"
        >
          Official links are listed here.
        </Link>
      </p>
    </div>
  );
}
