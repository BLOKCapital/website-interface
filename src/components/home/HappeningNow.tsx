import { Section } from "@/components/ui/Section";
import { ProposalBoard } from "@/components/governance/ProposalBoard";
import type { GovernanceSnapshot } from "@/lib/data/proposals";

/**
 * "What the DAO has decided": its proposals as recorded on-chain, each one
 * opening the DAO on Aragon. Read at build time, so visitors never see a
 * loading or failure state.
 */
export function HappeningNow({ governance }: { governance: GovernanceSnapshot }) {
  return (
    <Section
      id="now"
      eyebrow="Governance on-chain"
      title={
        <>
          Don&apos;t take our word for it. <em className="text-sand">Read the votes.</em>
        </>
      }
      description="Every change to the protocol is a proposal the DAO votes on with Aragon, on Arbitrum. Here's what it has decided so far; each one opens on Aragon, where the votes live."
    >
      <ProposalBoard governance={governance} />
    </Section>
  );
}
