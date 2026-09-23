import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { ActivityFeed } from "@/components/live/ActivityFeed";
import { NetworkPulse } from "@/components/live/NetworkPulse";
import type { GovernanceSnapshot } from "@/lib/data/proposals";
import { protocolStatus } from "@/lib/data/status";

/**
 * "What's happening right now": the DAO's own on-chain history and the
 * network it runs on, both read live in the browser. Titles for proposals
 * come from the build-time governance snapshot.
 */
export function HappeningNow({ governance }: { governance: GovernanceSnapshot }) {
  const titles = Object.fromEntries(governance.proposals.map((p) => [p.index, p.title]));
  const executed = governance.proposals.filter((p) => p.statusLabel === "Executed").length;
  return (
    <Section
      id="now"
      eyebrow="Happening now"
      title={
        <>
          Don&apos;t take our word for it. <em className="text-sand">Watch the chain.</em>
        </>
      }
      description="Every decision the DAO makes lands on Arbitrum as a transaction. This feed reads those logs directly, in your browser, with no server of ours in between."
    >
      <div className="grid gap-5 lg:grid-cols-12">
        <Reveal className="min-w-0 lg:col-span-7">
          <ActivityFeed titles={titles} className="h-full" />
        </Reveal>
        <div className="flex flex-col gap-5 lg:col-span-5">
          <Reveal delay={0.06}>
            <NetworkPulse />
          </Reveal>
          <Reveal delay={0.12} className="flex-1">
            <Card className="relative flex h-full flex-col overflow-hidden">
              <div aria-hidden className="glow-leaf absolute -right-16 -top-16 size-72 opacity-50" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="eyebrow">Governance</p>
                  <h3 className="mt-3 text-h4 font-medium text-fg">
                    {governance.proposals.length ? `${executed} of ${governance.proposals.length} proposals executed` : "Proposals on Aragon"}
                  </h3>
                </div>
                <Image src="/brand/token-front.webp" alt="" width={56} height={56} className="size-12 shrink-0" />
              </div>
              <p className="relative mt-3 text-small text-fg-muted">
                Upgrades, index approvals and fees go to an on-chain vote. Until $BLOKC launches ({protocolStatus.token}),
                the core members listed on Aragon hold the vote; after that, token holders do.
              </p>
              <div className="relative mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-6">
                <ArrowLink href="/governance">Read the proposals</ArrowLink>
                <ArrowLink href="/token">About $BLOKC</ArrowLink>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
