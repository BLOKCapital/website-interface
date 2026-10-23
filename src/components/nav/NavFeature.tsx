import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import { TokenStack } from "@/components/indices/TokenLogo";
import { indices } from "@/lib/data/indices";
import { social } from "@/lib/data/socials";
import { DISCORD_LABEL, type NavGroup } from "@/lib/nav";

const foot = "mt-1 flex items-center justify-between gap-3 rounded-control bg-surface px-3 py-2.5";
const link = "group/f inline-flex shrink-0 items-center gap-1 text-caption font-semibold text-leaf";
const arrow = <ArrowIcon size={11} className="transition-transform group-hover/f:translate-x-0.5" />;

/**
 * The one-line footer of each menu: one fact or shortcut, never a second
 * column (the menus stay small). Protocol: the three indices, each with its
 * tokens. Governance: who votes today. Company: the Discord and X. Trust:
 * where to start.
 */
export function NavFeature({ id }: { id: NavGroup["id"] }) {
  if (id === "protocol") {
    return (
      <ul className={foot}>
        {indices.map((x) => (
          <li key={x.id}>
            <Link
              href={`/indices/${x.id}`}
              className="flex items-center gap-1.5 rounded-xs font-mono text-label text-fg transition-colors duration-fast hover:text-leaf"
            >
              <TokenStack symbols={x.components} size={14} max={3} />
              {x.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  if (id === "governance") {
    return (
      <div className={foot}>
        <p className="min-w-0 text-caption text-fg-muted">Core members vote until $BLOKC launches.</p>
        <Link href="/governance#process" className={link}>
          How {arrow}
        </Link>
      </div>
    );
  }
  if (id === "trust") {
    return (
      <div className={foot}>
        <p className="min-w-0 text-caption text-fg-muted">
          Check the work, <span className="hand">not our word.</span>
        </p>
        <Link href="/security#readiness" className={link}>
          What&apos;s done {arrow}
        </Link>
      </div>
    );
  }
  return (
    <div className={foot}>
      <a href={social("discord").href} data-placement="nav_company" target="_blank" rel="noopener noreferrer" className={link}>
        {DISCORD_LABEL} {arrow}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <a href={social("x").href} data-cta="nav_follow_x" data-placement="nav_company" target="_blank" rel="noopener noreferrer" className={link}>
        Follow on X {arrow}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
