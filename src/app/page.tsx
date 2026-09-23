import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { AtAGlance } from "@/components/home/AtAGlance";
import { Problem } from "@/components/home/Problem";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Products } from "@/components/home/Products";
import { SecurityPillars } from "@/components/home/SecurityPillars";
import { GovernanceToken } from "@/components/home/GovernanceToken";
import { Ecosystem } from "@/components/home/Ecosystem";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FaqList } from "@/components/ui/FaqList";
import { CtaBand } from "@/components/ui/CtaBand";
import { RoadmapNowNext, roadmapUpdated } from "@/components/roadmap/Roadmap";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, softwareApplicationSchema } from "@/lib/seo/schema";
import { getGovernance } from "@/lib/data/proposals";
import { faqs } from "@/lib/data/faqs";

export const metadata: Metadata = {
  description:
    "BLOK Capital is a non-custodial wealth-management protocol on Arbitrum: follow curated on-chain indices from a smart wallet only you control.",
  alternates: { canonical: "/" },
};

/**
 * Home, in the order a newcomer needs it: what it is → the facts → why it
 * exists → how it works → what you can do → why it's safe → who governs it →
 * what it's built on → where it's going → questions → join.
 */
export default async function HomePage() {
  const governance = await getGovernance();
  return (
    <>
      <JsonLd data={[serviceSchema(), softwareApplicationSchema()]} />
      <Hero />
      <AtAGlance governance={governance} />
      <Problem />
      <HowItWorks />
      <Products />
      <SecurityPillars />
      <GovernanceToken governance={governance} />
      <Ecosystem />
      <Section
        id="roadmap"
        tone="surface"
        eyebrow="Roadmap"
        title={
          <>
            Where things <em className="text-sand">stand.</em>
          </>
        }
        description={`Last updated ${roadmapUpdated}.`}
        actions={<Button href="/about#roadmap" variant="secondary">Full roadmap</Button>}
      >
        <RoadmapNowNext />
      </Section>
      <Section
        id="faq"
        eyebrow="FAQ"
        title="Questions, answered."
        actions={<Button href="/contact#faq" variant="secondary">All questions</Button>}
      >
        <FaqList items={faqs.slice(0, 5)} />
      </Section>
      <CtaBand />
    </>
  );
}
