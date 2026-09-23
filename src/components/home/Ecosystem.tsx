import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Stagger, RevealItem, Reveal } from "@/components/ui/Reveal";
import { ExternalIcon } from "@/components/ui/icons";
import { ecosystem, otherChains } from "@/lib/data/ecosystem";

/**
 * Ecosystem map: grouped by the job each project does in a Garden, each
 * tile linking to the code or docs that proves it. Logos render monochrome
 * so mixed brand colours read as one calm system; hover restores colour.
 */
export function Ecosystem() {
  return (
    <Section
      id="ecosystem"
      eyebrow="Ecosystem"
      title={
        <>
          Composed from projects <em className="text-sand">you already know.</em>
        </>
      }
      description="BLOK Capital doesn't reinvent exchanges, oracles or lending. It wires proven ones into your wallet. Each tile links to the code that integrates it."
    >
      <div className="divide-y divide-line/[0.07] border-y border-line/[0.07]">
        {ecosystem.map((g) => (
          <Reveal key={g.id} className="grid gap-5 py-7 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h3 className="text-h4 font-medium text-fg">{g.label}</h3>
              <p className="mt-1.5 max-w-xs text-small text-fg-subtle">{g.intro}</p>
            </div>
            <Stagger as="ul" step={0.05} className="grid gap-2 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
              {g.items.map((it) => (
                <RevealItem as="li" key={it.name}>
                  <a
                    href={it.evidence.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/e flex h-full flex-col gap-3 rounded-2xl border border-line/[0.07] bg-card p-4 transition-colors hover:border-leaf/30 hover:bg-raised"
                  >
                    <span className="flex h-7 items-center">
                      {it.logo ? (
                        <span className="relative h-6 w-28">
                          <Image
                            src={it.logo}
                            alt=""
                            fill
                            sizes="112px"
                            unoptimized
                            className="object-contain object-left opacity-80 transition-[filter,opacity] duration-300 [filter:grayscale(1)_brightness(0)_invert(1)] group-hover/e:opacity-100 group-hover/e:[filter:none]"
                            style={{ transform: `scale(${it.scale ?? 1})`, transformOrigin: "left center" }}
                          />
                        </span>
                      ) : (
                        <span aria-hidden className="text-[17px] font-semibold tracking-tight text-fg/80 group-hover/e:text-fg">
                          {it.name}
                        </span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="sr-only">{it.name}: </span>
                      <span className="block text-small text-fg-muted">{it.use}</span>
                      <span className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-fg-subtle group-hover/e:text-leaf">
                        {it.evidence.label} <ExternalIcon size={10} />
                      </span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                  </a>
                </RevealItem>
              ))}
            </Stagger>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-5 flex flex-col gap-2 rounded-2xl border border-dashed border-line/15 px-5 py-4 text-small text-fg-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
        <span className="text-fg-subtle">Also in the codebase, not live on Arbitrum:</span>
        {otherChains.map((o) => (
          <a key={o.chain} href={o.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-leaf">
            <span className="text-fg">{o.chain}</span> · {o.venues}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
      </Reveal>
    </Section>
  );
}
