"use client";

import type { CSSProperties } from "react";
import { type Box, type Pt, type V3, bounds, project, pts, roundRect } from "./geometry";
import { Layer } from "./Iso";
import { type FigureStep, MachineFigure } from "./MachineFigure";
import { Cyl, Engrave, Flat, INK, OnFace, Part, Screw, Slab } from "./machine";
import css from "./iso.module.css";

/*
 * Fig. 2, the index method drawn as a weighing machine. The four steps are the
 * four in methodology.steps (lib/data/indices.ts), and the readouts quote its
 * guardrails; only the component sizes are made up.
 * - Price: the Chainlink mast sends a pulse to each component tube; each tube's lamp lights.
 * - Size: an authorised account drops the supply card into the register; each tube
 *   fills to its market cap (price × supply).
 * - Weigh: the weight rail lights segment by segment, each one that tube's share of the total.
 * - Floor: the near-empty fifth component's sliver is lifted to the minimum, and the rest rescale.
 */

const Z = 10;
const PLATE = { x: 0, y: 0, w: 440, d: 200, h: Z, r: 14 };

const ORACLE: Box = { x: 22, y: 22, z: Z, w: 40, d: 40, h: 12 };
const MAST = { cx: 42, cy: 42 };
const REG: Box = { x: 22, y: 108, z: Z, w: 58, d: 52, h: 32 };
const CARD: Box = { x: 40, y: 128.5, z: REG.z + REG.h, w: 22, d: 2, h: 14 };

// The component tubes, and how full each one gets (made up: illustrative market caps).
const TUBE = { y: 96, r: 14, h: 76, socket: 4 };
const TUBES = [152, 192, 232, 272, 312];
const LEVELS = [64, 44, 30, 20, 0.6];
const LIQ = { r: 12, z: Z + TUBE.socket };

// The weight rail: shares of the total, before and after the floor.
const RAIL: Box = { x: 120, y: 150, z: Z, w: 300, d: 16, h: 8 };
const MIN = 11; // the floor, drawn wide enough to see (the rule is 0.01%)
const total = LEVELS.reduce((a, b) => a + b, 0);
const before = LEVELS.map((l) => (l / total) * RAIL.w);
const restTotal = LEVELS.slice(0, -1).reduce((a, b) => a + b, 0);
const after = [...LEVELS.slice(0, -1).map((l) => (l / restTotal) * (RAIL.w - MIN)), MIN];
const JACK: Box = { x: 402, y: 132, z: Z, w: 14, d: 14, h: 12 };

const VIEW = bounds(
  [
    ...roundRect(PLATE.x, PLATE.y, PLATE.w, PLATE.d, PLATE.r, 0),
    project([MAST.cx - 16, MAST.cy - 16, 100]),
    project([CARD.x, CARD.y, CARD.z + CARD.h + 60]),
  ],
  14,
);

const RAW = [
  {
    tab: "Price",
    readout: "price · Chainlink feed · fresh within its heartbeat · within ±10% of its average",
    scene: "Step 1 of 4, Price. The Chainlink mast sends a price to each of the five component tubes, and each tube's lamp lights.",
  },
  {
    tab: "Size",
    readout: "market cap = price × circulating supply · supply posted on-chain",
    scene:
      "Step 2 of 4, Size. An authorised account drops the supply card into the register, and each tube fills to its market cap: price times circulating supply.",
  },
  {
    tab: "Weigh",
    readout: "weight = market cap ÷ total · nobody sets it by hand",
    scene:
      "Step 3 of 4, Weigh. The weight rail lights segment by segment: each component's weight is its market cap's share of the total, adding up to 100%.",
  },
  {
    tab: "Floor",
    readout: "minimum weight 0.01% · then all rescaled to 100%",
    scene:
      "Step 4 of 4, Floor. The fifth component is almost empty; its weight is lifted to the 0.01% minimum, and the others rescale so the total is still 100%.",
  },
];
const STEPS: FigureStep[] = RAW.map((x) => ({ tab: x.tab, scene: x.scene, readout: x.readout }));

/** How long each step stays up in the loop: its motion, then a beat to read. */
const dwell = (i: number) => [2600, 3000, 2800, 2600][i];

const GLASS = "rgb(var(--card) / 0.35)";
const LIQUID = { top: "rgb(var(--cobalt) / 0.32)", side: "rgb(var(--cobalt) / 0.5)" };
const tint = (i: number) => `rgb(var(--cobalt) / ${0.12 + i * 0.08})`;
const at = (s: number): CSSProperties => ({ animationDelay: `${s}ms` });
const line = (a: V3, b: V3) => {
  const [p, q] = [project(a), project(b)];
  return { x1: p[0], y1: p[1], x2: q[0], y2: q[1] };
};
const plaque = (x: number, y: number, w: number, d: number) => roundRect(x, y, w, d, 2, Z);

