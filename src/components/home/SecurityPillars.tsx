import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PillarIcon } from "@/components/ui/PillarIcons";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { ArrowIcon, ExternalIcon } from "@/components/ui/icons";
import { pillars } from "@/lib/data/pillars";

/** Six security properties, each linking to where it's proven. */
export function SecurityPillars() {
  return (
    <Section
      id="security"
      tone="surface"
      eyebrow="Security"
      title={
        <>
          Don&apos;t trust us. <em className="text-sand">Check.</em>
        </>
      }
      description="Each property maps to a contract, an audit or a line of open-source code."
      actions={<Button href="/security" variant="secondary">Contracts and audits</Button>}
    >
      <Stagger as="ul" className="grid gap-px overflow-hidden rounded-2xl border border-line/[0.08] bg-line/[0.08] sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p) => {
          const external = p.href?.startsWith("http");
          const inner = (
            <>
              <div className="flex items-center justify-between gap-3">
                <PillarIcon id={p.id} />
                <span className="text-right font-mono text-[11.5px] text-fg-subtle">{p.spec}</span>
              </div>
              <h3 className="mt-6 text-h4 font-medium text-fg">{p.label}</h3>
              <p className="mt-2 text-small text-fg-muted">{p.description}</p>
              {p.href && (
                <span className="mt-5 inline-flex items-center gap-1.5 text-small font-medium text-leaf">
                  See the proof {external ? <ExternalIcon /> : <ArrowIcon size={13} />}
                </span>
              )}
            </>
          );
          return (
            <RevealItem as="li" key={p.id} className="bg-canvas">
              {p.href ? (
                <Link
                  href={p.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="block h-full p-7 transition-colors hover:bg-card"
                >
                  {inner}
                  {external && <span className="sr-only"> (opens in a new tab)</span>}
                </Link>
              ) : (
                <div className="h-full p-7">{inner}</div>
              )}
            </RevealItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
