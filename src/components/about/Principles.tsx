import type { ReactNode } from "react";
import { Stagger, RevealItem } from "@/components/ui/Reveal";

export type Principle = { title: string; body: string; where: string };

const draw = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", pathLength: 1, className: "draw-path" } as const;

/** One drawn mark per principle, in order. */
const marks: ReactNode[] = [
  // Self-custody: a key
  <>
    <path d="M23 24a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" {...draw} />
    <path d="M23 24h17M34 24v6M39 24v4" {...draw} />
  </>,
  // Transparency: a receipt
  <>
    <path d="M14 8h20v32l-4-3-3 3-3-3-3 3-3-3-4 3Z" {...draw} />
    <path d="M19 16h10M19 22h10M19 28h6" {...draw} />
  </>,
  // Community-owned: three people, connected
  <>
    <path d="M29 14a5 5 0 1 1-10 0 5 5 0 0 1 10 0ZM18 32a5 5 0 1 1-10 0 5 5 0 0 1 10 0ZM40 32a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" {...draw} />
    <path d="m21 18.5-5 9M27 18.5l5 9M18 32h12" {...draw} />
  </>,
  // Long-term wealth: a steady curve
  <>
    <path d="M8 40h32M8 40V8" {...draw} />
    <path d="M12 35c7-1 10-6 14-12s8-10 14-11" {...draw} />
  </>,
];

/**
 * The principles, each a card with its own drawn mark: the line draws itself
 * in as the card reveals (globals.css, "Drawn marks"), a large numeral sits
 * behind, and the place each principle is proven is pinned at the foot.
 * Server component; the drawing is pure CSS and fully drawn without JS or
 * with reduced motion.
 */
export function Principles({ items }: { items: Principle[] }) {
  return (
    <Stagger as="ul" step={0.1} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((v, i) => (
        <RevealItem as="li" key={v.title} className="h-full">
          <article className="group/p relative flex h-full flex-col overflow-hidden rounded-[24px] border border-line/[0.08] bg-card p-7 transition-[border-color,transform] duration-base ease-expo hover:-translate-y-1 hover:border-leaf/30">
            <span aria-hidden className="pointer-events-none absolute -right-2 -top-6 font-mono text-[96px] leading-none text-line/[0.05] transition-colors duration-base group-hover/p:text-leaf/10">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span aria-hidden className="relative grid size-14 place-items-center rounded-2xl border border-leaf/25 bg-leaf/[0.07] text-leaf">
              <svg width="34" height="34" viewBox="0 0 48 48">
                {marks[i % marks.length]}
              </svg>
            </span>
            <h3 className="display relative mt-8 text-h3 text-fg">{v.title}</h3>
            <p className="relative mt-3 flex-1 text-[15px] text-fg-muted">{v.body}</p>
            <p className="relative mt-7 inline-flex items-center gap-2 self-start rounded-full border border-leaf/25 bg-leaf/[0.06] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-leaf">
              <span aria-hidden className="size-1.5 rounded-full bg-leaf" />
              {v.where}
            </p>
          </article>
        </RevealItem>
      ))}
    </Stagger>
  );
}
