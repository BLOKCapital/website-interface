"use client";

import { useRef, type CSSProperties } from "react";
import { bounds, project, roundRect } from "@/components/iso/geometry";
import { IsoScene, Layer } from "@/components/iso/Iso";
import { CoinFace, Cyl, Engrave, Flat, INK, OnFace, Part, Slab } from "@/components/iso/machine";
import { useFigureLoop } from "@/components/iso/useFigureLoop";
import { AutoplayToggle } from "@/components/explore/AutoplayToggle";
import css from "@/components/iso/iso.module.css";
import { indices, methodology, type ComponentSymbol } from "@/lib/data/indices";

/*
 * The home hero's picture: a Garden as clean line art (the isometric kit with
 * its side shades lifted to paper, so it reads as a drawing). Five coin
 * stacks on your plate are the index; a padlock on the plate says only you
 * hold the key. Every few seconds the index does the one thing it does:
 * prices drift (one stack gains a coin, another loses one) and the Garden
 * rebalances itself (the extra coin hops across to fill the gap). Each cycle
 * uses a different pair and ends where it started.
 *
 * Illustrative: no real amounts. Loops while on screen (useFigureLoop) with
 * its own Pause; reduced motion, Pause motion and server HTML show it at
 * rest.
 *
 * The stacks are BLOKC5's five tokens, each with its logo on its top coin
 * and its symbol engraved in front, so the coin that hops reads as a trade:
 * it leaves one token's colours and logo and lands as the other's.
 *
 * Annotated like the brand's posts: a handwritten "your key" with an arrow to
 * the padlock, and a pinned note card with the one real number behind the
 * motion, the index's drift tolerance (methodology.guardrails).
 */

const Z = 10;
const PLATE = { x: 0, y: 0, w: 300, d: 150, h: Z, r: 18 };
// Narrow enough that neighbouring stacks never touch (48 apart; each 2 × 15 × √2 ≈ 42 wide on screen).
const COIN = { r: 15, h: 6.5 };
/** BLOKC5's components, in its order, each in its token's colour. */
const BASKET = indices.find((i) => i.id === "blokc5")!.components;
const TINTS: Partial<Record<ComponentSymbol, string>> = { LINK: "#2A5ADA", UNI: "#FF007A", AAVE: "#2EBAC6", ARB: "#28A0F0", PENDLE: "#71717A" };
const STACKS = BASKET.map((symbol, s) => ({ symbol, cx: 58 + s * 48, cy: 75, n: [4, 3, 5, 4, 3][s], tint: TINTS[symbol] ?? "#71717A" }));
/** Which stack drifts up, and which down, each cycle: [from, to]. */
const PAIRS: [number, number][] = [
  [2, 1],
  [0, 4],
  [3, 1],
  [2, 4],
  [0, 1],
];
const LOCK = { x: 18, y: 120, z: Z, w: 16, d: 7, h: 13 };
const LIFT = 34;

const VIEW = bounds(
  [...roundRect(PLATE.x, PLATE.y, PLATE.w, PLATE.d, PLATE.r, 0), project([STACKS[0].cx, STACKS[0].cy, Z + 7 * COIN.h + LIFT + 10])],
  12,
);

/** The drift tolerance, split into the figure and its unit: "2%" and "per asset". */
const [driftValue, ...driftUnit] = methodology.guardrails.find((g) => g.k === "Drift tolerance")!.v.split(" ");

/** Where the "your key" note sits, as a share of the drawing (below the plate's left corner), and its arrow to the lock. */
const NOTE = { x: 0.03, y: 0.66 };
const lockFoot = project([LOCK.x + LOCK.w / 2, LOCK.y + LOCK.d, LOCK.z]);
const noteTail: [number, number] = [VIEW.x + (NOTE.x + 0.1) * VIEW.w, VIEW.y + (NOTE.y - 0.03) * VIEW.h];
const ARROW = `M ${noteTail[0]} ${noteTail[1]} Q ${noteTail[0] - 6} ${(noteTail[1] + lockFoot[1]) / 2} ${lockFoot[0] - 1} ${lockFoot[1] + 9}`;

