import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { Story } from "@/components/about/Story";
import { ProductVideo } from "@/components/preview/ProductVideo";
import { CoreValues } from "@/components/about/CoreValues";
import { TeamGrid } from "@/components/about/TeamGrid";
import { GovernanceFlow } from "@/components/about/GovernanceFlow";
import { Community } from "@/components/about/Community";
import { PressKit } from "@/components/about/PressKit";
import { getProposals } from "@/lib/data/proposals";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "About",
  description:
    "BLOK Capital is built by the community, for the world. Read our story, meet the team, and follow the DAO.",
  alternates: { canonical: "/about" },
};

/**
 * Each About section now owns its own scroll-triggered motion (Framer Motion
 * whileInView), so the outer Reveal wrappers used to compound those animations.
 * They've been removed; sections animate independently with their own
 * stagger/fade choreography.
 */
export default async function AboutPage() {
  const proposals = await getProposals();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <AboutHero />
      <Story />
      <ProductVideo />
      <CoreValues />
      <TeamGrid />
      <GovernanceFlow proposals={proposals} />
      <Community />
      <PressKit />
    </>
  );
}
