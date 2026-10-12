import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { AtAGlance } from "@/components/home/AtAGlance";
import { Problem } from "@/components/home/Problem";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Products } from "@/components/home/Products";
import { SecurityPillars } from "@/components/home/SecurityPillars";
import { IndicesSection } from "@/components/home/IndicesSection";
import { HappeningNow } from "@/components/home/HappeningNow";
import { BuiltInOpen } from "@/components/home/BuiltInOpen";
import { EcosystemStrip } from "@/components/home/EcosystemStrip";
import { RulesSection } from "@/components/home/RulesSection";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FaqList } from "@/components/ui/FaqList";
import { CtaBand } from "@/components/ui/CtaBand";
import { RoadmapNowNext, roadmapUpdated } from "@/components/roadmap/Roadmap";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, softwareApplicationSchema } from "@/lib/seo/schema";
import { getGovernance } from "@/lib/data/proposals";
import { faqs } from "@/lib/data/faqs";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: { absolute: "BLOK Capital · Non-custodial wealth management on Arbitrum" },
  description:
    "Non-custodial wealth management on Arbitrum: market-cap-weighted on-chain indices (BLOKC2, BLOKC5, BLOKC10) from a smart wallet at your own address.",
  path: "/",
  // The root opengraph-image.tsx is this page's own card.
  ownImage: true,
});

/**
 * Home, problem → how → proof → act (UI_UX_SUGGESTIONS §3.1, D-08 a–e): what
 * is it → the facts → why does it exist → how does it work → what can I do
 * → what are the indices → can I check it (the security properties, then
 * the rules running) → what has the DAO decided → what is it built on → who
 * builds it → where is it going → questions → how do I join.
 *
 * Moved, not deleted: the six-layer explorer and the full ecosystem go to
 * /protocol, the proposal board to /governance, the index explorer stays on
 * /indices. Old anchors still land: #explore (the How it works teaser
 * line), #rules (the demo inside #security), #now, #ecosystem.
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
      <IndicesSection />
      <SecurityPillars>
        <RulesSection />
      </SecurityPillars>
      <HappeningNow governance={governance} />
      <EcosystemStrip />
      <BuiltInOpen />
      <Section
        id="roadmap"
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
        tone="surface"
        eyebrow="FAQ"
        title="Questions, answered."
        actions={
          <Button href="/contact#faq" variant="secondary" data-cta="faq_all_questions">
            All questions
          </Button>
        }
      >
        <FaqList items={faqs.slice(0, 5)} />
      </Section>
      <CtaBand />
    </>
  );
}