const coinTop = (s: number, i: number) => Z + i * COIN.h;
const tint = (hex: string) => ({ top: `${hex}33`, side: `${hex}22` });
const dwell = () => 3800;

/**
 * Coin `i` of stack `s` (counting from the plate), in that stack's colour, or
 * in stack `as`'s colour and logo. `face` prints the logo on its top: the
 * top coin of a stack.
 */
function Coin({ s, i, as = s, face, className, style }: { s: number; i: number; as?: number; face?: boolean; className?: string; style?: CSSProperties }) {
  const st = STACKS[s];
  return (
    <g className={className} style={style}>
      <Cyl cx={st.cx} cy={st.cy} z={coinTop(s, i)} r={COIN.r} h={COIN.h} {...tint(STACKS[as].tint)} />
      {face && <CoinFace cx={st.cx} cy={st.cy} z={coinTop(s, i) + COIN.h} r={COIN.r} symbol={STACKS[as].symbol} />}
    </g>
  );
}

/** A padlock on the plate's front edge: only you hold the key. */
function Lock() {
  const [a, b] = [project([LOCK.x + 3, LOCK.y + 3, LOCK.z + LOCK.h]), project([LOCK.x + LOCK.w - 3, LOCK.y + 3, LOCK.z + LOCK.h])];
  const top = project([LOCK.x + LOCK.w / 2, LOCK.y + 3, LOCK.z + LOCK.h + 11]);
  return (
    <g>
      <path
        d={`M ${a[0]} ${a[1]} C ${a[0]} ${top[1] - 2}, ${b[0]} ${top[1] - 2}, ${b[0]} ${b[1]}`}
        fill="none"
        stroke="rgb(var(--leaf))"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Part box={LOCK} tint={{ top: "rgb(var(--leaf) / 0.18)", left: "rgb(var(--leaf) / 0.12)", right: "rgb(var(--leaf) / 0.22)" }} />
    </g>
  );
}

