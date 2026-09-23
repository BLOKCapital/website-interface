import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { ExternalIcon } from "@/components/ui/icons";
import { ProductVideo } from "@/components/about/ProductVideo";
import { TeamPhoto } from "@/components/about/TeamPhoto";
import { RoadmapTimeline, roadmapUpdated } from "@/components/roadmap/Roadmap";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { team } from "@/lib/data/team";
import { links } from "@/lib/data/socials";

export const metadata: Metadata = {
  title: "About",
  description: "Why BLOK Capital exists, what it won't trade away, the people building it, and the roadmap.",
  alternates: { canonical: "/about" },
};

const story = [
  "The first wallet I ever made showed me what was wrong with crypto, but I also understood what was wrong with the alternative.",
  "Custodians don't run away with your money very often. They just quietly tell you no when you ask the wrong question. They charge you 2-and-20 to invest in the same five things. They send you a PDF every quarter and call it transparency.",
  "BLOK is the protocol I wanted to use myself: a way to follow real managers, with on-chain receipts, without ever handing anyone the keys. We didn't invent any of the primitives, but we put them together in a way no one else had.",
];

const values = [
  { title: "Self-custody, always", body: "If we ever build a custodial product, we've gotten lost.", where: "In the contracts" },
  { title: "Transparency by default", body: "If it can be on-chain, it should be on-chain. Receipts beat reports.", where: "In the receipts" },
  { title: "Community-owned", body: "BLOK is governed by people who actually use it. Not us.", where: "In the votes" },
  { title: "Long-term wealth", body: "Compound, not pump. Boring is a feature.", where: "In the rebalance" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <PageHero
        crumb="About"
        eyebrow="About"
        title={
          <>
            A protocol, <em className="text-sand">not a product owned by anyone.</em>
          </>
        }
        description="The team that shipped BLOK Capital doesn't hold the keys to your money, the right to change it without a vote, or the ability to take it down."
        aside={
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/[0.08] bg-line/[0.08] text-small">
            {[
              ["Founded", "2023"],
              ["Entity", "BLOK Capital DAO LLC"],
              ["Jurisdiction", "Marshall Islands"],
              ["License", "MIT"],
            ].map(([k, v]) => (
              <div key={k} className="bg-card p-4">
                <dt className="text-caption text-fg-subtle">{k}</dt>
                <dd className="mt-1 text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <Section id="story" eyebrow="Why we built it">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="space-y-6 text-[19px] leading-[1.7] text-fg-muted">
              {story.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <p className="mt-8 text-small text-fg-subtle">BLOK Capital</p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <blockquote className="display border-l-2 border-leaf/50 pl-6 text-h3 italic text-fg">
              &ldquo;We didn&apos;t invent any of the primitives, but we put them together in a way no one else had.&rdquo;
            </blockquote>
          </Reveal>
        </div>
      </Section>

      <Section id="video" tone="surface" eyebrow="Introduction" title="BLOK Capital in a few minutes.">
        <Reveal className="mx-auto max-w-4xl">
          <ProductVideo />
          <a
            href={links.video}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-small text-fg-muted hover:text-fg"
          >
            Watch on YouTube <ExternalIcon />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Reveal>
      </Section>

      <Section id="values" eyebrow="Principles" title="What we won't trade away.">
        <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <RevealItem as="li" key={v.title}>
              <Card className="flex h-full flex-col">
                <h3 className="display text-h3 text-fg">{v.title}</h3>
                <p className="mt-3 flex-1 text-[15px] text-fg-muted">{v.body}</p>
                <p className="mt-6 border-t border-line/[0.08] pt-4 text-caption text-leaf">{v.where}</p>
              </Card>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      <Section
        id="team"
        tone="surface"
        eyebrow="Team"
        title="The people tending it."
        description="Core DAO members, listed on-chain in the Aragon token-voting plugin."
        actions={<Button href={links.aragonMembers} variant="secondary">Verify on Aragon</Button>}
      >
        <Stagger as="ul" step={0.05} className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {team.map((m) => {
            const card = (
              <>
                <span className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-raised">
                  <TeamPhoto member={m} />
                </span>
                <span className="mt-3 flex items-center justify-between gap-2 px-1">
                  <span className="text-[15px] text-fg">{m.name}</span>
                  {m.href && <ExternalIcon className="text-fg-subtle transition-colors group-hover:text-leaf" />}
                </span>
                {m.role && <span className="mt-0.5 block px-1 text-caption text-fg-subtle">{m.role}</span>}
              </>
            );
            return (
              <RevealItem as="li" key={m.name}>
                {m.href ? (
                  <a href={m.href} target="_blank" rel="noopener noreferrer" className="group block rounded-2xl">
                    {card}
                    <span className="sr-only"> profile (opens in a new tab)</span>
                  </a>
                ) : (
                  <div className="group">{card}</div>
                )}
              </RevealItem>
            );
          })}
        </Stagger>
      </Section>

      <Section id="roadmap" eyebrow="Roadmap" title="Every milestone since 2023." description={`Last updated ${roadmapUpdated}.`}>
        <RoadmapTimeline />
      </Section>

      <Section id="press" tone="surface" eyebrow="Press" title="Brand and media kit.">
        <Reveal>
          <Card className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-h4 font-medium text-fg">Logo pack and brand guidelines</h3>
              <p className="mt-2 text-small text-fg-muted">SVG and PNG logos in light and dark, plus colour, type and usage rules.</p>
            </div>
            <Button href={links.brandKit} variant="secondary">
              Open the brand kit
            </Button>
          </Card>
        </Reveal>
      </Section>
      <CtaBand />
    </>
  );
}
