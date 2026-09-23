import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { ProposalList } from "@/components/governance/ProposalList";
import type { GovernanceSnapshot } from "@/lib/data/proposals";
import { protocolStatus } from "@/lib/data/status";

/** The two ways the community owns the protocol, with real data where it exists. */
export function GovernanceToken({ governance }: { governance: GovernanceSnapshot }) {
  return (
    <Section
      id="governance"
      eyebrow="Governance & token"
      title={
        <>
          Changes go through <em className="text-sand">the DAO.</em>
        </>
      }
      description="Protocol upgrades, index approvals and fee parameters are decided on-chain through Aragon OSx."
    >
      <div className="grid gap-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <Card className="h-full">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-h4 font-medium text-fg">Recent proposals</h3>
              <Badge tone="neutral">Aragon OSx</Badge>
            </div>
            <ProposalList governance={governance} limit={3} className="mt-6" />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line/[0.08] pt-5">
              <p className="text-caption text-fg-subtle">Until the public token launch, core DAO members listed on Aragon vote.</p>
              <ArrowLink href="/governance">How governance works</ArrowLink>
            </div>
          </Card>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-5">
          <Card className="relative flex h-full flex-col overflow-hidden">
            <div aria-hidden className="glow-leaf absolute -right-16 -top-16 size-72 opacity-60" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">$BLOKC</p>
                <h3 className="display mt-3 text-h3 text-fg">The governance token</h3>
              </div>
              <Image src="/brand/token-front.webp" alt="" width={72} height={72} className="size-16 shrink-0" />
            </div>
            <p className="relative mt-4 text-small text-fg-muted">
              Governance, loyalty rewards for Garden owners, staking once the DAO turns the fee switch on, and boosting the
              Gardeners you trust.
            </p>
            <dl className="relative mt-6 grid grid-cols-2 gap-4 border-t border-line/[0.08] pt-5">
              <div>
                <dt className="text-caption text-fg-subtle">Supply</dt>
                <dd className="display mt-1 text-[24px] text-fg">10B</dd>
              </div>
              <div>
                <dt className="text-caption text-fg-subtle">Launch</dt>
                <dd className="display mt-1 text-[24px] text-fg">IDO {protocolStatus.token}</dd>
              </div>
            </dl>
            <ArrowLink href="/token" className="relative mt-auto pt-6">
              Utility and allocation
            </ArrowLink>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
