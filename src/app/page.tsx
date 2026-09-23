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
import { ExploreSection } from "@/components/explore/ExploreSection";
import { Ecosystem } from "@/components/home/Ecosystem";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FaqList } from "@/components/ui/FaqList";
import { CtaBand } from "@/components/ui/CtaBand";
import { RoadmapNowNext, roadmapUpdated } from "@/components/roadmap/Roadmap";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, softwareApplicationSchema } from "@/lib/seo/schema";
import { getGovernance } from "@/lib/data/proposals";
import { getGithub } from "@/lib/data/github";
import { faqs } from "@/lib/data/faqs";

export const metadata: Metadata = {
  description:
    "Non-custodial wealth management on Arbitrum. Follow BLOKC2, BLOKC5 or BLOKC10, market-cap-weighted on-chain indices, from a smart wallet at your own address.",
  alternates: { canonical: "/" },
};

/**
 * Home, in the order a newcomer asks: what is it → the facts → why does it
 * exist → how does it work → what can I do → what are the indices → what's
 * under the hood → what's happening right now → is it safe → what is it built
 * on → who builds it → where is it going → questions → how do I join.
 */
export default async function HomePage() {
  const [governance, github] = await Promise.all([getGovernance(), getGithub()]);
  return (
    <>
      <JsonLd data={[serviceSchema(), softwareApplicationSchema()]} />
      <Hero />
      <AtAGlance governance={governance} />
      <Problem />
      <HowItWorks />
      <Products />
      <IndicesSection />
      <ExploreSection />
      <HappeningNow governance={governance} />
      <SecurityPillars />
      <Ecosystem />
      <BuiltInOpen github={github} />
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
