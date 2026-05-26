import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { Channels } from "@/components/contact/Channels";
import { Faq } from "@/components/contact/FAQ";
// import { LegalBlock } from "@/components/contact/LegalBlock";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { faqs } from "@/lib/data/faqs";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to us. Partnerships, support, press, security, we have a channel for each.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <ContactHero />
      <Reveal><Channels /></Reveal>
      <Reveal><Faq /></Reveal>
      {/* <Reveal variant="fade-in"><LegalBlock /></Reveal> */}
    </>
  );
}
