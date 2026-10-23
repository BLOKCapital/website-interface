"use client";

import type { CSSProperties } from "react";
import { type Box, type V3, bounds, faces, project, roundRect } from "./geometry";
import { Layer } from "./Iso";
import { type FigureStep, MachineFigure } from "./MachineFigure";
import { Cyl, Engrave, Flat, INK, OnFace, Part, Screw, Slab } from "./machine";
import css from "./iso.module.css";

/*
 * Fig. 4, how a decision is made, as a machine: a proposal card hangs from a
 * trolley on an overhead rail and travels four stations, the four stages the
 * Governance page lists (passed in as `stages`): propose (it prints out of
 * the Aragon OSx slot), discuss (the public board's lamps light), vote ($BLOKC
 * coins fill the FOR tube past the quorum line) and execute (it drops into the
 * protocol's registry cabinet). The vote counts are illustrative.
 */

export type Stage = { label: string; detail: string; where: string };

const Z = 10;
const PLATE = { x: 0, y: 0, w: 460, d: 180, h: Z, r: 14 };

// The overhead rail and the card's hanging place at each station.
const RAIL_Z = 96;
const POST_L: Box = { x: 14, y: 50, z: Z, w: 8, d: 8, h: RAIL_Z - Z };
const POST_R: Box = { x: 438, y: 50, z: Z, w: 8, d: 8, h: RAIL_Z - Z };
const BEAM: Box = { x: 14, y: 50, z: RAIL_Z, w: 432, d: 8, h: 6 };
const STATIONS = [72, 172, 282, 396];
const CARD = { w: 32, d: 2, h: 24, z: 58 };
const hang = (i: number) => ({
  trolley: { x: STATIONS[i] - 7, y: 49, z: RAIL_Z - 7, w: 14, d: 10, h: 7 } as Box,
  card: { x: STATIONS[i] - CARD.w / 2, y: 53, z: CARD.z, w: CARD.w, d: CARD.d, h: CARD.h } as Box,
});

// Stations.
const PRINTER: Box = { x: 50, y: 68, z: Z, w: 44, d: 34, h: 34 };
const BOARD: Box = { x: 150, y: 70, z: Z, w: 44, d: 5, h: 46 };
const BALLOT: Box = { x: 252, y: 70, z: Z, w: 60, d: 40, h: 18 };
const TUBES = [
  { cx: 268, label: "For", coins: 7 },
  { cx: 296, label: "Against", coins: 1 },
];
const TUBE = { cy: 90, r: 9, z: BALLOT.z + BALLOT.h, h: 46, coin: 5 };
const QUORUM = 4; // coins: where the quorum line sits (illustrative)
const CABINET: Box = { x: 370, y: 66, z: Z, w: 54, d: 46, h: 40 };

const VIEW = bounds([...roundRect(PLATE.x, PLATE.y, PLATE.w, PLATE.d, PLATE.r, 0), ...Object.values(faces(BEAM)).flat()], 14);

const dwell = (i: number) => [2400, 2600, 3200, 2800][i];
const at = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });
const plaque = (x: number, y: number, w: number, d: number) => roundRect(x, y, w, d, 2, Z);
const lit = (on: boolean, delay?: number) => (on && delay != null ? { className: css.lampOn, style: at(delay) } : {});
const LEAF = "rgb(var(--leaf))";
const GOLD = { top: "rgb(var(--sand) / 0.22)", side: "rgb(var(--sand) / 0.55)" };

const SCENES = [
  "Step 1 of 4, Propose. A proposal card prints out of the Aragon OSx slot and is hooked onto the overhead rail.",
  "Step 2 of 4, Discuss. It hangs over the public board while its three lamps light: Discord, Telegram and the forum.",
  "Step 3 of 4, Vote. $BLOKC votes drop in as coins; the For tube fills past the quorum line, the Against tube stays low.",
  "Step 4 of 4, Execute. The passed proposal drops into the protocol's registry cabinet, and its lamp lights. No admin override.",
];

