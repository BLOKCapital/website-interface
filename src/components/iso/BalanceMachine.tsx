"use client";

import type { CSSProperties, ReactNode } from "react";
import { type Pt, bounds, project, roundRect } from "./geometry";
import { Layer } from "./Iso";
import { type FigureStep, MachineFigure } from "./MachineFigure";
import { Cyl, Engrave, INK, OnFace, Part, Screw, Slab } from "./machine";
import { Coin, Coins } from "./coins";
import css from "./iso.module.css";

/*
 * Fig. 6, BLOKC2 as a balance: Bitcoin on the left pan, Ether on the right,
 * on one beam set straight across the view, its pivot off-centre so the two
 * hang level at their target weights (market-cap weights are unequal, so the
 * arms are too). A dashed line marks level: the target. Both tokens move on
 * every pass, and each pass the other way round:
 * 1 Prices move: one runs ahead (a coin's worth lands on its pan) while the
 *   other falls behind (a coin's worth goes). The beam tips past the 2% band
 *   and the lamp turns amber.
 * 2 Rebalance: one coin hops from the heavy pan to the light one, changing
 *   token mid-air (one pooled trade), and the beam levels.
 * Each pass ends where the next begins: level, 5 BTC and 3 ETH.
 * Illustrative: the coin counts are made up; the 2% band is the contracts'.
 */

const Z = 10;
const PLATE = { x: 0, y: 0, w: 230, d: 230, h: Z, r: 16 };
/** The pivot, in the middle of the plate. */
const P = { x: 115, y: 115 };
const POST = { x: P.x - 8, y: P.y - 8, z: Z, w: 16, d: 16, h: 76 };
const BEAM_Z = POST.z + POST.h + 6;
/**
 * The beam runs along scene (−1, 1) to Bitcoin and (1, −1) to Ether: straight
 * left and right on screen (one unit along it is 2 screen units). Ether's arm
 * is twice Bitcoin's.
 */
const ARM = { btc: 40, eth: 80 };
const END = { btc: { x: P.x - ARM.btc, y: P.y + ARM.btc }, eth: { x: P.x + ARM.eth, y: P.y - ARM.eth } };
// The pans hang 50 below the beam: the tallest stack (6 coins) stays 14 under it, and a pan tipped down stays clear of the plate.
const PAN = { r: 30, h: 3, z: BEAM_Z - 50 };
const COIN = { r: 13, h: 5.5 };
const BASE = PAN.z + PAN.h;
const N = { btc: 5, eth: 3 };
/** How far the Bitcoin end moves when the beam tips (screen units); the Ether end, on an arm twice as long, twice as far. */
const TIP = 14;
const SKEW = (Math.atan(TIP / (2 * ARM.btc)) * 180) / Math.PI;

const pivot = project([P.x, P.y, BEAM_Z]);
const beam = (deg: number) => `translate(${pivot[0]}px, ${pivot[1]}px) skewY(${deg}deg) translate(${-pivot[0]}px, ${-pivot[1]}px)`;
const lift = (dy: number) => `translate(0px, ${dy}px)`;
/** The three poses: level, Bitcoin down (its price ran ahead), Bitcoin up (its price fell). */
const POSE = {
  level: { beam: beam(0), btc: lift(0), eth: lift(0) },
  btcDown: { beam: beam(-SKEW), btc: lift(TIP), eth: lift(-2 * TIP) },
  btcUp: { beam: beam(SKEW), btc: lift(-TIP), eth: lift(2 * TIP) },
};
type Pose = keyof typeof POSE;
/** Where each pan sits in a pose, as a screen offset. */
const OFFSET: Record<Pose, { btc: number; eth: number }> = {
  level: { btc: 0, eth: 0 },
  btcDown: { btc: TIP, eth: -2 * TIP },
  btcUp: { btc: -TIP, eth: 2 * TIP },
};
type Side = "btc" | "eth";
const SYMBOL = { btc: "BTC", eth: "ETH" } as const;
/** Each pass, which token runs ahead (up) and which falls behind (down); they take turns. */
const PASSES: { up: Side; down: Side }[] = [
  { up: "btc", down: "eth" },
  { up: "eth", down: "btc" },
];
/** The pose a pass tips to: the heavy (up) side down. */
const tipped = (up: Side): Pose => (up === "btc" ? "btcDown" : "btcUp");

const VIEW = bounds(
  [
    ...roundRect(PLATE.x, PLATE.y, PLATE.w, PLATE.d, PLATE.r, 0),
    project([END.eth.x, END.eth.y, BEAM_Z + 2 * TIP + 8]),
    project([END.btc.x, END.btc.y, BEAM_Z + TIP + 8]),
    project([P.x, P.y, BASE + 6 * COIN.h + 40]),
  ],
  14,
);

