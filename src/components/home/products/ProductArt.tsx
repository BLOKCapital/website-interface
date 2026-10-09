import Image from "next/image";
import type { CSSProperties } from "react";
import { indices, type ComponentSymbol } from "@/lib/data/indices";
import { TokenLogo } from "@/components/indices/TokenLogo";
import { cn } from "@/lib/utils";

/**
 * Small, looping pictures of what each product does, for the product tiles.
 * Pure SVG + CSS (keyframes in globals.css, "Product art"), so they cost no
 * JavaScript and stand still under reduced motion. Decorative: each tile's
 * text says the same thing, so they're aria-hidden.
 */

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/* ---------- Index Gardens: drift past 2%, then a pooled rebalance ---------- */

const BASKET = indices.find((i) => i.id === "blokc5")!.components;
const W1 = 400;
const H1 = 250;
const C1 = { x: 200, y: 125 };
const ORBIT = 80;
const THRESHOLD = 100;
/** Which token drifts out and gets pulled back. */
const DRIFTER = 2;

export function RebalanceArt({ className }: { className?: string }) {
  const at = (i: number) => {
    const a = -Math.PI / 2 + (i / BASKET.length) * Math.PI * 2;
    return { x: C1.x + Math.cos(a) * ORBIT, y: C1.y + Math.sin(a) * ORBIT, dx: Math.cos(a), dy: Math.sin(a) };
  };
  return (
    <div aria-hidden className={cn("relative aspect-[16/10] w-full", className)}>
      <svg viewBox={`0 0 ${W1} ${H1}`} className="absolute inset-0 size-full" fill="none">
        <circle cx={C1.x} cy={C1.y} r={THRESHOLD} stroke="rgb(var(--caution) / 0.45)" strokeDasharray="3 6" />
        <circle cx={C1.x} cy={C1.y} r={ORBIT} stroke="rgb(var(--leaf) / 0.35)" strokeDasharray="2 5" />
        {BASKET.map((s, i) => {
          const p = at(i);
          return <line key={s} x1={C1.x} y1={C1.y} x2={p.x} y2={p.y} stroke="rgb(var(--line) / 0.1)" />;
        })}
        <circle cx={C1.x} cy={C1.y} r="30" fill="rgb(var(--leaf) / 0.1)" stroke="rgb(var(--leaf) / 0.5)" />
        {/* The rebalance: one pulse from the Garden as the drifter snaps back. */}
        <circle cx={C1.x} cy={C1.y} r="30" stroke="rgb(var(--leaf))" className="art-pulse origin-center [transform-box:fill-box]" />
      </svg>

      <Image
        src="/brand/mark.png"
        alt=""
        width={32}
        height={32}
        unoptimized
        className="absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-lg"
        style={{ left: pct(C1.x, W1), top: pct(C1.y, H1) }}
      />
      {BASKET.map((s, i) => {
        const p = at(i);
        return (
          <span
            key={s}
            className={cn("absolute -translate-x-1/2 -translate-y-1/2", i === DRIFTER && "z-10")}
            style={{ left: pct(p.x, W1), top: pct(p.y, H1) }}
          >
            <span
              className={cn("block rounded-full", i === DRIFTER && "art-drift")}
              style={{ "--dx": `${p.dx * 26}px`, "--dy": `${p.dy * 26}px` } as CSSProperties}
            >
              <TokenLogo symbol={s} size={30} className="ring-2 ring-card" />
            </span>
          </span>
        );
      })}

      <span
        className="absolute whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-caution"
        style={{ left: pct(C1.x + 70, W1), top: pct(C1.y - 98, H1) }}
      >
        ┄ 2% band
      </span>
      <span className="art-flag absolute bottom-[6%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-leaf/35 bg-leaf/10 px-2.5 py-1 font-mono text-[11px] text-leaf">
        Past 2% → one pooled rebalance
      </span>
    </div>
  );
}

/* ---------- Yield Gardens: you route to the venues ---------- */

const W2 = 400;
const H2 = 260;
const GARDEN = { x: 64, y: 130 };
const venues: { name: string; use: string; token: ComponentSymbol; y: number }[] = [
  { name: "Uniswap", use: "Swap", token: "UNI", y: 34 },
  { name: "Aave", use: "Lend", token: "AAVE", y: 98 },
  { name: "GMX", use: "Perps", token: "GMX", y: 162 },
  { name: "Pendle", use: "Fixed yield", token: "PENDLE", y: 226 },
];
const VENUE_X = 262;

