import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { partnerGroups } from "@/lib/data/partners";

/**
 * Integrations wall. Logos are rendered monochrome (CSS filter) so a mixed
 * set of brand colours reads as one calm row on the dark theme; hover brings
 * the colour back. Labelled as integrations, not endorsements.
 */
export function Ecosystem() {
  return (
    <Section
      id="ecosystem"
      eyebrow="Ecosystem"
      title={
        <>
          Built on <em className="text-sand">open infrastructure.</em>
        </>
      }
      description="The smart-wallet stack that keeps the keys with you, and the on-chain venues a Garden routes through. Integrations, not endorsements."
    >
      <div className="space-y-12">
        {partnerGroups.map((g) => (
          <div key={g.label}>
            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-h4 font-medium text-fg">{g.label}</h3>
              <p className="text-small text-fg-subtle">{g.intro}</p>
            </div>
            <Stagger
              as="ul"
              step={0.04}
              className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/[0.08] bg-line/[0.08] ${
                // Column count the logos fill exactly, so no empty cells show.
                g.partners.length % 3 === 0 ? "sm:grid-cols-3 lg:grid-cols-6" : "sm:grid-cols-4"
              }`}
            >
              {g.partners.map((p) => (
                <RevealItem as="li" key={p.name} className="bg-canvas">
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/p flex h-28 flex-col items-center justify-center gap-3 px-4 transition-colors hover:bg-card"
                  >
                    <span className="relative h-8 w-full max-w-[120px]">
                      <Image
                        src={p.image}
                        alt=""
                        fill
                        sizes="120px"
                        unoptimized
                        className="object-contain opacity-70 transition-[filter,opacity] duration-300 [filter:grayscale(1)_brightness(0)_invert(1)] group-hover/p:opacity-100 group-hover/p:[filter:none]"
                        style={{ transform: `scale(${p.scale ?? 1})` }}
                      />
                    </span>
                    <span className="text-[12px] text-fg-subtle transition-colors group-hover/p:text-fg-muted">
                      {p.name}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                  </a>
                </RevealItem>
              ))}
            </Stagger>
          </div>
        ))}
      </div>
    </Section>
  );
}
