import type { ReactNode } from "react";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { ExternalIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export type Control = { label: string; body: string; by: string; source: string };

const draw = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", pathLength: 1, className: "draw-path" } as const;

/** A drawn mark per control, by label. */
const marks: Record<string, ReactNode> = {
  "Your funds": (
    <>
      <path d="M14 22h20v16H14z" {...draw} />
      <path d="M18 22v-5a6 6 0 0 1 12 0v5M24 29v3" {...draw} />
    </>
  ),
  Upgrades: (
    <>
      <path d="M24 8 10 15l14 7 14-7-14-7ZM10 22l14 7 14-7" {...draw} />
      <path d="m19 33 4 4 7-8" {...draw} />
    </>
  ),
  "Protocol changes": (
    <>
      <path d="M24 8 12 12.5V22c0 8 5 13.5 12 16 7-2.5 12-8 12-16v-9.5L24 8Z" {...draw} />
      <path d="M19 23h10M24 18v10" {...draw} />
    </>
  ),
  Pausing: (
    <>
      <path d="M38 24a14 14 0 1 1-28 0 14 14 0 0 1 28 0Z" {...draw} />
      <path d="M20.5 18v12M27.5 18v12" {...draw} />
    </>
  ),
  Governance: (
    <>
      <path d="M10 24h28v14H10z" {...draw} />
      <path d="M16 24V10h16v14M19.5 16.5l3 3 6-6" {...draw} />
    </>
  ),
};

function Mark({ label, large }: { label: string; large?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn("grid shrink-0 place-items-center rounded-2xl border border-leaf/25 bg-leaf/[0.07] text-leaf", large ? "size-16" : "size-12")}
    >
      <svg width={large ? 38 : 28} height={large ? 38 : 28} viewBox="0 0 48 48">
        {marks[label]}
      </svg>
    </span>
  );
}

function Source({ href, label, className }: { href: string; label: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("group/s inline-flex items-center gap-1 text-small font-medium text-leaf transition-colors hover:text-fg", className)}
    >
      Read the source <ExternalIcon className="transition-transform group-hover/s:-translate-y-0.5 group-hover/s:translate-x-0.5" />
      <span className="sr-only"> for {label} (opens in a new tab)</span>
    </a>
  );
}

/**
 * Who can change what, as a map: the first control (your funds) is the large
 * dark tile, the rest sit beside it. Each names what enforces it and links to
 * where the docs say so; marks draw in as the cards reveal.
 */
export function ControlMap({ controls }: { controls: Control[] }) {
  const [lead, ...rest] = controls;
  return (
    <Stagger step={0.08} className="grid gap-5 lg:grid-cols-12">
      <RevealItem className="lg:col-span-5">
        <article className="theme-dark relative flex h-full flex-col overflow-hidden rounded-[28px] border border-leaf/20 bg-card p-7 sm:p-9">
          <div aria-hidden className="glow-leaf pointer-events-none absolute -right-24 -top-24 size-80 opacity-80" />
          <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_80%_0%,black,transparent_70%)]" />
          <Mark label={lead.label} large />
          <p className="relative mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
            Enforced by <span className="text-leaf">{lead.by}</span>
          </p>
          <h3 className="display relative mt-3 text-[clamp(30px,2.4vw+16px,44px)] leading-tight text-fg">{lead.label}</h3>
          <p className="relative mt-4 text-lead text-fg-muted">{lead.body}</p>
          <Source href={lead.source} label={lead.label} className="relative mt-auto pt-8" />
        </article>
      </RevealItem>
      <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
        {rest.map((c) => (
          <RevealItem as="li" key={c.label}>
            <article className="flex h-full flex-col rounded-[24px] border border-line/[0.08] bg-card p-6 transition-[border-color,transform] duration-base ease-expo hover:-translate-y-0.5 hover:border-leaf/30">
              <div className="flex items-start justify-between gap-3">
                <Mark label={c.label} />
                <span className="rounded-full border border-line/12 px-2.5 py-0.5 text-right font-mono text-[11px] uppercase tracking-[0.1em] text-fg-subtle">
                  {c.by}
                </span>
              </div>
              <h3 className="mt-5 text-h4 font-medium text-fg">{c.label}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-fg-muted">{c.body}</p>
              <Source href={c.source} label={c.label} className="mt-5" />
            </article>
          </RevealItem>
        ))}
      </ul>
    </Stagger>
  );
}
