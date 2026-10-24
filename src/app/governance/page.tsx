import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { FactGrid } from "@/components/ui/FactGrid";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProposalMachine } from "@/components/iso/ProposalMachine";
import { CtaBand } from "@/components/ui/CtaBand";
import { NextReads } from "@/components/ui/NextReads";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { TakePart } from "@/components/governance/TakePart";
import { ProposalBoard } from "@/components/governance/ProposalBoard";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getGovernance } from "@/lib/data/proposals";
import { links } from "@/lib/data/socials";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Governance: on-chain DAO votes on Aragon OSx",
  description:
    "How BLOK Capital is governed on-chain through Aragon OSx: who votes today, what the DAO decides, and the latest proposals.",
  path: "/governance",
});

const process = [
  { label: "Propose", detail: "A protocol upgrade, new index, fee parameter or treasury allocation.", where: "Aragon OSx" },
  { label: "Discuss", detail: "In public on Discord, Telegram and the forum, before any vote.", where: "In public" },
  { label: "Vote", detail: "On-chain via Aragon OSx, weighted by $BLOKC. Every vote is public.", where: "On-chain" },
  { label: "Execute", detail: "Passed proposals execute through Aragon OSx. No admin override.", where: "On-chain · no override" },
];

const decides = ["Protocol upgrades and new facets", "New indices and index facets", "Fee parameters", "Treasury allocations"];

export default async function GovernancePage() {
  const governance = await getGovernance();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Governance", path: "/governance" }])} />
      <PageHero
        crumb="Governance"
        eyebrow="Governance"
        title={
          <>
            Every change goes <em className="text-sand">through the same door.</em>
          </>
        }
        description="No back-room upgrades and no admin keys with quiet superpowers: changes are proposed, voted and executed on-chain through Aragon OSx."
        actions={
          <>
            {/* Too wide for one row on a phone: when they wrap, each fills its row. */}
            <Button href={links.aragon} data-cta="gov_aragon_proposals" className="max-sm:grow">
              All proposals on Aragon
            </Button>
            <Button href="/token" variant="secondary" className="max-sm:grow">
              $BLOKC token
            </Button>
          </>
        }
        aside={
          <FactGrid
            items={[
              ["Votes today", "Core DAO members"],
              ["After the IDO", "$BLOKC holders"],
              ["Platform", "Aragon OSx"],
              ["Network", "Arbitrum One"],
            ]}
          />
        }
      />

      <Section id="process" eyebrow="Process" title="How a decision is made.">
        {/* Fig 4: the same four stages, as a machine (it replaces the DecisionPipeline explainer). */}
        <Reveal>
          <ProposalMachine stages={process} />
        </Reveal>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Reveal>
            <Card className="h-full">
              <h3 className="text-h4 font-bold tracking-tight text-fg">What the DAO decides</h3>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {decides.map((d, i) => (
                  <li key={d} className="note-card flex flex-col gap-3 p-4">
                    <span className="font-mono text-label text-cobalt">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-ui text-fg">{d}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="h-full border-bloom/25">
              <Badge tone="current">Current phase</Badge>
              <h3 className="mt-4 text-h4 font-bold tracking-tight text-fg">Core members vote until the token launches</h3>
              <p className="mt-2 text-small text-fg-muted">
                Before the public token launch, only the core DAO members listed on Aragon can vote. Public $BLOKC voting follows the
                IDO. Every member is verifiable on-chain.
              </p>
              <p className="mt-5" data-cta="gov_aragon_members">
                <ArrowLink href={links.aragonMembers} className="text-small">
                  See the members on Aragon
                </ArrowLink>
              </p>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* The rich board lives here now (UX-07); home shows a compact strip.
          Its "As of" stamp and Aragon button replace the old sync footer. */}
      <Section
        id="proposals"
        tone="surface"
        eyebrow="On-chain record"
        title="Proposals."
        description="The DAO's proposals, synced from chain when this page was built. The votes themselves live on Aragon."
      >
        <ProposalBoard governance={governance} />
      </Section>
      <TakePart />
      <NextReads hrefs={["/token", "/security#controls", "/about"]} />
      <CtaBand />
    </>
  );
}