export function RoutesArt({ className }: { className?: string }) {
  const route = (y: number) => `M${GARDEN.x + 26} ${GARDEN.y} C ${GARDEN.x + 110} ${GARDEN.y}, ${VENUE_X - 90} ${y}, ${VENUE_X - 4} ${y}`;
  return (
    <div aria-hidden className={cn("relative aspect-[400/260] w-full", className)}>
      <svg viewBox={`0 0 ${W2} ${H2}`} className="absolute inset-0 size-full" fill="none">
        {venues.map((v) => (
          <path key={v.name} d={route(v.y)} stroke="rgb(var(--cobalt) / 0.22)" strokeWidth="1.25" />
        ))}
        {venues.map((v, i) => (
          <path
            key={`hi-${v.name}`}
            d={route(v.y)}
            stroke="rgb(var(--cobalt))"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            strokeLinecap="round"
            className="art-route"
            style={{ animationDelay: `${i * 2}s, 0s` } as CSSProperties}
          />
        ))}
      </svg>
      <span
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
        style={{ left: pct(GARDEN.x, W2), top: pct(GARDEN.y, H2) }}
      >
        <span className="grid size-12 place-items-center rounded-2xl border border-cobalt/30 bg-card shadow-[0_10px_30px_-16px_rgb(var(--shadow))]">
          <Image src="/brand/mark.png" alt="" width={28} height={28} unoptimized className="size-7 rounded-md" />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">You steer</span>
      </span>
      {venues.map((v, i) => (
        <span
          key={v.name}
          className="art-chip absolute flex -translate-y-1/2 items-center gap-2 rounded-xl border border-line/10 bg-card py-1 pl-1 pr-3"
          style={{ left: pct(VENUE_X, W2), top: pct(v.y, H2), animationDelay: `${i * 2}s` }}
        >
          <TokenLogo symbol={v.token} size={22} />
          <span className="leading-tight">
            <span className="block text-[11.5px] font-medium text-fg">{v.name}</span>
            <span className="block text-[10.5px] text-fg-subtle">{v.use}</span>
          </span>
        </span>
      ))}
    </div>
  );
}

/* ---------- Gardeners: a soulbound record you can revoke ---------- */

const hexagon = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 3;
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(" ");

/**
 * The badge on the left; its record and the access switch in a column on
 * the right. A flex layout rather than fixed positions, so the labels never
 * collide however narrow the tile gets.
 */
export function BadgeArt({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex w-full items-center gap-[7%] py-3", className)}>
      <div className="relative aspect-square w-[42%] shrink-0">
        <svg viewBox="0 0 160 160" className="absolute inset-0 size-full" fill="none">
          <g className="art-spin origin-center [transform-box:fill-box]">
            <circle cx="80" cy="80" r="76" stroke="rgb(var(--leaf) / var(--fx-line))" strokeDasharray="2 7" />
          </g>
          <polygon points={hexagon(80, 80, 58)} fill="rgb(var(--leaf) / 0.08)" stroke="rgb(var(--leaf) / 0.7)" strokeWidth="1.5" />
          <polygon points={hexagon(80, 80, 47)} stroke="rgb(var(--leaf) / 0.45)" strokeDasharray="3 5" />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
          <span className="font-mono text-[11px] font-medium text-leaf">ERC-5484</span>
          <span className="text-[10.5px] text-fg-subtle">soulbound</span>
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">On-chain record</p>
        {/* The track record: each trade lands on the badge's line. */}
        <div className="relative mt-3 flex items-center justify-between px-1">
          <span className="absolute inset-x-0 top-1/2 h-px bg-leaf/30" />
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="art-dot relative size-2.5 rounded-full bg-leaf" style={{ animationDelay: `${i * 0.35}s` }} />
          ))}
        </div>
        {/* Access you can switch off with one signature. */}
        <span className="mt-5 inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-line/10 bg-card py-1.5 pl-1.5 pr-3.5">
          <span className="art-switch relative h-5 w-9 shrink-0 rounded-full bg-leaf/80">
            <span className="art-knob absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow-sm" />
          </span>
          <span className="relative text-[12px] text-fg">
            <span className="art-on">Access granted</span>
            <span className="art-off absolute inset-0">Revoked</span>
          </span>
        </span>
      </div>
    </div>
  );
}