const STEPS: FigureStep[] = [
  {
    tab: "Prices move",
    readout: (lap) => {
      const { up, down } = PASSES[lap % PASSES.length];
      return `${SYMBOL[up]} price up · ${SYMBOL[down]} price down · past the 2% band`;
    },
    scene: (lap) => {
      const { up, down } = PASSES[lap % PASSES.length];
      return `Step 1 of 2, Prices move. ${SYMBOL[up]}'s price runs ahead and its pan gets heavier, while ${SYMBOL[down]}'s falls behind and its pan gets lighter. The beam tips past the 2% band and the lamp turns amber.`;
    },
  },
  {
    tab: "Rebalance",
    readout: (lap) => {
      const { up, down } = PASSES[lap % PASSES.length];
      return `one pooled trade · ${SYMBOL[up]} → ${SYMBOL[down]} · level`;
    },
    scene: (lap) => {
      const { up, down } = PASSES[lap % PASSES.length];
      return `Step 2 of 2, Rebalance. One coin moves from the ${SYMBOL[up]} pan to the ${SYMBOL[down]} pan, turning into ${SYMBOL[down]} on the way: one pooled trade. The beam is level again.`;
    },
  },
];
const dwell = (i: number) => [2000, 2200][i];

const line = (a: Pt, b: Pt) => ({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] });
const LEAF = "rgb(var(--leaf))";
const AMBER = "rgb(var(--caution))";
/** The band lamp, on its stand beside the post. */
const LAMP = { x: P.x + 30, y: P.y + 6, h: 20 };
const lamp = (color: string) => <Cyl cx={LAMP.x} cy={LAMP.y} z={Z + LAMP.h} r={4.6} h={3} top={color} side={color} />;

/** One pan: its chains up to the beam's end, the pan, and what's on it. */
function Pan({ end, children }: { end: { x: number; y: number }; children?: ReactNode }) {
  const top = project([end.x, end.y, BEAM_Z]);
  return (
    <g>
      {/* Chains to the pan's back and to its two sides as seen, so they frame the stack. */}
      {[-135, -45, 135].map((a) => {
        const rad = (a * Math.PI) / 180;
        return <line key={a} {...line(top, project([end.x + PAN.r * Math.cos(rad), end.y + PAN.r * Math.sin(rad), BASE]))} stroke={INK} strokeWidth={1} />;
      })}
      <Cyl cx={end.x} cy={end.y} z={PAN.z} r={PAN.r} h={PAN.h} />
      {children}
    </g>
  );
}

/** A coin's place on a pan in a pose, on screen. */
const spot = (side: Side, i: number, pose: Pose): Pt => {
  const p = project([END[side].x, END[side].y, BASE + i * COIN.h]);
  return [p[0], p[1] + OFFSET[pose][side]];
};
/** The hop for a coin landing at `land`, from `from` (both on screen, with their pans' tilt). */
function hopFrom(from: Pt, land: Pt): CSSProperties {
  const [fx, fy] = [from[0] - land[0], from[1] - land[1]];
  // --delay is reset: the pan around it sets its own, which would otherwise hold the hop back.
  return { "--fx": `${fx}px`, "--fy": `${fy}px`, "--mx": `${fx / 2}px`, "--my": `${Math.min(fy, 0) / 2 - 30}px`, "--dur": "620ms", "--delay": "0ms" } as CSSProperties;
}