/** Rail segments on the rail's top face, from widths in rail units. */
const segments = (widths: number[]) => {
  let x = RAIL.x;
  const z = RAIL.z + RAIL.h;
  return widths.map((w) => {
    const p: Pt[] = [
      project([x, RAIL.y, z]),
      project([x + w, RAIL.y, z]),
      project([x + w, RAIL.y + RAIL.d, z]),
      project([x, RAIL.y + RAIL.d, z]),
    ];
    x += w;
    return p;
  });
};
const SEG_BEFORE = segments(before);
const SEG_AFTER = segments(after);

/** A glass tube: its socket, the back wall, then (separately) the front glass. */
function TubeBack({ cx }: { cx: number }) {
  return (
    <g>
      <Cyl cx={cx} cy={TUBE.y} z={Z} r={TUBE.r + 2} h={TUBE.socket} />
      <ellipse {...iso(cx, TUBE.y, Z + TUBE.socket + TUBE.h, TUBE.r)} fill="rgb(var(--plate-l) / 0.6)" stroke={INK} strokeWidth={0.8} />
    </g>
  );
}
function TubeFront({ cx }: { cx: number }) {
  const b = iso(cx, TUBE.y, Z + TUBE.socket, TUBE.r);
  const t = iso(cx, TUBE.y, Z + TUBE.socket + TUBE.h, TUBE.r);
  const d = `M ${b.cx - b.rx} ${b.cy} A ${b.rx} ${b.ry} 0 0 0 ${b.cx + b.rx} ${b.cy} L ${t.cx + t.rx} ${t.cy} A ${t.rx} ${t.ry} 0 0 0 ${t.cx - t.rx} ${t.cy} Z`;
  return (
    <g>
      <path d={d} fill={GLASS} stroke={INK} strokeWidth={0.8} strokeLinejoin="round" />
      {/* A highlight down the glass. */}
      <line
        x1={t.cx - t.rx * 0.55}
        y1={t.cy + 4}
        x2={b.cx - b.rx * 0.55}
        y2={b.cy - 2}
        stroke="rgb(var(--card))"
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.8}
      />
      {/* Graduations. */}
      {[0.25, 0.5, 0.75].map((f) => {
        const y = b.cy - (b.cy - t.cy) * f + b.ry * 0.9;
        return <line key={f} x1={b.cx + b.rx * 0.55} y1={y} x2={b.cx + b.rx * 0.85} y2={y - 1.5} stroke={INK} strokeWidth={0.6} />;
      })}
    </g>
  );
}
const iso = (cx: number, cy: number, z: number, r: number) => {
  const [x, y] = project([cx, cy, z]);
  return { cx: x, cy: y, rx: r * Math.SQRT2, ry: (r * Math.SQRT2) / 2 };
};
/** The clip for a tube's liquid: the inside of the glass. */
const tubeClip = (cx: number) => {
  const b = iso(cx, TUBE.y, LIQ.z, LIQ.r);
  const t = iso(cx, TUBE.y, LIQ.z + TUBE.h, LIQ.r);
  return `M ${b.cx - b.rx} ${b.cy} A ${b.rx} ${b.ry} 0 0 0 ${b.cx + b.rx} ${b.cy} L ${t.cx + t.rx} ${t.cy - 8} L ${t.cx - t.rx} ${t.cy - 8} Z`;
};
/** Where a tube's lamp sits: on a short arm at the back of its rim. */
const lampAt = (cx: number): V3 => [cx + 10, TUBE.y - 10, Z + TUBE.socket + TUBE.h + 2];