export function HeroGarden({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const loop = useFigureLoop(root, PAIRS.length, dwell);
  const moving = loop.canPlay;
  const [from, to] = PAIRS[loop.step];
  const full = `${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`;

  // The drifted coin lands in the gap on `to`: its start, relative to there, is the top of `from`.
  const start = project([STACKS[from].cx, STACKS[from].cy, coinTop(from, STACKS[from].n)]);
  const end = project([STACKS[to].cx, STACKS[to].cy, coinTop(to, STACKS[to].n - 1)]);
  const [fx, fy] = [start[0] - end[0], start[1] - end[1]];
  const hop = { "--fx": `${fx}px`, "--fy": `${fy}px`, "--mx": `${fx / 2}px`, "--my": `${fy / 2 - LIFT}px`, "--dur": "820ms", "--delay": "1500ms" } as CSSProperties;

  return (
    <figure ref={root} className={className}>
      {/* Side shades lifted to paper: the kit's machines, drawn as line art. */}
      <div style={{ "--plate-l": "var(--card)", "--plate-r": "var(--raised)" } as CSSProperties}>
        <IsoScene
          view={VIEW}
          label="Illustration: a Garden on Arbitrum holding the BLOKC5 index as five coin stacks, LINK, UNI, AAVE, ARB and PENDLE, with a padlock for your key. When prices drift, one stack gains a coin and another loses one, and the Garden rebalances itself by moving the extra coin across."
        >
          <svg aria-hidden viewBox={full} className="absolute inset-0 size-full overflow-visible">
            <Slab id="hero-plate" {...PLATE} />
            <Flat points={roundRect(PLATE.x + 14, PLATE.y + 14, PLATE.w - 28, PLATE.d - 28, 10, Z)} stroke={INK} dash="2 4" />
            <OnFace face="top" at={project([PLATE.x + 52, PLATE.y + 124, Z])}>
              <Engrave u={0} v={6} size={8}>
                Your Garden
              </Engrave>
            </OnFace>
            <Lock />
            {/* Each token's symbol, engraved in front of its stack. */}
            {STACKS.map((st) => (
              <OnFace key={st.symbol} face="top" at={project([st.cx - 6, st.cy + COIN.r + 9, Z])}>
                <Engrave u={0} v={0} size={7.5}>
                  {st.symbol}
                </Engrave>
              </OnFace>
            ))}
            {/* The stacks at rest, less whatever this cycle moves; the logo is on each top coin. */}
            {STACKS.map((st, s) => {
              const n = moving && s === to ? st.n - 1 : st.n;
              return Array.from({ length: n }, (_, i) => <Coin key={`${s}-${i}`} s={s} i={i} face={i === n - 1} />);
            })}
          </svg>

          {moving && (
            <Layer key={loop.key} view={VIEW} rect={VIEW}>
              {/* The gap the drift leaves, then filled. */}
              <ellipse
                {...(() => {
                  const [x, y] = project([STACKS[to].cx, STACKS[to].cy, coinTop(to, STACKS[to].n)]);
                  return { cx: x, cy: y, rx: COIN.r * Math.SQRT2, ry: (COIN.r * Math.SQRT2) / 2 };
                })()}
                fill="none"
                stroke="rgb(var(--leaf))"
                strokeWidth={1}
                strokeDasharray="3 3"
                className={css.fadeOut}
                style={{ animationDelay: "2300ms" }}
              />
              {/* `to` loses its top coin as its price drifts down. */}
              <Coin s={to} i={STACKS[to].n - 1} face className={css.fadeOut} style={{ animationDelay: "250ms" }} />
              {/* `from` gains one, which then hops across to fill the gap, changing colour and logo mid-air: the trade. */}
              <g className={css.hop} style={hop}>
                <g className={css.drop} style={{ "--h": "-16px" } as CSSProperties}>
                  <Coin s={to} i={STACKS[to].n - 1} face className={css.lampOn} style={{ animationDelay: "1900ms" }} />
                  <Coin s={to} i={STACKS[to].n - 1} as={from} face className={css.fadeOut} style={{ animationDelay: "1900ms" }} />
                </g>
              </g>
            </Layer>
          )}

          {/* Notes pinned to the drawing. Decorative: the scene's label says the same. */}
          <svg aria-hidden viewBox={full} className="pointer-events-none absolute inset-0 size-full overflow-visible">
            <defs>
              <marker id="hero-note-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M1 1.5 L8 5 L1 8.5" fill="none" stroke="rgb(var(--cobalt))" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>
            <path d={ARROW} fill="none" stroke="rgb(var(--cobalt))" strokeWidth={1.3} strokeLinecap="round" markerEnd="url(#hero-note-arrow)" vectorEffect="non-scaling-stroke" />
          </svg>
          <span aria-hidden className="note pointer-events-none absolute -rotate-3 text-[1.05rem] sm:text-[1.35rem]" style={{ left: `${NOTE.x * 100}%`, top: `${NOTE.y * 100}%` }}>
            your key
          </span>
          <span aria-hidden className="note-card pointer-events-none absolute right-0 top-0 rotate-3 px-3 py-2 sm:px-3.5 sm:py-2.5">
            <span className="block font-mono text-micro lowercase text-fg-subtle sm:text-label">drift tolerance</span>
            <span className="mt-0.5 flex items-baseline gap-1.5">
              <span className="text-h4 font-extrabold leading-none tracking-tight text-fg sm:text-h3">{driftValue}</span>
              <span className="font-mono text-micro text-fg-muted sm:text-label">{driftUnit.join(" ")}</span>
            </span>
          </span>
        </IsoScene>
      </div>
      <figcaption className="mt-4 flex items-center justify-between gap-4">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-mono text-label uppercase tracking-caps text-cobalt">Prices drift</span>
          <span className="note">it rebalances itself.</span>
        </span>
        {loop.canPlay && <AutoplayToggle on={loop.playing} ended={false} onClick={loop.toggle} what="the illustration" />}
      </figcaption>
    </figure>
  );
}
