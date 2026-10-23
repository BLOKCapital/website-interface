import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Geometry shared by the stack drawing and the HTML labels laid over it, so
 * plates, leader lines and tabs line up at any size. Units are the SVG's
 * viewBox units; the figure scales uniformly.
 */
const W = 220; // plate width; its top face is W/2 tall (2:1 isometric)
const T = 9; // plate thickness
const GAP = 36; // vertical step between plates
const LIFT = 34; // how far plates above the active one rise, so its face shows whole
const X = 10;
const TOP = 10 + LIFT;
const CX = X + W / 2;

export function stackGeometry(count: number) {
  const width = X + W + 210;
  const height = TOP + (count - 1) * GAP + W / 2 + T + 12;
  /** Where plate i's centre sits, given the active plate. */
  const centreY = (i: number, active: number) => TOP + i * GAP + W / 4 - (i < active ? LIFT : 0);
  return { width, height, labelX: X + W + 26, centreY };
}

const face = (pts: [number, number][]) => pts.map((p) => p.join(",")).join(" ");

const g = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" } as const;

/** Each layer's mark, on a 20-unit grid (the menu icons' style), printed on its plate. */
const GLYPHS: Record<string, ReactNode> = {
  // You: a person
  you: (
    <>
      <circle cx="10" cy="7" r="3" {...g} />
      <path d="M4 17c.8-3.3 3.1-5 6-5s5.2 1.7 6 5" {...g} />
    </>
  ),
  // Your Garden: a wallet
  garden: <path d="M3.5 6.5h12A1.5 1.5 0 0 1 17 8v7a1.5 1.5 0 0 1-1.5 1.5h-12V6.5Zm0 0 9-3v3M13 11.5h1.5" {...g} />,
  // An index: a pie with a slice out
  index: (
    <>
      <path d="M8.8 4.2a6.3 6.3 0 1 0 7 7H8.8v-7Z" {...g} />
      <path d="M11.4 2.6a6.2 6.2 0 0 1 6 6h-6v-6Z" {...g} />
    </>
  ),
  // Data: a feed, broadcasting
  data: (
    <>
      <circle cx="10" cy="10" r="1.6" {...g} />
      <path d="M6.6 13.4a4.8 4.8 0 0 1 0-6.8M13.4 6.6a4.8 4.8 0 0 1 0 6.8M4.1 15.9a8.3 8.3 0 0 1 0-11.8M15.9 4.1a8.3 8.3 0 0 1 0 11.8" {...g} />
    </>
  ),
  // Rebalance: two arrows, trading places
  rebalance: <path d="M3.5 7h12l-3-3M16.5 13h-12l3 3" {...g} />,
  // The DAO: columns
  dao: <path d="M3 8 10 4l7 4M4.8 9v6M8.3 9v6M11.7 9v6M15.2 9v6M3 16.5h14" {...g} />,
};

/**
 * The protocol's layers as an isometric stack of plates, top (you) to
 * bottom (the DAO), each with its mark printed on its face. The stack opens
 * at the active layer: the plates above lift clear, and the active plate
 * turns ink blue, its mark popping in. Clicking a plate selects it (a mouse
 * shortcut; the labelled tabs beside it are the accessible control), so the
 * drawing itself is aria-hidden. Motion is transform and opacity only, and
 * settles at once (globals.css, "Protocol explorer").
 */
export function LayerStack({
  count,
  ids = [],
  active,
  onSelect,
  className,
}: {
  count: number;
  /** Each layer's id, for its mark (GLYPHS). */
  ids?: string[];
  active: number;
  onSelect?: (i: number) => void;
  className?: string;
}) {
  const geo = stackGeometry(count);
  // Paint from the bottom plate up, so upper plates overlap lower ones.
  const order = Array.from({ length: count }, (_, i) => count - 1 - i);

  return (
    <div aria-hidden className={cn("relative", className)}>
      <svg viewBox={`0 0 ${geo.width} ${geo.height}`} className="absolute inset-0 size-full">
        <defs>
          <radialGradient id="layerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(var(--cobalt))" stopOpacity="0.22" />
            <stop offset="100%" stopColor="rgb(var(--cobalt))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {order.map((i) => {
          const on = i === active;
          const y = TOP + i * GAP;
          const top = face([
            [CX, y],
            [X + W, y + W / 4],
            [CX, y + W / 2],
            [X, y + W / 4],
          ]);
          const left = face([
            [X, y + W / 4],
            [CX, y + W / 2],
            [CX, y + W / 2 + T],
            [X, y + W / 4 + T],
          ]);
          const right = face([
            [CX, y + W / 2],
            [X + W, y + W / 4],
            [X + W, y + W / 4 + T],
            [CX, y + W / 2 + T],
          ]);
          const stroke = on ? "rgb(var(--cobalt))" : "rgb(var(--line) / 0.26)";
          const glyph = GLYPHS[ids[i] ?? ""];
          return (
            <g
              key={i}
              onClick={onSelect ? () => onSelect(i) : undefined}
              className={cn("transition-transform duration-base ease-expo", onSelect && "cursor-pointer")}
              style={{ transform: `translateY(${i < active ? -LIFT : 0}px)` }}
            >
              {on && <ellipse cx={CX} cy={y + W / 4} rx={W * 0.55} ry={W * 0.3} fill="url(#layerGlow)" />}
              <polygon points={left} fill={on ? "rgb(var(--cobalt) / 0.62)" : "rgb(var(--plate-l))"} stroke={stroke} strokeWidth="1" />
              <polygon points={right} fill={on ? "rgb(var(--cobalt) / 0.42)" : "rgb(var(--plate-r))"} stroke={stroke} strokeWidth="1" />
              <polygon
                points={top}
                fill={on ? "rgb(var(--cobalt) / 0.12)" : "rgb(var(--card))"}
                stroke={stroke}
                strokeWidth={on ? 1.5 : 1}
                className="transition-[fill,stroke] duration-fast"
              />
              {/* Its mark, printed flat on the face (the top face's iso transform, at 2.4×). */}
              {glyph && (
                <g transform={`translate(${CX} ${y + W / 4}) matrix(1 0.5 -1 0.5 0 0) scale(2.4) translate(-10 -10)`}>
                  <g
                    key={on ? `on-${active}` : "off"}
                    className={on ? "stack-glyph-in" : undefined}
                    style={{ color: on ? "rgb(var(--cobalt))" : "rgb(var(--line) / 0.32)", transformOrigin: "10px 10px" }}
                  >
                    {glyph}
                  </g>
                </g>
              )}
              {/* Leader line out to this layer's label. */}
              <line
                x1={X + W + 4}
                y1={y + W / 4}
                x2={geo.labelX - 6}
                y2={y + W / 4}
                stroke={on ? "rgb(var(--cobalt))" : "rgb(var(--line) / 0.18)"}
                strokeDasharray={on ? undefined : "2 4"}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
