import Link from "next/link";
import { audits } from "@/lib/data/audits";
import { indices } from "@/lib/data/indices";
import { links } from "@/lib/data/socials";
import type { GovernanceSnapshot } from "@/lib/data/proposals";
import { ArrowIcon } from "@/components/ui/icons";
import { CountUp } from "@/components/motion/CountUp";
import { CornerMarks } from "@/components/motion/CornerMarks";
import { cn } from "@/lib/utils";

const credShields = audits.find((a) => a.partner === "CredShields");

/**
 * The protocol at a glance: only figures with a source, each linking to it.
 * No TVL or user counts: the protocol is in private testing and those numbers
 * aren't public, so they aren't shown (and never invented). Counts run up
 * to their real value as the band scrolls into view.
 */
export function AtAGlance({ governance }: { governance: GovernanceSnapshot }) {
  const executed = governance.proposals.filter((p) => p.statusLabel === "Executed").length;
  const items = [
    { value: "Arbitrum One", label: "Network", href: "/protocol#architecture" },
    { value: credShields?.date ?? "v1.0", label: "CredShields audit", href: credShields?.url ?? "/security" },
    {
      value: governance.proposals.length ? <CountUp value={executed} /> : "—",
      label: "DAO proposals executed",
      href: links.aragon,
    },
    { value: <CountUp value={indices.length} />, label: "On-chain indices", href: "/indices" },
    { value: <CountUp value={10} suffix="B" />, label: "$BLOKC supply", href: "/token" },
  ];
  return (
    <section aria-label="At a glance" className="relative border-y border-line/[0.07] bg-surface">
      <CornerMarks />
      {/* Hairlines are the 1px gaps showing the line colour through.
          Phones: 2 per row (the last spans both). Tablets: 3 then 2, on a
          6-column grid. Desktop: all 5 in a row. */}
      <div className="mx-auto w-full max-w-page px-5 sm:px-8">
        <dl className="grid grid-cols-2 gap-px bg-line/[0.07] md:grid-cols-6 lg:grid-cols-5">
          {items.map((i, idx) => {
            const external = /^https?:\/\//.test(i.href);
            return (
              <div
                key={i.label}
                className={cn(
                  "bg-surface",
                  idx === items.length - 1 && "col-span-2",
                  idx < 3 ? "md:col-span-2" : "md:col-span-3",
                  "lg:col-span-1",
                )}
              >
                <Link
                  href={i.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group/g flex h-full flex-col gap-2 px-4 py-6 transition-colors duration-base hover:bg-card sm:px-6"
                >
                  <dd className="display whitespace-nowrap text-[clamp(22px,1.4vw+14px,28px)] leading-none text-fg tabular">{i.value}</dd>
                  <dt className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle group-hover/g:text-fg-muted">
                    {i.label}
                    <ArrowIcon size={12} className="opacity-0 transition-opacity group-hover/g:opacity-100" />
                  </dt>
                  {external && <span className="sr-only">(opens in a new tab)</span>}
                </Link>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
