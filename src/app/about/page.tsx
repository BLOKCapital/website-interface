import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { FactGrid } from "@/components/ui/FactGrid";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { NextReads } from "@/components/ui/NextReads";
import { Reveal } from "@/components/ui/Reveal";
import { ExternalIcon } from "@/components/ui/icons";
import { ProductVideo } from "@/components/about/ProductVideo";
import { TeamWall } from "@/components/about/TeamWall";
import { Principles } from "@/components/about/Principles";
import { RoadmapTimeline, roadmapUpdated } from "@/components/roadmap/Roadmap";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { team } from "@/lib/data/team";
import { links } from "@/lib/data/socials";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: { absolute: "About BLOK Capital: team, principles and roadmap" },
  description:
    "BLOK Capital DAO LLC (Marshall Islands): why the protocol exists, the principles it won't trade away, the team building it and the roadmap.",
  path: "/about",
});

const story = [
  "The first wallet I ever made showed me what was wrong with crypto, but I also understood what was wrong with the alternative.",
  "Custodians don't run away with your money very often. They just quietly tell you no when you ask the wrong question. They charge you 2-and-20 to invest in the same five things. They send you a PDF every quarter and call it transparency.",
  "BLOK is the protocol I wanted to use myself: a way to follow real managers, with on-chain receipts, without ever handing anyone the keys. We didn't invent any of the primitives, but we put them together in a way no one else had.",
];

const values = [
  { title: "Self-custody, always", body: "If we ever build a custodial product, we've gotten lost.", where: "In the contracts" },
  { title: "Transparency by default", body: "If it can be on-chain, it should be on-chain. Receipts beat reports.", where: "In the receipts" },
  // CRO-06: true today (core members vote), and says when that changes.
  {
    title: "Community-owned, by design",
    body: "Today the core members listed on Aragon vote. After the IDO, $BLOKC holders do, and then it stops being up to us.",
    where: "In the votes",
  },
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
            A protocol, <em>governed in the open.</em>
          </>
        }
        // No "or the ability to take it down": a security council can pause
        // new Garden deployments (/security, "Pausing").
        description="The team that shipped BLOK Capital doesn't hold the keys to your money, and every change goes through an on-chain vote."
        actions={
          <>
            <Button href="#team">Meet the team</Button>
            <Button href="#video" variant="secondary">
              Watch the intro
            </Button>
          </>
        }
        aside={
          <FactGrid
            items={[
              ["Founded", "2023"],
              ["Entity", "BLOK Capital DAO LLC"],
              ["Jurisdiction", "Marshall Islands"],
              ["Source", "Public on GitHub"],
            ]}
          />
        }
      />

      {/* The story as a letter, signed; beside it, its one line that sums it up and the introduction video. */}
      <Section
        id="story"
        eyebrow="Story"
        title={
          <>
            Why we <em>built it.</em>
          </>
        }
      >
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <article className="paper-ruled relative rounded-panel border border-subtle bg-card px-6 pb-8 pt-10 shadow-soft sm:px-10 sm:pb-10 sm:pt-12">
              <span className="tag-lime absolute -top-3 left-6 sm:left-10">why BLOK exists</span>
              <div className="space-y-5 text-body leading-[1.85] text-fg-muted">
                {story.map((p, i) => (
                  <p key={p.slice(0, 24)} className={i === 0 ? "text-lead leading-[1.6] text-fg" : undefined}>
                    {p}
                  </p>
                ))}
              </div>
              <p className="note mt-8 text-h3">BLOK Capital</p>
            </article>
          </Reveal>
          <div className="flex flex-col gap-8 lg:col-span-5">
            <Reveal delay={0.08}>
              <blockquote className="display text-h3 text-fg">
                &ldquo;We didn&apos;t invent any of the primitives, but we put them together in a way <em>no one else had.</em>&rdquo;
              </blockquote>
            </Reveal>
            <Reveal delay={0.14} id="video" className="scroll-mt-28">
              <p className="mb-3 flex items-baseline justify-between gap-3">
                <span className="font-mono text-label uppercase tracking-caps text-cobalt">Introduction</span>
                <span className="note text-[1.15rem]">BLOK Capital in a few minutes</span>
              </p>
              <ProductVideo />
              <a
                href={links.video}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-small font-medium text-leaf transition-colors duration-fast can-hover:hover:text-fg"
              >
                Watch on YouTube <ExternalIcon />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* The principles, as a short manifesto of pinned cards. */}
      <Section
        id="values"
        tone="surface"
        className="paper-ruled"
        eyebrow="Principles"
        title={
          <>
            What we <em>won&apos;t trade away.</em>
          </>
        }
      >
        <Principles items={values} />
      </Section>

      <Section
        id="team"
        eyebrow="Team"
        title={
          <>
            The people <em>tending it.</em>
          </>
        }
        description="Core DAO members, listed on-chain in the Aragon token-voting plugin."
        actions={<Button href={links.aragonMembers} variant="secondary">Verify on Aragon</Button>}
      >
        <TeamWall team={team} />
      </Section>

      <Section id="roadmap" tone="surface" eyebrow="Roadmap" title="Every milestone since 2023." description={`Last updated ${roadmapUpdated}.`}>
        <RoadmapTimeline />
      </Section>

      <NextReads hrefs={["/protocol", "/security", "/governance"]} />
      <CtaBand />
    </>
  );
}
