import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FaqList } from "@/components/ui/FaqList";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { DiscordIcon, ExternalIcon, SOCIAL_ICONS } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { faqs } from "@/lib/data/faqs";
import { links, social, socials } from "@/lib/data/socials";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the BLOK Capital team and community: Discord for support and security reports, plus answers to common questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const others = socials.filter((s) => s.id !== "discord");
  return (
    <>
      <JsonLd data={[faqSchema(faqs), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])]} />
      <PageHero
        crumb="Contact"
        eyebrow="Contact"
        title={
          <>
            Talk to <em className="text-sand">the team.</em>
          </>
        }
        description="Support, partnerships, press and security all start in the Discord, where the whole team works in the open. We reply within 24 hours."
      />

      <Section id="channels" eyebrow="Channels" title="Where to find us.">
        <div className="grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Card className="relative flex h-full flex-col overflow-hidden border-leaf/25">
              <div aria-hidden className="glow-leaf absolute -right-20 -top-20 size-80" />
              <DiscordIcon size={32} className="relative text-leaf" />
              <h3 className="display relative mt-6 text-h2 text-fg">Discord</h3>
              <p className="relative mt-3 flex-1 text-[15.5px] text-fg-muted">
                The main channel for support, partnerships and press. For security issues, open a private ticket; never a public
                channel.
              </p>
              <Button href={social("discord").href} size="lg" className="relative mt-8 self-start">
                Join the Discord
              </Button>
            </Card>
          </Reveal>
          <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {others.map((s) => {
              const Icon = SOCIAL_ICONS[s.id];
              return (
                <RevealItem as="li" key={s.id}>
                  <Card href={s.href} className="flex h-full items-center gap-4 p-5">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line/12 text-fg-muted group-hover/card:text-leaf">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] text-fg">{s.label}</span>
                      <span className="block text-caption text-fg-subtle">{s.desc}</span>
                    </span>
                    <ExternalIcon className="text-fg-subtle" />
                  </Card>
                </RevealItem>
              );
            })}
            <RevealItem as="li">
              <Card href={links.docs} className="flex h-full items-center gap-4 p-5">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line/12 font-mono text-[12px] text-fg-muted">
                  docs
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] text-fg">Documentation</span>
                  <span className="block text-caption text-fg-subtle">Guides, architecture and contracts</span>
                </span>
                <ExternalIcon className="text-fg-subtle" />
              </Card>
            </RevealItem>
          </Stagger>
        </div>
      </Section>

      <Section id="faq" tone="surface" eyebrow="FAQ" title="Common questions.">
        <FaqList items={faqs} />
      </Section>
    </>
  );
}
