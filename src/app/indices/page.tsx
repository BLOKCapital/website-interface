import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";
import { IndexExplorer } from "@/components/indices/IndexExplorer";
import { IndexMatrix } from "@/components/indices/IndexMatrix";
import { TokenStack } from "@/components/indices/TokenLogo";
import { Methodology } from "@/components/indices/Methodology";
import { RebalanceLab } from "@/components/indices/RebalanceLab";
import { DataAvailability } from "@/components/indices/DataAvailability";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { indices, sources } from "@/lib/data/indices";

export const metadata: Metadata = {
  title: "Indices: BLOKC2, BLOKC5, BLOKC10",
  description:
    "BLOK Capital's three on-chain indices: what each holds, how market-cap weights are computed from Chainlink prices, and how pooled rebalancing works. Live oracle prices.",
  alternates: { canonical: "/indices" },
};

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
        description="Each BLOKC index holds a fixed set of tokens, weighted by market cap, priced by Chainlink and rebalanced on-chain. Nobody picks the weights by hand; the contract does the maths in public."
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
                  className="group/i flex items-center justify-between gap-4 rounded-2xl border border-line/[0.08] bg-card px-5 py-4 transition-colors hover:border-leaf/30 hover:bg-raised"
                >
                  <span>
                    <span className="block font-mono text-[14px] font-medium text-fg">{i.name}</span>
                    <span className="block text-caption text-fg-subtle">{i.tagline}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <TokenStack symbols={i.components} size={20} max={5} className="hidden sm:flex" />
                    <span className="font-mono text-[12px] text-fg-muted">{i.components.length}</span>
                    <ArrowIcon size={13} className="text-fg-subtle transition-transform group-hover/i:translate-x-0.5 group-hover/i:text-leaf" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </Stagger>
        }
      />

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
        title={
          <>
            Base assets, <em className="text-sand">then the DeFi stack.</em>
          </>
        }
        description="BLOKC2 holds Bitcoin and Ether. BLOKC5 holds five DeFi blue chips, and BLOKC10 holds those five plus five more. No token in BLOKC2 appears in the other two."
      >
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-7">
            <IndexMatrix />
          </Reveal>
          <Stagger as="dl" className="grid content-start gap-3 lg:col-span-5">
            {[
              { k: "Same method", v: "All three are market-cap weighted with the same guardrails. Only the component lists differ." },
              { k: "Same data", v: "Every component is priced by a Chainlink USD feed on Arbitrum. Circulating supply, the other input, is posted on-chain by an authorised account." },
              { k: "Different shape", v: "Fewer components means fewer weights to keep in line. We won't publish volatility or return figures until there's real history to measure." },
            ].map((x) => (
              <RevealItem key={x.k} className="rounded-2xl border border-line/[0.08] bg-card p-5">
                <dt className="text-small font-medium text-fg">{x.k}</dt>
                <dd className="mt-1.5 text-small text-fg-muted">{x.v}</dd>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section
        id="methodology"
        eyebrow="Methodology"
        title="How the weights are set."
        description="Four steps, all on-chain. Open the guardrails for the limits the contracts enforce, or the technical details for the code."
      >
        <Methodology />
      </Section>

      <Section
        id="rebalancing"
        tone="surface"
        eyebrow="Rebalancing"
        title={
          <>
            Why a market-cap index <em className="text-sand">rarely trades.</em>
          </>
        }
        description="Move the sliders. When a price moves, the holding and its target move together. Trades happen when something else shifts, like a token's circulating supply."
      >
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <RebalanceLab />
          </Reveal>
          <Stagger as="ol" className="space-y-3 lg:col-span-5">
            {[
              ["Weights refresh", "Anyone can ask an index to recompute its weights, at most once an hour."],
              ["Drift is checked", "For every Garden on the index, each asset is compared with its target value."],
              ["One pooled trade", "Assets beyond 2% are netted across all those Gardens and swapped in one batch, at most daily."],
              ["Slippage capped", "If the batch would lose more than 0.5% of value, it reverts and nothing moves."],
            ].map(([t, b], i) => (
              <RevealItem as="li" key={t} className="flex gap-4 rounded-2xl border border-line/[0.08] bg-card p-5">
                <span className="font-mono text-[12px] text-leaf">0{i + 1}</span>
                <span>
                  <span className="block text-small font-medium text-fg">{t}</span>
                  <span className="mt-1 block text-small text-fg-muted">{b}</span>
                </span>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section
        id="data"
        eyebrow="Data"
        title="What's live, and what isn't yet."
        description="The indices are in private testing. Here's exactly what this page can show today, and what arrives with the public launch."
      >
        <DataAvailability />
      </Section>

      <CtaBand />
    </>
  );
}
