import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { FactGrid } from "@/components/ui/FactGrid";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FaqList } from "@/components/ui/FaqList";
import { Reveal } from "@/components/ui/Reveal";
import { DiscordIcon } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { Channels } from "@/components/contact/Channels";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { faqs, faqTopics } from "@/lib/data/faqs";
import { social } from "@/lib/data/socials";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: { absolute: "Contact BLOK Capital: Discord support and FAQ" },
  description:
    "Reach the BLOK Capital team and community: Discord for support and security reports, every official channel, and answers to common questions.",
  path: "/contact",
});

/** The FAQ by topic, numbered on across the groups. */
const faqGroups = faqTopics.reduce<{ id: string; label: string; items: typeof faqs; start: number }[]>((acc, t) => {
  const start = acc.reduce((n, g) => n + g.items.length, 0);
  acc.push({ ...t, items: faqs.filter((f) => f.topic === t.id), start });
  return acc;
}, []);

export default function ContactPage() {
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
        actions={
          <>
            <Button href={social("discord").href} data-placement="contact_hero">
              <DiscordIcon /> Join the Discord
            </Button>
            <Button href="#faq" variant="secondary">
              Common questions
            </Button>
          </>
        }
        aside={
          <FactGrid
            items={[
              ["Fastest reply", "Discord"],
              ["Response", "Within 24 hours"],
              ["Security reports", "Private ticket"],
              ["Launch news", "X and Discord"],
            ]}
          />
        }
      />

      <Channels />

      <Section id="faq" tone="surface" eyebrow="FAQ" title="Common questions.">
        {/* By topic, with a sticky index (after Safe's help centre): each group counts on from the last, and every answer can be linked on its own (FaqList). */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <nav aria-label="FAQ topics" className="lg:sticky lg:top-28 lg:col-span-3 lg:self-start">
            <p className="label-caps">Topics</p>
            <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {faqGroups.map((g) => (
                <li key={g.id}>
                  <a
                    href={`#faq-topic-${g.id}`}
                    className="flex items-center justify-between gap-4 rounded-control border border-subtle px-3 py-2 text-small text-fg-muted transition-colors duration-fast can-hover:hover:bg-card can-hover:hover:text-fg lg:border-transparent"
                  >
                    {g.label}
                    <span className="font-mono text-label tabular-nums text-fg-subtle">{g.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-10 lg:col-span-9">
            {faqGroups.map((g) => (
              <div key={g.id} id={`faq-topic-${g.id}`} className="scroll-mt-6">
                <h3 className="label-caps mb-3">{g.label}</h3>
                <FaqList items={g.items} start={g.start} />
              </div>
            ))}
          </div>
        </div>

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
