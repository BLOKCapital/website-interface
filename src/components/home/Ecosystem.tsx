import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Stagger, RevealItem, Reveal } from "@/components/ui/Reveal";
import { ExternalIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { ecosystem, otherChains } from "@/lib/data/ecosystem";
import { links, social } from "@/lib/data/socials";

/**
 * Ecosystem map: grouped by the job each project does in a Garden, each
 * tile linking to the code or docs that proves it. Logos show in their own
 * brand colours, always (not only on hover).
 *
 * Its home is /protocol#ecosystem (D-08b). The tiles are integrations, never
 * endorsements or partnerships, and the copy says so (CRO-22).
 */
export function Ecosystem({ tone = "canvas" }: { tone?: "canvas" | "surface" }) {
  return (
    <Section
      id="ecosystem"
      tone={tone}
      eyebrow="Ecosystem"
      title="Composed from projects you already know."
      description={
        <>
          BLOK Capital doesn&apos;t reinvent exchanges, oracles or lending. It wires proven ones into your wallet.{" "}
          <strong className="font-medium text-fg">Integrations in our code, not endorsements.</strong> Each tile links to the
          file or docs page that shows it.
        </>
      }
      actions={
        <>
          <Button href={social("github").href} variant="secondary" data-cta="protocol_github">
            Code on GitHub
          </Button>
          <Button href={links.docs} variant="secondary" data-cta="protocol_docs">
            Read the docs
          </Button>
        </>
      }
    >
      <div className="divide-y divide-subtle border-y border-subtle">
        {ecosystem.map((g) => (
          <Reveal key={g.id} className="grid gap-5 py-7 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h3 className="text-h4 font-bold tracking-tight text-fg">{g.label}</h3>
              <p className="mt-1.5 max-w-xs text-small text-fg-subtle">{g.intro}</p>
            </div>
            <Stagger as="ul" step={0.05} className="grid grid-cols-2 gap-2 lg:col-span-8 lg:grid-cols-4">
              {g.items.map((it) => (
                <RevealItem as="li" key={it.name}>
                  <a
                    href={it.evidence.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/e flex h-full flex-col gap-3 rounded-card border border-subtle bg-card p-4 surface-link shadow-soft"
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
                            className="object-contain object-left"
                            style={{ transform: `scale(${it.scale ?? 1})`, transformOrigin: "left center" }}
                          />
                        </span>
                      ) : it.mark ? (
                        // The project's own mark (its token icon) beside its name.
                        <span aria-hidden className="flex items-center gap-2">
                          <Image src={it.mark} alt="" width={24} height={24} unoptimized className="size-6 rounded-full" />
                          <span className="text-body font-semibold tracking-tight text-fg">{it.name}</span>
                        </span>
                      ) : (
                        <span aria-hidden className="text-body font-semibold tracking-tight text-fg/80 group-hover/e:text-fg">
                          {it.name}
                        </span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="sr-only">{it.name}: </span>
                      <span className="block text-small text-fg-muted">{it.use}</span>
                      {/* Long file names wrap inside the tile (VIS-10, MOB-09c). */}
                      <span className="mt-1 block font-mono text-label text-fg-subtle [overflow-wrap:anywhere] group-hover/e:text-leaf">
                        {it.evidence.label} <ExternalIcon size={10} className="inline-block align-baseline" />
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
      <Reveal className="mt-5 flex flex-col gap-2 rounded-card border border-dashed border-line/15 px-5 py-4 text-small text-fg-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
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
