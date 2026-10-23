import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { CornerMarks } from "@/components/motion/CornerMarks";
import { SplitText } from "@/components/motion/SplitText";
import { team } from "@/lib/data/team";
import { social } from "@/lib/data/socials";

/**
 * Who builds BLOK Capital, as a compact band: the people, then where to read
 * their work. The community channels aren't repeated here; the CTA band and
 * the footer below carry them.
 */
export function BuiltInOpen() {
  return (
    <section id="builders" className="relative border-y border-subtle bg-surface py-section-sm">
      <CornerMarks />
      <Container className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-6">
          <p className="eyebrow">Who&apos;s building it</p>
          <SplitText className="display mt-4 text-h2 text-balance text-fg">
            A small team, working in public.
          </SplitText>
          <p className="mt-4 max-w-md text-ui text-fg-muted">
            The contracts, the rebalancing keeper, the docs and this website are all on GitHub. Read the code, and ask the
            people who wrote it in the Discord.
          </p>
        </div>
        <div className="lg:col-span-6">
          <Stagger as="ul" step={0.04} aria-label="The team" className="flex flex-wrap -space-x-3">
            {team.map((m) => (
              <RevealItem as="li" key={m.name}>
                {m.image ? (
                  <Image
                    src={m.image.replace(/\.webp$/, "-96.webp")}
                    alt={m.name}
                    title={m.name}
                    width={48}
                    height={48}
                    className="size-10 rounded-full object-cover ring-2 ring-surface sm:size-12"
                  />
                ) : (
                  <span className="grid size-10 place-items-center rounded-full bg-raised text-caption text-fg-muted ring-2 ring-surface sm:size-12" title={m.name}>
                    {m.initials}
                  </span>
                )}
              </RevealItem>
            ))}
          </Stagger>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <ArrowLink href="/about#team">Meet the team and read the story</ArrowLink>
            <ArrowLink href={social("github").href}>Read the code on GitHub</ArrowLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
