"use client";

import type { CSSProperties } from "react";
import { type Box, type V3, bounds, boxBounds, faces, project, roundRect } from "./geometry";
import { IsoMark, Layer } from "./Iso";
import { type FigureStep, MachineFigure } from "./MachineFigure";
import { Cyl, Engrave, Flat, INK, OnFace, Part, Screw, Slab } from "./machine";
import css from "./iso.module.css";

/*
 * Fig. 3, the release line: how a change reaches production, as an assembly
 * line. A change (a facet cartridge) rides the belt through six stations,
 * the six stages the Security page lists (passed in as `stages`, so the
 * readouts can't drift from it): write, test, audit, scan, approve, ship.
 * It collects a lit dot for each check it passes (test, audit, approve).
 */

export type Stage = { label: string; detail: string };

const Z = 10;
const PLATE = { x: 0, y: 0, w: 480, d: 170, h: Z, r: 14 };
const BELT: Box = { x: 20, y: 70, z: Z, w: 450, d: 30, h: 8 };
const TOP = BELT.z + BELT.h; // the belt's surface
const LANE = BELT.y + BELT.d / 2;

// The cartridge, and where it rests at each station (its near-left corner x).
const CART = { w: 22, d: 18, h: 14 };
const STATIONS = [50, 125, 200, 275, 350, 421];
const cartAt = (i: number): Box => ({ x: STATIONS[i] - CART.w / 2, y: LANE - CART.d / 2, z: TOP, ...CART });

// Stations.
const DESK: Box = { x: 30, y: 26, z: Z, w: 46, d: 36, h: 34 };
const arch = (x: number) => ({
  back: { x, y: 62, z: Z, w: 8, d: 6, h: 44 } as Box,
  front: { x, y: 102, z: Z, w: 8, d: 6, h: 44 } as Box,
  bar: { x, y: 62, z: Z + 44, w: 8, d: 46, h: 6 } as Box,
});
const TEST = arch(121);
const SCAN = arch(271);
const BEAM: Box = { x: 273, y: 69, z: Z + 37, w: 4, d: 32, h: 2 };
const AUDIT_POST: Box = { x: 196, y: 34, z: Z, w: 8, d: 8, h: 60 };
const AUDIT_ARM: Box = { x: 198, y: 42, z: Z + 54, w: 4, d: LANE - 42, h: 4 };
const LENS = { cx: 200, cy: LANE, z: Z + 44, r: 13 };
const PRESS_POST: Box = { x: 344, y: 40, z: Z, w: 12, d: 10, h: 76 };
const PRESS_ARM: Box = { x: 344, y: 46, z: Z + 70, w: 12, d: LANE - 46 + 6, h: 6 };
const STAMP: Box = { x: 342, y: LANE - 8, z: TOP + CART.h + 12, w: 16, d: 16, h: 14 };
const BAY: Box = { x: 436, y: 56, z: Z, w: 38, d: 58, h: 46 };

const VIEW = bounds(
  [...roundRect(PLATE.x, PLATE.y, PLATE.w, PLATE.d, PLATE.r, 0), ...Object.values(faces(PRESS_POST)).flat(), project([30, 26, Z + 70])],
  14,
);

const dwell = (i: number) => [2200, 2600, 2600, 2400, 2600, 2800][i];
const at = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });
const plaque = (x: number, y: number, w: number, d: number) => roundRect(x, y, w, d, 2, Z);
const lamp = (cx: number, cy: number, z: number, lit: boolean, delay?: number, r = 3) =>
  lit ? (
    <g className={delay != null ? css.lampOn : undefined} style={delay != null ? at(delay) : undefined}>
      <Cyl cx={cx} cy={cy} z={z} r={r} h={3} top="rgb(var(--leaf))" side="rgb(var(--leaf))" />
    </g>
  ) : (
    <Cyl cx={cx} cy={cy} z={z} r={r} h={3} />
  );

const SCENES = [
  "Step 1 of 6, Write. A new change, a facet cartridge, is written in Solidity and set on the belt.",
  "Step 2 of 6, Test. It passes under the test arch; three test lamps light, and the cartridge's first dot lights.",
  "Step 3 of 6, Audit. It passes under the audit lens and gets its second dot.",
  "Step 4 of 6, Scan. The scanner's beam sweeps across it.",
  "Step 5 of 6, Approve. The DAO stamp presses down on it: new facets need a DAO vote. Its third dot lights.",
  "Step 6 of 6, Ship. It rides into the Arbitrum One bay.",
];

