"use client";

import type { CSSProperties } from "react";
import type { ComponentSymbol } from "@/lib/data/indices";
import { type Box, bounds, project, roundRect } from "./geometry";
import { IsoMark, Layer } from "./Iso";
import { type FigureStep, MachineFigure } from "./MachineFigure";
import { Engrave, Flat, OnFace, Part, Screw, Slab } from "./machine";
import { Coin, Coins } from "./coins";
import css from "./iso.module.css";

/*
 * Fig. 8, BLOKC10 under a drift check: ten tokens in two rows, and a gantry
 * that sweeps the plate. Each pass, a different six move (three ahead, three
 * behind), so every token takes part over the loop:
 * 1 Prices move: three run ahead (a coin's worth lands on each), three fall
 *   behind (a coin's worth goes).
 * 2 Check: the gantry sweeps across; the four within the 2% band get a tick,
 *   the six past it a flag.
 * 3 Trade: one pooled trade moves a coin from each one ahead to its
 *   neighbour behind, changing token mid-air; the other four aren't touched,
 *   because small wobbles cost nothing. Then the marks clear and the gantry
 *   glides home.
 * Each pass ends where the next begins. Illustrative: the coin counts and
 * which tokens move are made up; the band is the contracts'.
 */

const Z = 10;
const PLATE = { x: 0, y: 0, w: 540, d: 190, h: Z, r: 14 };
const COIN = { r: 12, h: 4.5 };
const XS = [70, 150, 230, 310, 390];
const ROWS: { y: number; tokens: { symbol: ComponentSymbol; n: number }[] }[] = [
  {
    y: 64,
    tokens: [
      { symbol: "LINK", n: 4 },
      { symbol: "DAI", n: 3 },
      { symbol: "UNI", n: 3 },
      { symbol: "AAVE", n: 4 },
      { symbol: "ARB", n: 3 },
    ],
  },
  {
    y: 124,
    tokens: [
      { symbol: "CRV", n: 3 },
      { symbol: "ZRO", n: 2 },
      { symbol: "PENDLE", n: 3 },
      { symbol: "GRT", n: 2 },
      { symbol: "GMX", n: 3 },
    ],
  },
];
const STACKS = ROWS.flatMap((r) => r.tokens.map((t, i) => ({ ...t, x: XS[i], y: r.y })));
const idx = (symbol: ComponentSymbol) => STACKS.findIndex((s) => s.symbol === symbol);
/**
 * Each pass: which tokens run ahead, and which neighbour each trades into
 * (it fell behind). Three pairs a pass; over the three passes all ten move.
 */
const PASSES: [up: number, down: number][][] = [
  [
    [idx("CRV"), idx("ZRO")],
    [idx("UNI"), idx("AAVE")],
    [idx("GMX"), idx("GRT")],
  ],
  [
    [idx("LINK"), idx("DAI")],
    [idx("PENDLE"), idx("ZRO")],
    [idx("ARB"), idx("AAVE")],
  ],
  [
    [idx("DAI"), idx("UNI")],
    [idx("GRT"), idx("PENDLE")],
    [idx("AAVE"), idx("ARB")],
  ],
];
const pass = (lap: number) => PASSES[lap % PASSES.length];
const list = (ids: number[]) => ids.map((i) => STACKS[i].symbol).join(", ");
const ups = (lap: number) => pass(lap).map(([u]) => u);
const downs = (lap: number) => pass(lap).map(([, d]) => d);
const TALLEST = Math.max(...STACKS.map((s) => s.n)) + 1;

// The gantry: two posts and a bar, gliding along rails from one end of the plate to
// the other. It parks past x 510, where its front post is clear of ARB and GMX (it
// used to stop on top of them).
const GX = { from: 4, to: 524 };
const POST_H = 56;
const POST_A: Box = { x: GX.from, y: 14, z: Z, w: 8, d: 8, h: POST_H };
const POST_B: Box = { x: GX.from, y: 168, z: Z, w: 8, d: 8, h: POST_H };
const BAR: Box = { x: GX.from, y: 14, z: Z + POST_H, w: 8, d: 162, h: 6 };
const SWEEP = { delay: 150, dur: 1600 };
const [SX, SY] = project([GX.to - GX.from, 0, 0]);
const HOME = "translate(0px, 0px)";
const AWAY = `translate(${SX}px, ${SY}px)`;

const VIEW = bounds(
  [
    ...roundRect(PLATE.x, PLATE.y, PLATE.w, PLATE.d, PLATE.r, 0),
    project([GX.from, 14, Z + POST_H + 12]),
    project([GX.to, 14, Z + POST_H + 12]),
    ...STACKS.map((st) => project([st.x, st.y, Z + TALLEST * COIN.h + 60])),
  ],
  14,
);

