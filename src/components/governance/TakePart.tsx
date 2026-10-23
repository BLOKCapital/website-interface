import { Section } from "@/components/ui/Section";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Badge } from "@/components/ui/Badge";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { links, social } from "@/lib/data/socials";
import { protocolStatus } from "@/lib/data/status";

type Way = { verb: string; title: string; body: string; links: { label: string; href: string; cta?: string }[]; later?: boolean };

/**
 * Where a visitor can take part today (after Safe Foundation's governance
 * link cards: a caps verb, what the place is for, the link). Before the IDO
 * only core members vote, so the honest actions are to discuss, watch and
 * check, with voting itself marked for later. Every line restates the
 * process on this page, the "Current phase" card or status.ts.
 */
const ways: Way[] = [
  {
    verb: "Discuss",
    title: "Talk it through first",
    body: "Proposals are discussed in public on Discord and Telegram before any vote.",
    links: [
      { label: "Discord", href: social("discord").href },
      { label: "Telegram", href: social("telegram").href },
    ],
  },
  {
    verb: "Watch",
    title: "Follow every vote",
    body: "Every proposal and every vote is public on Aragon, on-chain.",
    links: [{ label: "Proposals on Aragon", href: links.aragon, cta: "gov_takepart_aragon" }],
  },
  {
    verb: "Check",
    title: "See who votes today",
    body: "Until the token launches, only the core members listed on Aragon vote. Every member is verifiable on-chain.",
    links: [{ label: "Members on Aragon", href: links.aragonMembers, cta: "gov_takepart_members" }],
  },
  {
    verb: "Vote",
    title: "Hold $BLOKC, after the IDO",
    body: `Public $BLOKC voting follows the IDO, planned for ${protocolStatus.token}.`,
    links: [{ label: "The token", href: "/token" }],
    later: true,
  },
];

export function TakePart() {
  return (
    <Section
      id="take-part"
      eyebrow="Take part"
      title="Where to follow along."
      description="Core members vote until the token launches. Anyone can discuss, watch and check, today."
    >
      <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ways.map((w) => (
          <RevealItem
            as="li"
            key={w.verb}
            className={
              w.later
                ? "flex flex-col rounded-card border border-dashed border-line/30 p-5"
                : "flex flex-col rounded-card border border-subtle bg-card p-5"
            }
          >
            <div className="flex h-6 items-center justify-between gap-3">
              <p className="label-caps text-leaf">{w.verb}</p>
              {w.later && <Badge status="planned" />}
            </div>
            <h3 className="mt-3 text-h4 font-medium text-fg">{w.title}</h3>
            <p className="mt-2 text-small text-fg-muted">{w.body}</p>
            <p className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-5">
              {w.links.map((l) => (
                <span key={l.label} data-cta={l.cta} data-placement={l.cta ? "gov_take_part" : undefined}>
                  <ArrowLink href={l.href} className="text-small">
                    {l.label}
                  </ArrowLink>
                </span>
              ))}
            </p>
          </RevealItem>
        ))}
      </Stagger>
    </Section>
  );
}
