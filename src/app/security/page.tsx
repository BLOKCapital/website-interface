import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { FactGrid } from "@/components/ui/FactGrid";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ReleaseMachine } from "@/components/iso/ReleaseMachine";
import { CtaBand } from "@/components/ui/CtaBand";
import { ControlMap } from "@/components/security/ControlMap";
import { LaunchReadiness } from "@/components/security/LaunchReadiness";
import { ContractRegistry } from "@/components/security/ContractRegistry";
import { AuditCard } from "@/components/security/AuditCard";
import { OfficialLinks } from "@/components/security/OfficialLinks";
import { SafetyNotice } from "@/components/security/SafetyNotice";
import { RulesDemo } from "@/components/guard/RulesDemo";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { DiscordIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { audits } from "@/lib/data/audits";
import { links, social } from "@/lib/data/socials";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Security: audits, contracts and controls",
  description: "Who can change the BLOK Capital contracts, who has audited them, and how to report a vulnerability.",
  path: "/security",
  // security/opengraph-image.tsx supplies the card.
  ownImage: true,
});

/** From the CredShields report's summary table (audits repo). */
const findings = [
  { k: "Critical", n: 0, c: "bg-negative" },
  { k: "High", n: 2, c: "bg-negative/80" },
  { k: "Medium", n: 12, c: "bg-caution" },
  { k: "Low", n: 5, c: "bg-sand/70" },
  { k: "Informational", n: 2, c: "bg-cobalt/70" },
  { k: "Gas", n: 5, c: "bg-fg-subtle/60" },
];

const total = findings.reduce((n, f) => n + f.n, 0);

/** The one published report; its dates and scope come from audits.ts (SEC-27, CRO-05). */
const report = audits.find((a) => a.kind === "report")!;

/**
 * How to report a vulnerability (SEC-15). Each step restates what the site
 * already promises: a private ticket, no public posts, a reply within 24
 * hours (the FAQ), and a fix and disclosure timeline agreed privately.
 */
const disclosureSteps = [
  {
    title: "Open a private ticket in the BLOK Capital Discord",
    body: "Use the Discord invite from the official links above, so you know the server is ours.",
  },
  { title: "Describe it", body: "Include the steps to reproduce it and the impact." },
  {
    title: "Keep it private",
    body: "Please don't post it in a public channel or open a public GitHub issue.",
  },
  {
    title: "Hear back within 24 hours",
    body: "We'll work out a fix and a disclosure timeline with you there, privately.",
  },
];

