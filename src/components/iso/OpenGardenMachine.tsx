import type { CSSProperties } from "react";
import { type Box, bounds, project, roundRect } from "./geometry";
import { IsoScene, Layer } from "./Iso";
import { CoinFace, Cyl, Engrave, Flat, INK, OnFace, Part, Screw, Slab } from "./machine";
import css from "./iso.module.css";
import { TokenStack } from "@/components/indices/TokenLogo";
import { indices, type ComponentSymbol } from "@/lib/data/indices";
import { cn } from "@/lib/utils";

/*
 * Fig. 5, how a Garden starts, as a machine, for the home "How it works"
 * scroller (which drives `stage` as its three steps scroll past):
 * 0 Open: the Garden factory stamps out your Garden at your address, and the
 *   ownership NFT lights beside your Google sign-in key.
 * 1 Fund: the on-ramp kiosk (card or bank) drops USDC into it.
 * 2 Strategy: a BLOKC5 cartridge docks, and the USDC becomes the index's five
 *   tokens, each stack with its token's logo on top; the caption names them.
 * No tabs of its own: the scroller is the control. Illustrative: no real amounts.
 */

export type GardenStage = 0 | 1 | 2;

const Z = 10;
const PLATE = { x: 0, y: 0, w: 300, d: 210, h: Z, r: 14 };
const TRAY = { x: 104, y: 72, w: 128, d: 92, h: 8, r: 8 };
const TOP = Z + TRAY.h;
const FACTORY: Box = { x: 18, y: 18, z: Z, w: 62, d: 50, h: 46 };
const KIOSK: Box = { x: 16, y: 148, z: Z, w: 46, d: 42, h: 42 };
const STAND: Box = { x: 96, y: 10, z: Z, w: 44, d: 36, h: 8 };
const KEY: Box = { x: 108, y: 24, z: Z + 8, w: 16, d: 3, h: 24 };
// The cartridge docks against the Garden's back edge, right of the "You · Google"
// plaque (at x 150 it covered "Google").
const CART: Box = { x: 172, y: 52, z: Z, w: 40, d: 16, h: 18 };

// USDC first, then BLOKC5's five tokens (the app's token colours; PENDLE its grey).
const USDC = { x: 150, y: 118, coins: 6, color: "#2775CA" };
const BASKET = indices.find((i) => i.id === "blokc5")!.components;
const TOKENS: { symbol: ComponentSymbol; x: number; y: number; n: number; color: string }[] = [
  // Set back from the tray's front edge, so none sits on "Your Garden · 0x…" engraved there.
  { symbol: "LINK", x: 126, y: 90, n: 3, color: "#2A5ADA" },
  { symbol: "UNI", x: 160, y: 90, n: 2, color: "#FF007A" },
  { symbol: "AAVE", x: 126, y: 122, n: 2, color: "#2EBAC6" },
  { symbol: "ARB", x: 160, y: 122, n: 2, color: "#28A0F0" },
  { symbol: "PENDLE", x: 143, y: 140, n: 1, color: "#71717A" },
];
const COIN = { r: 10, h: 4.5 };

const VIEW = bounds(
  [...roundRect(PLATE.x, PLATE.y, PLATE.w, PLATE.d, PLATE.r, 0), project([FACTORY.x, FACTORY.y, FACTORY.z + FACTORY.h + 12])],
  12,
);
const at = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });
const plaque = (x: number, y: number, w: number, d: number) => roundRect(x, y, w, d, 2, Z);
const coinTint = (hex: string) => ({ top: `${hex}40`, side: `${hex}b3` });
const LEAF = "rgb(var(--leaf))";

const LABEL = [
  "Illustration, step 1, Open a Garden: the Garden factory stamps out your Garden at your own address, and the ownership NFT lights beside your Google sign-in key.",
  "Illustration, step 2, Fund it: the on-ramp kiosk, card or bank, drops USDC into your Garden.",
  "Illustration, step 3, Choose a strategy: a BLOKC5 cartridge docks on your Garden, and the USDC becomes the index's five tokens.",
];

