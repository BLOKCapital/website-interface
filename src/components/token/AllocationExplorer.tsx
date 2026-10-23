"use client";

import { useRef, useState, type CSSProperties } from "react";
import { slug, trackSelect } from "@/lib/explainers";
import { cn } from "@/lib/utils";

type Item = { label: string; pct: number };

const fmt = new Intl.NumberFormat("en-US");

/**
 * Where the supply goes, as one 100% strip plus a ranked list. Part-to-whole
 * with 13 shares reads best as a stacked strip in one quiet tone, with the
 * share you're looking at picked out in leaf (emphasis, not 13 colours);
 * the list beside it prints every value, so nothing depends on colour.
 * Click or focus a row to pick a share (aria-current marks it): the readout
 * gives its percent and its exact token amount. Pointing at a row or a
 * segment previews it, silently. Each row already says its percent and
 * amount, so the readout isn't a live region.
 *
 * The strip is drawn full width in the server HTML; it grows in once,
 * segment by segment, only with JS and motion allowed (globals.css,
 * "Allocation strip", driven by RevealScript).
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
  // What the pointer is over, if anything: shown, but not selected.
  const [preview, setPreview] = useState<number | null>(null);
  const shown = preview ?? active;
  const a = items[shown];
  // A click or focus chooses (never a hover); report each new choice once,
  // so the focus-then-click of one row counts once.
  const reported = useRef<number | null>(null);
  const choose = (i: number) => {
    setActive(i);
    if (reported.current === i) return;
    reported.current = i;
    trackSelect("allocation_share", slug(items[i].label));
  };
  const amount = (pct: number) => fmt.format(Math.round((total * pct) / 100));

  return (
    <figure className="rounded-panel border border-subtle bg-card p-6 sm:p-8 shadow-soft">
      <figcaption className="sr-only">{caption}</figcaption>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-caps">Total supply</p>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="display text-display-md leading-none text-fg tabular">{fmt.format(total)}</span>
            <span className="font-mono text-small text-fg-subtle">{symbol}</span>
          </p>
        </div>
        <div className="min-w-[180px] text-left sm:text-right">
          <p className="label-caps">{a.label}</p>
          <p className="mt-1 font-mono text-h3 leading-none text-leaf tabular">{a.pct}%</p>
          <p className="mt-1 font-mono text-caption text-fg-muted tabular">
            {amount(a.pct)} {symbol}
          </p>
        </div>
      </div>

      {/* The whole supply, one segment per share. A reveal group, so
          RevealScript can grow it in (see the comment above). */}
      <div aria-hidden data-reveal-group="" suppressHydrationWarning onPointerLeave={() => setPreview(null)} className="mt-8 flex h-12 w-full gap-[2px]">
        {items.map((it, i) => {
          const on = i === shown;
          return (
            <span
              key={it.label}
              onPointerEnter={() => setPreview(i)}
              className={cn(
                "alloc-seg relative flex h-full origin-left items-center justify-center overflow-hidden first:rounded-l-control last:rounded-r-control",
                on ? "bg-leaf" : "bg-line/10 hover:bg-line/[0.18]",
              )}
              style={{ flex: `${it.pct} 1 0%`, "--i": i } as CSSProperties}
            >
              {it.pct >= 10 && (
                <span className={cn("hidden font-mono text-label tabular sm:inline", on ? "text-canvas" : "text-fg-muted")}>{it.pct}%</span>
              )}
            </span>
          );
        })}
      </div>

      {/* Every share, ranked */}
      {/* Ranked top to bottom, down the first column then the second. */}
      <ul className="mt-6 gap-x-8 sm:columns-2" onPointerLeave={() => setPreview(null)}>
        {items.map((it, i) => {
          const on = i === shown;
          return (
            <li key={it.label} className="break-inside-avoid">
              <button
                type="button"
                // A single choice in a list: the current one, not a set of toggles.
                aria-current={i === active ? "true" : undefined}
                onPointerEnter={() => setPreview(i)}
                onFocus={() => choose(i)}
                onClick={() => {
                  setPreview(null);
                  choose(i);
                }}
                className="group/r flex w-full items-center gap-3 border-b border-subtle py-2.5 text-left"
              >
                <span
                  aria-hidden
                  className={cn("size-2 shrink-0 rounded-full transition-colors duration-fast", on ? "bg-leaf" : "bg-line/25 group-hover/r:bg-line/50")}
                />
                <span className={cn("flex-1 text-small transition-colors duration-fast", on ? "text-fg" : "text-fg-muted group-hover/r:text-fg")}>
                  {it.label}
                </span>
                <span className="font-mono text-caption text-fg tabular">{it.pct}%</span>
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
