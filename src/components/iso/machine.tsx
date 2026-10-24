import type { ReactNode } from "react";
import { components, type ComponentSymbol } from "@/lib/data/indices";
import { type Box, type Pt, faces, hull, isoCircle, onFace, project, pts, roundRect } from "./geometry";

/**
 * The drawing kit for the protocol figures: technical drawings of small
 * machines on a mounting plate, in ink on paper. Parts are paper-white with
 * three shades (top, front left, front right) and a fine ink outline;
 * labels are engraved on the parts they name. Colour is kept for meaning:
 * a lit LED, a lamp, the gold of a coin. Every value is a design token, so a
 * figure works in the light page and in a Night-garden band.
 */

export const INK = "rgb(var(--line) / 0.55)";
const INK_TEXT = "rgb(var(--line) / 0.72)";
const W = 0.8; // outline width, in scene units

type Fill = { top?: string; left?: string; right?: string };
const PAPER = { top: "rgb(var(--card))", left: "rgb(var(--plate-l))", right: "rgb(var(--plate-r))" };

/** A box: three faces, each an opaque paper base with an optional tint over it. */
export function Part({ box, tint, stroke = INK }: { box: Box; tint?: Fill; stroke?: string }) {
  const f = faces(box);
  return (
    <g strokeLinejoin="round">
      {(["left", "right", "top"] as const).map((k) => (
        <g key={k}>
          <polygon points={pts(f[k])} fill={PAPER[k]} />
          {tint?.[k] && <polygon points={pts(f[k])} fill={tint[k]} />}
          <polygon points={pts(f[k])} fill="none" stroke={stroke} strokeWidth={W} />
        </g>
      ))}
    </g>
  );
}

/**
 * A rounded slab (the mounting plate, a tray): its extruded outline filled as
 * the sides, split at the front corner into the two side shades, then the
 * top. `id` keeps the clip paths unique on the page.
 */
export function Slab({
  id,
  x,
  y,
  w,
  d,
  h,
  r,
  z = 0,
}: {
  id: string;
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  r: number;
  z?: number;
}) {
  const top = roundRect(x, y, w, d, r, z + h);
  const bottom = roundRect(x, y, w, d, r, z);
  const sides = hull([...top, ...bottom]);
  const front = project([x + w, y + d, z])[0]; // the front corner's screen x
  const ys = sides.map((p) => p[1]);
  const [minY, maxY] = [Math.min(...ys) - 2, Math.max(...ys) + 2];
  const xs = sides.map((p) => p[0]);
  const [minX, maxX] = [Math.min(...xs) - 2, Math.max(...xs) + 2];
  return (
    <g strokeLinejoin="round">
      <clipPath id={`${id}-l`}>
        <rect x={minX} y={minY} width={front - minX} height={maxY - minY} />
      </clipPath>
      <clipPath id={`${id}-r`}>
        <rect x={front} y={minY} width={maxX - front} height={maxY - minY} />
      </clipPath>
      <polygon points={pts(sides)} fill={PAPER.left} clipPath={`url(#${id}-l)`} />
      <polygon points={pts(sides)} fill={PAPER.right} clipPath={`url(#${id}-r)`} />
      <polygon points={pts(sides)} fill="none" stroke={INK} strokeWidth={W} />
      <polygon points={pts(top)} fill={PAPER.top} stroke={INK} strokeWidth={W} />
    </g>
  );
}

/** A vertical cylinder standing at (cx, cy) from height z: coins, lamps, pucks. */
export function Cyl({
  cx,
  cy,
  z,
  r,
  h,
  top = PAPER.top,
  side = PAPER.right,
  stroke = INK,
}: {
  cx: number;
  cy: number;
  z: number;
  r: number;
  h: number;
  top?: string;
  side?: string;
  stroke?: string;
}) {
  const b = isoCircle(cx, cy, z, r);
  const t = isoCircle(cx, cy, z + h, r);
  const body = `M ${b.cx - b.rx} ${b.cy} A ${b.rx} ${b.ry} 0 0 0 ${b.cx + b.rx} ${b.cy} L ${t.cx + t.rx} ${t.cy} A ${t.rx} ${t.ry} 0 0 1 ${t.cx - t.rx} ${t.cy} Z`;
  return (
    <g>
      <path d={body} fill={PAPER.right} />
      <path d={body} fill={side} stroke={stroke} strokeWidth={W} strokeLinejoin="round" />
      <ellipse {...t} fill={PAPER.top} />
      <ellipse {...t} fill={top} stroke={stroke} strokeWidth={W} />
    </g>
  );
}

/** A token's round logo, from its listing in lib/data/indices (the 64px cut). */
export const logoSrc = (symbol: ComponentSymbol) => components[symbol].logo.replace(/\.webp$/, "-64.webp");

/**
 * A logo printed on a round face lying in the plane z: a coin's top. It's
 * the logo squashed 2:1 to sit in the face's ellipse, on a white disc (some
 * logos are open in the middle), inset so the coin's rim still shows. `src`
 * is any round image; `symbol` a listed token.
 */
export function CoinFace({ cx, cy, z, r, symbol, src }: { cx: number; cy: number; z: number; r: number } & ({ symbol: ComponentSymbol; src?: never } | { src: string; symbol?: never })) {
  const t = isoCircle(cx, cy, z, r);
  const R = t.rx * 0.8;
  return (
    <g>
      <ellipse cx={t.cx} cy={t.cy} rx={R} ry={R / 2} fill="#fff" />
      <image
        href={src ?? logoSrc(symbol!)}
        x={-R}
        y={-R}
        width={R * 2}
        height={R * 2}
        transform={`translate(${+t.cx.toFixed(2)} ${+t.cy.toFixed(2)}) scale(1 0.5)`}
      />
    </g>
  );
}

/** A screw head on the plane z. */
export function Screw({ cx, cy, z, r = 3.2 }: { cx: number; cy: number; z: number; r?: number }) {
  const e = isoCircle(cx, cy, z, r);
  const [a, b] = [project([cx - r * 0.7, cy - r * 0.7, z]), project([cx + r * 0.7, cy + r * 0.7, z])];
  return (
    <g>
      <ellipse {...e} fill={PAPER.left} stroke={INK} strokeWidth={W} />
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={INK} strokeWidth={W} />
    </g>
  );
}

/** A flat outline on the plane z: a groove, a plaque, a recess. */
export function Flat({ points, fill = "none", stroke = INK, dash }: { points: Pt[]; fill?: string; stroke?: string; dash?: string }) {
  return <polygon points={pts(points)} fill={fill} stroke={stroke} strokeWidth={W} strokeDasharray={dash} strokeLinejoin="round" />;
}

/** Marks and text drawn flat on one face: u along the face, v down it (or along +y on top). */
export function OnFace({ face, at, children }: { face: keyof typeof onFace; at: Pt; children: ReactNode }) {
  return <g transform={onFace[face](at)}>{children}</g>;
}

/** Engraved text, for inside <OnFace>: small mono caps. */
export function Engrave({
  u,
  v,
  size = 6,
  anchor = "start",
  children,
}: {
  u: number;
  v: number;
  size?: number;
  anchor?: "start" | "middle" | "end";
  children: ReactNode;
}) {
  return (
    <text
      x={u}
      y={v}
      fontSize={size}
      textAnchor={anchor}
      fill={INK_TEXT}
      style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
    >
      {children}
    </text>
  );
}
