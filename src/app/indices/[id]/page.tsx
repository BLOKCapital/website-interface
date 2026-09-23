import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { ArrowIcon, CheckIcon } from "@/components/ui/icons";
import { IndexExplorer } from "@/components/indices/IndexExplorer";
import { TokenLogo, TokenStack } from "@/components/indices/TokenLogo";
import { Methodology } from "@/components/indices/Methodology";
import { RebalanceLab } from "@/components/indices/RebalanceLab";
import { DataAvailability } from "@/components/indices/DataAvailability";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { BASE } from "@/lib/seo/site";
import { indices, indexById, components, sources } from "@/lib/data/indices";

export const dynamicParams = false;

export function generateStaticParams() {
  return indices.map((i) => ({ id: i.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const idx = indexById((await params).id);
  if (!idx) return {};
  const list = idx.components.join(", ");
  return {
    title: `${idx.name}: ${idx.tagline}`,
    description: `${idx.name}: a market-cap-weighted index of ${idx.components.length} assets on Arbitrum (${list}), priced by Chainlink. Composition and methodology.`,
    alternates: { canonical: `/indices/${idx.id}` },
    openGraph: { title: `${idx.name} · BLOK Capital`, description: `${idx.tagline}. ${idx.components.length} components: ${list}.` },
  };
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
        description={idx.summary}
        actions={
          <>
            <Button href="#composition">See what&apos;s inside</Button>
            <Button href="#methodology" variant="secondary">
              Methodology
            </Button>
          </>
        }
        aside={
          <div className="rounded-2xl border border-line/[0.08] bg-card">
            <div className="flex items-center justify-between gap-3 border-b border-line/[0.07] px-5 py-3.5">
              <TokenStack symbols={idx.components} size={24} />
              <Badge tone="current">{idx.status}</Badge>
            </div>
            <dl className="grid grid-cols-2">
              {stats.map((s, i) => (
                <div key={s.k} className={`px-5 py-4 ${i % 2 ? "border-l border-line/[0.07]" : ""} ${i > 1 ? "border-t border-line/[0.07]" : ""}`}>
                  <dt className="text-caption text-fg-subtle">{s.k}</dt>
                  <dd className="mt-1 text-[17px] text-fg">{s.v}</dd>
                </div>
              ))}
            </dl>
            <div className="border-t border-line/[0.07] px-5 py-3.5">
              <p className="text-caption text-fg-subtle">Index value</p>
              <p className="mt-1 text-small text-fg-muted">Not published yet: an index has no value until Gardens follow it publicly.</p>
            </div>
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
            <p className="text-lead text-fg-muted">{idx.forWho}</p>
          </Reveal>
          <Stagger as="ul" className="space-y-3 lg:col-span-7">
            {idx.notes.map((n) => (
              <RevealItem as="li" key={n} className="flex gap-3 rounded-2xl border border-line/[0.08] bg-card p-5 text-small text-fg-muted">
                <CheckIcon className="mt-0.5 shrink-0 text-leaf" />
                {n}
              </RevealItem>
            ))}
            <RevealItem as="li" className="rounded-2xl border border-dashed border-line/15 p-5 text-small text-fg-subtle">
              Components as confirmed by the BLOK Capital team. Weights aren&apos;t listed: they&apos;re recomputed on-chain
              from market caps and move with the market. Any change to the component list needs DAO approval.
            </RevealItem>
          </Stagger>
        </div>
      </Section>

      <Section id="methodology" eyebrow="Methodology" title="How its weights are set." description={`${idx.name} uses the same method as every BLOKC index.`}>
        <Methodology />
      </Section>

      <Section id="rebalancing" tone="surface" eyebrow="Rebalancing" title="When it trades, and when it doesn't.">
        <Reveal>
          <RebalanceLab />
        </Reveal>
      </Section>

      <Section id="data" eyebrow="Data" title="What's live, and what isn't yet.">
        <DataAvailability />
      </Section>

      <Section id="related" tone="surface" eyebrow="Related" title="The other indices.">
        <Stagger as="ul" className="grid gap-4 md:grid-cols-2">
          {others.map((o) => (
            <RevealItem as="li" key={o.id}>
              <Link
                href={`/indices/${o.id}`}
                className="group/r flex h-full flex-col rounded-2xl border border-line/[0.08] bg-card p-6 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-leaf/30 hover:bg-raised"
              >
                <span className="flex items-center justify-between">
                  <span className="font-mono text-[18px] font-medium text-fg">{o.name}</span>
                  <ArrowIcon className="text-fg-subtle transition-transform group-hover/r:translate-x-0.5 group-hover/r:text-leaf" />
                </span>
                <span className="mt-1 text-small text-fg-muted">{o.tagline}</span>
                <span className="mt-5 flex flex-wrap gap-1.5">
                  {o.components.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1.5 rounded-full border border-line/10 px-2.5 py-1 font-mono text-[11px] text-fg-muted">
                      <TokenLogo symbol={s} size={16} />
                      {s}
                    </span>
                  ))}
                </span>
              </Link>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      <CtaBand />
    </>
  );
}
