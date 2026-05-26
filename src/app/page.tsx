import { Hero } from "@/components/home/Hero";
import { ProblemComparison } from "@/components/home/ProblemComparison";
import { GardenMetaphor } from "@/components/home/GardenMetaphor";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyItsSafe } from "@/components/home/WhyItsSafe";
import { TokenTeaser } from "@/components/home/TokenTeaser";
import { RoadmapTrack } from "@/components/home/RoadmapTrack";
import { SocialProof } from "@/components/home/SocialProof";
import { DaoCommunity } from "@/components/home/DaoCommunity";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema } from "@/lib/seo/schema";
import type { Metadata } from "next";

// Title falls back to the layout's default ("BLOK Capital — It's crypto, but
// different"); we only add a home-specific description + canonical here.
export const metadata: Metadata = {
  description:
    "Decentralized wealth management on Arbitrum. Follow pro-curated indices or hire an on-chain manager, your assets never leave your wallet.",
  alternates: { canonical: "/" },
};

/**
 * Home composition. The hero animates on its own (no wrap).
 * Each section below fades up on viewport enter — single-shot reveals
 * give the page a felt rhythm without distracting from scroll.
 *
 * Closing CTA is handled by the global FooterBanner ("Everyone deserves a
 * Garden.") in layout.tsx, so a second "Plant your Garden today" panel here
 * would duplicate the same beat.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={serviceSchema()} />
      <Hero />
      <Reveal><ProblemComparison /></Reveal>
      <GardenMetaphor />{/* owns its own scroll-driven motion, don't wrap */}
      <Reveal><HowItWorks /></Reveal>
      <Reveal><WhyItsSafe /></Reveal>
      <Reveal><TokenTeaser /></Reveal>
      <RoadmapTrack />{/* owns its own scroll-locked motion */}
      <Reveal><SocialProof /></Reveal>
      <Reveal><DaoCommunity /></Reveal>
    </>
  );
}
