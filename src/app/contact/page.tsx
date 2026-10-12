import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FaqList } from "@/components/ui/FaqList";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { DiscordIcon, ExternalIcon, SOCIAL_ICONS } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { SafetyNotice } from "@/components/security/SafetyNotice";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { faqs } from "@/lib/data/faqs";
import { links, social, socials } from "@/lib/data/socials";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: { absolute: "Contact BLOK Capital: Discord support and FAQ" },
  description:
    "Reach the BLOK Capital team and community: Discord for support and security reports, plus answers to common questions.",
  path: "/contact",
});

export default function ContactPage() {
  const others = socials.filter((s) => s.id !== "discord");
  const x = social("x");
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
          {/* The Discord card and, beside it, the rule to check a fake
              "support" DM against (SEC-09). */}
          <Reveal className="flex flex-col gap-4 lg:col-span-5">
            <Card className="relative flex flex-1 flex-col overflow-hidden border-leaf/25">
              <div aria-hidden className="glow-leaf absolute -right-20 -top-20 size-80" />
              <DiscordIcon size={32} className="relative text-leaf" />
              <h3 className="display relative mt-6 text-h2 text-fg">Discord</h3>
              <p className="relative mt-3 flex-1 text-[15.5px] text-fg-muted">
                The main channel for support, partnerships and press. For security issues, open a private ticket; never a public
                channel.
              </p>
              <Button href={social("discord").href} size="lg" className="relative mt-8 self-start" data-placement="contact_card">
                Join the Discord
              </Button>
            </Card>
            <SafetyNotice />
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
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line/12 text-fg-muted group-hover/card:text-leaf">
                  <Icon name="doc" />
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

        {/* The page's next step (UX-20): a question the FAQ didn't answer goes
            to the Discord, or to X for anyone not on it (D-19). */}
        <Reveal>
          <Card size="lg" radius="panel" className="mt-12 flex flex-col gap-6 sm:mt-14 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="display text-h3 text-fg">Didn&apos;t find it? Ask in the Discord.</h3>
              <p className="mt-3 text-small text-fg-muted">
                {"Not on Discord? "}
                <a
                  href={x.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-placement="contact_footer"
                  className="inline-flex items-center gap-0.5 rounded-xs font-medium text-leaf underline decoration-leaf/40 underline-offset-[3px] transition-colors duration-fast can-hover:hover:decoration-leaf"
                >
                  Follow us on X
                  <Icon name="external" size="sm" className="-mx-1" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                .
              </p>
            </div>
            <Button href={social("discord").href} size="lg" className="self-start md:self-auto" data-placement="contact_footer">
              <DiscordIcon /> Join the Discord
            </Button>
          </Card>
        </Reveal>
      </Section>
    </>
  );
}