const STEPS: FigureStep[] = [
  {
    tab: "Prices move",
    readout: (lap) => `${list(ups(lap))} up · ${list(downs(lap))} down`,
    scene: (lap) =>
      `Step 1 of 3, Prices move. BLOKC10's ten tokens stand in two rows. ${list(ups(lap))} run ahead and their stacks grow; ${list(downs(lap))} fall behind and their stacks shrink.`,
  },
  {
    tab: "Check",
    readout: (lap) => `drift check · four within the 2% band · ${list(ups(lap))} over · ${list(downs(lap))} under`,
    scene: (lap) =>
      `Step 2 of 3, Check. A gantry sweeps across the ten. Four get a tick, within the 2% band; ${list([...ups(lap), ...downs(lap)])} get a flag, past it.`,
  },
  {
    tab: "Trade",
    readout: (lap) => `one pooled trade · ${pass(lap).map(([u, d]) => `${STACKS[u].symbol} → ${STACKS[d].symbol}`).join(" · ")} · four untouched`,
    scene: (lap) =>
      `Step 3 of 3, Trade. In one pooled trade, ${pass(lap)
        .map(([u, d]) => `a coin moves from ${STACKS[u].symbol} to ${STACKS[d].symbol}`)
        .join(", ")}, each turning into the other token on the way. The other four aren't touched. Then the gantry goes home.`,
  },
];
const dwell = (i: number) => [1700, 2300, 2800][i];

/** A mark's size, in scene units: in proportion to the stacks at any width. */
const MARK = 24;
/** Where a stack's mark floats, above its top. */
const markAt = (i: number) => project([STACKS[i].x, STACKS[i].y, Z + (STACKS[i].n + 1) * COIN.h + 21]);
/** When the sweeping gantry reaches a stack (its motion eases in and out, so roughly). */
const reach = (x: number) => SWEEP.delay + ((x - GX.from) / (GX.to - GX.from)) * SWEEP.dur;

function Gantry() {
  const curtain = [
    project([GX.from + 4, 22, Z + POST_H]),
    project([GX.from + 4, 168, Z + POST_H]),
    project([GX.from + 4, 168, Z]),
    project([GX.from + 4, 22, Z]),
  ];
  return (
    <g>
      <Part box={POST_A} />
      {/* The scanning curtain, down to a line on the plate. */}
      <polygon points={curtain.map((p) => p.join(",")).join(" ")} fill="rgb(var(--cobalt) / 0.07)" stroke="rgb(var(--cobalt) / 0.45)" strokeWidth={0.8} strokeDasharray="3 3" />
      <Part box={BAR} tint={{ top: "rgb(var(--cobalt) / 0.18)" }} />
      <Part box={POST_B} />
    </g>
  );
}