export function OpenGardenMachine({
  stage,
  animate = true,
  steadyCaption = false,
  className,
}: {
  stage: GardenStage;
  animate?: boolean;
  /** Keep room for step 3's token line at every step, so a looping figure doesn't change height. */
  steadyCaption?: boolean;
  className?: string;
}) {
  const full = `${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`;
  const k = `s${stage}`;
  // Motion only on the step that's just arrived, and only when asked to animate.
  const play = (s: GardenStage) => animate && stage === s;
  return (
    <figure className={className}>
      <IsoScene view={VIEW} label={LABEL[stage]}>
        <svg aria-hidden viewBox={full} className="absolute inset-0 size-full overflow-visible">
          <Slab id={`og-plate`} {...PLATE} />
          {[
            [12, 12],
            [PLATE.w - 12, 12],
            [PLATE.w - 12, PLATE.d - 12],
            [12, PLATE.d - 12],
          ].map(([x, y]) => (
            <Screw key={`${x}-${y}`} cx={x} cy={y} z={Z} />
          ))}

          {/* The Garden factory. */}
          <Part box={FACTORY} />
          <OnFace face="left" at={project([FACTORY.x, FACTORY.y + FACTORY.d, FACTORY.z + FACTORY.h])}>
            <Engrave u={31} v={16} size={5.2} anchor="middle">
              Garden factory
            </Engrave>
            <Engrave u={31} v={24} size={4.4} anchor="middle">
              CREATE2
            </Engrave>
          </OnFace>

          {/* The on-ramp kiosk and its screen. */}
          <Part box={KIOSK} />
          <OnFace face="left" at={project([KIOSK.x, KIOSK.y + KIOSK.d, KIOSK.z + KIOSK.h])}>
            <rect x={6} y={5} width={34} height={14} fill="rgb(var(--plate-r))" stroke={INK} strokeWidth={0.6} />
            <Engrave u={23} v={14.5} size={5} anchor="middle">
              USDC
            </Engrave>
            <Engrave u={23} v={30} size={4.4} anchor="middle">
              Card · bank
            </Engrave>
          </OnFace>

          {/* Your key, on its stand. */}
          <Part box={STAND} />
          <Part
            box={KEY}
            tint={{ top: "rgb(var(--leaf) / 0.35)", left: "rgb(var(--leaf) / 0.22)", right: "rgb(var(--leaf-deep) / 0.6)" }}
          />
          <OnFace face="left" at={project([KEY.x, KEY.y + KEY.d, KEY.z + KEY.h])}>
            <Engrave u={8} v={14} size={7} anchor="middle">
              G
            </Engrave>
          </OnFace>
          <Flat points={plaque(94, 50, 56, 9)} fill="rgb(var(--plate-l))" />
          <OnFace face="top" at={project([94, 50, Z])}>
            <Engrave u={4} v={6.6} size={5}>
              You · Google
            </Engrave>
          </OnFace>
        </svg>

        {/* The strategy cartridge, docking at step 3 against the Garden's back edge (drawn first: it's behind it). */}
        {stage === 2 && (
          <Layer key={`cart-${k}`} view={VIEW} rect={VIEW}>
            <g
              className={animate ? css.hop : undefined}
              style={
                animate
                  ? ({ "--fx": "24px", "--fy": "-12px", "--mx": "12px", "--my": "-10px", "--dur": "600ms" } as CSSProperties)
                  : undefined
              }
            >
              <Part
                box={CART}
                tint={{ top: "rgb(var(--cobalt) / 0.2)", left: "rgb(var(--cobalt) / 0.35)", right: "rgb(var(--cobalt) / 0.55)" }}
              />
              <OnFace face="left" at={project([CART.x, CART.y + CART.d, CART.z + CART.h])}>
                <Engrave u={20} v={11} size={5} anchor="middle">
                  BLOKC5
                </Engrave>
              </OnFace>
            </g>
          </Layer>
        )}

        {/* The Garden: stamped out at step 1. */}
        <Layer key={`tray-${k}`} view={VIEW} rect={VIEW}>
          <g
            className={play(0) ? css.drop : undefined}
            style={play(0) ? ({ "--h": "-36px", animationDelay: "350ms" } as CSSProperties) : undefined}
          >
            <Slab id="og-tray" {...TRAY} z={Z} />
            <OnFace face="top" at={project([TRAY.x, TRAY.y, TOP])}>
              <Engrave u={8} v={TRAY.d - 8} size={5.2}>
                Your Garden · 0x7a3c…f1c2
              </Engrave>
            </OnFace>
          </g>
        </Layer>

        {/* What's in it: USDC (step 2), then the index's tokens (step 3). */}
        <Layer key={`coins-${k}`} view={VIEW} rect={VIEW}>
          {stage >= 1 &&
            Array.from({ length: USDC.coins }, (_, i) => (
              <g
                key={`u${i}`}
                className={play(1) ? css.drop : play(2) ? css.fadeOut : undefined}
                style={
                  play(1) ? ({ "--h": "-60px", animationDelay: `${250 + i * 120}ms` } as CSSProperties) : play(2) ? at(700) : undefined
                }
              >
                {stage === 1 || play(2) ? (
                  <Cyl cx={USDC.x} cy={USDC.y} z={TOP + i * COIN.h} r={COIN.r} h={COIN.h} {...coinTint(USDC.color)} />
                ) : null}
              </g>
            ))}
          {stage === 2 &&
            TOKENS.map((t, ti) =>
              Array.from({ length: t.n }, (_, i) => (
                <g key={`${ti}-${i}`} className={play(2) ? css.lampOn : undefined} style={play(2) ? at(800 + ti * 90) : undefined}>
                  <Cyl cx={t.x} cy={t.y} z={TOP + i * COIN.h} r={COIN.r - 2} h={COIN.h} {...coinTint(t.color)} />
                  {i === t.n - 1 && <CoinFace cx={t.x} cy={t.y} z={TOP + (i + 1) * COIN.h} r={COIN.r - 2} symbol={t.symbol} />}
                </g>
              )),
            )}
        </Layer>

        {/* Lamps: the factory (step 1), the NFT by your key (step 1 on), the kiosk (step 2). */}
        <Layer key={`lamps-${k}`} view={VIEW} rect={VIEW}>
          <g className={play(0) ? css.lampOn : undefined} style={play(0) ? at(150) : undefined}>
            <Cyl cx={FACTORY.x + 50} cy={FACTORY.y + 10} z={FACTORY.z + FACTORY.h} r={3.4} h={3} top={LEAF} side={LEAF} />
          </g>
          <g className={play(0) ? css.lampOn : undefined} style={play(0) ? at(900) : undefined}>
            <Cyl cx={STAND.x + 34} cy={STAND.y + 10} z={STAND.z + STAND.h} r={6} h={3} top="rgb(var(--leaf) / 0.6)" side={LEAF} />
          </g>
          {stage >= 1 && (
            <g className={play(1) ? css.lampOn : undefined} style={play(1) ? at(100) : undefined}>
              <Cyl cx={KIOSK.x + 36} cy={KIOSK.y + 10} z={KIOSK.z + KIOSK.h} r={3.4} h={3} top={LEAF} side={LEAF} />
            </g>
          )}
        </Layer>
      </IsoScene>
      <figcaption className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 font-mono text-label text-fg-subtle">
        {/* At step 3, which tokens the stacks are. */}
        {(stage === 2 || steadyCaption) && (
          <span aria-hidden={stage !== 2 || undefined} className={cn("inline-flex items-center gap-2 text-fg-muted", stage !== 2 && "invisible")}>
            <TokenStack symbols={BASKET} size={18} />
            <span>
              <span className="text-cobalt">BLOKC5</span> · {BASKET.join(" · ")}
            </span>
          </span>
        )}
        <span>Illustration · no real amounts</span>
      </figcaption>
    </figure>
  );
}
