import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { AtAGlance } from "@/components/home/AtAGlance";
import { AppPreview } from "@/components/home/AppPreview";
import { Problem } from "@/components/home/Problem";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Products } from "@/components/home/Products";
import { SecurityPillars } from "@/components/home/SecurityPillars";
import { Contribute } from "@/components/home/Contribute";
import { IndicesSection } from "@/components/home/IndicesSection";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FaqList } from "@/components/ui/FaqList";
import { CtaBand } from "@/components/ui/CtaBand";
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
 * Home, kept to what a first visit needs (one idea per section, the depth on
 * its own page or in the docs): what it is → the facts → the app → why it
 * exists → how it works → what you can do → the indices → why it's safe →
 * how to earn $BLOKC (the Contributor Program) → questions → how to join.
 *
 * Moved off home, not deleted: the rules console to /security#rules, the
 * DAO's proposals to /governance, the ecosystem to /protocol#ecosystem, the
 * team to /about and the roadmap to /about#roadmap.
 */
export default async function HomePage() {
  const governance = await getGovernance();
  return (
    <>
      <JsonLd data={[serviceSchema(), softwareApplicationSchema()]} />
      <Hero />
      <AtAGlance governance={governance} />
      <AppPreview />
      <Problem />
      <HowItWorks />
      <Products />
      <IndicesSection />
      <SecurityPillars />
      <Contribute />
      <Section
        className="paper-ruled"
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