export function DriftScanMachine({ className }: { className?: string }) {
  return (
    <MachineFigure
      n={8}
      title="BLOKC10 · the drift check"
      steps={STEPS}
      dwell={dwell}
      view={VIEW}
      className={className}
      caption="BLOKC10 under a drift check: each pass, six of its tokens drift and only those past their 2% band trade, all in one pooled trade; small wobbles cost nothing. Illustrative: the coin counts and which tokens move are made up; the band is the contracts'."
    >
      {({ step, lap, k, uid }) => {
        const p = pass(lap);
        const up = ups(lap);
        const down = downs(lap);
        // Coins left standing this step; the coins that move are drawn on their own, above.
        const n = (i: number) => (up.includes(i) ? STACKS[i].n + (step === 1 ? 1 : 0) : down.includes(i) ? STACKS[i].n - 1 : STACKS[i].n);
        /** The hop for pair j: from the top of the one ahead to the gap in its neighbour. */
        const hop = ([u, d]: [number, number], j: number) => {
          const from = project([STACKS[u].x, STACKS[u].y, Z + STACKS[u].n * COIN.h]);
          const land = project([STACKS[d].x, STACKS[d].y, Z + (STACKS[d].n - 1) * COIN.h]);
          const [fx, fy] = [from[0] - land[0], from[1] - land[1]];
          return { "--fx": `${fx}px`, "--fy": `${fy}px`, "--mx": `${fx / 2}px`, "--my": `${Math.min(fy, 0) / 2 - 36}px`, "--dur": "660ms", "--delay": `${j * 150}ms` } as CSSProperties;
        };
        // The gantry: home, sweeping out, or (after the trade) gliding home.
        const gantry =
          step === 1
            ? { className: css.sweep, style: { "--sx": `${SX}px`, "--sy": `${SY}px`, "--dur": `${SWEEP.dur}ms`, "--delay": `${SWEEP.delay}ms` } as CSSProperties }
            : step === 2
              ? { className: css.tween, style: { "--from": AWAY, "--to": HOME, "--dur": "900ms", "--delay": "1600ms" } as CSSProperties }
              : {};
        return (
          <>
            <svg aria-hidden viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} className="absolute inset-0 size-full overflow-visible">
              <Slab id={`${uid}-plate`} {...PLATE} />
              {[
                [12, 12],
                [PLATE.w - 12, 12],
                [PLATE.w - 12, PLATE.d - 12],
                [12, PLATE.d - 12],
              ].map(([x, y]) => (
                <Screw key={`${x}-${y}`} cx={x} cy={y} z={Z} />
              ))}
              {/* The gantry's rails, along both long edges. */}
              {[18, 172].map((y) => (
                <Flat key={y} points={roundRect(GX.from + 2, y - 3, GX.to - GX.from + 4, 6, 2, Z)} fill="rgb(var(--plate-l))" />
              ))}
              {STACKS.map((s) => (
                <OnFace key={`n-${s.symbol}`} face="top" at={project([s.x - 10, s.y + COIN.r + 9, Z])}>
                  <Engrave u={0} v={0} size={7}>
                    {s.symbol}
                  </Engrave>
                </OnFace>
              ))}
              <OnFace face="top" at={project([96, 186, Z])}>
                <Engrave u={0} v={0} size={6.8}>
                  BLOKC10 · ten tokens · 2% band
                </Engrave>
              </OnFace>
              {STACKS.map((s, i) => (
                <Coins key={s.symbol} cx={s.x} cy={s.y} z={Z} n={n(i)} r={COIN.r} h={COIN.h} symbol={s.symbol} />
              ))}
            </svg>

            <Layer key={`parts-${k}`} view={VIEW} rect={VIEW}>
              {step === 0 &&
                p.map(([u, d], j) => (
                  <g key={`${u}-${d}`}>
                    {/* One runs ahead: a coin's worth lands on it. Its neighbour falls behind: a coin's worth goes. */}
                    <g className={css.drop} style={{ "--h": "-18px", animationDelay: `${j * 130}ms` } as CSSProperties}>
                      <Coin cx={STACKS[u].x} cy={STACKS[u].y} z={Z + STACKS[u].n * COIN.h} r={COIN.r} h={COIN.h} symbol={STACKS[u].symbol} face />
                    </g>
                    <Coin
                      cx={STACKS[d].x}
                      cy={STACKS[d].y}
                      z={Z + (STACKS[d].n - 1) * COIN.h}
                      r={COIN.r}
                      h={COIN.h}
                      symbol={STACKS[d].symbol}
                      face
                      className={css.fadeOut}
                      style={{ animationDelay: `${160 + j * 130}ms` }}
                    />
                  </g>
                ))}
              {step === 2 &&
                // One pooled trade: each extra coin hops to its neighbour, changing token on the way.
                p.map(([u, d], j) => {
                  const at = { cx: STACKS[d].x, cy: STACKS[d].y, z: Z + (STACKS[d].n - 1) * COIN.h, r: COIN.r, h: COIN.h };
                  return (
                    <g key={`${u}-${d}`} className={css.hop} style={hop([u, d], j)}>
                      <Coin {...at} symbol={STACKS[d].symbol} face className={css.lampOn} style={{ animationDelay: `${340 + j * 150}ms` }} />
                      <Coin {...at} symbol={STACKS[u].symbol} face className={css.fadeOut} style={{ animationDelay: `${340 + j * 150}ms` }} />
                    </g>
                  );
                })}
              <g {...gantry}>
                <Gantry />
              </g>
            </Layer>

            {/* The check's marks: they pop in as the gantry passes, stay through the trade (the flags turning to ticks), then clear. */}
            {step > 0 && (
              <div
                key={`marks-${lap}`}
                aria-hidden
                className={step === 2 ? `pointer-events-none absolute inset-0 ${css.fadeOut}` : "pointer-events-none absolute inset-0"}
                style={step === 2 ? { animationDelay: "1600ms" } : undefined}
              >
                {STACKS.map((s, i) => {
                  const drifter = up.includes(i) || down.includes(i);
                  if (!drifter) return <IsoMark key={s.symbol} view={VIEW} at={markAt(i)} kind="ok" size={MARK} delay={reach(s.x)} />;
                  return (
                    <span key={s.symbol}>
                      <span className={step === 2 ? css.fadeOut : undefined} style={step === 2 ? { animationDelay: "940ms" } : undefined}>
                        <IsoMark view={VIEW} at={markAt(i)} kind="flag" size={MARK} delay={reach(s.x)} />
                      </span>
                      {step === 2 && <IsoMark view={VIEW} at={markAt(i)} kind="ok" size={MARK} delay={1000} />}
                    </span>
                  );
                })}
              </div>
            )}
          </>
        );
      }}
    </MachineFigure>
  );
}
