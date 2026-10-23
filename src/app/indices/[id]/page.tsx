import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { ArrowIcon, CheckIcon } from "@/components/ui/icons";
import { IndexExplorer } from "@/components/indices/IndexExplorer";
import { TokenLogo, TokenStack } from "@/components/indices/TokenLogo";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { IndexCaveats } from "@/components/indices/IndexCaveats";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { BASE } from "@/lib/seo/site";
import { pageMetadata } from "@/lib/seo/metadata";
import { indices, indexById, type IndexDef, type IndexId } from "@/lib/data/indices";

export const dynamicParams = false;

// What each basket holds, in the words its own summary uses.
const holds: Record<IndexId, string> = {
  blokc2: "the two largest crypto assets",
  blokc5: "five DeFi tokens",
  blokc10: "ten DeFi tokens",
};

/**
 * The answer first (SEO-12): one sentence an answer engine can lift whole,
 * built from the index data. E.g. "BLOKC5 is a BLOK Capital index of five
 * DeFi tokens (LINK, UNI, AAVE, ARB, PENDLE), weighted by market cap and
 * priced by Chainlink on Arbitrum. In private testing."
 */
const definition = (idx: IndexDef) =>
  `${idx.name} is a BLOK Capital index of ${holds[idx.id]} (${idx.components.join(", ")}), weighted by market cap and ` +
  `priced by Chainlink on Arbitrum. ${idx.status}.`;

