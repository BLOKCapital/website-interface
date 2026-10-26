"use client";

import { useId, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { VESTING_MONTHS, fmtPct, unlockedFraction, unlockedOfSupply, type Vesting } from "@/lib/data/vesting";

const fmt = new Intl.NumberFormat("en-US");
const W = 480;
const H = 220;
const months = Array.from({ length: VESTING_MONTHS + 1 }, (_, m) => m);
const x = (m: number) => (m / VESTING_MONTHS) * W;
const y = (pct: number) => H - (pct / 100) * H;

/** One stacked band: the top edge left to right, the bottom edge back. */
function bandPath(lower: number[], upper: number[]) {
  const top = upper.map((v, m) => `${m ? "L" : "M"}${x(m).toFixed(1)},${y(v).toFixed(2)}`).join("");
  const bottom = lower.map((v, m) => `L${x(m).toFixed(1)},${y(v).toFixed(2)}`).reverse().join("");
  return `${top}${bottom}Z`;
}

/**
 * When the supply unlocks: a stacked area of every share's unlocked amount,
 * month by month from the TGE, beside the same shares as a list. It reads
 * the way AllocationExplorer does: one quiet tone, the share you pick in
 * leaf, every value printed in the list so nothing depends on colour.
 * Point at (or drag across) the chart, or use the slider, to move through
 * the months; the readout and the list follow. The chart is aria-hidden: the
 * slider, the readout and the terms table carry the same data.
 */
export function VestingExplorer({ items, total, symbol }: { items: Vesting[]; total: number; symbol: string }) {
  const [active, setActive] = useState(2);
  const [month, setMonth] = useState(12);
  const sliderId = useId();
  const a = items[active];

  // Cumulative stack, bottom to top in list order.
  const stacks: number[][] = [];
  items.forEach((v, i) => {
    stacks.push(months.map((m) => (i ? stacks[i - 1][m] : 0) + v.pct * unlockedFraction(v, m)));
  });
  const zero = months.map(() => 0);

  const supplyPct = unlockedOfSupply(items, month);
  const shareFraction = unlockedFraction(a, month);
  const tokens = (pct: number) => fmt.format(Math.round((total * pct) / 100));

  const scrub = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const m = Math.round(((e.clientX - r.left) / r.width) * VESTING_MONTHS);
    setMonth(Math.max(0, Math.min(VESTING_MONTHS, m)));
  };

  return (
    <figure className="rounded-panel border border-subtle bg-card p-6 shadow-soft sm:p-8">
      <figcaption className="sr-only">
        $BLOKC unlocked over the {VESTING_MONTHS} months after the TGE, by allocation share. Example terms.
      </figcaption>

      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="flex items-center gap-3">
            <span className="label-caps">Unlocked at TGE + {month} mo</span>
            <Badge status="example" />
          </p>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="display text-display-md leading-none text-fg tabular">{fmtPct(supplyPct)}</span>
            <span className="font-mono text-small text-fg-subtle">of supply</span>
          </p>
          <p className="mt-1 font-mono text-caption text-fg-muted tabular">
            {tokens(supplyPct)} {symbol}
          </p>
        </div>
        <div className="min-w-[180px] text-left sm:text-right">
          <p className="label-caps">{a.label}</p>
          <p className="mt-1 font-mono text-h3 leading-none text-leaf tabular">{fmtPct(shareFraction * 100)}</p>
          <p className="mt-1 font-mono text-caption text-fg-muted tabular">
            of its {a.pct}%: {tokens(a.pct * shareFraction)} {symbol}
          </p>
        </div>
      </div>

      {/* The chart. Pointer only; the slider below is the keyboard path. */}
      <div className="mt-8 grid grid-cols-[2.25rem_1fr] gap-2">
        <div aria-hidden className="relative font-mono text-label text-fg-subtle tabular">
          {[100, 75, 50, 25, 0].map((p) => (
            <span key={p} className="absolute right-0 -translate-y-1/2" style={{ top: `${100 - p}%` }}>
              {p}%
            </span>
          ))}
        </div>
        <div
          aria-hidden
          onPointerDown={scrub}
          onPointerMove={(e) => (e.pointerType === "mouse" || e.buttons) && scrub(e)}
          className="relative aspect-[4/3] w-full touch-pan-y cursor-crosshair sm:aspect-[480/220]"
        >
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
            {[25, 50, 75].map((p) => (
              <line key={p} x1={0} x2={W} y1={y(p)} y2={y(p)} vectorEffect="non-scaling-stroke" className="stroke-line/10" strokeDasharray="3 4" />
            ))}
            {stacks.map((upper, i) => (
              <path
                key={items[i].label}
                d={bandPath(i ? stacks[i - 1] : zero, upper)}
                vectorEffect="non-scaling-stroke"
                onPointerEnter={() => setActive(i)}
                className={cn(
                  "stroke-card transition-colors duration-fast",
                  i === active ? "fill-leaf" : i % 2 ? "fill-line/12" : "fill-line/8",
                )}
                strokeWidth={1}
              />
            ))}
            <line x1={0} x2={W} y1={H} y2={H} vectorEffect="non-scaling-stroke" className="stroke-line/25" />
          </svg>
          {/* "You are here" in time: the month the readout describes. */}
          <span className="pointer-events-none absolute inset-y-0 w-px bg-fg" style={{ left: `${(month / VESTING_MONTHS) * 100}%` }}>
            <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-fg" />
          </span>
        </div>
        <span />
        <div aria-hidden className="relative h-5 font-mono text-label text-fg-subtle tabular">
          {[0, 12, 24, 36, 48].map((m) => (
            <span key={m} className={cn("absolute top-1", m === 0 ? "left-0" : m === 48 ? "right-0" : "-translate-x-1/2", m % 24 === 12 && "max-sm:hidden")} style={m && m !== 48 ? { left: `${(m / 48) * 100}%` } : undefined}>
              {m === 0 ? "TGE" : `+${m} mo`}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <label htmlFor={sliderId} className="label-caps">
          Months after TGE
        </label>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={VESTING_MONTHS}
          step={1}
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          aria-valuetext={`TGE plus ${month} months: ${fmtPct(supplyPct)} of supply unlocked`}
          className="h-6 min-w-[200px] flex-1 accent-leaf"
        />
        <span className="w-14 text-right font-mono text-small text-fg tabular">+{month} mo</span>
      </div>

      {/* Every share at this month, in stack order. */}
      <ul className="mt-6 gap-x-8 sm:columns-2">
        {items.map((it, i) => {
          const on = i === active;
          const f = unlockedFraction(it, month);
          return (
            <li key={it.label} className="break-inside-avoid">
              <button
                type="button"
                aria-current={on ? "true" : undefined}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group/r flex w-full items-center gap-3 border-b border-subtle py-2.5 text-left"
              >
                <span aria-hidden className={cn("size-2 shrink-0 rounded-full transition-colors duration-fast", on ? "bg-leaf" : "bg-line/25 group-hover/r:bg-line/50")} />
                <span className={cn("flex-1 text-small transition-colors duration-fast", on ? "text-fg" : "text-fg-muted group-hover/r:text-fg")}>{it.label}</span>
                {/* How much of this share is out, as a small meter. */}
                <span aria-hidden className="h-1 w-12 overflow-hidden rounded-full bg-line/10">
                  <span className={cn("block h-full rounded-full", on ? "bg-leaf" : "bg-line/40")} style={{ width: `${f * 100}%` }} />
                </span>
                <span className="w-12 text-right font-mono text-caption text-fg tabular">{fmtPct(f * 100)}</span>
                <span className="sr-only">of its {it.pct}% share unlocked</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-caption text-fg-subtle">
        Percent of each share unlocked at the month shown. Example terms for review; the real schedule is in the whitepaper.
      </p>
    </figure>
  );
}
