"use client";

import type { CSSProperties } from "react";
import { type Box, type V3, bounds, boxBounds, faces, project, roundRect, shift } from "./geometry";
import { IsoMark, Layer } from "./Iso";
import { type FigureStep, MachineFigure } from "./MachineFigure";
import css from "./iso.module.css";
import { CoinFace, Cyl, Engrave, Flat, INK, OnFace, Part, Screw, Slab, logoSrc } from "./machine";
import type { ComponentSymbol } from "@/lib/data/indices";

/*
 * Fig. 1, the Garden, drawn as a machine. A mounting plate carries:
 * - the holdings tray (coin stacks),
 * - the Diamond core, with four facet cartridges in its bays (INDEX lit when it's the caller),
 * - a rail from the tray to the transfer-out gate (a portcullis with a lamp),
 * - the owner-key lock beside the gate, and the key on its stand.
 * Three steps that loop (Pause stops it), or picked with the tabs or the arrow keys: the index strategy
 * rebalances (a coin hops between stacks: allowed); it tries to send a coin
 * out (the coin hits the shut gate: blocked); you put your key in (the gate
 * lifts and the coin leaves: allowed). Illustrative: no real amounts.
 * The holdings carry their tokens' logos, and each facet the mark of what it
 * plugs into (the index: BLOK's own; swap: Uniswap; lend: Aave; perps: GMX).
 */

const Z = 10; // the plate's top
const PLATE = { x: 0, y: 0, w: 420, d: 230, h: Z, r: 14 };

// Holdings: three stacks on a tray. The rebalance moves the top coin of a onto c.
const TRAY = { x: 20, y: 108, w: 110, d: 60, h: 6, r: 6 };
const COIN = { r: 11, h: 5, z: Z + TRAY.h };
const STACKS: { x: number; n: number; symbol: ComponentSymbol }[] = [
  { x: 42, n: 4, symbol: "LINK" }, // a: 5 before the rebalance; its fifth coin is the hopping one
  { x: 75, n: 3, symbol: "UNI" },
  { x: 108, n: 2, symbol: "AAVE" }, // c: 3 after, the third is the hopping one
];
const STACK_Y = 138;
const HOP_REST: V3 = [STACKS[2].x, STACK_Y, COIN.z + 2 * COIN.h];
const HOP_FROM: V3 = [STACKS[0].x - STACKS[2].x, 0, 4 * COIN.h - 2 * COIN.h];
const HOP_VIA: V3 = [HOP_FROM[0] / 2, 0, HOP_FROM[2] + 30];

// The Diamond core and its facet bays (on its front-left face, y = CORE.y + CORE.d).
const CORE: Box = { x: 160, y: 30, z: Z, w: 160, d: 65, h: 90 };
/** Each facet and the mark of what it plugs into. */
const FACETS: { name: string; mark: string }[] = [
  { name: "Index", mark: "/brand/mark-96.webp" },
  { name: "Swap", mark: logoSrc("UNI") },
  { name: "Lend", mark: logoSrc("AAVE") },
  { name: "Perps", mark: logoSrc("GMX") },
];

// The rail, the gate, the lamp.
const RAIL = { x0: 140, x1: 410, y0: 188, y1: 200 };
const RAIL_Y = (RAIL.y0 + RAIL.y1) / 2;
const POST_A: Box = { x: 322, y: 176, z: Z, w: 8, d: 8, h: 48 };
const POST_B: Box = { x: 322, y: 204, z: Z, w: 8, d: 8, h: 48 };
const BAR: Box = { x: 322, y: 176, z: Z + 48, w: 8, d: 36, h: 6 };
const GATE: Box = { x: 324, y: 184, z: Z, w: 4, d: 20, h: 36 };
const LIFT = 30; // how far the gate rises when it opens
const PUCK = { x: 150, r: 6, h: 4 };

// The owner-key lock and the key's stand.
const LOCK: Box = { x: 352, y: 118, z: Z, w: 30, d: 30, h: 24 };
const STAND: Box = { x: 382, y: 58, z: Z, w: 26, d: 26, h: 10 };
const KEY_IN: Box = { x: 360, y: 132, z: LOCK.z + LOCK.h, w: 14, d: 3, h: 30 };
const KEY_HOME: V3 = [390 - KEY_IN.x, 70 - KEY_IN.y, STAND.z + STAND.h - KEY_IN.z];
const KEY_VIA: V3 = [KEY_HOME[0] / 2, KEY_HOME[1] / 2, 26];

const cylBox = (cx: number, cy: number, z: number, r: number, h: number) =>
  bounds([project([cx - r, cy - r, z + h]), project([cx + r, cy + r, z]), project([cx + r, cy - r, z]), project([cx - r, cy + r, z])], 2);

