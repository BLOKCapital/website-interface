import Link from "next/link";
import { audits } from "@/lib/data/audits";
import { partnerGroups } from "@/lib/data/partners";
import { links } from "@/lib/data/socials";
import type { GovernanceSnapshot } from "@/lib/data/proposals";
import { ArrowIcon } from "@/components/ui/icons";

const credShields = audits.find((a) => a.partner === "CredShields");
const integrations = partnerGroups.reduce((n, g) => n + g.partners.length, 0);

/**
 * The protocol at a glance: only figures with a source, each linking to it.
 * No TVL or user counts: the protocol is in private testing and those numbers
 * aren't public, so they aren't shown (and never invented).
 */
export function AtAGlance({ governance }: { governance: GovernanceSnapshot }) {
  const executed = governance.proposals.filter((p) => p.statusLabel === "Executed").length;
  const items = [
    { value: "Arbitrum One", label: "Network", href: "/protocol#architecture" },
    { value: credShields?.date ?? "v1.0", label: "CredShields audit", href: credShields?.url ?? "/security" },
    {
      value: governance.proposals.length ? String(executed) : "—",
      label: "DAO proposals executed",
      href: links.aragon,
    },
    { value: String(integrations), label: "Protocol integrations", href: "#ecosystem" },
    { value: "10B", label: "$BLOKC supply", href: "/token" },
  ];
  return (
    <section aria-label="At a glance" className="border-y border-line/[0.07] bg-surface">
      <dl className="mx-auto grid w-full max-w-page grid-cols-2 px-5 sm:px-8 md:grid-cols-5">
        {items.map((i, idx) => {
          const external = /^https?:\/\//.test(i.href);
          return (
            <div
              key={i.label}
              className={`border-line/[0.07] ${idx % 2 === 1 ? "border-l" : ""} ${idx > 0 ? "md:border-l" : ""} ${idx < 4 ? "border-b md:border-b-0" : ""} ${idx === 4 ? "col-span-2 md:col-span-1" : ""}`}
            >
              <Link
                href={i.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group/g flex h-full flex-col gap-1.5 px-4 py-6 transition-colors hover:bg-card sm:px-6"
              >
                <dd className="display text-[26px] leading-none text-fg tabular">{i.value}</dd>
                <dt className="flex items-center gap-1.5 text-caption text-fg-subtle group-hover/g:text-fg-muted">
                  {i.label}
                  <ArrowIcon size={12} className="opacity-0 transition-opacity group-hover/g:opacity-100" />
                </dt>
                {external && <span className="sr-only">(opens in a new tab)</span>}
              </Link>
            </div>
          );
        })}
      </dl>
      {governance.syncedLabel && (
        <p className="mx-auto max-w-page px-5 pb-4 text-right text-[11.5px] text-fg-subtle sm:px-8">
          Governance data synced from chain {governance.syncedLabel}
        </p>
      )}
    </section>
  );
}
