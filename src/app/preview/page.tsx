import type { Metadata } from "next";
import { PreviewHero } from "@/components/preview/PreviewHero";
import { Sandbox } from "@/components/preview/Sandbox";
import { FeatureWalkthrough } from "@/components/preview/FeatureWalkthrough";
import { FinalCta } from "@/components/home/FinalCta";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Dashboard Preview",
  description: "Try BLOK before you connect. An interactive sandbox of the real Garden dashboard.",
  alternates: { canonical: "/preview" },
};

export default function PreviewPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Dashboard Preview", path: "/preview" },
        ])}
      />
      <PreviewHero />
      <Reveal><Sandbox /></Reveal>
      <Reveal><FeatureWalkthrough /></Reveal>
      <Reveal variant="scale-up"><FinalCta /></Reveal>
    </>
  );
}
