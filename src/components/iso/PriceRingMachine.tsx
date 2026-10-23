"use client";

import type { CSSProperties } from "react";
import type { ComponentSymbol } from "@/lib/data/indices";
import { type Pt, bounds, isoCircle, project, roundRect } from "./geometry";
import { Layer } from "./Iso";
import { type FigureStep, MachineFigure } from "./MachineFigure";
import { Cyl, Engrave, INK, OnFace, Screw, Slab } from "./machine";
import { Coin, Coins } from "./coins";
import css from "./iso.module.css";

/*
 * Fig. 7, BLOKC5 as a price ring: its five tokens stand round a Chainlink
 * price mast, each on a status ring (green within its 2% band, amber past
 * it). Each pass, a different four of the five move, two ahead and two
 * behind, so every token takes part over the loop:
 * 1 Read prices: a pulse goes out from the mast and each ring flashes as its
 *   price comes in.
 * 2 Prices move: two run ahead (a coin's worth lands on each) and two fall
 *   behind (a coin's worth goes); their rings turn amber.
 * 3 One trade: one pooled trade moves a coin from each one ahead to its
 *   neighbour behind, changing token mid-air; every ring is green again.
 * Each pass ends where the next begins. Illustrative: the coin counts and
 * which tokens move are made up; the band is the contracts'.
 */

const Z = 10;
const PLATE = { x: 0, y: 0, w: 268, d: 268, h: Z, r: 16 };
const C = { x: 134, y: 134 };
const DAIS = { r: 124, h: 6 };
const DZ = Z + DAIS.h;
const RING = 86;
const COIN = { r: 15, h: 6 };
const MAST = { r: 4.5, h: 52 };

/**
 * BLOKC5's five, round the ring (scene degrees: 0 is +x, 90 is +y, toward
 * the viewer), set 18° off the line through the mast (−135° and 45°) so none
 * hides behind it or in front of it. Each name sits beside its stack on the
 * side away from the mast.
 */
const RAW: { symbol: ComponentSymbol; angle: number; n: number; label: "left" | "right" }[] = [
  // Each name goes on the side of its stack that's free of the price feed running in to it.
  { symbol: "LINK", angle: -117, n: 4, label: "right" },
  { symbol: "UNI", angle: -45, n: 3, label: "right" },
  { symbol: "AAVE", angle: 27, n: 4, label: "left" },
  { symbol: "ARB", angle: 99, n: 3, label: "left" },
  { symbol: "PENDLE", angle: 171, n: 2, label: "right" },
];
const STACKS = RAW.map((s) => {
  const a = (s.angle * Math.PI) / 180;
  const [x, y] = [C.x + RING * Math.cos(a), C.y + RING * Math.sin(a)];
  // Scene (±17, ∓17) is straight right or left on screen: just clear of the ring, inside the dais.
  const d = s.label === "right" ? 17 : -17;
  return { ...s, x, y, tx: x + d, ty: y - d };
});
const idx = (symbol: ComponentSymbol) => STACKS.findIndex((s) => s.symbol === symbol);
/**
 * Each pass: which tokens run ahead, and which neighbour each one trades into
 * (it fell behind). Two pairs a pass, never the same four twice running;
 * over the three passes every token moves.
 */
const PASSES: [up: number, down: number][][] = [
  [
    [idx("LINK"), idx("UNI")],
    [idx("AAVE"), idx("ARB")],
  ],
  [
    [idx("PENDLE"), idx("LINK")],
    [idx("UNI"), idx("AAVE")],
  ],
  [
    [idx("ARB"), idx("PENDLE")],
    [idx("AAVE"), idx("UNI")],
  ],
];
const pass = (lap: number) => PASSES[lap % PASSES.length];
const names = (list: number[]) => list.map((i) => STACKS[i].symbol).join(" and ");
const within = (lap: number) => STACKS.filter((_, i) => !pass(lap).some(([u, d]) => u === i || d === i)).map((s) => s.symbol);
const TALLEST = Math.max(...STACKS.map((s) => s.n)) + 1;

const VIEW = bounds(
  [
    ...roundRect(PLATE.x, PLATE.y, PLATE.w, PLATE.d, PLATE.r, 0),
    project([C.x - 16, C.y - 16, DZ + MAST.h + 14]),
    ...STACKS.map((st) => project([st.x, st.y, DZ + TALLEST * COIN.h + 40])),
  ],
  14,
);

