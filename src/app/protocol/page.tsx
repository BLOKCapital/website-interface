import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { CustodyDiagram } from "@/components/home/CustodyDiagram";
import { products } from "@/components/home/Products";
import { FeesRisks } from "@/components/protocol/FeesRisks";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { protocolStatus } from "@/lib/data/status";
import { links } from "@/lib/data/socials";

export const metadata: Metadata = {
  title: "Protocol",
  description:
    "How BLOK Capital works: smart-wallet Gardens, curated Index Gardens, Yield Gardens, on-chain Gardeners, the Diamond architecture, fees and risks.",
  alternates: { canonical: "/protocol" },
};

/** Extra detail per product, beyond the home-page card. */
const detail: Record<string, { body: string; audience: string; more?: { label: string; href: string } }> = {
  index: {
    audience: "For people who want diversified exposure without managing it.",
    more: { label: "Explore BLOKC2, BLOKC5 and BLOKC10", href: "/indices" },
    body: "Connect your Garden to BLOKC2, BLOKC5 or BLOKC10. Weights are each component's share of market cap, priced by Chainlink. A pooled rebalancer trades only assets more than 2% off target, at the best quote across Uniswap and Camelot, at most once a day. Every rebalance is a transaction you can read.",
  },
  yield: {
    audience: "For people who'd rather steer themselves.",
    body: "A Yield Garden lets you act directly across the venues the protocol composes with: swap on Uniswap V3 and Camelot V3, lend and borrow on Aave V3, take perp exposure on GMX V2, or lock fixed yield with Pendle V2.",
  },
  gardeners: {
    audience: "For people who want a professional, and for the professionals.",
    body: "A Gardener publishes a strategy on-chain and investors authorise it from their own Garden, then revoke it the same way. Performance writes itself to a non-transferable ERC-5484 badge in the Gardener's wallet, and fees settle on-chain within DAO-set ceilings.",
  },
};

const architecture = [
  {
    title: "Smart accounts",
    spec: "ERC-4337 · EIP-7702 · Web3Auth MPC",
    body: "Each Garden is a smart-contract wallet at the user's address. Sign in with Google through Web3Auth's MPC (no seed phrase) or bring a wallet; batched actions need one signature.",
  },
  {
    title: "Diamond contracts",
    spec: "EIP-2535 · EIP-7201",
    body: "Gardens are Diamonds: capabilities live in facets that can be added or swapped without migrating user storage. An upgrade can only install a facet the DAO has approved in the Facet Registry.",
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

export default function ProtocolPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Protocol", path: "/protocol" }])} />
      <PageHero
        crumb="Protocol"
        eyebrow="The protocol"
        title={
          <>
            A wallet you own, <em className="text-sand">a strategy on top.</em>
          </>
        }
        description="Every Garden is a smart wallet at your address. Strategies can rebalance inside it; only your signature moves funds out."
        actions={
          <>
            <Button href={links.docs}>Read the docs</Button>
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

      <Section id="products" eyebrow="Products" title="Three ways to run a Garden.">
        <div className="space-y-5">
          {products.map((p) => (
            <Reveal key={p.id} id={p.id} className="scroll-mt-28">
              <Card className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <Badge tone={p.status.tone}>{p.status.label}</Badge>
                  <h3 className="display mt-4 text-h2 text-fg">{p.name}</h3>
                  <p className="mt-3 text-small text-fg-subtle">{detail[p.id].audience}</p>
                </div>
                <div className="lg:col-span-7">
                  <p className="text-body text-fg-muted">{detail[p.id].body}</p>
                  {detail[p.id].more && (
                    <ArrowLink href={detail[p.id].more!.href} className="mt-4">
                      {detail[p.id].more!.label}
                    </ArrowLink>
                  )}
                  <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                    {p.points.map((pt) => (
                      <li key={pt} className="rounded-xl border border-line/[0.08] bg-raised/60 p-4 text-small text-fg">
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
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
                <Link href="/#ecosystem" className="text-leaf underline underline-offset-2">
                  full ecosystem
                </Link>
                .
              </p>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="flex h-full flex-col gap-3">
              <h3 className="text-h4 font-medium text-fg">Start here</h3>
              <ArrowLink href="https://github.com/BLOKCapital">Contracts on GitHub</ArrowLink>
              <ArrowLink href={links.docsArchitecture}>V1 architecture</ArrowLink>
              <ArrowLink href={links.docsContracts}>Smart-contract guide</ArrowLink>
            </Card>
          </Reveal>
        </div>
      </Section>

      <FeesRisks />
      <CtaBand />
    </>
  );
}
