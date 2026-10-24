import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { SectionNav } from "@/components/ui/SectionNav";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";
import { IndexExplorer } from "@/components/indices/IndexExplorer";
import { IndexMatrix } from "@/components/indices/IndexMatrix";
import { TokenStack } from "@/components/indices/TokenLogo";
import { Methodology } from "@/components/indices/Methodology";
import { IndexCaveats } from "@/components/indices/IndexCaveats";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { indices, sources } from "@/lib/data/indices";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Crypto indices: BLOKC2, BLOKC5, BLOKC10",
  description:
    "BLOK Capital's three on-chain indices: holdings, market-cap weights from Chainlink prices, and pooled rebalancing. Live oracle prices.",
  path: "/indices",
});

const names = indices.map((i) => i.name);

/**
 * The answer first (SEO-12), from the index data: what the BLOK Capital
 * indices are, then the one rule they share. "The BLOK Capital indices",
 * never "each BLOKC index", which reads as the token (MISS-14).
 */
const definition =
  `The BLOK Capital indices, ${names.slice(0, -1).join(", ")} and ${names.at(-1)}, are three fixed baskets of tokens on ` +
  `Arbitrum, weighted by market cap, priced by Chainlink and rebalanced on-chain. Nobody picks the weights by ` +
  "hand; the contract does the maths in public.";

/** The page's sections, in order, for the sticky section bar. */
const sections = [
  { id: "explore", label: "Explorer" },
  { id: "compare", label: "Compare" },
  { id: "methodology", label: "Methodology" },
];

export default function IndicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Indices", path: "/indices" }])} />
      <PageHero
        crumb="Indices"
        eyebrow="Index Gardens"
        title={
          <>
            Three baskets, <em className="text-sand">one honest rule.</em>
          </>
        }
        description={definition}
        actions={
          <>
            <Button href="#explore">Explore the indices</Button>
            <Button href={sources.docsIndexGarden} variant="secondary">
              Index docs
            </Button>
          </>
        }
        aside={
          <Stagger as="ul" className="grid gap-2">
            {indices.map((i) => (
              <RevealItem as="li" key={i.id}>
                <Link
                  href={`/indices/${i.id}`}
                  className="group/i flex items-center justify-between gap-4 rounded-card border border-subtle bg-card px-5 py-4 surface-link shadow-soft"
                >
                  <span>
                    <span className="block font-mono text-small font-medium text-fg">{i.name}</span>
                    <span className="block text-caption text-fg-subtle">{i.tagline}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <TokenStack symbols={i.components} size={20} max={5} className="hidden sm:flex" />
                    <span className="font-mono text-label text-fg-muted">{i.components.length}</span>
                    <ArrowIcon size={13} className="text-fg-subtle transition-transform group-hover/i:translate-x-0.5 group-hover/i:text-leaf" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </Stagger>
        }
      />

      <SectionNav items={sections} />

      <Section
        id="explore"
        eyebrow="Explorer"
        title="Pick an index. Open it up."
        description="Every component, the oracle that prices it and the token the Garden would hold. Prices are read live from Chainlink on Arbitrum."
      >
        <Reveal>
          <IndexExplorer />
        </Reveal>
      </Section>

      <Section
        id="compare"
        tone="surface"
        eyebrow="Compare"
        title="Base assets, then the DeFi stack."
        description="BLOKC2 holds Bitcoin and Ether. BLOKC5 holds five DeFi blue chips, and BLOKC10 holds those five plus five more. No token in BLOKC2 appears in the other two."
      >
        {/* The method rows are in the table now (said once across all three); the one note left sits under it. */}
        <Reveal className="mx-auto max-w-4xl">
          <IndexMatrix />
          <p className="mt-4 text-caption text-fg-subtle">
            Fewer components means fewer weights to keep in line. We won&apos;t publish volatility or return figures until
            there&apos;s real history to measure.
          </p>
        </Reveal>
      </Section>

      <Section
        id="methodology"
        eyebrow="Methodology"
        title="How the weights are set."
        description="Four steps, all on-chain. Because weights follow market caps, a price move changes a holding and its target together, so an index rarely needs to trade."
      >
        <Methodology />
        {/* The two caveats every index page carries; #data keeps old links landing here. */}
        <Reveal id="data" className="mt-10 max-w-3xl">
          <IndexCaveats />
        </Reveal>
      </Section>

      <CtaBand />
    </>
  );
}
