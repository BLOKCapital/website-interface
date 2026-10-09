"use client";

import { useRef, useState, type CSSProperties } from "react";
import { useInView } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Item = { label: string; pct: number };

const fmt = new Intl.NumberFormat("en-US");

/**
 * Where the supply goes, as one 100% strip plus a ranked list. Part-to-whole
 * with 13 shares reads best as a stacked strip in one quiet tone, with the
 * share you're looking at picked out in leaf (emphasis, not 13 colours);
 * the list beside it prints every value, so nothing depends on colour.
 * Hover or focus a row, or point at the strip, to pick a share: the readout
 * gives its percent and its exact token amount. The strip grows in once,
 * segment by segment, when it scrolls into view.
 */
export function AllocationExplorer({
  items,
  total,
  symbol,
  caption,
}: {
  items: Item[];
  total: number;
  symbol: string;
  /** What the percentages are of, for screen readers. */
  caption: string;
}) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true });
  const a = items[active];
  const amount = (pct: number) => fmt.format(Math.round((total * pct) / 100));

  return (
    <figure ref={ref} className="rounded-[28px] border border-line/[0.08] bg-card p-6 sm:p-8">
      <figcaption className="sr-only">{caption}</figcaption>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">Total supply</p>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="display text-[clamp(30px,2.6vw+14px,48px)] leading-none text-fg tabular">{fmt.format(total)}</span>
            <span className="font-mono text-small text-fg-subtle">{symbol}</span>
          </p>
        </div>
        <div aria-live="polite" className="min-w-[180px] text-left sm:text-right">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">{a.label}</p>
          <p className="mt-1 font-mono text-[26px] leading-none text-leaf tabular">{a.pct}%</p>
          <p className="mt-1 font-mono text-caption text-fg-muted tabular">
            {amount(a.pct)} {symbol}
          </p>
        </div>
      </div>

      {/* The whole supply, one segment per share */}
      <div aria-hidden className="mt-8 flex h-12 w-full gap-[2px]">
        {items.map((it, i) => {
          const on = i === active;
          return (
            <span
              key={it.label}
              onPointerEnter={() => setActive(i)}
              className={cn(
                "relative flex h-full origin-left items-center justify-center overflow-hidden transition-[background-color,transform] duration-slow ease-expo first:rounded-l-xl last:rounded-r-xl",
                on ? "bg-leaf" : "bg-line/[0.1] hover:bg-line/[0.18]",
              )}
              style={
                {
                  flex: `${it.pct} 1 0%`,
                  transform: seen ? "scaleX(1)" : "scaleX(0)",
                  transitionDelay: seen ? `0ms, ${i * 45}ms` : "0ms",
                } as CSSProperties
              }
            >
              {it.pct >= 10 && (
                <span className={cn("hidden font-mono text-[11px] tabular sm:inline", on ? "text-canvas" : "text-fg-muted")}>{it.pct}%</span>
              )}
            </span>
          );
        })}
      </div>

      {/* Every share, ranked */}
      {/* Ranked top to bottom, down the first column then the second. */}
      <ul className="mt-6 gap-x-8 sm:columns-2">
        {items.map((it, i) => {
          const on = i === active;
          return (
            <li key={it.label} className="break-inside-avoid">
              <button
                type="button"
                aria-pressed={on}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group/r flex w-full items-center gap-3 border-b border-line/[0.07] py-2.5 text-left"
              >
                <span
                  aria-hidden
                  className={cn("size-2 shrink-0 rounded-full transition-colors duration-base", on ? "bg-leaf" : "bg-line/25 group-hover/r:bg-line/50")}
                />
                <span className={cn("flex-1 text-small transition-colors duration-base", on ? "text-fg" : "text-fg-muted group-hover/r:text-fg")}>
                  {it.label}
                </span>
                <span className="font-mono text-[13px] text-fg tabular">{it.pct}%</span>
                <span className="sr-only">
                  , {amount(it.pct)} {symbol}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-caption text-fg-subtle">Percent of total supply. Vesting and unlock terms are in the whitepaper.</p>
    </figure>
  );
}
