import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { FactGrid } from "@/components/ui/FactGrid";
import { SectionNav } from "@/components/ui/SectionNav";
import { GardenCompare } from "@/components/protocol/GardenCompare";
import { GardenMachine } from "@/components/iso/GardenMachine";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CtaBand } from "@/components/ui/CtaBand";
import { ExternalIcon } from "@/components/ui/icons";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
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


/** The builders' first reads; the whitepaper joins them (CRO-24). */
const startHere = [
  { label: "Contracts on GitHub", desc: "The Solidity contracts and their Foundry tests.", href: social("github").href, cta: "protocol_github" },
  { label: "V1 architecture", desc: "How the protocol is put together, in the docs.", href: links.docsArchitecture, cta: "protocol_docs_architecture" },
  { label: "Smart-contract guide", desc: "Each contract and what it does, in the docs.", href: links.docsContracts, cta: "protocol_docs_contracts" },
  { label: "Whitepaper", desc: "The full design and the token, on DocSend.", href: links.whitepaper, cta: "protocol_whitepaper" },
];

/** The page's sections, in order, for the sticky section bar. */
const sections = [
  { id: "explore", label: "Layers" },
  { id: "products", label: "Products" },
  { id: "architecture", label: "Architecture" },
  { id: "fees", label: "Fees & risks" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "builders", label: "Builders" },
  { id: "glossary", label: "Glossary" },
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
          <FactGrid
            items={[
              ["Network", "Arbitrum One"],
              ["Custody", "Always yours"],
              ["Source", "Public on GitHub"],
              ["Status", protocolStatus.label],
            ]}
          />
        }
      />

      <SectionNav items={sections} />

      {/* The canonical "how" (D-08a, UX-04): the layer-by-layer explorer is the centrepiece, right after the hero. */}
      <ExploreSection />

      <Section
        id="products"
        eyebrow="Products"
        title="Three ways to run a Garden."
        description="Every Garden is the same smart wallet underneath; what changes is who steers it. Scroll through the three."
      >
        <ProductStack />
        {/* The deck shows one at a time; this sets them side by side so a visitor can choose. */}
        <div id="compare" className="mt-16 sm:mt-20">
          <div className="mb-8 max-w-2xl">
            <p className="label-caps">Compare</p>
            <h3 className="display mt-3 text-display-sm text-balance text-fg">Side by side.</h3>
            <p className="mt-3 text-ui text-fg-muted">
              Same wallet, same custody. What changes is who steers it, what it costs and when it opens.
            </p>
          </div>
          <GardenCompare />
        </div>
      </Section>

      <Section
        id="architecture"
        tone="surface"
        eyebrow="Architecture"
        title="Standards the ecosystem already trusts."
        description="BLOK Capital composes proven primitives rather than inventing new ones."
      >
        {/* Fig 1: the custody model as a working machine (replaces the flat CustodyDiagram). */}
        <Reveal>
          <GardenMachine />
        </Reveal>
        <Stagger as="ul" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {architecture.map((a) => (
            <RevealItem as="li" key={a.title} className="rounded-card border border-subtle bg-card p-5">
              <p className="font-mono text-label text-leaf">{a.spec}</p>
              <h3 className="mt-3 text-h4 font-medium text-fg">{a.title}</h3>
              <p className="mt-2 text-small text-fg-muted">{a.body}</p>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      {/* What it costs and what can go wrong, right after how it's built. */}
      <FeesRisks tone="canvas" />

      {/* D-08b: the full ecosystem lives here; home keeps a pointer to it. */}
      <Ecosystem tone="surface" />

      {/* The builders' first reads, as tiles on a dark band. The ecosystem
          above already lists what the protocol composes with. */}
      <Section
        id="builders"
        tone="dark"
        eyebrow="For builders"
        title="Read it, fork it, extend it."
        description="The contracts and tests are public on GitHub. New strategies and integrations plug in as facets through the DAO-approved Facet Registry."
      >
        <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {startHere.map((l) => (
            <RevealItem as="li" key={l.cta}>
              <Card
                href={l.href}
                data-cta={l.cta}
                data-placement="protocol_builders"
                aria-labelledby={`${l.cta}-title`}
                aria-describedby={`${l.cta}-desc`}
                className="flex h-full flex-col"
              >
                <h3 id={`${l.cta}-title`} className="text-h4 font-medium text-fg">
                  {l.label}
                </h3>
                <p id={`${l.cta}-desc`} className="mt-2 text-small text-fg-muted">
                  {l.desc}
                </p>
                <span aria-hidden className="mt-auto inline-flex items-center gap-1.5 pt-6 text-small font-medium text-leaf">
                  Open <ExternalIcon />
                </span>
              </Card>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      {/* CRO-15: the six terms, as reference at the end; every first mention above links here. */}
      <Glossary />
      <CtaBand context="protocol" />
    </>
  );
}