export function ProposalMachine({ stages, className }: { stages: Stage[]; className?: string }) {
  const steps: FigureStep[] = stages.map((s, i) => ({
    tab: s.label,
    scene: SCENES[i] ?? `${s.label}: ${s.detail}`,
    readout: `${s.label.toLowerCase()} · ${s.detail.replace(/\.$/, "")}`,
  }));
  return (
    <MachineFigure
      n={4}
      title="The proposal rail"
      steps={steps}
      dwell={dwell}
      view={VIEW}
      className={className}
      caption="How a decision is made, as a machine. The stages are the ones the DAO runs on Aragon OSx; the vote counts are illustrative."
    >
      {({ step, k, uid }) => {
        const full = `${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`;
        const h = hang(step);
        const from: V3 = step === 0 ? [0, 0, 0] : [STATIONS[step - 1] - STATIONS[step], 0, 0];
        return (
          <>
            {/* The plate and the stations under the rail. */}
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
              {Array.from({ length: 52 }, (_, i) => 24 + i * 8).map((x, i) => {
                const [a, b] = [project([x, i % 5 ? 162 : 158, Z]), project([x, 166, Z])];
                return <line key={x} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={INK} strokeWidth={0.6} />;
              })}
              <Part box={POST_L} />

              {/* Propose: the printer and its slot. */}
              <Part box={PRINTER} />
              <Flat
                points={[
                  project([PRINTER.x + 8, 82, PRINTER.z + PRINTER.h]),
                  project([PRINTER.x + 36, 82, PRINTER.z + PRINTER.h]),
                  project([PRINTER.x + 36, 85, PRINTER.z + PRINTER.h]),
                  project([PRINTER.x + 8, 85, PRINTER.z + PRINTER.h]),
                ]}
                fill="rgb(var(--line) / 0.55)"
              />
              <OnFace face="left" at={project([PRINTER.x, PRINTER.y + PRINTER.d, PRINTER.z + PRINTER.h])}>
                <Engrave u={22} v={14} size={5} anchor="middle">
                  Aragon OSx
                </Engrave>
              </OnFace>

              {/* Discuss: the public board. */}
              <Part box={BOARD} />
              <OnFace face="left" at={project([BOARD.x, BOARD.y + BOARD.d, BOARD.z + BOARD.h])}>
                {["Discord", "Telegram", "Forum"].map((name, i) => (
                  <g key={name}>
                    <circle cx={8} cy={10 + i * 12} r={3.2} fill="rgb(var(--plate-l))" stroke={INK} strokeWidth={0.6} />
                    <Engrave u={14} v={12 + i * 12} size={4.6}>
                      {name}
                    </Engrave>
                  </g>
                ))}
              </OnFace>

              {/* Vote: the ballot base, its two tubes' sockets and the quorum mark. */}
              <Part box={BALLOT} />
              <OnFace face="left" at={project([BALLOT.x, BALLOT.y + BALLOT.d, BALLOT.z + BALLOT.h])}>
                <Engrave u={30} v={11} size={5} anchor="middle">
                  $BLOKC vote
                </Engrave>
              </OnFace>

              {/* Execute: the registry cabinet and its slot. */}
              <Part box={CABINET} />
              <Flat
                points={[
                  project([CABINET.x + 12, 88, CABINET.z + CABINET.h]),
                  project([CABINET.x + 42, 88, CABINET.z + CABINET.h]),
                  project([CABINET.x + 42, 91, CABINET.z + CABINET.h]),
                  project([CABINET.x + 12, 91, CABINET.z + CABINET.h]),
                ]}
                fill="rgb(var(--line) / 0.55)"
              />
              <OnFace face="left" at={project([CABINET.x, CABINET.y + CABINET.d, CABINET.z + CABINET.h])}>
                {[0, 1, 2, 3].map((i) => (
                  <rect key={i} x={6 + i * 11.5} y={8} width={9} height={14} fill="rgb(var(--card))" stroke={INK} strokeWidth={0.6} />
                ))}
                <Engrave u={27} v={32} size={4.8} anchor="middle">
                  Protocol · facets
                </Engrave>
              </OnFace>

              {/* Plaques along the front. */}
              {stages.map((s, i) => (
                <g key={s.label}>
                  <Flat points={plaque(STATIONS[i] - 20, 132, 42, 10)} fill="rgb(var(--plate-l))" />
                  <OnFace face="top" at={project([STATIONS[i] - 20, 132, Z])}>
                    <Engrave u={4} v={7.4} size={5.4}>
                      {`0${i + 1} ${s.label}`}
                    </Engrave>
                  </OnFace>
                </g>
              ))}
            </svg>

            {/* Vote: the coins in the tubes (behind the glass), dropping in on the vote step. */}
            <Layer key={`coins-${k}`} view={VIEW} rect={VIEW}>
              {step >= 2 &&
                TUBES.flatMap((t, ti) =>
                  Array.from({ length: t.coins }, (_, i) => (
                    <g
                      key={`${t.label}${i}`}
                      className={step === 2 ? css.drop : undefined}
                      style={
                        step === 2
                          ? ({ "--h": "-46px", animationDelay: `${300 + (ti === 0 ? i * 150 : 600)}ms` } as CSSProperties)
                          : undefined
                      }
                    >
                      <Cyl cx={t.cx} cy={TUBE.cy} z={TUBE.z + i * TUBE.coin} r={TUBE.r - 2} h={TUBE.coin} top={GOLD.top} side={GOLD.side} />
                    </g>
                  )),
                )}
            </Layer>

            {/* The glass tubes, the quorum line and the tube labels. */}
            <svg aria-hidden viewBox={full} className="absolute inset-0 size-full overflow-visible">
              {TUBES.map((t) => {
                const b = project([t.cx, TUBE.cy, TUBE.z]);
                const top = project([t.cx, TUBE.cy, TUBE.z + TUBE.h]);
                const rx = TUBE.r * Math.SQRT2;
                const ry = rx / 2;
                const q = project([t.cx, TUBE.cy, TUBE.z + QUORUM * TUBE.coin]);
                return (
                  <g key={t.label}>
                    <path
                      d={`M ${b[0] - rx} ${b[1]} A ${rx} ${ry} 0 0 0 ${b[0] + rx} ${b[1]} L ${top[0] + rx} ${top[1]} A ${rx} ${ry} 0 0 0 ${top[0] - rx} ${top[1]} Z`}
                      fill="rgb(var(--card) / 0.3)"
                      stroke={INK}
                      strokeWidth={0.8}
                    />
                    <ellipse cx={top[0]} cy={top[1]} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth={0.8} />
                    {/* The quorum line. */}
                    <path
                      d={`M ${q[0] - rx} ${q[1]} A ${rx} ${ry} 0 0 0 ${q[0] + rx} ${q[1]}`}
                      fill="none"
                      stroke="rgb(var(--danger) / 0.7)"
                      strokeWidth={1}
                      strokeDasharray="2 2"
                    />
                    <OnFace face="top" at={project([t.cx - 9, TUBE.cy + 16, BALLOT.z + BALLOT.h])}>
                      <Engrave u={0} v={0} size={4.4}>
                        {t.label}
                      </Engrave>
                    </OnFace>
                  </g>
                );
              })}
            </svg>

            {/* The proposal: on its trolley, from the last station (prints up at Propose, drops in at Execute). */}
            <Layer
              key={`card-${k}`}
              view={VIEW}
              rect={bounds([...Object.values(faces(h.trolley)).flat(), ...Object.values(faces(h.card)).flat()], 4)}
              motion={step === 0 ? undefined : { anim: "hop", from, via: [from[0] / 2, 0, 0], dur: 700 }}
            >
              <Part box={h.trolley} />
              <line
                x1={project([STATIONS[step], 54, RAIL_Z - 7])[0]}
                y1={project([STATIONS[step], 54, RAIL_Z - 7])[1]}
                x2={project([STATIONS[step], 54, CARD.z + CARD.h])[0]}
                y2={project([STATIONS[step], 54, CARD.z + CARD.h])[1]}
                stroke={INK}
                strokeWidth={0.9}
              />
              <g
                className={step === 0 ? css.hop : step === 3 ? css.exit : undefined}
                style={
                  step === 0
                    ? ({ "--fx": "0px", "--fy": "30px", "--mx": "0px", "--my": "15px", "--dur": "650ms" } as CSSProperties)
                    : step === 3
                      ? ({ "--tx": "0px", "--ty": "34px", "--dur": "700ms", animationDelay: "800ms" } as CSSProperties)
                      : undefined
                }
              >
                <Part box={h.card} />
                <OnFace face="left" at={project([h.card.x, h.card.y + h.card.d, h.card.z + h.card.h])}>
                  <rect x={0} y={0} width={CARD.w} height={4} fill={LEAF} />
                  {[0, 1, 2].map((i) => (
                    <line key={i} x1={3} y1={8 + i * 3.5} x2={[22, 18, 20][i]} y2={8 + i * 3.5} stroke={INK} strokeWidth={0.7} />
                  ))}
                </OnFace>
              </g>
            </Layer>

            {/* The rail over everything, and what lights. */}
            <svg aria-hidden viewBox={full} className="absolute inset-0 size-full overflow-visible">
              <Part box={BEAM} />
              <Part box={POST_R} />
            </svg>
            <Layer key={`lamps-${k}`} view={VIEW} rect={VIEW}>
              {/* Discuss: the board's three lamps, in turn (drawn on the board's face, over the unlit ones). */}
              {step >= 1 && (
                <OnFace face="left" at={project([BOARD.x, BOARD.y + BOARD.d, BOARD.z + BOARD.h])}>
                  {[0, 1, 2].map((i) => (
                    <circle key={i} cx={8} cy={10 + i * 12} r={3.2} fill={LEAF} {...lit(true, step === 1 ? 700 + i * 220 : undefined)} />
                  ))}
                </OnFace>
              )}
              {/* Execute: the cabinet's lamp. */}
              {step === 3 && (
                <g className={css.lampOn} style={at(1400)}>
                  <Cyl cx={CABINET.x + 46} cy={CABINET.y + 8} z={CABINET.z + CABINET.h} r={3.4} h={3} top={LEAF} side={LEAF} />
                </g>
              )}
            </Layer>
          </>
        );
      }}
    </MachineFigure>
  );
}