const VIEW = bounds(
  [
    ...roundRect(PLATE.x, PLATE.y, PLATE.w, PLATE.d, PLATE.r, 0),
    ...Object.values(faces(CORE)).flat(),
    project([GATE.x, GATE.y, GATE.z + GATE.h + LIFT + 12]),
    project([KEY_IN.x + KEY_HOME[0], KEY_IN.y + KEY_HOME[1], KEY_IN.z + KEY_HOME[2] + KEY_IN.h + 30]),
  ],
  14,
);

type Step = { tab: string; who: string; action: string; verdict: "allowed" | "blocked"; scene: string };
const RAW: Step[] = [
  {
    tab: "Strategy rebalances",
    who: "index strategy",
    action: "rebalance",
    verdict: "allowed",
    scene:
      "Step 1 of 3. The index strategy rebalances inside your Garden: one coin moves from the tallest holding to the shortest. Allowed.",
  },
  {
    tab: "Strategy sends out",
    who: "index strategy",
    action: "transfer out",
    verdict: "blocked",
    scene:
      "Step 2 of 3. The index strategy tries to send a coin out of your Garden. It runs down the rail and stops at the shut transfer-out gate. Blocked.",
  },
  {
    tab: "You withdraw",
    who: "you, with your key",
    action: "transfer out",
    verdict: "allowed",
    scene: "Step 3 of 3. You put your owner key in the lock. The transfer-out gate lifts and the coin leaves your Garden. Allowed.",
  },
];

const STEPS: FigureStep[] = RAW.map((x) => ({
  tab: x.tab,
  scene: x.scene,
  readout: (
    <>
      caller {x.who} · {x.action} · <span className={x.verdict === "allowed" ? "text-leaf" : "text-danger"}>{x.verdict}</span>
    </>
  ),
}));

/** How long each step stays up in the loop: its motion, then a beat to read the readout. */
const dwell = (i: number) => [2600, 2600, 3200][i];

const GOLD = { top: "rgb(var(--sand) / 0.22)", side: "rgb(var(--sand) / 0.55)" };
const fade = (ms: number, delay = 0): CSSProperties => ({ transition: `fill ${ms}ms var(--ease-out) ${delay}ms` });

// Fixed geometry the drawing reads.
const coreFace = project([CORE.x, CORE.y + CORE.d, CORE.z + CORE.h]);
const railPts = (z: number) => [
  project([RAIL.x0, RAIL.y0, z]),
  project([RAIL.x1, RAIL.y0, z]),
  project([RAIL.x1, RAIL.y1, z]),
  project([RAIL.x0, RAIL.y1, z]),
];
const plaque = (x: number, y: number, w: number, d: number) => roundRect(x, y, w, d, 2, Z);
const keyRect = boxBounds(KEY_IN, 2);
const gateRect = bounds([...Object.values(faces(GATE)).flat(), project([GATE.x, GATE.y, GATE.z + GATE.h + LIFT])], 2);
const puckRect = cylBox(PUCK.x, RAIL_Y, Z, PUCK.r, PUCK.h);
const hopRect = cylBox(HOP_REST[0], HOP_REST[1], HOP_REST[2], COIN.r, COIN.h);

