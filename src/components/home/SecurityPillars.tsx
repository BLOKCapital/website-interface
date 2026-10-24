import { IntentLink } from "@/components/ui/IntentLink";
import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PillarIcon } from "@/components/ui/PillarIcons";
import { Stagger } from "@/components/ui/Reveal";
import { ArrowIcon, ExternalIcon } from "@/components/ui/icons";
import { pillars } from "@/lib/data/pillars";

/**
 * Docs explain how something works; code, the audit and the on-chain record
 * prove it. Each link says which it is (CRO-13).
 */
const isDocs = (href: string) => /^https?:\/\/docs\./.test(href);

/**
 * "Don't trust us. Check.": six security properties in plain words, each
 * linking to where it's shown (the standards behind them are in the docs and
 * pillars.ts `spec`, not on the cards); then `children`, if any.
 * A property that isn't live yet carries its "Planned" badge, and its copy
 * is in the future tense (pillars.ts).
 *
 * The grid clips its rounded corners, so focus rings are drawn inside each
 * cell (focus-inset, A11Y-16). Each cell's link is named by its title, its
 * status and what it leads to, with the description read after (A11Y-31).
 */
export function SecurityPillars({ children }: { children?: ReactNode }) {
  return (
    <Section
      id="security"
      eyebrow="Security"
      title={
        <>
          Don&apos;t trust us. <em className="text-sand">Check.</em>
        </>
      }
      description="Six things that keep your money yours. Each one links to where it's shown: the docs or the code."
      actions={
        <Button href="/security" variant="secondary" data-cta="security_contracts_audits">
          Contracts and audits
        </Button>
      }
    >
      <Stagger
        as="ul"
        className="focus-inset grid gap-px overflow-hidden rounded-card border border-subtle bg-line/8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {pillars.map((p) => {
          const external = p.href?.startsWith("http") ?? false;
          const id = `pillar-${p.id}`;
          const named = [`${id}-title`, p.planned && `${id}-status`, p.href && `${id}-cta`, external && `${id}-newtab`]
            .filter(Boolean)
            .join(" ");
          const inner = (
            <>
              <PillarIcon id={p.id} />
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                <h3 id={`${id}-title`} className="text-h4 font-bold tracking-tight text-fg">
                  {p.label}
                </h3>
                {p.planned && (
                  <span id={`${id}-status`}>
                    <Badge tone="soon">{p.planned}</Badge>
                  </span>
                )}
              </div>
              <p id={`${id}-desc`} className="mt-2 text-small text-fg-muted">
                {p.description}
              </p>
              {p.href && (
                <span id={`${id}-cta`} className="mt-5 inline-flex items-center gap-1.5 text-small font-medium text-leaf">
                  {isDocs(p.href) ? "Read how it works" : "See the proof"}
                  {external ? <ExternalIcon /> : <ArrowIcon size={13} />}
                </span>
              )}
            </>
          );
          return (
            // A RevealItem that also carries the analytics id for its link.
            <li key={p.id} data-reveal-item="" data-cta={`pillar_${p.id.replace(/-/g, "_")}`} suppressHydrationWarning className="bg-canvas">
              {p.href ? (
                <IntentLink
                  href={p.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  aria-labelledby={named}
                  aria-describedby={`${id}-desc`}
                  className="block h-full p-7 transition-colors duration-fast can-hover:hover:bg-card"
                >
                  {inner}
                  {external && (
                    <span id={`${id}-newtab`} className="sr-only">
                      (opens in a new tab)
                    </span>
                  )}
                </IntentLink>
              ) : (
                <div className="h-full p-7">{inner}</div>
              )}
            </li>
          );
        })}
      </Stagger>
      {children}
    </Section>
  );
}
