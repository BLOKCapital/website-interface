import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { brandFacts } from "@/lib/seo/facts";
import { cn } from "@/lib/utils";

/** The glossary entries' anchor ids, used by TermLink. */
export type TermId = "garden" | "smart-account" | "diamond" | "facet" | "index" | "gardener";

/** A definition from the site's canonical facts (lib/seo/facts.ts), by term. */
const fact = (term: string) => brandFacts.glossary.find((g) => g.term === term)?.definition;

/**
 * Six terms the protocol pages lean on (CRO-15). Garden, Gardener and index
 * reuse `brandFacts.glossary`, the definitions llms.txt and the structured
 * data already publish, so the page and the machine-readable facts can't
 * drift. The other three restate copy already on /protocol (Architecture,
 * the explorer); nothing here is new.
 */
const terms: { id: TermId; term: string; spec?: string; definition: string | undefined }[] = [
  { id: "garden", term: "Garden", definition: fact("Garden") },
  {
    id: "smart-account",
    term: "Smart account",
    spec: "ERC-4337",
    definition:
      "The kind of wallet a Garden is: a smart-contract wallet at your own address, which this site calls a smart wallet. Sign in with Google through Web3Auth's MPC (no seed phrase) or bring your own wallet; batched actions need one signature.",
  },
  {
    id: "diamond",
    term: "Diamond",
    spec: "EIP-2535",
    definition:
      "The contract pattern every Garden is built on. Its capabilities live in facets that can be added or swapped without migrating your storage. The usual diamondCut is blocked, so an upgrade can only install what the DAO has approved.",
  },
  {
    id: "facet",
    term: "Facet",
    definition:
      "A module that gives a Garden one capability: follow an index, lend on Aave, trade perps on GMX. Remove one and nothing else changes. A Garden can only install a facet the DAO has approved in the Facet Registry.",
  },
  { id: "index", term: "Index", definition: fact("Curated index") },
  { id: "gardener", term: "Gardener", definition: fact("Gardener") },
];

/**
 * The first mention of a glossary term in the page's own copy, linked to its
 * definition. Same colour as the sentence around it; a dotted underline says
 * it's a term, not a destination.
 */
export function TermLink({ id, children, className }: { id: TermId; children: ReactNode; className?: string }) {
  return (
    <a
      href={`#term-${id}`}
      className={cn(
        "rounded-xs underline decoration-fg-subtle/70 decoration-dotted decoration-1 underline-offset-4 transition-colors duration-fast",
        "can-hover:hover:text-fg can-hover:hover:decoration-leaf",
        className,
      )}
    >
      {children}
    </a>
  );
}

/** The six-term glossary block for /protocol (#glossary; each term at #term-…). */
export function Glossary() {
  const defined = terms.filter((t): t is (typeof terms)[number] & { definition: string } => !!t.definition);
  return (
    <Section
      id="glossary"
      eyebrow="Glossary"
      title="Six words, defined once."
      description="The terms this page leans on. Each one's first mention above links here."
    >
      <Reveal>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {defined.map((t) => (
            // :target marks the definition a term link just jumped to.
            <div
              key={t.id}
              id={`term-${t.id}`}
              className="scroll-mt-28 rounded-card border border-subtle bg-card p-5 transition-colors duration-base target:border-leaf/40 target:bg-raised"
            >
              <dt className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="text-h4 font-medium text-fg">{t.term}</span>
                {t.spec && <span className="label-caps text-leaf">{t.spec}</span>}
              </dt>
              <dd className="mt-2 text-small text-fg-muted">{t.definition}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
