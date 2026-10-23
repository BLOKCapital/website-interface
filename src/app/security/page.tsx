import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { SectionNav } from "@/components/ui/SectionNav";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ReleaseMachine } from "@/components/iso/ReleaseMachine";
import { CtaBand } from "@/components/ui/CtaBand";
import { ControlMap } from "@/components/security/ControlMap";
import { LaunchReadiness } from "@/components/security/LaunchReadiness";
import { SecurityReadout } from "@/components/security/SecurityReadout";
import { OfficialLinks } from "@/components/security/OfficialLinks";
import { SafetyNotice } from "@/components/security/SafetyNotice";
import { RulesDemo } from "@/components/guard/RulesDemo";
import { Reveal } from "@/components/ui/Reveal";
import { DiscordIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { auditStatus } from "@/lib/data/audits";
import { links, social } from "@/lib/data/socials";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Security: audits, contracts and controls",
  description: "Who can change the BLOK Capital contracts, where the audit reports are published, and how to report a vulnerability.",
  path: "/security",
  // security/opengraph-image.tsx supplies the card.
  ownImage: true,
});

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
  { label: "Audit", detail: "independent audits, in progress · reports in the docs" },
  { label: "Scan", detail: "SolidityScan and Octane on each release" },
  { label: "Approve", detail: "New facets need a DAO vote" },
  { label: "Ship", detail: "To Arbitrum One at public launch" },
];

/** The page's sections, in order, for the sticky section bar (the Trust menu links into them). */
const sections = [
  { id: "readiness", label: "Readiness" },
  { id: "controls", label: "Who can change what" },
  { id: "rules", label: "Simulation" },
  { id: "audits", label: "Audits" },
  { id: "contracts", label: "Contracts" },
  { id: "official", label: "Official links" },
  { id: "disclosure", label: "Report" },
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
        description="What the contracts let anyone do, who can change them, where the audits are published, and how to report a problem."
        actions={
          <>
            <Button href="#controls">Who can change what</Button>
            <Button href="#disclosure" variant="secondary">
              Report a vulnerability
            </Button>
          </>
        }
        aside={<SecurityReadout release={pipeline.map((p) => p.label)} />}
        asideAlign="start"
      />

      <SectionNav items={sections} />

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

      {/* Audits: their state, and where the reports go (the docs). The old report is no longer shown; data: lib/data/audits.ts. */}
      <Section
        id="audits"
        eyebrow="Audits"
        title={
          <>
            New audits, <em>in progress.</em>
          </>
        }
        description="Independent audits of the contracts are under way. The reports are published in the docs, so you can read each one in full."
      >
        <Reveal>
          <div className="grid overflow-hidden rounded-panel border border-subtle bg-card shadow-soft lg:grid-cols-12">
            <div className="flex flex-col p-6 sm:p-8 lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="eyebrow">Status</p>
                <span className="stamp mr-1 text-progress-text">{auditStatus.label}</span>
              </div>
              <h3 className="display mt-4 text-h3 text-fg">
                Reports go <em>in the docs.</em>
              </h3>
              <p className="mt-3 max-w-xl text-ui text-fg-muted">{auditStatus.detail}</p>
            </div>
            {/* What to look for once a report is out: general, true of any audit. */}
            <div className="border-t border-subtle p-6 sm:p-8 lg:col-span-5 lg:border-l lg:border-t-0">
              <p className="label-caps">When a report is out, check</p>
              <ol className="mt-5 space-y-4">
                {[
                  ["Scope", "Which contracts it covers, and which it doesn't."],
                  ["Version", "The commit it reviewed, against the code that's deployed."],
                  ["Findings", "What was found, and whether each one was fixed."],
                ].map(([k, v], i) => (
                  <li key={k} className="grid grid-cols-[2rem_1fr] gap-3">
                    <span className="font-mono text-label text-cobalt">0{i + 1}</span>
                    <p className="text-small text-fg-muted">
                      <span className="font-bold text-fg">{k}.</span> {v}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
        {/* Fig 3: how a change reaches production, as an assembly line (the same six stages). */}
        <Reveal className="mt-5">
          <h3 className="sr-only">How a change reaches production</h3>
          <ReleaseMachine stages={pipeline} />
        </Reveal>
      </Section>

      {/* Contract addresses are published in the docs, so this points there instead of listing them (owner, 2026-10-23). */}
      <Section
        id="contracts"
        tone="surface"
        eyebrow="Contracts"
        title={
          <>
            Addresses live <em>in the docs.</em>
          </>
        }
        description="Mainnet deployment is in progress. The docs are where verified contract addresses are published. Treat any address that claims to be a BLOK Capital contract, and isn't there, with suspicion."
        actions={
          <Button href={links.docsAddresses} variant="secondary" data-cta="security_docs_addresses">
            Addresses in the docs
          </Button>
        }
      />

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
              <h3 className="text-h4 font-bold tracking-tight text-fg">How to report it</h3>
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
            </Card>
          </Reveal>
        </div>
      </Section>
      <CtaBand context="protocol" />
    </>
  );
}
