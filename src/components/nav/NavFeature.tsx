import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ArrowIcon, DiscordIcon } from "@/components/ui/icons";
import { TokenStack } from "@/components/indices/TokenLogo";
import { indices } from "@/lib/data/indices";
import { protocolStatus } from "@/lib/data/status";
import { social } from "@/lib/data/socials";
import { audits } from "@/lib/data/audits";
import { NavIcon } from "./NavIcons";
import { DISCORD_LABEL, type NavGroup } from "@/lib/nav";

const card = "flex h-full flex-col rounded-card border border-subtle p-5";

// The one published report, named with its scope where the claim is made (INS-01).
const report = audits.find((a) => a.kind === "report");

/** The featured card on the right of each menu. */
export function NavFeature({ id }: { id: NavGroup["id"] }) {
  if (id === "protocol") {
    return (
      <div className={`theme-dark bg-card ${card}`}>
        <p className="label-caps">The indices</p>
        <ul className="mt-3 space-y-1">
          {indices.map((x) => (
            <li key={x.id}>
              <Link
                href={`/indices/${x.id}`}
                className="flex items-center justify-between gap-3 rounded-control px-2.5 py-2 transition-colors duration-fast hover:bg-line/6"
              >
                <span className="font-mono text-small text-fg">{x.name}</span>
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
        <p className="mt-4 text-body font-medium leading-snug text-fg">Core members vote until $BLOKC launches</p>
        <p className="mt-1.5 text-small text-fg-subtle">Token launch planned for {protocolStatus.token}; then holders vote.</p>
        <Link href="/governance#process" className="group/f mt-auto inline-flex items-center gap-1.5 pt-4 text-small font-medium text-leaf">
          How a decision is made <ArrowIcon size={12} className="transition-transform group-hover/f:translate-x-0.5" />
        </Link>
      </div>
    );
  }
  if (id === "trust") {
    return (
      <div className={`bg-raised ${card}`}>
        <span className="grid size-12 place-items-center rounded-control bg-leaf/10 text-leaf">
          <NavIcon href="/security" size={24} />
        </span>
        <p className="mt-4 text-body font-medium leading-snug text-fg">Check the work, not our word</p>
        <p className="mt-1.5 text-small text-fg-subtle">
          {report
            ? `${report.partner} audited the ${report.coverage?.covered ?? "Garden contracts"} (${report.auditedOn}). The newer index and rebalancer code gets a published review before launch.`
            : "Every contract, control and audit, with the proof beside it."}
        </p>
        <Link href="/security#readiness" className="group/f mt-auto inline-flex items-center gap-1.5 pt-4 text-small font-medium text-leaf">
          What&apos;s done, and what isn&apos;t yet <ArrowIcon size={12} className="transition-transform group-hover/f:translate-x-0.5" />
        </Link>
      </div>
    );
  }
  const link = "group/f inline-flex items-center gap-1.5 text-small font-medium text-leaf";
  return (
    <div className={`bg-raised ${card}`}>
      <span className="grid size-12 place-items-center rounded-control bg-leaf/10 text-leaf">
        <DiscordIcon size={24} />
      </span>
      <p className="mt-4 text-body font-medium leading-snug text-fg">The community lives in the Discord</p>
      <p className="mt-1.5 text-small text-fg-subtle">Testing feedback, support and security reports. Launch news goes out on X and in the Discord.</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-4">
        <a href={social("discord").href} data-placement="nav_company" target="_blank" rel="noopener noreferrer" className={link}>
          {DISCORD_LABEL} <ArrowIcon size={12} className="transition-transform group-hover/f:translate-x-0.5" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <a href={social("x").href} data-cta="nav_follow_x" data-placement="nav_company" target="_blank" rel="noopener noreferrer" className={link}>
          Follow on X <ArrowIcon size={12} className="transition-transform group-hover/f:translate-x-0.5" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
