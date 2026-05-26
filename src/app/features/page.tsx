import type { Metadata } from "next";
import { FeaturesHero } from "@/components/features/FeaturesHero";
import { ForInvestors } from "@/components/features/ForInvestors";
import { ForManagers } from "@/components/features/ForManagers";
import { ForBuilders } from "@/components/features/ForBuilders";
import { TokenDeepDive } from "@/components/features/TokenDeepDive";
import { SecurityAudits } from "@/components/features/SecurityAudits";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Curated indices, on-chain managers, soulbound reputation, Diamond proxy, and the $BLOKC token.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
        ])}
      />
      <FeaturesHero />
      <Reveal><ForInvestors /></Reveal>
      <Reveal variant="slide-left"><ForManagers /></Reveal>
      <Reveal><ForBuilders /></Reveal>
      <Reveal><TokenDeepDive /></Reveal>
      <Reveal variant="scale-up"><SecurityAudits /></Reveal>
    </>
  );
}
