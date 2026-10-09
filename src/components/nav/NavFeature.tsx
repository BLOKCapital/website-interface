import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ArrowIcon, DiscordIcon } from "@/components/ui/icons";
import { TokenStack } from "@/components/indices/TokenLogo";
import { indices } from "@/lib/data/indices";
import { protocolStatus } from "@/lib/data/status";
import { social } from "@/lib/data/socials";
import type { NavGroup } from "@/lib/nav";

const card = "flex h-full flex-col rounded-2xl border border-line/[0.08] p-5";

/** The featured card on the right of each menu. */
export function NavFeature({ id }: { id: NavGroup["id"] }) {
  if (id === "protocol") {
    return (
      <div className={`theme-dark bg-card ${card}`}>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">The indices</p>
        <ul className="mt-3 space-y-1">
          {indices.map((x) => (
            <li key={x.id}>
              <Link
                href={`/indices/${x.id}`}
                className="flex items-center justify-between gap-3 rounded-xl px-2.5 py-2 transition-colors duration-fast hover:bg-line/[0.06]"
              >
                <span className="font-mono text-[14px] text-fg">{x.name}</span>
                <TokenStack symbols={x.components} size={22} max={5} />
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/indices" className="group/f mt-auto inline-flex items-center gap-1.5 pt-4 text-small font-medium text-leaf">
          Compare all three <ArrowIcon size={12} className="transition-transform group-hover/f:translate-x-0.5" />
        </Link>
      </div>
    );
  }
  if (id === "governance") {
    return (
      <div className={`bg-raised ${card}`}>
        <div className="flex items-start justify-between gap-3">
          <Badge tone="current">Current phase</Badge>
          <Image src="/brand/token-front.webp" alt="" width={48} height={48} className="size-12" />
        </div>
        <p className="mt-4 text-[16px] font-medium leading-snug text-fg">Core members vote until $BLOKC launches</p>
        <p className="mt-1.5 text-small text-fg-subtle">Token launch planned for {protocolStatus.token}; then holders vote.</p>
        <Link href="/governance#process" className="group/f mt-auto inline-flex items-center gap-1.5 pt-4 text-small font-medium text-leaf">
          How a decision is made <ArrowIcon size={12} className="transition-transform group-hover/f:translate-x-0.5" />
        </Link>
      </div>
    );
  }
  return (
    <div className={`bg-raised ${card}`}>
      <span className="grid size-12 place-items-center rounded-xl bg-leaf/10 text-leaf">
        <DiscordIcon size={24} />
      </span>
      <p className="mt-4 text-[16px] font-medium leading-snug text-fg">The team is in the Discord every day</p>
      <p className="mt-1.5 text-small text-fg-subtle">Testing feedback, support and security reports go there.</p>
      <a
        href={social("discord").href}
        target="_blank"
        rel="noopener noreferrer"
        className="group/f mt-auto inline-flex items-center gap-1.5 pt-4 text-small font-medium text-leaf"
      >
        Join the Discord <ArrowIcon size={12} className="transition-transform group-hover/f:translate-x-0.5" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
