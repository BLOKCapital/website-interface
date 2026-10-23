import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CtaBand } from "@/components/ui/CtaBand";
import { NextReads } from "@/components/ui/NextReads";
import { RiskNote } from "@/components/ui/RiskNote";
import { TokenSpec } from "@/components/token/TokenSpec";
import { AllocationExplorer } from "@/components/token/AllocationExplorer";
import { TokenTimeline } from "@/components/token/TokenTimeline";
import { TokenChecks } from "@/components/token/TokenChecks";
import { DotField } from "@/components/motion/DotField";
import { ScrollInk } from "@/components/motion/ScrollInk";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { milestones } from "@/lib/data/milestones";
import { protocolStatus } from "@/lib/data/status";
import { links } from "@/lib/data/socials";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "$BLOKC token: supply, utility and allocation",
  description: `The $BLOKC governance token on Arbitrum One: 10B supply, utility, allocation, the official contract address and the IDO planned for ${protocolStatus.token}.`,
  path: "/token",
  // token/opengraph-image.tsx supplies the card.
  ownImage: true,
});

// Present tense only for what exists today: core members already vote
// (as /governance states). Everything $BLOKC itself unlocks is planned (CRO-13).
const utilities: { title: string; body: string; planned?: boolean }[] = [
  {
    title: "Governance",
    body: "Core DAO members vote today on protocol upgrades, index approvals and fee parameters, on-chain through Aragon OSx. $BLOKC holders will vote after the IDO.",
  },
  { title: "Loyalty rewards", planned: true, body: "$BLOKC will be distributed to Garden owners who actively use the protocol." },
  { title: "Staking", planned: true, body: "Staked $BLOKC will earn a share of protocol fees, once the fee switch is turned on by DAO vote." },
  { title: "Manager boost", planned: true, body: "You will be able to delegate $BLOKC to boost the visibility of a Gardener you trust." },
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

// Key facts (SEO-12): one plain sentence an answer engine can lift, under the
// heading, using only what this page already shows (TokenSpec and
// TokenContract). A sentence, not a list: the spec panel below is the list.
const keyFacts =
  "$BLOKC is an ERC-20 token on Arbitrum One (chain ID 42161), with a total supply of 10,000,000,000 $BLOKC and 18 " +
  "decimals. Its contract address is below; always check it against the docs before you send anything.";

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
        description={`$BLOKC is BLOK Capital's governance token, an ERC-20 on Arbitrum One. It launches at the IDO, planned for ${protocolStatus.token}, and will give the people who use BLOK Capital a say in how the protocol changes.`}
        actions={
          <>
            {/* With the ↗ cue the pair no longer fits one row at 375: when they wrap, each fills its row. */}
            <Button href={links.whitepaper} data-cta="token_whitepaper" className="max-sm:grow">
              Read the whitepaper
            </Button>
            <Button href="/governance" variant="secondary" className="max-sm:grow">
              Governance
            </Button>
          </>
        }
        aside={
          <div className="relative mx-auto aspect-square w-full max-w-[260px]">
            {/* A field of dots behind the coin (after Safe Foundation's token hero), inside the glow's bounds so it never widens a phone. */}
            <div aria-hidden className="pointer-events-none absolute inset-[-20%] opacity-70 [mask-image:radial-gradient(circle,black_30%,transparent_70%)]">
              <DotField variant="orb" tone="leaf" gap={9} />
            </div>
            <div aria-hidden className="glow-leaf pointer-events-none absolute inset-[-20%]" />
            <Image src="/brand/token-front.webp" alt="The $BLOKC token" fill sizes="260px" priority className="animate-float object-contain" />
          </div>
        }
      />

      {/* The point of the token, inked in as it scrolls (the About page's principle, word for word). */}
      <Section id="say" className="pb-0 sm:pb-0">
        <ScrollInk className="display max-w-4xl text-display-sm leading-[1.28] text-fg">
          Today the core members listed on Aragon vote. After the IDO, $BLOKC holders do, and then it stops being up to us.
        </ScrollInk>
      </Section>

      <Section
        id="facts"
        eyebrow="Token facts"
        title="One token, four numbers."
        description={keyFacts}
      >
        <Reveal>
          <TokenSpec />
        </Reveal>
      </Section>

      <Section
        id="utility"
        tone="surface"
        eyebrow="Utility"
        title="What $BLOKC is for."
        description="The DAO already governs the protocol through its core members. Voting with $BLOKC, and everything else here, is planned."
      >
        <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {utilities.map((u, i) => (
            <RevealItem as="li" key={u.title}>
              <Card tone={u.planned ? "planned" : "default"} className="h-full">
                <div className="flex h-6 items-center justify-between gap-3">
                  <span className="font-mono text-label text-leaf">0{i + 1}</span>
                  {u.planned && <Badge status="planned" />}
                </div>
                <h3 className="mt-3 text-h4 font-medium text-fg">{u.title}</h3>
                <p className="mt-2 text-small text-fg-muted">{u.body}</p>
              </Card>
            </RevealItem>
          ))}
        </Stagger>
        <RiskNote className="mt-8" />
      </Section>

      <Section id="allocation" eyebrow="Allocation" title="Where the 10B supply goes.">
        <div className="grid gap-5 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-8">
            <AllocationExplorer
              items={allocation}
              total={10_000_000_000}
              symbol="BLOKC"
              caption="$BLOKC allocation, as a percentage of the 10 billion total supply"
            />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-4">
            <TokenTimeline items={tokenMilestones} />
          </Reveal>
        </div>
      </Section>
      <TokenChecks />
      <NextReads hrefs={["/governance", "/security#controls", "/indices"]} />
      <CtaBand />
    </>
  );
}