export function GardenMachine({ className }: { className?: string }) {
  return (
    <MachineFigure
      n={1}
      title="The Garden · smart account"
      steps={STEPS}
      dwell={dwell}
      view={VIEW}
      className={className}
      caption="Your Garden, drawn as a machine: strategies can trade inside it, but only your key moves funds out. Illustrative."
    >
      {({ step, k, uid }) => {
        const caller = step < 2; // the index strategy is calling
        const open = step === 2;
        const lamp = step === 1 ? "rgb(var(--danger))" : step === 2 ? "rgb(var(--leaf))" : "rgb(var(--plate-l))";
        return (
          <>
            {/* The plate and everything fixed to it. */}
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
              {/* Ruler along the front edge. */}
              {Array.from({ length: 47 }, (_, i) => 24 + i * 8).map((x, i) => {
                const [a, b] = [project([x, i % 5 ? 222 : 218, Z]), project([x, 226, Z])];
                return <line key={x} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={INK} strokeWidth={0.6} />;
              })}
              {/* The plate's own plaque. */}
              <Flat points={plaque(20, 70, 110, 14)} fill="rgb(var(--plate-l))" />
              <OnFace face="top" at={project([20, 70, Z])}>
                <Engrave u={6} v={9.8} size={6.2}>
                  Garden · your address
                </Engrave>
              </OnFace>

              {/* Holdings tray and its label. */}
              <Slab id={`${uid}-tray`} {...TRAY} z={Z} />
              <Flat points={plaque(22, 174, 56, 10)} fill="rgb(var(--plate-l))" />
              <OnFace face="top" at={project([22, 174, Z])}>
                <Engrave u={5} v={7.6} size={6.2}>
                  Holdings
                </Engrave>
              </OnFace>
              {STACKS.map((st, s) =>
                Array.from({ length: st.n }, (_, i) => (
                  <g key={`${st.x}-${i}`}>
                    <Cyl cx={st.x} cy={STACK_Y} z={COIN.z + i * COIN.h} r={COIN.r} h={COIN.h} top={GOLD.top} side={GOLD.side} />
                    {/* The top coin carries the token's logo (stack c's top coin is the hopping one). */}
                    {i === st.n - 1 && s < 2 && <CoinFace cx={st.x} cy={STACK_Y} z={COIN.z + (i + 1) * COIN.h} r={COIN.r} symbol={st.symbol} />}
                  </g>
                )),
              )}

              {/* The Diamond core. */}
              <Part box={CORE} />
              <OnFace face="left" at={coreFace}>
                {FACETS.map(({ name, mark }, i) => {
                  const u = 8 + i * 38;
                  const on = name === "Index" && caller;
                  return (
                    <g key={name}>
                      <rect x={u} y={16} width={32} height={60} fill="rgb(var(--plate-r))" stroke={INK} strokeWidth={0.8} />
                      <rect x={u + 2.5} y={18.5} width={27} height={55} fill="rgb(var(--card))" stroke={INK} strokeWidth={0.8} />
                      {/* What it plugs into, printed on the cartridge; the lamp sits beside it. */}
                      <image href={mark} x={u + 8} y={21} width={12} height={12} />
                      <circle
                        cx={u + 24.5}
                        cy={24.5}
                        r={2.4}
                        fill={on ? "rgb(var(--leaf))" : "rgb(var(--plate-l))"}
                        stroke={INK}
                        strokeWidth={0.6}
                        style={fade(240)}
                      />
                      <g transform={`translate(${u + 18.2} 51) rotate(-90)`}>
                        <Engrave u={0} v={0} size={7} anchor="middle">
                          {name}
                        </Engrave>
                      </g>
                      <line x1={u + 9} y1={68} x2={u + 23} y2={68} stroke={INK} strokeWidth={0.8} />
                    </g>
                  );
                })}
              </OnFace>
              <OnFace face="top" at={project([CORE.x, CORE.y, CORE.z + CORE.h])}>
                <Engrave u={10} v={52} size={7}>
                  Diamond core · EIP-2535
                </Engrave>
              </OnFace>
              <OnFace face="right" at={project([CORE.x + CORE.w, CORE.y + CORE.d, CORE.z + CORE.h])}>
                {Array.from({ length: 9 }, (_, i) => 20 + i * 6).map((v) => (
                  <line key={v} x1={12} y1={v} x2={53} y2={v} stroke={INK} strokeWidth={0.8} />
                ))}
              </OnFace>

              {/* The rail, from the tray to the edge, and its plaque. */}
              <Flat points={railPts(Z)} fill="rgb(var(--plate-l))" />
              <line
                {...(([a, b]) => ({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] }))([
                  project([RAIL.x0 + 4, RAIL_Y, Z]),
                  project([RAIL.x1 - 4, RAIL_Y, Z]),
                ])}
                stroke={INK}
                strokeWidth={0.5}
                strokeDasharray="2 3"
              />
              <Flat points={plaque(338, 206, 66, 10)} fill="rgb(var(--plate-l))" />
              <OnFace face="top" at={project([338, 206, Z])}>
                <Engrave u={5} v={7.6} size={6.2}>
                  Transfer out
                </Engrave>
              </OnFace>

              {/* The key's stand, the lock and its slot. */}
              <Part box={STAND} />
              <Flat points={plaque(372, 90, 42, 9)} fill="rgb(var(--plate-l))" />
              <OnFace face="top" at={project([372, 90, Z])}>
                <Engrave u={3.5} v={6.8} size={6}>
                  Your key
                </Engrave>
              </OnFace>
              <Part box={LOCK} />
              <Flat
                points={[
                  project([KEY_IN.x - 1, KEY_IN.y - 1, LOCK.z + LOCK.h]),
                  project([KEY_IN.x + KEY_IN.w + 1, KEY_IN.y - 1, LOCK.z + LOCK.h]),
                  project([KEY_IN.x + KEY_IN.w + 1, KEY_IN.y + KEY_IN.d + 1, LOCK.z + LOCK.h]),
                  project([KEY_IN.x - 1, KEY_IN.y + KEY_IN.d + 1, LOCK.z + LOCK.h]),
                ]}
                fill="rgb(var(--line) / 0.55)"
              />
              <OnFace face="left" at={project([LOCK.x, LOCK.y + LOCK.d, LOCK.z + LOCK.h])}>
                <Engrave u={15} v={15} size={6.2} anchor="middle">
                  Owner
                </Engrave>
              </OnFace>

              {/* The far post of the gate; the gate itself moves, so it's a layer. */}
              <Part box={POST_A} />
            </svg>

            {/* The rebalance: the fifth coin of stack a hops onto stack c. */}
            <Layer
              key={`hop-${k}`}
              view={VIEW}
              rect={hopRect}
              motion={step === 0 ? { anim: "hop", from: HOP_FROM, via: HOP_VIA, delay: 120, dur: 650 } : undefined}
            >
              <Cyl cx={HOP_REST[0]} cy={HOP_REST[1]} z={HOP_REST[2]} r={COIN.r} h={COIN.h} top={GOLD.top} side={GOLD.side} />
              <CoinFace cx={HOP_REST[0]} cy={HOP_REST[1]} z={HOP_REST[2] + COIN.h} r={COIN.r} symbol={STACKS[2].symbol} />
            </Layer>

            {/* The key: on its stand, or (step 3) lifted into the lock. */}
            <Layer
              key={`key-${k}`}
              view={VIEW}
              rect={keyRect}
              motion={open ? { anim: "hop", from: KEY_HOME, via: KEY_VIA, dur: 560 } : undefined}
              className="will-change-transform"
            >
              <g style={open ? undefined : { transform: `translate(${shift(...KEY_HOME).join("px,")}px)` }}>
                <Part
                  box={KEY_IN}
                  tint={{ top: "rgb(var(--leaf) / 0.35)", left: "rgb(var(--leaf) / 0.25)", right: "rgb(var(--leaf-deep) / 0.6)" }}
                />
              </g>
            </Layer>

            {/* The gate: shut, or lifted once the key is in. */}
            <Layer view={VIEW} rect={gateRect}>
              <g
                className="transition-transform duration-base ease-expo"
                style={{
                  transform: open ? `translate(${shift(0, 0, LIFT).join("px,")}px)` : "none",
                  transitionDelay: open ? "560ms" : "0ms",
                }}
              >
                <Part box={GATE} tint={{ left: "rgb(var(--line) / 0.06)", right: "rgb(var(--line) / 0.08)" }} />
              </g>
            </Layer>

            {/* The coin on the rail: bounces off the shut gate, or leaves through the open one. */}
            <Layer
              key={`puck-${k}`}
              view={VIEW}
              rect={puckRect}
              motion={
                step === 1
                  ? { anim: "bounce", via: [GATE.x - PUCK.r - 1 - PUCK.x, 0, 0], delay: 100, dur: 650 }
                  : open
                    ? { anim: "exit", to: [RAIL.x1 - 4 - PUCK.x, 0, 0], delay: 780, dur: 900 }
                    : undefined
              }
            >
              <Cyl cx={PUCK.x} cy={RAIL_Y} z={Z} r={PUCK.r} h={PUCK.h} top={GOLD.top} side={GOLD.side} />
            </Layer>

            {/* The near post, the crossbar and the lamp, over the gate and the coin. */}
            <Layer
              view={VIEW}
              rect={bounds(
                [...Object.values(faces(POST_B)).flat(), ...Object.values(faces(BAR)).flat(), project([326, 194, BAR.z + BAR.h + 8])],
                3,
              )}
            >
              <Part box={POST_B} />
              <Part box={BAR} />
              <Cyl cx={326} cy={194} z={BAR.z + BAR.h} r={4} h={5} />
              {/* Lit when the coin hits the shut gate (red), or once the key is in (green). */}
              {step !== 0 && (
                <g key={`lamp-${k}`} className={css.lampOn} style={{ animationDelay: `${step === 1 ? 370 : 560}ms` }}>
                  <Cyl cx={326} cy={194} z={BAR.z + BAR.h} r={4} h={5} top={lamp} side={lamp} />
                </g>
              )}
            </Layer>

            {step === 1 && (
              <IsoMark key={`stop-${k}`} view={VIEW} kind="stop" size={18} at={project([GATE.x - 8, RAIL_Y + 14, Z + 40])} delay={370} />
            )}
            {open && <IsoMark key={`ok-${k}`} view={VIEW} kind="ok" size={18} at={project([GATE.x - 8, RAIL_Y + 14, Z + 40])} delay={700} />}
          </>
        );
      }}
    </MachineFigure>
  );
}