const STEPS: FigureStep[] = [
  {
    tab: "Read prices",
    readout: "Chainlink · five prices, read on-chain",
    scene: "Step 1 of 3, Read prices. A pulse goes out from the Chainlink mast in the middle, and each token's ring flashes as its price comes in.",
  },
  {
    tab: "Prices move",
    readout: (lap) => {
      const p = pass(lap);
      return `${names(p.map(([u]) => u))} up · ${names(p.map(([, d]) => d))} down · ${within(lap).join(", ")} within`;
    },
    scene: (lap) => {
      const p = pass(lap);
      return `Step 2 of 3, Prices move. ${names(p.map(([u]) => u))} run ahead and ${names(p.map(([, d]) => d))} fall behind: all four are past the 2% band, and their rings turn amber. ${within(lap).join(", ")} stays within it.`;
    },
  },
  {
    tab: "One trade",
    readout: (lap) => `one pooled trade · ${pass(lap).map(([u, d]) => `${STACKS[u].symbol} → ${STACKS[d].symbol}`).join(" · ")}`,
    scene: (lap) =>
      `Step 3 of 3, One trade. In one pooled trade, ${pass(lap)
        .map(([u, d]) => `a coin moves from ${STACKS[u].symbol} to ${STACKS[d].symbol}`)
        .join(" and ")}, each turning into the other token on the way. Every ring is green again.`,
  },
];
const dwell = (i: number) => [1600, 2000, 2500][i];

const line = (a: Pt, b: Pt) => ({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] });
const LEAF = "rgb(var(--leaf))";
const AMBER = "rgb(var(--caution))";
/** A token's status ring, round the foot of its stack. */
const ring = (i: number, color: string, extra?: { className?: string; style?: CSSProperties }) => (
  <ellipse {...isoCircle(STACKS[i].x, STACKS[i].y, DZ, COIN.r + 5)} fill="none" stroke={color} strokeWidth={2.4} {...extra} />
);

