import { IntentLink } from "@/components/ui/IntentLink";
import { audits } from "@/lib/data/audits";
import { indices } from "@/lib/data/indices";
import { links } from "@/lib/data/socials";
import type { GovernanceSnapshot } from "@/lib/data/proposals";
import { ArrowIcon } from "@/components/ui/icons";
import { CornerMarks } from "@/components/motion/CornerMarks";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

const credShields = audits.find((a) => a.partner === "CredShields");

/**
 * The protocol at a glance: only figures with a source, each linking to it.
 * No TVL or user counts: the protocol is in private testing and those numbers
 * aren't public, so they aren't shown (and never invented). Figures are data
 * being read, so they're simply there (D-34).
 *
 * A list of links, each read label first ("Network: Arbitrum One", A11Y-07);
 * `flex-col-reverse` still draws the figure above its label.
 */
export function AtAGlance({ governance }: { governance: GovernanceSnapshot }) {
  const executed = governance.proposals.filter((p) => p.statusLabel === "Executed").length;
  const items = [
    { id: "network", value: "Arbitrum One", label: "Network", href: "/protocol#architecture" },
    {
      id: "audit",
      // When the review ran, labelled with what it covered (CRO-05).
      value: credShields?.auditedOn ?? credShields?.date ?? "—",
      label: `CredShields audit · ${credShields?.coverage?.covered ?? "Garden contracts"}`,
      href: credShields?.url ?? "/security#audits",
    },
    { id: "proposals", value: governance.proposals.length ? String(executed) : "—", label: "DAO proposals executed", href: links.aragon },
    { id: "indices", value: String(indices.length), label: "On-chain indices", href: "/indices" },
    { id: "supply", value: "10B", label: "$BLOKC supply", href: "/token" },
  ];
  return (
    <section aria-label="At a glance" className="relative border-y border-subtle bg-surface">
      <CornerMarks />
      {/* Hairlines are the 1px gaps showing the line colour through.
          Phones: 2 per row (the last spans both). Tablets: 3 then 2, on a
          6-column grid. Desktop: all 5 in a row. */}
      <Container>
        <ul className="grid grid-cols-2 gap-px bg-line/7 md:grid-cols-6 lg:grid-cols-5">
          {items.map((i, idx) => {
            const external = /^https?:\/\//.test(i.href);
            return (
              <li
                key={i.id}
                className={cn(
                  "bg-surface",
                  idx === items.length - 1 && "col-span-2",
                  idx < 3 ? "md:col-span-2" : "md:col-span-3",
                  "lg:col-span-1",
                )}
              >
                <IntentLink
                  href={i.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  data-cta={`glance_${i.id}`}
                  className="focus-inset group/g flex h-full flex-col-reverse justify-end gap-2 px-4 py-6 transition-colors duration-fast can-hover:hover:bg-card sm:px-6"
                >
                  <span className="label-caps can-hover:group-hover/g:text-fg-muted">
                    {i.label}
                    <span className="sr-only">: </span>
                    {/* Half strength at rest, so touch readers see it's a link (MOB-19). */}
                    <ArrowIcon
                      size={12}
                      className="ml-1.5 inline-block align-[-1px] opacity-50 transition-opacity duration-fast group-focus-visible/g:opacity-100 can-hover:group-hover/g:opacity-100"
                    />
                  </span>
                  <span className="display text-h3 leading-tight text-fg tabular">{i.value}</span>
                  {external && <span className="sr-only">(opens in a new tab)</span>}
                </IntentLink>
              </li>
            );
          })}
        </ul>
        {/* Where the figures come from, and when (after Safe Foundation's "Figures as of …"). */}
        <p className="border-t border-subtle py-3 text-caption text-fg-subtle">
          Each figure links to its source.
          {governance.syncedLabel && <> Proposals as of {governance.syncedLabel}, read from Aragon when this page was built.</>}
        </p>
      </Container>
    </section>
  );
}