export function IndexMachine({ className }: { className?: string }) {
  return (
    <MachineFigure
      n={2}
      title="Index weights · the method"
      steps={STEPS}
      dwell={dwell}
      view={VIEW}
      className={className}
      caption="How every BLOK Capital index sets its weights, as a machine: price, size, weigh, floor. Illustrative: the component sizes are made up; the rules are the contracts'."
    >
      {({ step, k, uid }) => {
        const filled = step >= 1;
        const weighed = step >= 2;
        const floored = step === 3;
        const full = `${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`;
        return (
          <>
            {/* The plate, the stations and the back of the tubes. */}
            <svg aria-hidden viewBox={full} className="absolute inset-0 size-full overflow-visible">
              <Slab id={`${uid}-plate`} {...PLATE} />
              {[
                [12, 12],
                [PLATE.w - 12, 12],
                [PLATE.w - 12, PLATE.d - 12],
                [12, PLATE.d - 12],
              ].map(([x, y]) => (
                <Screw key={`${x}-${y}`} cx={x} cy={y} z={Z} />
              ))}
              {Array.from({ length: 50 }, (_, i) => 24 + i * 8).map((x, i) => (
                <line key={x} {...line([x, i % 5 ? 192 : 188, Z], [x, 196, Z])} stroke={INK} strokeWidth={0.6} />
              ))}

              {/* Wiring on the plate: prices along the back bus, supply along the front one. */}
              <polyline
                points={pts([project([62, 42, Z]), project([92, 42, Z]), project([92, 70, Z]), project([TUBES[4], 70, Z])])}
                fill="none"
                stroke={INK}
                strokeWidth={0.7}
                strokeDasharray="2 3"
              />
              {TUBES.map((x) => (
                <line
                  key={`p${x}`}
                  {...line([x, 70, Z], [x, TUBE.y - TUBE.r - 2, Z])}
                  stroke={INK}
                  strokeWidth={0.7}
                  strokeDasharray="2 3"
                />
              ))}
              <polyline
                points={pts([project([REG.x + REG.w, 124, Z]), project([TUBES[4], 124, Z])])}
                fill="none"
                stroke={INK}
                strokeWidth={0.7}
                strokeDasharray="2 3"
              />
              {TUBES.map((x) => (
                <line
                  key={`s${x}`}
                  {...line([x, 124, Z], [x, TUBE.y + TUBE.r + 2, Z])}
                  stroke={INK}
                  strokeWidth={0.7}
                  strokeDasharray="2 3"
                />
              ))}

              {/* Price: the Chainlink mast. */}
              <Part box={ORACLE} />
              <Cyl cx={MAST.cx} cy={MAST.cy} z={ORACLE.z + ORACLE.h} r={3.5} h={62} />
              <Cyl cx={MAST.cx} cy={MAST.cy} z={84} r={15} h={3} />
              <Cyl cx={MAST.cx} cy={MAST.cy} z={87} r={3} h={6} />
              <Flat points={plaque(16, 70, 70, 10)} fill="rgb(var(--plate-l))" />
              <OnFace face="top" at={project([16, 70, Z])}>
                <Engrave u={5} v={7.4} size={5.5}>
                  Price · Chainlink
                </Engrave>
              </OnFace>

              {/* Size: the supply register, its counter and its slot. */}
              <Part box={REG} />
              <OnFace face="left" at={project([REG.x, REG.y + REG.d, REG.z + REG.h])}>
                <rect x={8} y={8} width={42} height={12} fill="rgb(var(--plate-r))" stroke={INK} strokeWidth={0.7} />
                {Array.from({ length: 5 }, (_, i) => (
                  <rect key={i} x={10 + i * 8} y={9.5} width={6} height={9} fill="rgb(var(--card))" stroke={INK} strokeWidth={0.5} />
                ))}
                <Engrave u={29} v={28} size={5} anchor="middle">
                  Supply
                </Engrave>
              </OnFace>
              <Flat
                points={[
                  project([CARD.x - 2, CARD.y - 1, REG.z + REG.h]),
                  project([CARD.x + CARD.w + 2, CARD.y - 1, REG.z + REG.h]),
                  project([CARD.x + CARD.w + 2, CARD.y + CARD.d + 1, REG.z + REG.h]),
                  project([CARD.x - 2, CARD.y + CARD.d + 1, REG.z + REG.h]),
                ]}
                fill="rgb(var(--line) / 0.55)"
              />
              <Flat points={plaque(16, 166, 70, 10)} fill="rgb(var(--plate-l))" />
              <OnFace face="top" at={project([16, 166, Z])}>
                <Engrave u={5} v={7.4} size={5.5}>
                  Size · supply
                </Engrave>
              </OnFace>

              {TUBES.map((x) => (
                <TubeBack key={x} cx={x} />
              ))}
              {TUBES.map((x, i) => (
                <clipPath key={x} id={`${uid}-tube${i}`}>
                  <path d={tubeClip(x)} />
                </clipPath>
              ))}
            </svg>

            {/* The supply card and the liquid: replayed on every step change. */}
            <Layer key={`fill-${k}`} view={VIEW} rect={VIEW}>
              {filled && (
                <g className={step === 1 ? css.drop : undefined} style={step === 1 ? ({ "--h": "-60px" } as CSSProperties) : undefined}>
                  <Part
                    box={CARD}
                    tint={{ top: "rgb(var(--sand) / 0.3)", left: "rgb(var(--sand) / 0.25)", right: "rgb(var(--sand) / 0.5)" }}
                  />
                </g>
              )}
              {filled &&
                TUBES.map((x, i) => (
                  <g key={x} clipPath={`url(#${uid}-tube${i})`}>
                    <g
                      className={step === 1 ? css.rise : undefined}
                      style={
                        step === 1 ? ({ "--h": `${LEVELS[i] + 14}px`, animationDelay: `${450 + i * 120}ms` } as CSSProperties) : undefined
                      }
                    >
                      <Cyl
                        cx={x}
                        cy={TUBE.y}
                        z={LIQ.z}
                        r={LIQ.r}
                        h={LEVELS[i]}
                        top={LIQUID.top}
                        side={LIQUID.side}
                        stroke="rgb(var(--cobalt) / 0.6)"
                      />
                    </g>
                  </g>
                ))}
            </Layer>

            {/* The front glass, the lamps (off), the jack and the weight rail. */}
            <svg aria-hidden viewBox={full} className="absolute inset-0 size-full overflow-visible">
              {TUBES.map((x) => (
                <g key={x}>
                  <TubeFront cx={x} />
                  <line {...line([x + 7, TUBE.y - 7, Z + TUBE.socket + TUBE.h], lampAt(x))} stroke={INK} strokeWidth={0.8} />
                  <Cyl cx={lampAt(x)[0]} cy={lampAt(x)[1]} z={lampAt(x)[2]} r={3} h={3} />
                </g>
              ))}
              <Part box={JACK} />
              <Part box={{ x: 406, y: JACK.y + JACK.d, z: Z + 3, w: 6, d: 4, h: 4 }} />
              <Part box={RAIL} />
              <OnFace face="left" at={project([RAIL.x, RAIL.y + RAIL.d, RAIL.z + RAIL.h])}>
                <Engrave u={3} v={6.2} size={4.6}>
                  0%
                </Engrave>
                <Engrave u={RAIL.w - 3} v={6.2} size={4.6} anchor="end">
                  100%
                </Engrave>
              </OnFace>
              <Flat points={plaque(120, 172, 92, 10)} fill="rgb(var(--plate-l))" />
              <OnFace face="top" at={project([120, 172, Z])}>
                <Engrave u={5} v={7.4} size={5.5}>
                  Weight · share of total
                </Engrave>
              </OnFace>
              <Flat points={plaque(338, 172, 70, 10)} fill="rgb(var(--plate-l))" />
              <OnFace face="top" at={project([338, 172, Z])}>
                <Engrave u={5} v={7.4} size={5.5}>
                  Floor · 0.01%
                </Engrave>
              </OnFace>
            </svg>

            {/* What lights up: price pulses and lamps, the rail's segments, the floor. */}
            <Layer key={`lit-${k}`} view={VIEW} rect={VIEW}>
              {step === 0 &&
                TUBES.map((x, i) => {
                  const [a, b] = [project([MAST.cx, MAST.cy, 90]), project(lampAt(x))];
                  return (
                    <g
                      key={`pulse${x}`}
                      className={css.exit}
                      style={
                        {
                          "--tx": `${b[0] - a[0]}px`,
                          "--ty": `${b[1] - a[1]}px`,
                          "--dur": "620ms",
                          animationDelay: `${i * 110}ms`,
                        } as CSSProperties
                      }
                    >
                      <circle cx={a[0]} cy={a[1]} r={2.6} fill="rgb(var(--leaf))" />
                    </g>
                  );
                })}
              {TUBES.map((x, i) => (
                <g key={`lamp${x}`} className={step === 0 ? css.lampOn : undefined} style={step === 0 ? at(560 + i * 110) : undefined}>
                  <Cyl cx={lampAt(x)[0]} cy={lampAt(x)[1]} z={lampAt(x)[2]} r={3} h={3} top="rgb(var(--leaf))" side="rgb(var(--leaf))" />
                </g>
              ))}

              {weighed &&
                SEG_BEFORE.map((p, i) => (
                  <polygon
                    key={`b${i}`}
                    points={pts(p)}
                    fill={tint(i)}
                    stroke={INK}
                    strokeWidth={0.7}
                    className={step === 2 ? css.lampOn : floored ? css.fadeOut : undefined}
                    style={step === 2 ? at(150 + i * 170) : floored ? at(380) : undefined}
                  />
                ))}
              {floored &&
                SEG_AFTER.map((p, i) => (
                  <polygon
                    key={`a${i}`}
                    points={pts(p)}
                    fill={i === SEG_AFTER.length - 1 ? "rgb(var(--leaf) / 0.55)" : tint(i)}
                    stroke={INK}
                    strokeWidth={0.7}
                    className={css.lampOn}
                    style={at(380)}
                  />
                ))}
              {floored && (
                <g className={css.lampOn} style={at(200)}>
                  <Cyl
                    cx={JACK.x + JACK.w / 2}
                    cy={JACK.y + JACK.d / 2}
                    z={JACK.z + JACK.h}
                    r={3}
                    h={3}
                    top="rgb(var(--leaf))"
                    side="rgb(var(--leaf))"
                  />
                </g>
              )}
            </Layer>
          </>
        );
      }}
    </MachineFigure>
  );
}
