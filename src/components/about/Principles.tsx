import type { ReactNode } from "react";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

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
 * The principles, as a short manifesto: four pinned note cards, each with
 * its number, its drawn mark (the line draws itself in as the card reveals;
 * globals.css, "Drawn marks"), the principle and why, and a stamp for where
 * it's proven. Server component; fully drawn without JS or with reduced
 * motion.
 */
export function Principles({ items }: { items: Principle[] }) {
  return (
    <Stagger as="ul" step={0.1} className="grid gap-4 md:grid-cols-2">
      {items.map((v, i) => (
        <RevealItem as="li" key={v.title} className="h-full">
          <article className="note-card flex h-full gap-5 p-6 sm:p-7">
            <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-tag bg-cobalt/10 text-cobalt">
              <svg width="32" height="32" viewBox="0 0 48 48">
                {marks[i % marks.length]}
              </svg>
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="font-mono text-label text-cobalt">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1.5 text-h4 font-extrabold tracking-tight text-fg">{v.title}</h3>
              <p className="mt-2 flex-1 text-ui text-fg-muted">{v.body}</p>
              <span className={cn("stamp mt-5 self-start text-leaf", i % 2 ? "rotate-2" : "")}>{v.where}</span>
            </div>
          </article>
        </RevealItem>
      ))}
    </Stagger>
  );
}
