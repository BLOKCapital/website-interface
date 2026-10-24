import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { FactGrid } from "@/components/ui/FactGrid";
import { SectionNav } from "@/components/ui/SectionNav";
import { GardenCompare } from "@/components/protocol/GardenCompare";
import { GardenMachine } from "@/components/iso/GardenMachine";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { Ecosystem } from "@/components/home/Ecosystem";
import { ExploreSection } from "@/components/explore/ExploreSection";
import { ProductStack } from "@/components/protocol/ProductStack";
import { FeesRisks } from "@/components/protocol/FeesRisks";
import { TermLink } from "@/components/protocol/Glossary";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { protocolStatus } from "@/lib/data/status";
import { links } from "@/lib/data/socials";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Protocol: how non-custodial Gardens work",
  description: `How BLOK Capital works: smart-wallet Gardens, curated Index Gardens, Yield Gardens, Gardeners (from ${protocolStatus.gardeners}), how a Garden keeps your keys yours, fees and risks.`,
  path: "/protocol",
  // protocol/opengraph-image.tsx supplies the card.
  ownImage: true,
});

/** The page's sections, in order, for the sticky section bar. */
const sections = [
  { id: "explore", label: "How it works" },
  { id: "products", label: "Gardens" },
  { id: "architecture", label: "Under the hood" },
  { id: "fees", label: "Fees & risks" },
  { id: "ecosystem", label: "Ecosystem" },
];

export default function ProtocolPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Protocol", path: "/protocol" }])} />
      <PageHero
        crumb="Protocol"
        eyebrow="The protocol"
        title={
          <>
            One wallet. <em className="text-sand">Three ways to steer it.</em>
          </>
        }
        description={
          <>
            Every <TermLink id="garden">Garden</TermLink> is a <TermLink id="smart-account">smart wallet</TermLink> at your
            address. Strategies can rebalance inside it; only your signature moves funds out.
          </>
        }
        actions={
          <>
            <Button href={links.docs} data-cta="protocol_hero_docs">
              Read the docs
            </Button>
            <Button href="/security" variant="secondary">
              Security
            </Button>
          </>
        }
        aside={
          <FactGrid
            items={[
              ["Network", "Arbitrum One"],
              ["Custody", "Always yours"],
              ["Source", "Public on GitHub"],
              ["Indices", "BLOKC2 · 5 · 10"],
            ]}
          />
        }
      />

      <SectionNav items={sections} />

      {/* The canonical "how" (D-08a, UX-04): the layer-by-layer explorer is the centrepiece, right after the hero. */}
      <ExploreSection />

      <Section
        id="products"
        eyebrow="Products"
        title="Three ways to run a Garden."
        description="Every Garden is the same smart wallet underneath; what changes is who steers it. Scroll through the three."
      >
        <ProductStack />
        {/* The deck shows one at a time; this sets them side by side so a visitor can choose. */}
        <div id="compare" className="mt-16 sm:mt-20">
          <div className="mb-8 max-w-2xl">
            <p className="label-caps">Compare</p>
            <h3 className="display mt-3 text-display-sm text-balance text-fg">Side by side.</h3>
            <p className="mt-3 text-ui text-fg-muted">
              Same wallet, same custody. What changes is who steers it, what it costs and when it opens.
            </p>
          </div>
          <GardenCompare />
        </div>
      </Section>

      {/* Under the hood, in one idea: the custody model as a machine (Fig 1). The standards behind it are in the docs. */}
      <Section
        id="architecture"
        tone="surface"
        eyebrow="Under the hood"
        title={
          <>
            Your keys stay <em className="text-sand">yours.</em>
          </>
        }
        description="Your Garden is a smart wallet at your own address. Strategies can work inside it, but only your signature takes money out."
        actions={
          <Button href={links.docsArchitecture} variant="secondary" data-cta="protocol_docs_architecture">
            How it&apos;s built, in the docs
          </Button>
        }
      >
        <Reveal>
          <GardenMachine />
        </Reveal>
      </Section>

      {/* What it costs and what can go wrong, right after how it's built. */}
      <FeesRisks tone="canvas" />

      {/* D-08b: the full ecosystem; its actions are the builders' first reads (the code and the docs). */}
      <Ecosystem tone="surface" />

      <CtaBand context="protocol" />
    </>
  );
}
