import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StepFlow } from "@/components/ui/StepFlow";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { ProposalList } from "@/components/governance/ProposalList";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getGovernance } from "@/lib/data/proposals";
import { links } from "@/lib/data/socials";

export const metadata: Metadata = {
  title: "Governance",
  description: "How BLOK Capital is governed on-chain through Aragon OSx, and the latest DAO proposals.",
  alternates: { canonical: "/governance" },
};

const process = [
  { label: "Propose", detail: "A protocol upgrade, new index, fee parameter or treasury allocation." },
  { label: "Discuss", detail: "In public on Discord, Telegram and the forum, before any vote." },
  { label: "Vote", detail: "On-chain via Aragon OSx, weighted by BLOKC. Every vote is public." },
  { label: "Execute", detail: "Passed proposals execute through Aragon OSx. No admin override." },
];

const decides = ["Protocol upgrades and new facets", "Index approvals and rebalance cadence", "Fee parameters and the fee switch", "Treasury allocations"];

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
            <Button href={links.aragon}>Proposals on Aragon</Button>
            <Button href="/token" variant="secondary">
              $BLOKC token
            </Button>
          </>
        }
      />

      <Section id="process" eyebrow="Process" title="How a decision is made.">
        <Reveal>
          <Card>
            <StepFlow steps={process} label="How a governance decision is made" />
          </Card>
        </Reveal>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Reveal>
            <Card className="h-full">
              <h3 className="text-h4 font-medium text-fg">What the DAO decides</h3>
              <ul className="mt-5 space-y-3">
                {decides.map((d) => (
                  <li key={d} className="flex gap-3 text-[15px] text-fg-muted">
                    <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-leaf" />
                    {d}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="h-full border-bloom/25">
              <Badge tone="current">Current phase</Badge>
              <h3 className="mt-4 text-h4 font-medium text-fg">Core members vote until the token launches</h3>
              <p className="mt-2 text-small text-fg-muted">
                Before the public token launch, only the core DAO members listed on Aragon can vote. Public $BLOKC voting follows the
                IDO. Every member is verifiable on-chain.
              </p>
              <a
                href={links.aragonMembers}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex text-small font-medium text-leaf underline underline-offset-2 hover:text-fg"
              >
                See the members on Aragon<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section id="proposals" tone="surface" eyebrow="On-chain record" title="Proposals.">
        <Reveal>
          <Card>
            <ProposalList governance={governance} />
            <p className="mt-6 border-t border-line/[0.08] pt-5 text-caption text-fg-subtle">
              {governance.syncedLabel
                ? `Synced from chain ${governance.syncedLabel}. `
                : ""}
              The full record, including votes, is on{" "}
              <a href={links.aragon} target="_blank" rel="noopener noreferrer" className="text-leaf underline underline-offset-2">
                Aragon
              </a>
              .
            </p>
          </Card>
        </Reveal>
      </Section>
      <CtaBand />
    </>
  );
}
