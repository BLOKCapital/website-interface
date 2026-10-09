import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { team } from "@/lib/data/team";

/** Who builds BLOK Capital and where to find them: the people and the community channels. */
export function BuiltInOpen() {
  return (
    <Section
      id="builders"
      tone="surface"
      eyebrow="Who's building it"
      title={
        <>
          A small team, <em className="text-sand">working in public.</em>
        </>
      }
      description="The contracts, the rebalancing keeper, the docs and this website are all on GitHub. Read the code, and ask the people who wrote it in the Discord."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal className="rounded-3xl border border-line/[0.08] bg-card p-6">
          <p className="text-small font-medium text-fg">The people</p>
          <Stagger as="ul" step={0.04} className="mt-4 flex flex-wrap gap-2">
            {team.map((m) => (
              <RevealItem as="li" key={m.name}>
                {m.image ? (
                  <Image src={m.image} alt={m.name} title={m.name} width={44} height={44} className="size-11 rounded-full border border-line/10 object-cover" />
                ) : (
                  <span className="grid size-11 place-items-center rounded-full bg-raised text-caption text-fg-muted" title={m.name}>
                    {m.initials}
                  </span>
                )}
              </RevealItem>
            ))}
          </Stagger>
          <ArrowLink href="/about#team" className="mt-5">
            Meet the team and read the story
          </ArrowLink>
        </Reveal>
        <Reveal delay={0.06} className="rounded-3xl border border-line/[0.08] bg-card p-6">
          <p className="text-small font-medium text-fg">The community</p>
          <p className="mt-2 text-small text-fg-muted">
            The Discord is where testing feedback, support and security reports go. Everything else is announced on X first.
          </p>
          <SocialLinks className="mt-5" />
        </Reveal>
      </div>
    </Section>
  );
}