export function ReleaseMachine({ stages, className }: { stages: Stage[]; className?: string }) {
  const steps: FigureStep[] = stages.map((s, i) => ({
    tab: s.label,
    scene: SCENES[i] ?? `${s.label}: ${s.detail}.`,
    readout: `${s.label.toLowerCase()} · ${s.detail}`,
  }));
  return (
    <MachineFigure
      n={3}
      title="The release line"
      steps={steps}
      dwell={dwell}
      view={VIEW}
      className={className}
      caption="How a change reaches production, as an assembly line. The stages and tools are the ones above; the cartridge is illustrative."
    >
      {({ step, k, uid }) => {
        const full = `${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`;
        const rest = step === 5 ? cartAt(5) : cartAt(step);
        const from: V3 = step === 0 ? [0, 0, 26] : [STATIONS[step - 1] - STATIONS[step], 0, 0];
        const via: V3 = step === 0 ? [0, 0, 30] : [from[0] / 2, 0, 0];
        const dots = [step >= 1, step >= 2, step >= 4];
        // When each dot lights, on the step that earns it.
        const dotDelay = [step === 1 ? 1150 : undefined, step === 2 ? 1150 : undefined, step === 4 ? 1050 : undefined];
        return (
          <>
            {/* The plate, the belt and everything behind the cartridge. */}
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
              {Array.from({ length: 54 }, (_, i) => 24 + i * 8).map((x, i) => {
                const [a, b] = [project([x, i % 5 ? 152 : 148, Z]), project([x, 156, Z])];
                return <line key={x} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={INK} strokeWidth={0.6} />;
              })}

              {/* Write: the desk and its screen. */}
              <Part box={DESK} />
              <OnFace face="left" at={project([DESK.x, DESK.y + DESK.d, DESK.z + DESK.h])}>
                <rect x={6} y={5} width={34} height={18} fill="rgb(var(--plate-r))" stroke={INK} strokeWidth={0.7} />
                {[0, 1, 2].map((i) => (
                  <line
                    key={i}
                    x1={9 + (i === 1 ? 4 : 0)}
                    y1={9 + i * 4.5}
                    x2={[30, 34, 24][i]}
                    y2={9 + i * 4.5}
                    stroke="rgb(var(--leaf))"
                    strokeWidth={1.2}
                  />
                ))}
                <Engrave u={23} v={30} size={5.5} anchor="middle">
                  {"</>"}
                </Engrave>
              </OnFace>

              <Part box={BELT} />
              {/* Belt slats. */}
              {Array.from({ length: 44 }, (_, i) => BELT.x + 6 + i * 10).map((x) => {
                const [a, b] = [project([x, BELT.y + 2, TOP]), project([x, BELT.y + BELT.d - 2, TOP])];
                return <line key={x} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgb(var(--line) / 0.25)" strokeWidth={0.6} />;
              })}

              {/* Back halves of the arches, the audit post and arm, the press column. */}
              <Part box={TEST.back} />
              <Part box={AUDIT_POST} />
              <Part box={SCAN.back} />
              <Part box={PRESS_POST} />

              {/* Station plaques, along the front. */}
              {stages.map((s, i) => (
                <g key={s.label}>
                  <Flat points={plaque(STATIONS[i] - 22, 110, 44, 10)} fill="rgb(var(--plate-l))" />
                  <OnFace face="top" at={project([STATIONS[i] - 22, 110, Z])}>
                    <Engrave u={4} v={7.4} size={5.4}>
                      {`0${i + 1} ${s.label}`}
                    </Engrave>
                  </OnFace>
                </g>
              ))}
            </svg>

            {/* The change on the belt: slides in from the last station (or drops in at Write). */}
            <Layer
              key={`cart-${k}`}
              view={VIEW}
              rect={boxBounds(rest, 4)}
              motion={{ anim: "hop", from, via, dur: step === 0 ? 520 : 650 }}
              inner={step === 5 ? { anim: "exit", to: [BAY.x + 30 - rest.x, 0, 0], delay: 700, dur: 700 } : undefined}
            >
              <Part
                box={rest}
                tint={{ top: "rgb(var(--sand) / 0.18)", left: "rgb(var(--sand) / 0.12)", right: "rgb(var(--sand) / 0.3)" }}
              />
              <OnFace face="left" at={project([rest.x, rest.y + rest.d, rest.z + rest.h])}>
                <Engrave u={11} v={9.5} size={5} anchor="middle">
                  {"</>"}
                </Engrave>
              </OnFace>
              {dots.map((lit, i) => {
                const [cx, cy] = [rest.x + 5 + i * 6, rest.y + 9];
                return <g key={i}>{lamp(cx, cy, rest.z + rest.h, lit, dotDelay[i], 1.8)}</g>;
              })}
            </Layer>

            {/* Scan: the beam sweeps across the cartridge. */}
            <Layer
              key={`beam-${k}`}
              view={VIEW}
              rect={boxBounds(BEAM, 3)}
              motion={step === 3 ? { anim: "bounce", via: [16, 0, 0], delay: 700, dur: 900 } : undefined}
            >
              <Part
                box={BEAM}
                tint={
                  step === 3
                    ? { top: "rgb(var(--leaf) / 0.7)", left: "rgb(var(--leaf) / 0.6)", right: "rgb(var(--leaf) / 0.8)" }
                    : undefined
                }
              />
            </Layer>

            {/* Approve: the stamp comes down on the cartridge and back up. */}
            <Layer
              key={`stamp-${k}`}
              view={VIEW}
              rect={boxBounds(STAMP, 3)}
              motion={step === 4 ? { anim: "bounce", via: [0, 0, -12], delay: 700, dur: 600 } : undefined}
            >
              {/* The piston rod runs up through the press arm (drawn over it), so it never shows a gap. */}
              <Cyl cx={STAMP.x + STAMP.w / 2} cy={STAMP.y + STAMP.d / 2} z={STAMP.z + STAMP.h} r={2} h={44} />
              <Part box={STAMP} tint={{ left: "rgb(var(--leaf) / 0.18)", right: "rgb(var(--leaf-deep) / 0.45)" }} />
              <OnFace face="left" at={project([STAMP.x, STAMP.y + STAMP.d, STAMP.z + STAMP.h])}>
                <Engrave u={8} v={9} size={4.6} anchor="middle">
                  DAO
                </Engrave>
              </OnFace>
            </Layer>

            {/* In front of the cartridge: the front posts, the bars, the lens, the press arm, the bay. */}
            <svg aria-hidden viewBox={full} className="absolute inset-0 size-full overflow-visible">
              <Part box={TEST.front} />
              <Part box={TEST.bar} />
              <Part box={AUDIT_ARM} />
              <Part box={SCAN.front} />
              <Part box={SCAN.bar} />
              <Part box={PRESS_ARM} />
              <Part box={BAY} />
              <OnFace face="left" at={project([BAY.x, BAY.y + BAY.d, BAY.z + BAY.h])}>
                <Engrave u={19} v={20} size={4.6} anchor="middle">
                  Arbitrum
                </Engrave>
                <Engrave u={19} v={27} size={4.6} anchor="middle">
                  One
                </Engrave>
              </OnFace>
              {/* The audit lens, hanging over the belt. */}
              <line
                x1={project([LENS.cx, LENS.cy, AUDIT_ARM.z])[0]}
                y1={project([LENS.cx, LENS.cy, AUDIT_ARM.z])[1]}
                x2={project([LENS.cx, LENS.cy, LENS.z])[0]}
                y2={project([LENS.cx, LENS.cy, LENS.z])[1]}
                stroke={INK}
                strokeWidth={1.2}
              />
              {(() => {
                const [x, y] = project([LENS.cx, LENS.cy, LENS.z]);
                const rx = LENS.r * Math.SQRT2;
                return <ellipse cx={x} cy={y} rx={rx} ry={rx / 2} fill="rgb(var(--card) / 0.35)" stroke={INK} strokeWidth={2.2} />;
              })()}
            </svg>

            {/* What moves or lights at each station. */}
            <Layer key={`fx-${k}`} view={VIEW} rect={VIEW}>
              {/* Test: three lamps on the bar, in turn. */}
              {[0, 1, 2].map((i) => (
                <g key={`t${i}`}>{lamp(125, 70 + i * 13, TEST.bar.z + TEST.bar.h, step >= 1, step === 1 ? 700 + i * 140 : undefined)}</g>
              ))}
              {/* Audit: the lens lights up. */}
              {step >= 2 &&
                (() => {
                  const [x, y] = project([LENS.cx, LENS.cy, LENS.z]);
                  const rx = LENS.r * Math.SQRT2;
                  return (
                    <ellipse
                      cx={x}
                      cy={y}
                      rx={rx}
                      ry={rx / 2}
                      fill="none"
                      stroke="rgb(var(--leaf))"
                      strokeWidth={2.2}
                      className={step === 2 ? css.lampOn : undefined}
                      style={step === 2 ? at(720) : undefined}
                    />
                  );
                })()}
              {/* Approve: the press lamp. */}
              <g>{lamp(350, 45, PRESS_POST.z + PRESS_POST.h, step >= 4, step === 4 ? 1000 : undefined)}</g>
              {/* Ship: the bay's lamp. */}
              <g>{lamp(BAY.x + 19, BAY.y + 29, BAY.z + BAY.h, step >= 5, step === 5 ? 1300 : undefined, 3.6)}</g>
            </Layer>

            {step === 2 && (
              <IsoMark key={`ok-${k}`} view={VIEW} kind="ok" at={project([LENS.cx + 2, LENS.cy - 18, LENS.z + 14])} delay={900} />
            )}
          </>
        );
      }}
    </MachineFigure>
  );
}
