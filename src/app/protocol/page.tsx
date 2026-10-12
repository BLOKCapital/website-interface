import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { CustodyDiagram } from "@/components/home/CustodyDiagram";
import { Ecosystem } from "@/components/home/Ecosystem";
import { ExploreSection } from "@/components/explore/ExploreSection";
import { ProductStack } from "@/components/protocol/ProductStack";
import { FeesRisks } from "@/components/protocol/FeesRisks";
import { Glossary, TermLink } from "@/components/protocol/Glossary";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { protocolStatus } from "@/lib/data/status";
import { links, social } from "@/lib/data/socials";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Protocol: how non-custodial Gardens work",
  description: `How BLOK Capital works: smart-wallet Gardens, curated Index Gardens, Yield Gardens, Gardeners (from ${protocolStatus.gardeners}), the Diamond architecture, fees and risks.`,
  path: "/protocol",
  // protocol/opengraph-image.tsx supplies the card.
  ownImage: true,
});

const architecture: { title: string; spec: string; body: ReactNode }[] = [
  {
    title: "Smart accounts",
    spec: "ERC-4337 · EIP-7702 · Web3Auth MPC",
    body: "Each Garden is a smart-contract wallet at the user's address. Sign in with Google through Web3Auth's MPC (no seed phrase) or bring a wallet; batched actions need one signature.",
  },
  {
    title: "Diamond contracts",
    spec: "EIP-2535 · EIP-7201",
    body: (
      <>
        Gardens are <TermLink id="diamond">Diamonds</TermLink>: capabilities live in <TermLink id="facet">facets</TermLink> that
        can be added or swapped without migrating user storage. An upgrade can only install a facet the DAO has approved in
        the Facet Registry.
      </>
    ),
  },
  {
    title: "Soulbound reputation",
    spec: "ERC-5484",
    body: "A Gardener's track record is written to a non-transferable badge, verifiable from any dapp and owned by no platform.",
  },
  {
    title: "Open by default",
    spec: "GitHub · Foundry · Arbitrum",
    body: "Contracts and their Foundry test suite are public on GitHub. Every Garden, index and vote is on Arbitrum for anyone to read.",
  },
];

const composes = ["Uniswap V3", "Camelot V3", "Aave V3", "GMX V2", "Pendle V2", "Chainlink"];

/** The builders' first reads; the whitepaper joins them (CRO-24). */
const startHere = [
  { label: "Contracts on GitHub", href: social("github").href, cta: "protocol_github" },
  { label: "V1 architecture", href: links.docsArchitecture, cta: "protocol_docs_architecture" },
  { label: "Smart-contract guide", href: links.docsContracts, cta: "protocol_docs_contracts" },
  { label: "Whitepaper", href: links.whitepaper, cta: "protocol_whitepaper" },
];

export default function ProtocolPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Protocol", path: "/protocol" }])} />
      <PageHero
        crumb="Protocol"
        eyebrow="The protocol"
        title={
          <>
            One wallet. <em className="text-sand">Three ways to steer it.</em>
          </>
        }
        description={
          <>
            Every <TermLink id="garden">Garden</TermLink> is a <TermLink id="smart-account">smart wallet</TermLink> at your
            address. Strategies can rebalance inside it; only your signature moves funds out.
          </>
        }
        actions={
          <>
            <Button href={links.docs} data-cta="protocol_hero_docs">
              Read the docs
            </Button>
            <Button href="/security" variant="secondary">
              Security
            </Button>
          </>
        }
        aside={
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/[0.08] bg-line/[0.08] text-small">
            {[
              ["Network", "Arbitrum One"],
              ["Custody", "Always yours"],
              ["Source", "Public on GitHub"],
              ["Status", protocolStatus.label],
            ].map(([k, v]) => (
              <div key={k} className="bg-card p-4">
                <dt className="text-caption text-fg-subtle">{k}</dt>
                <dd className="mt-1 text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        }
      />

      {/* The canonical "how" (D-08a, UX-04): the layer-by-layer explorer is the centrepiece, right after the hero. */}
      <ExploreSection />

      <Section
        id="products"
        eyebrow="Products"
        title="Three ways to run a Garden."
        description="Every Garden is the same smart wallet underneath; what changes is who steers it. Scroll through the three."
      >
        <ProductStack />
      </Section>

      <Section
        id="architecture"
        tone="surface"
        eyebrow="Architecture"
        title={
          <>
            Standards the ecosystem <em className="text-sand">already trusts.</em>
          </>
        }
        description="BLOK Capital composes proven primitives rather than inventing new ones."
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="hidden rounded-3xl border border-line/[0.08] bg-canvas/60 p-6 sm:block lg:col-span-6">
            <CustodyDiagram />
          </Reveal>
          <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
            {architecture.map((a) => (
              <RevealItem as="li" key={a.title} className="rounded-2xl border border-line/[0.08] bg-card p-5">
                <p className="font-mono text-[11.5px] text-leaf">{a.spec}</p>
                <h3 className="mt-3 text-h4 font-medium text-fg">{a.title}</h3>
                <p className="mt-2 text-small text-fg-muted">{a.body}</p>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* CRO-15: the six terms, after the sections that use them most. */}
      <Glossary />

      {/* D-08b: the full ecosystem lives here; home keeps a pointer to it. */}
      <Ecosystem tone="surface" />

      <Section
        id="builders"
        eyebrow="For builders"
        title={
          <>
            Read it, fork it, <em className="text-sand">extend it.</em>
          </>
        }
        description="The contracts and tests are public on GitHub. New strategies and integrations plug in as facets through the DAO-approved Facet Registry."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <Card className="h-full">
              <h3 className="text-h4 font-medium text-fg">Composes with</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {composes.map((c) => (
                  <li key={c} className="rounded-full border border-line/12 bg-raised px-3.5 py-1.5 text-small text-fg">
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-small text-fg-muted">
                All wired through the Facet Registry. See the{" "}
                <Link href="#ecosystem" className="text-leaf underline underline-offset-2">
                  full ecosystem
                </Link>
                .
              </p>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="flex h-full flex-col">
              <h3 className="text-h4 font-medium text-fg">Start here</h3>
              {/* data-cta on each item: ArrowLink takes no extra props, and
                  the click listener reads the closest [data-cta]. */}
              <ul className="mt-3 flex flex-col gap-3">
                {startHere.map((l) => (
                  <li key={l.cta} data-cta={l.cta}>
                    <ArrowLink href={l.href}>{l.label}</ArrowLink>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </Section>

      <FeesRisks />
      <CtaBand context="protocol" />
    </>
  );
}