export function BalanceMachine({ className }: { className?: string }) {
  return (
    <MachineFigure
      n={6}
      title="BLOKC2 · the balance"
      steps={STEPS}
      dwell={dwell}
      view={VIEW}
      className={className}
      caption="BLOKC2 as a balance: Bitcoin and Ether take turns running ahead, and each time one pooled trade brings the two back to target. Illustrative: the coin counts are made up; the 2% band is the contracts'."
    >
      {({ step, lap, k, uid }) => {
        const { up } = PASSES[lap % PASSES.length];
        const tilt = tipped(up);
        // Step 1 tips from level once the prices have moved; step 2 levels once the coin has landed.
        const m = step === 0 ? { from: "level" as Pose, to: tilt, delay: 380 } : { from: tilt, to: "level" as Pose, delay: 620 };
        const tween = (part: "beam" | Side) => ({
          className: css.tipIn,
          style: { "--level": POSE[m.from][part], "--tilt": POSE[m.to][part], "--delay": `${m.delay}ms` } as CSSProperties,
        });
        // Past the band once the prices move; back on target once the trade lands.
        const amber = step === 0;
        const level = project([END.eth.x + 30, END.eth.y - 30, BEAM_Z]);
        /** One pan's coins this step: what stays put, and the coin that moves (drawn on its own). */
        const pan = (side: Side) => {
          const n = N[side];
          const coin = (i: number, symbol: "BTC" | "ETH", extra?: { className?: string; style?: CSSProperties }) => (
            <Coin cx={END[side].x} cy={END[side].y} z={BASE + i * COIN.h} r={COIN.r} h={COIN.h} symbol={symbol} face {...extra} />
          );
          const stack = (count: number) => <Coins cx={END[side].x} cy={END[side].y} z={BASE} n={count} r={COIN.r} h={COIN.h} symbol={SYMBOL[side]} />;
          if (side === up) {
            return step === 0 ? (
              <>
                {stack(n)}
                {/* Its price runs ahead: a coin's worth lands. */}
                <g className={css.drop} style={{ "--h": "-18px" } as CSSProperties}>
                  {coin(n, SYMBOL[side])}
                </g>
              </>
            ) : (
              // The extra coin is the one hopping across (drawn on the other pan).
              stack(n)
            );
          }
          return step === 0 ? (
            <>
              {stack(n - 1)}
              {/* Its price falls behind: a coin's worth goes. */}
              {coin(n - 1, SYMBOL[side], { className: css.fadeOut, style: { animationDelay: "160ms" } })}
            </>
          ) : (
            <>
              {stack(n - 1)}
              {/* The trade: the heavy pan's extra coin lands here, turning into this token on the way. */}
              <g className={css.hop} style={hopFrom(spot(up, N[up], tilt), spot(side, n - 1, tilt))}>
                {coin(n - 1, SYMBOL[side], { className: css.lampOn, style: { animationDelay: "310ms" } })}
                {coin(n - 1, SYMBOL[up], { className: css.fadeOut, style: { animationDelay: "310ms" } })}
              </g>
            </>
          );
        };
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

              {/* What hangs on each side, engraved on the plate in front of it. */}
              <OnFace face="top" at={project([82, 197, Z])}>
                <Engrave u={0} v={0} size={6.5}>
                  BTC · Bitcoin
                </Engrave>
              </OnFace>
              <OnFace face="top" at={project([175, 105, Z])}>
                <Engrave u={0} v={0} size={6.5}>
                  ETH · Ether
                </Engrave>
              </OnFace>

              {/* The post, and where level is: the target. */}
              <Part box={POST} />
              <OnFace face="left" at={project([POST.x, POST.y + POST.d, POST.z + POST.h])}>
                <g transform="translate(9.5 40) rotate(-90)">
                  <Engrave u={0} v={0} size={6.2} anchor="middle">
                    BLOKC2
                  </Engrave>
                </g>
              </OnFace>
              <line {...line(project([END.btc.x - 6, END.btc.y + 6, BEAM_Z]), level)} stroke="rgb(var(--cobalt) / 0.55)" strokeWidth={1} strokeDasharray="3 4" />
              {/* Its label at the far end, past Ether's pan, so a pan never covers it. */}
              <g transform={`translate(${level[0]} ${level[1] - 4})`}>
                <Engrave u={0} v={0} size={6.4} anchor="end">
                  level
                </Engrave>
              </g>

              {/* The band lamp: green on target, amber past the band. */}
              <Cyl cx={LAMP.x} cy={LAMP.y} z={Z} r={2} h={LAMP.h} />
              {lamp(LEAF)}
            </svg>

            {/* The moving parts, re-keyed every step; each step starts in the pose the last one ended in. */}
            <Layer key={`parts-${k}`} view={VIEW} rect={VIEW}>
              <g className={amber ? css.lampOn : css.fadeOut} style={{ animationDelay: `${amber ? 420 : 640}ms` }}>
                {lamp(AMBER)}
              </g>

              {/* The beam: a bar straight across, on its pivot. */}
              <g {...tween("beam")}>
                {[INK, "rgb(var(--card))"].map((stroke, i) => (
                  <line
                    key={stroke}
                    {...line(project([END.btc.x - 4, END.btc.y + 4, BEAM_Z]), project([END.eth.x + 4, END.eth.y - 4, BEAM_Z]))}
                    stroke={stroke}
                    strokeWidth={i ? 4.6 : 6.4}
                    strokeLinecap="round"
                  />
                ))}
                <circle cx={pivot[0]} cy={pivot[1]} r={2.6} fill="rgb(var(--card))" stroke={INK} strokeWidth={0.8} />
              </g>

              {/* The two pans, each moving with its end of the beam. */}
              <g {...tween("btc")}>
                <Pan end={END.btc}>{pan("btc")}</Pan>
              </g>
              <g {...tween("eth")}>
                <Pan end={END.eth}>{pan("eth")}</Pan>
              </g>
            </Layer>
          </>
        );
      }}
    </MachineFigure>
  );
}
