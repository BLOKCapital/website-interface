import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { Badge } from "@/components/ui/Badge";
import { AllocationBars } from "@/components/ui/AllocationBars";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { milestones } from "@/lib/data/milestones";
import { protocolStatus } from "@/lib/data/status";
import { links } from "@/lib/data/socials";

export const metadata: Metadata = {
  title: "$BLOKC token",
  description: "The $BLOKC governance token: utility, allocation of the 10B supply, and launch timing.",
  alternates: { canonical: "/token" },
};

const utilities = [
  { title: "Governance", body: "Vote on protocol upgrades, index approvals and fee parameters, on-chain through Aragon OSx." },
  { title: "Loyalty rewards", body: "BLOKC is distributed to Garden owners who actively use the protocol." },
  { title: "Staking", body: "Stake BLOKC to earn a share of protocol fees once the fee switch is turned on by DAO vote." },
  { title: "Manager boost", body: "Delegate BLOKC to boost the visibility of a Gardener you trust." },
];

// Share of the 10B supply, largest first.
const allocation = [
  { label: "IDO", pct: 20 },
  { label: "Product development", pct: 15 },
  { label: "Team", pct: 12.5 },
  { label: "Treasury", pct: 12.5 },
  { label: "Marketing & PR", pct: 10 },
  { label: "Liquidity", pct: 10 },
  { label: "Seed", pct: 5 },
  { label: "Influencers", pct: 3 },
  { label: "Bug bounty", pct: 3 },
  { label: "Presale", pct: 3 },
  { label: "Advisors", pct: 3 },
  { label: "Community", pct: 2 },
  { label: "Airdrop", pct: 1 },
];

const tokenMilestones = milestones.filter((m) => ["staking", "ido", "dao-vote"].includes(m.id));

export default function TokenPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "$BLOKC token", path: "/token" }])} />
      <PageHero
        crumb="Token"
        eyebrow="$BLOKC"
        title={
          <>
            The token that <em className="text-sand">governs the protocol.</em>
          </>
        }
        description={`$BLOKC gives the people who use BLOK Capital a say in how it changes. It launches at the IDO, planned for ${protocolStatus.token}.`}
        actions={
          <>
            <Button href={links.whitepaper}>Read the whitepaper</Button>
            <Button href="/governance" variant="secondary">
              Governance
            </Button>
          </>
        }
        aside={
          <div className="relative mx-auto aspect-square w-full max-w-[260px]">
            <div aria-hidden className="glow-leaf absolute inset-[-20%]" />
            <Image src="/brand/token-front.webp" alt="The $BLOKC token" fill sizes="260px" priority className="animate-float object-contain" />
          </div>
        }
      />

      <Section id="facts" title="Token facts">
        <Reveal>
          <dl className="grid grid-cols-2 gap-8 rounded-2xl border border-line/[0.08] bg-card p-7 md:grid-cols-4">
            <Stat label="Symbol" value="BLOKC" />
            <Stat label="Total supply" value="10B" />
            <Stat label="Network" value="Arbitrum" />
            <Stat label="Decimals" value="18" />
          </dl>
        </Reveal>
        <p className="mt-4 text-caption text-fg-subtle">
          The contract address will be published at the token-generation event. Treat any earlier claim of a BLOKC contract with
          suspicion.
        </p>
      </Section>

      <Section id="utility" tone="surface" eyebrow="Utility" title="What $BLOKC does.">
        <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {utilities.map((u, i) => (
            <RevealItem as="li" key={u.title}>
              <Card className="h-full">
                <span className="font-mono text-[12px] text-leaf">0{i + 1}</span>
                <h3 className="mt-3 text-h4 font-medium text-fg">{u.title}</h3>
                <p className="mt-2 text-small text-fg-muted">{u.body}</p>
              </Card>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      <Section id="allocation" eyebrow="Allocation" title="Where the 10B supply goes.">
        <div className="grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Card>
              <AllocationBars items={allocation} caption="$BLOKC allocation, as a percentage of the 10 billion total supply" />
              <p className="mt-6 text-caption text-fg-subtle">
                Percent of total supply. Vesting and unlock terms are in the whitepaper.
              </p>
            </Card>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-5">
            <Card className="h-full">
              <h3 className="text-h4 font-medium text-fg">Timeline</h3>
              <ul className="mt-5 space-y-4">
                {tokenMilestones.map((m) => (
                  <li key={m.id} className="border-l-2 border-line/15 pl-4">
                    <p className="flex items-center justify-between gap-3">
                      <span className="text-[15px] text-fg">{m.label}</span>
                      <Badge tone="soon">{m.quarter}</Badge>
                    </p>
                    <p className="mt-1 text-small text-fg-muted">{m.description}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