const pipeline = [
  { label: "Write", detail: "Solidity ^0.8.31, public on GitHub" },
  { label: "Test", detail: "Foundry unit and end-to-end tests" },
  { label: "Audit", detail: `${report.partner}: ${report.coverage?.covered ?? "Garden contracts"}, ${report.auditedOn}` },
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
        aside={
          <FactGrid
            items={[
              ["Audit", <>{report.partner}, <span className="whitespace-nowrap">{report.auditedOn}</span></>],
              ["Upgrades", "Need a DAO vote"],
              ["Source", "Public on GitHub"],
              ["Bug reports", "Private Discord ticket"],
            ]}
          />
        }
      />

      <LaunchReadiness />

      {/* INS-05, first after readiness: can anyone but you move your funds? Actor by action (data: components/security/controls.ts). */}
      <Section
        id="controls"
        tone="surface"
        eyebrow="Who can do what"
        title="Who can change what."
        description="Can anyone but you move your funds? Every actor against every action, each answer linked to where it's stated."
      >
        <ControlMap />
      </Section>

      {/* D-08d: the rules demo also lives here, right after who-can-do-what. A dark band: it reads as a console. */}
      <Section
        id="rules"
        tone="dark"
        eyebrow="Simulation"
        title="Watch a Garden say no."
        description="Five things that could happen to a Garden, run through the checks its contracts enforce. Each trace links to the rule it comes from."
      >
        <Reveal>
          <RulesDemo />
        </Reveal>
      </Section>

      <Section id="audits" eyebrow="Audits & scanning" title="One published audit so far. More before launch."
        description="The Garden contracts were audited in November 2024. The index and rebalancer contracts are newer; they get a published review before anyone's money depends on them.">
        {/* Three columns only from lg, so nothing clips at 768 (MOB-09b); the report spans both columns at md. */}
        <Stagger as="ul" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {audits.map((a) => (
            <RevealItem as="li" key={a.partner} className={a.kind === "report" ? "h-full md:col-span-2 lg:col-span-1" : "h-full"}>
              <AuditCard audit={a} />
            </RevealItem>
          ))}
        </Stagger>
        <Reveal className="mt-5">
          <Card>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-h4 font-medium text-fg">CredShields findings, by severity</h3>
              <p className="text-caption text-fg-subtle">{`${total} total · all fixed and retested ${report.retestedOn}`}</p>
            </div>
            <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-line/7" role="img" aria-label={`${total} findings: ${findings.map((f) => `${f.n} ${f.k.toLowerCase()}`).join(", ")}. All fixed.`}>
              {findings.filter((f) => f.n).map((f) => (
                <span key={f.k} className={f.c} style={{ width: `${(f.n / total) * 100}%` }} />
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
        {/* Fig 3: how a change reaches production, as an assembly line (the same six stages). */}
        <Reveal className="mt-5">
          <h3 className="sr-only">How a change reaches production</h3>
          <ReleaseMachine stages={pipeline} />
        </Reveal>
      </Section>

      {/* INS-04: the registry, after the audits. Mainnet addresses are "In progress" (readiness), so every protocol row reads "Not deployed yet"; that's why it no longer leads the page. */}
      <Section
        id="contracts"
        tone="surface"
        eyebrow="Contracts"
        title="Every contract, and where to check it."
        description={
          <>
            Mainnet deployment is in progress. Verified addresses will be published in the documentation and the audits
            repository. Until then, treat any address claiming to be a BLOK Capital protocol contract with suspicion. The one
            published exception is the{" "}
            <Link href="/token#facts" className="text-leaf underline decoration-leaf/40 underline-offset-[3px] can-hover:hover:decoration-leaf">
              $BLOKC token
            </Link>
            .
          </>
        }
        actions={
          <>
            <Button href={links.docsAddresses} variant="secondary" data-cta="security_docs_addresses">
              Addresses in the docs
            </Button>
            <Button href={links.auditsRepo} variant="secondary" data-cta="security_audits_repo">
              Audits repository
            </Button>
          </>
        }
      >
        <ContractRegistry />
      </Section>

      {/* SEC-10: the list to check any link, handle or address against. */}
      <OfficialLinks />

      {/* SEC-15: the disclosure steps, no safe-harbour wording (counsel) and no security@ mailbox (owner, D-18). */}
      <Section
        id="disclosure"
        tone="surface"
        eyebrow="Responsible disclosure"
        title="Found a vulnerability?"
        description="Report it privately, in a Discord ticket. Here is exactly how, and what we will and won't ask of you."
      >
        <div className="grid gap-5 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-7">
            <Card className="h-full">
              <h3 className="text-h4 font-medium text-fg">How to report it</h3>
              {/* TODO(owner): UX-22. Name the ticket channel and the button to press
                  (e.g. "#open-a-ticket → Security") once you confirm them. */}
              <ol className="mt-5 space-y-4">
                {disclosureSteps.map((step, i) => (
                  <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-3">
                    <span aria-hidden className="grid size-8 place-items-center rounded-full border border-subtle font-mono text-label text-fg-muted tabular">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-ui font-medium text-fg">{step.title}</p>
                      <p className="mt-0.5 text-small text-fg-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 border-t border-subtle pt-5 text-body font-medium text-fg">
                We will never ask you to move funds.
              </p>
              <p className="mt-2 text-small text-fg-subtle">
                In scope: the Garden Diamond, facets, indices and rebalancer contracts, and this website.
              </p>
              <Button href={social("discord").href} className="mt-6 max-sm:h-auto max-sm:min-h-11 max-sm:whitespace-normal max-sm:py-2.5 max-sm:text-left" data-placement="security_disclosure">
                <DiscordIcon /> Open a private ticket in Discord
              </Button>
            </Card>
          </Reveal>
          <Reveal delay={0.08} className="flex min-w-0 flex-col gap-5 lg:col-span-5">
            <SafetyNotice />
            {/* The bug bounty and audit contests are rows in Launch readiness; this only points there. */}
            <Card size="sm">
              <p className="text-ui font-medium text-fg">Bug bounty and audit contests</p>
              <p className="mt-1 text-small text-fg-muted">
                Both are planned, with no dates set yet. They&apos;re tracked in{" "}
                <Link href="#readiness" className="rounded-xs text-leaf underline decoration-leaf/40 underline-offset-[3px] can-hover:hover:decoration-leaf">
                  launch readiness
                </Link>
                .
              </p>
              <div className="mt-4" data-cta="security_docs_security">
                <ArrowLink href={links.docsSecurity}>From the security documentation</ArrowLink>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>
      <CtaBand context="protocol" />
    </>
  );
}
