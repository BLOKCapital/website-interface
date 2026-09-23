import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StepFlow } from "@/components/ui/StepFlow";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { ExternalIcon, DiscordIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { audits } from "@/lib/data/audits";
import { links, social } from "@/lib/data/socials";

export const metadata: Metadata = {
  title: "Security",
  description: "Who can change the BLOK Capital contracts, who has audited them, and how to report a vulnerability.",
  alternates: { canonical: "/security" },
};

/**
 * Every control below restates the protocol documentation (linked as its
 * source). Don't add a control the docs don't describe, and don't list
 * contract addresses until they're published and verified.
 */
const controls = [
  {
    label: "Your funds",
    body: "Each Garden is a smart-contract wallet at your own address. You hold the keys; BLOK Capital doesn't hold your funds.",
    source: links.docsOverview,
  },
  {
    label: "Upgrades",
    body: "Upgrades go through a dedicated Upgrade facet that checks a hash against what the Facet Registry has approved for that Garden's type. An upgrade can only install something the DAO has already vetted.",
    source: links.docsArchitecture,
  },
  {
    label: "Protocol changes",
    body: "State changes are authorised by a security council tracked through ENS domains, not a list of hot wallets.",
    source: links.docsArchitecture,
  },
  {
    label: "Pausing",
    body: "While the protocol is inactive, the Garden Factory refuses to deploy new Gardens.",
    source: links.docsArchitecture,
  },
  {
    label: "Governance",
    body: "Facets, indices and fee parameters are approved through on-chain Aragon OSx votes. Before the public token launch, only the core DAO members listed on Aragon can vote.",
    source: links.aragon,
  },
];

/** From the CredShields report's summary table (audits repo). */
const findings = [
  { k: "Critical", n: 0, c: "bg-negative" },
  { k: "High", n: 2, c: "bg-negative/80" },
  { k: "Medium", n: 12, c: "bg-caution" },
  { k: "Low", n: 5, c: "bg-sand/70" },
  { k: "Informational", n: 2, c: "bg-cobalt/70" },
  { k: "Gas", n: 5, c: "bg-fg-subtle/60" },
];

const pipeline = [
  { label: "Write", detail: "Solidity ^0.8.31, public on GitHub" },
  { label: "Test", detail: "Foundry unit and end-to-end tests" },
  { label: "Audit", detail: "CredShields: Garden contracts, Nov 2024" },
  { label: "Scan", detail: "SolidityScan and Octane on each release" },
  { label: "Approve", detail: "New facets need a DAO vote" },
  { label: "Ship", detail: "To Arbitrum One at public launch" },
];

export default function SecurityPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Security", path: "/security" }])} />
      <PageHero
        crumb="Security"
        eyebrow="Security"
        title={
          <>
            Check the work, <em className="text-sand">not our word.</em>
          </>
        }
        description="What the contracts let anyone do, who can change them, who has audited them, and how to report a problem."
        actions={
          <>
            <Button href="#contracts">Contracts and controls</Button>
            <Button href="#disclosure" variant="secondary">
              Report a vulnerability
            </Button>
          </>
        }
      />

      <Section id="contracts" eyebrow="Contracts & controls" title="Who can change what.">
        <Reveal>
          <Card className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <Badge tone="current">In progress</Badge>
            <div>
              <h3 className="text-h4 font-medium text-fg">Contract addresses</h3>
              <p className="mt-2 max-w-2xl text-small text-fg-muted">
                Mainnet deployment is in progress. Verified addresses will be published in the{" "}
                <a href={links.docsAddresses} target="_blank" rel="noopener noreferrer" className="text-leaf underline underline-offset-2">
                  documentation
                </a>{" "}
                and the{" "}
                <a href={links.auditsRepo} target="_blank" rel="noopener noreferrer" className="text-leaf underline underline-offset-2">
                  audits repository
                </a>
                . Until then, treat any address claiming to be a BLOK Capital protocol contract with suspicion. The one
                published exception is the{" "}
                <a href="/token#facts" className="text-leaf underline underline-offset-2">
                  $BLOKC token
                </a>
                .
              </p>
            </div>
          </Card>
        </Reveal>
        <Stagger as="ul" className="divide-y divide-line/[0.08] border-y border-line/[0.08]">
          {controls.map((c) => (
            <RevealItem as="li" key={c.label} className="grid gap-2 py-6 md:grid-cols-[220px_1fr_auto] md:gap-8">
              <h3 className="text-h4 font-medium text-fg">{c.label}</h3>
              <p className="text-[15.5px] leading-relaxed text-fg-muted">{c.body}</p>
              <a
                href={c.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 self-start text-small text-leaf hover:text-fg"
              >
                Source <ExternalIcon />
                <span className="sr-only"> for {c.label} (opens in a new tab)</span>
              </a>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      <Section id="audits" tone="surface" eyebrow="Audits & scanning" title="One published audit so far. More before launch."
        description="The Garden contracts were audited in November 2024. The index and rebalancer contracts are newer; they get a published review before anyone's money depends on them.">
        <Stagger as="ul" className="grid gap-5 md:grid-cols-3">
          {audits.map((a) => (
            <RevealItem as="li" key={a.partner} className="h-full">
              <Card className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="display text-h3 text-fg">{a.partner}</h3>
                  <Badge tone={a.date === "Ongoing" ? "neutral" : "done"}>{a.date}</Badge>
                </div>
                <p className="mt-3 flex-1 text-small text-fg-muted">{a.scope}</p>
                {a.url && (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-1.5 text-small font-medium text-leaf hover:text-fg"
                  >
                    {a.kind === "report" ? "Read the report" : `About ${a.partner}`} <ExternalIcon />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </Card>
            </RevealItem>
          ))}
        </Stagger>
        <Reveal className="mt-5">
          <Card>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-h4 font-medium text-fg">CredShields findings, by severity</h3>
              <p className="text-caption text-fg-subtle">26 total · all fixed and retested 28 Nov 2024</p>
            </div>
            <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-line/[0.07]" role="img" aria-label="26 findings: 0 critical, 2 high, 12 medium, 5 low, 2 informational, 5 gas. All fixed.">
              {findings.filter((f) => f.n).map((f) => (
                <span key={f.k} className={f.c} style={{ width: `${(f.n / 26) * 100}%` }} />
              ))}
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-caption text-fg-muted">
              {findings.map((f) => (
                <li key={f.k} className="flex items-center gap-2">
                  <span aria-hidden className={`size-2 rounded-full ${f.c}`} />
                  {f.k} <span className="font-mono text-fg tabular">{f.n}</span>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
        <Reveal className="mt-5">
          <Card>
            <h3 className="text-h4 font-medium text-fg">How a change reaches production</h3>
            <StepFlow steps={pipeline} label="How a change reaches production" className="mt-8" />
          </Card>
        </Reveal>
      </Section>

      <Section id="disclosure" eyebrow="Responsible disclosure" title="Found a vulnerability?">
        <div className="grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Card className="h-full">
              <p className="text-body text-fg-muted">
                Open a <strong className="font-medium text-fg">private ticket</strong> in the BLOK Capital Discord with steps to
                reproduce and the impact. Please don&apos;t post it in a public channel or open a public GitHub issue. We&apos;ll
                work out a fix and a disclosure timeline with you there, privately.
              </p>
              <p className="mt-4 text-small text-fg-subtle">
                In scope: the Garden Diamond, facets, indices and rebalancer contracts, and this website.
              </p>
              <Button href={social("discord").href} className="mt-7">
                <DiscordIcon /> Open a private ticket
              </Button>
            </Card>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-5">
            <Card className="h-full">
              <h3 className="text-h4 font-medium text-fg">Planned</h3>
              <ul className="mt-5 space-y-4">
                <li className="rounded-xl border border-dashed border-line/15 p-4">
                  <p className="text-[15px] text-fg">Bug bounty</p>
                  <p className="mt-1 text-small text-fg-muted">A public programme on Immunefi.</p>
                </li>
                <li className="rounded-xl border border-dashed border-line/15 p-4">
                  <p className="text-[15px] text-fg">Audit contests</p>
                  <p className="mt-1 text-small text-fg-muted">Open contests on Cantina and Code4rena.</p>
                </li>
              </ul>
              <p className="mt-5 text-caption text-fg-subtle">
                From the{" "}
                <a href={links.docsSecurity} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-fg">
                  security documentation
                </a>
                . No dates set yet.
              </p>
            </Card>
          </Reveal>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
