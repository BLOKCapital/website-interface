import type { ReactNode } from "react";
import { Hint } from "@/components/ui/Hint";
import { brandFacts } from "@/lib/seo/facts";

/** The terms the protocol pages lean on. */
export type TermId = "garden" | "smart-account" | "diamond" | "facet" | "index" | "gardener";

/** A definition from the site's canonical facts (lib/seo/facts.ts), by term. */
const fact = (term: string) => brandFacts.glossary.find((g) => g.term === term)?.definition;

/**
 * Six terms the protocol pages lean on (CRO-15), defined in plain words.
 * Garden, Gardener and index reuse `brandFacts.glossary`, the definitions
 * llms.txt and the structured data already publish, so the page and the
 * machine-readable facts can't drift. The standards behind the others
 * (ERC-4337, EIP-2535) are in the docs, not here.
 */
const terms: Record<TermId, string | undefined> = {
  garden: fact("Garden"),
  "smart-account":
    "The kind of wallet a Garden is: a smart-contract wallet at your own address, which this site calls a smart wallet. Sign in with Google (no seed phrase) or bring your own wallet.",
  diamond:
    "The contract design every Garden is built on. Its features are modules (facets) that can be added or swapped without moving your funds, and only ones the DAO has approved can be installed.",
  facet:
    "A module that gives a Garden one feature: follow an index, lend on Aave, trade perps on GMX. Remove one and nothing else changes. Only DAO-approved facets can be installed.",
  index: fact("Curated index"),
  gardener: fact("Gardener"),
};

/**
 * A term in the page's own copy, defined where it's read: tap or hover it
 * for a one-line definition (Hint), instead of a trip to a glossary at the
 * foot of the page. Without a definition it's plain text.
 */
export function TermLink({ id, children, className }: { id: TermId; children: ReactNode; className?: string }) {
  const text = terms[id];
  if (!text) return <>{children}</>;
  return (
    <Hint text={text} className={className}>
      {children}
    </Hint>
  );
}