export function PriceRingMachine({ className }: { className?: string }) {
  return (
    <MachineFigure
      n={7}
      title="BLOKC5 · the price ring"
      steps={STEPS}
      dwell={dwell}
      view={VIEW}
      className={className}
      caption="BLOKC5 as a ring round its price mast: each pass, four of its tokens drift past their bands and one pooled trade brings them all back. Illustrative: the coin counts and which tokens move are made up; the 2% band is the contracts'."
    >
      {({ step, lap, k, uid }) => {
        const p = pass(lap);
        const ups = p.map(([u]) => u);
        const downs = p.map(([, d]) => d);
        // Coins left standing this step; the coins that move are drawn on their own, above.
        const n = (i: number) => STACKS[i].n - (downs.includes(i) && step > 0 ? 1 : 0);
        // Paint the stacks and the mast from the back to the front.
        const order = [...STACKS.map((s, i) => ({ i, depth: s.x + s.y })), { i: -1, depth: C.x + C.y }].sort((a, b) => a.depth - b.depth);
        /** The hop for pair j: from the top of the one ahead to the gap in its neighbour. */
        const hop = ([u, d]: [number, number], j: number) => {
          const from = project([STACKS[u].x, STACKS[u].y, DZ + STACKS[u].n * COIN.h]);
          const land = project([STACKS[d].x, STACKS[d].y, DZ + (STACKS[d].n - 1) * COIN.h]);
          const [fx, fy] = [from[0] - land[0], from[1] - land[1]];
          return { "--fx": `${fx}px`, "--fy": `${fy}px`, "--mx": `${fx / 2}px`, "--my": `${Math.min(fy, 0) / 2 - 34}px`, "--dur": "660ms", "--delay": `${j * 160}ms` } as CSSProperties;
        };
        const amber = (i: number) => (ups.includes(i) || downs.includes(i)) && step > 0;
        return (
          <>
            <svg aria-hidden viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} className="absolute inset-0 size-full overflow-visible">
              <Slab id={`${uid}-plate`} {...PLATE} />
              {[
                [14, 14],
                [PLATE.w - 14, 14],
                [PLATE.w - 14, PLATE.d - 14],
                [14, PLATE.d - 14],
              ].map(([x, y]) => (
                <Screw key={`${x}-${y}`} cx={x} cy={y} z={Z} />
              ))}
              {/* The dais, the price feeds out to each token, the names. (No plate engraving: the title says what this is, and it ran under ARB's name.) */}
              <Cyl cx={C.x} cy={C.y} z={Z} r={DAIS.r} h={DAIS.h} />
              <ellipse {...isoCircle(C.x, C.y, DZ, RING)} fill="none" stroke={INK} strokeWidth={0.6} strokeDasharray="2 4" />
              {STACKS.map((s) => (
                <line key={`f-${s.symbol}`} {...line(project([C.x, C.y, DZ]), project([s.x, s.y, DZ]))} stroke={INK} strokeWidth={0.6} strokeDasharray="2 3" />
              ))}
              {STACKS.map((s) => (
                <OnFace key={`n-${s.symbol}`} face="top" at={project([s.tx, s.ty, DZ])}>
                  <Engrave u={0} v={3} size={7} anchor={s.label === "right" ? "start" : "end"}>
                    {s.symbol}
                  </Engrave>
                </OnFace>
              ))}

              {/* Status rings: green within the band; amber past it (drawn per step, so they change in step). */}
              <g key={`rings-${k}`}>
                {STACKS.map((s, i) => (
                  <g key={s.symbol}>
                    {ring(i, LEAF)}
                    {amber(i) && ring(i, AMBER, { className: step === 1 ? css.lampOn : css.fadeOut, style: { animationDelay: `${step === 1 ? 480 : 720}ms` } })}
                  </g>
                ))}
              </g>

              {order.map(({ i }) =>
                i < 0 ? (
                  // The Chainlink mast.
                  <g key="mast">
                    <Cyl cx={C.x} cy={C.y} z={DZ} r={MAST.r} h={MAST.h} />
                    <Cyl cx={C.x} cy={C.y} z={DZ + MAST.h} r={13} h={3} />
                    <Cyl cx={C.x} cy={C.y} z={DZ + MAST.h + 3} r={3.5} h={5} top="rgb(var(--cobalt) / 0.5)" />
                  </g>
                ) : (
                  <Coins key={STACKS[i].symbol} cx={STACKS[i].x} cy={STACKS[i].y} z={DZ} n={n(i)} r={COIN.r} h={COIN.h} symbol={STACKS[i].symbol} />
                ),
              )}
            </svg>

            <Layer key={`parts-${k}`} view={VIEW} rect={VIEW}>
              {step === 0 && (
                <>
                  {/* The pulse from the mast; each ring flashes as its price arrives. */}
                  <ellipse {...isoCircle(C.x, C.y, DZ, DAIS.r - 6)} fill="none" stroke="rgb(var(--cobalt))" strokeWidth={1.4} className={css.ping} />
                  {STACKS.map((s, i) => (
                    <ellipse
                      key={s.symbol}
                      {...isoCircle(s.x, s.y, DZ, COIN.r + 14)}
                      fill="none"
                      stroke={LEAF}
                      strokeWidth={2}
                      className={css.ping}
                      style={{ "--delay": `${360 + i * 110}ms` } as CSSProperties}
                    />
                  ))}
                </>
              )}

              {step === 1 &&
                p.map(([u, d], j) => (
                  <g key={`${u}-${d}`}>
                    {/* One runs ahead: a coin's worth lands on it. */}
                    <g className={css.drop} style={{ "--h": "-18px", animationDelay: `${j * 140}ms` } as CSSProperties}>
                      <Coin cx={STACKS[u].x} cy={STACKS[u].y} z={DZ + STACKS[u].n * COIN.h} r={COIN.r} h={COIN.h} symbol={STACKS[u].symbol} face />
                    </g>
                    {/* Its neighbour falls behind: a coin's worth goes. */}
                    <Coin
                      cx={STACKS[d].x}
                      cy={STACKS[d].y}
                      z={DZ + (STACKS[d].n - 1) * COIN.h}
                      r={COIN.r}
                      h={COIN.h}
                      symbol={STACKS[d].symbol}
                      face
                      className={css.fadeOut}
                      style={{ animationDelay: `${160 + j * 140}ms` }}
                    />
                  </g>
                ))}

              {step === 2 &&
                // One pooled trade: each extra coin hops to its neighbour, changing token on the way.
                p.map(([u, d], j) => {
                  const at = { cx: STACKS[d].x, cy: STACKS[d].y, z: DZ + (STACKS[d].n - 1) * COIN.h, r: COIN.r, h: COIN.h };
                  return (
                    <g key={`${u}-${d}`} className={css.hop} style={hop([u, d], j)}>
                      <Coin {...at} symbol={STACKS[d].symbol} face className={css.lampOn} style={{ animationDelay: `${340 + j * 160}ms` }} />
                      <Coin {...at} symbol={STACKS[u].symbol} face className={css.fadeOut} style={{ animationDelay: `${340 + j * 160}ms` }} />
                    </g>
                  );
                })}
            </Layer>
          </>
        );
      }}
    </MachineFigure>
  );
}