export function generateStaticParams() {
  return indices.map((i) => ({ id: i.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const idx = indexById((await params).id);
  if (!idx) return {};
  const base = `${idx.name}: a market-cap-weighted index of ${idx.components.length} assets on Arbitrum (${idx.components.join(", ")}), priced by Chainlink.`;
  // The status goes in when it fits the 155-character snippet (BLOKC10's list doesn't leave room).
  const withStatus = `${base} ${idx.status}.`;
  return pageMetadata({
    title: `${idx.name}: ${idx.tagline}`,
    description: withStatus.length <= 155 ? withStatus : base,
    path: `/indices/${idx.id}`,
    // indices/[id]/opengraph-image.tsx supplies a card per index.
    ownImage: true,
  });
}

export default async function IndexPage({ params }: { params: Promise<{ id: string }> }) {
  const idx = indexById((await params).id);
  if (!idx) notFound();
  const others = indices.filter((i) => i.id !== idx.id);
  const stats = [
    { k: "Components", v: String(idx.components.length) },
    { k: "Weighting", v: "Market cap" },
    { k: "Prices", v: "Chainlink" },
    { k: "Network", v: "Arbitrum One" },
  ];
  // Factsheet rows (INS-08), only with rules the site already states: the
  // drift, cadence and value-loss guardrails in methodology.guardrails.
  const rules = [
    {
      k: "Governed by",
      v: (
        <Link href="/governance" className="rounded-xs text-fg underline decoration-line/30 underline-offset-[3px] transition-colors duration-fast can-hover:hover:text-leaf can-hover:hover:decoration-leaf">
          BLOK DAO (Aragon)
        </Link>
      ),
    },
    { k: "Rebalance", v: "Past 2% drift, at most daily, ≤ 0.5% value loss" },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Indices", path: "/indices" },
            { name: idx.name, path: `/indices/${idx.id}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            name: idx.name,
            description: idx.summary,
            url: `${BASE}/indices/${idx.id}`,
            category: "On-chain crypto index",
            provider: { "@id": `${BASE}/#organization` },
          },
        ]}
      />
      <PageHero
        crumb={idx.name}
        parent={{ label: "Indices", href: "/indices" }}
        eyebrow={idx.tagline}
        title={<span className="font-mono tracking-tight">{idx.name}</span>}
        description={definition(idx)}
        asideAlign="start"
        actions={
          <>
            <Button href="#composition">See what&apos;s inside</Button>
            <Button href="#methodology" variant="secondary">
              Methodology
            </Button>
          </>
        }
        aside={
          <div className="rounded-card border border-subtle bg-card">
            <div className="flex items-center justify-between gap-3 border-b border-subtle px-5 py-3.5">
              <TokenStack symbols={idx.components} size={24} />
              <Badge tone="current">{idx.status}</Badge>
            </div>
            <dl className="grid grid-cols-2">
              {stats.map((s, i) => (
                <div key={s.k} className={`px-5 py-4 ${i % 2 ? "border-l border-subtle" : ""} ${i > 1 ? "border-t border-subtle" : ""}`}>
                  <dt className="text-caption text-fg-subtle">{s.k}</dt>
                  <dd className="mt-1 text-lead text-fg">{s.v}</dd>
                </div>
              ))}
            </dl>
            <dl className="divide-y divide-subtle border-t border-subtle">
              {rules.map((r) => (
                <div key={r.k} className="px-5 py-3.5">
                  <dt className="text-caption text-fg-subtle">{r.k}</dt>
                  <dd className="mt-1 text-small text-fg">{r.v}</dd>
                </div>
              ))}
              <div className="px-5 py-3.5">
                <dt className="text-caption text-fg-subtle">Index value</dt>
                <dd className="mt-1 text-small text-fg-muted">Not published yet: an index has no value until Gardens follow it publicly.</dd>
              </div>
            </dl>
          </div>
        }
      />

      <Section
        id="composition"
        eyebrow="Composition"
        title="What's inside."
        description="Select a component to see what it is, its live Chainlink price, and the exact token and oracle contracts the index reads."
      >
        <Reveal>
          <IndexExplorer initial={idx.id} fixed linkToPages={false} />
        </Reveal>
      </Section>

      <Section id="why" tone="surface" eyebrow="In plain words" title={`Why ${idx.name} looks like this.`}>
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="text-lead text-fg">{idx.forWho}</p>
            <p className="mt-4 text-body text-fg-muted">{idx.summary}</p>
          </Reveal>
          <Stagger as="ul" className="space-y-3 lg:col-span-7">
            {idx.notes.map((n) => (
              <RevealItem as="li" key={n} className="flex gap-3 rounded-card border border-subtle bg-card p-5 text-small text-fg-muted">
                <CheckIcon className="mt-0.5 shrink-0 text-leaf" />
                {n}
              </RevealItem>
            ))}
            <RevealItem as="li" className="rounded-card border border-dashed border-line/15 p-5 text-small text-fg-subtle">
              Components as confirmed by the BLOK Capital team. Weights aren&apos;t listed: they&apos;re recomputed on-chain
              from market caps and move with the market. Any change to the component list needs{" "}
              <Link href="/governance" className="rounded-xs text-leaf underline decoration-leaf/40 underline-offset-[3px] transition-colors duration-fast can-hover:hover:decoration-leaf">
                DAO approval
              </Link>
              .
            </RevealItem>
          </Stagger>
        </div>
      </Section>

      {/* The method in brief (UX-08, SEO-09): the full Methodology,
          RebalanceLab and data ledger live once, on /indices. The ids keep
          old /indices/<id>#methodology, #rebalancing and #data links landing here. */}
      <Section id="methodology" eyebrow="Methodology" title="How its weights are set.">
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="space-y-4 lg:col-span-7">
            <p className="text-body text-fg">
              Nobody sets a weight by hand: each is a component&apos;s share of the basket&apos;s total market cap (circulating
              supply × Chainlink price), recomputed on-chain at most hourly.
            </p>
            <p id="rebalancing" className="text-body text-fg-muted">
              {`Gardens following ${idx.name} rebalance together in one pooled trade, at most daily, and only for assets more than 2% off target. A trade that would lose more than 0.5% of value reverts.`}
            </p>
            <ArrowLink href="/indices#methodology">Same method as every BLOK Capital index</ArrowLink>
          </Reveal>
          <Reveal id="data" delay={0.08} className="lg:col-span-5">
            <IndexCaveats>
              <ArrowLink href="/indices#data" className="mt-4">
                What&apos;s live, and what isn&apos;t yet
              </ArrowLink>
            </IndexCaveats>
          </Reveal>
        </div>
      </Section>

      <Section id="related" tone="surface" eyebrow="Related" title="The other indices.">
        <Stagger as="ul" className="grid gap-4 md:grid-cols-2">
          {others.map((o) => (
            <RevealItem as="li" key={o.id}>
              <Card href={`/indices/${o.id}`} className="flex h-full flex-col">
                <span className="flex items-center justify-between">
                  <span className="font-mono text-lead font-medium text-fg">{o.name}</span>
                  <ArrowIcon className="text-fg-subtle transition-transform duration-fast can-hover:group-hover/card:translate-x-0.5 can-hover:group-hover/card:text-leaf" />
                </span>
                <span className="mt-1 text-small text-fg-muted">{o.tagline}</span>
                <span className="mt-5 flex flex-wrap gap-1.5">
                  {o.components.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1.5 rounded-full border border-line/10 px-2.5 py-1 font-mono text-label text-fg-muted">
                      <TokenLogo symbol={s} size={16} />
                      {s}
                    </span>
                  ))}
                </span>
              </Card>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      <CtaBand context="index" indexName={idx.name} />
    </>
  );
}
