import { protocolStatus } from "@/lib/data/status";
import { cn } from "@/lib/utils";

/**
 * The launch state in one plain sentence, for under a hero's calls to
 * action (CRO-02): it says what "in private testing" means for the
 * visitor. From lib/data/status.ts, so it can't drift from the badges.
 * Deliberately no date or quarter: none is published (D-02).
 */
export function StatusLine({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-center gap-2 text-small text-fg-muted", className)}>
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-progress" />
      {protocolStatus.label}: the app is open to testers first, and Gardens open to everyone after testing.
    </p>
  );
}
