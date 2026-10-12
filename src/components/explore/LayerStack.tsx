import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Geometry shared by the stack drawing and the HTML labels laid over it, so
 * plates, leader lines and tabs line up at any size. Units are the SVG's
 * viewBox units; the figure scales uniformly.
 */
const W = 220; // plate width; its top face is W/2 tall (2:1 isometric)
const T = 9; // plate thickness
const GAP = 38; // vertical step between plates
const LIFT = 24; // how far plates above the active one rise
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

/**
 * The protocol's layers as an isometric stack of plates, top (you) to
 * bottom (the DAO). The stack opens at the active layer: the plates above
 * lift away, the active plate lights up, and a dashed signal line runs down
 * the shaft from your signature to it. Clicking a plate selects it (a mouse
 * shortcut; the labelled tabs beside it are the accessible control), so the
 * drawing itself is aria-hidden.
 *
 * Its motion settles: on each change of layer a dot drops down the shaft
 * twice and the active node pulses twice (about 4 s), then everything rests
 * on the still drawing. Both are HTML layers over the SVG, moved with
 * transform and opacity only (globals.css, "Protocol explorer").
 */
export function LayerStack({
  count,
  active,
  onSelect,
  className,
}: {
  count: number;
  active: number;
  onSelect?: (i: number) => void;
  className?: string;
}) {
  const g = stackGeometry(count);
  // Paint from the bottom plate up, so upper plates overlap lower ones.
  const order = Array.from({ length: count }, (_, i) => count - 1 - i);
  const topY = g.centreY(0, active);
  const activeY = g.centreY(active, active);
  // HTML overlays are placed in % of the figure, which shares the SVG's aspect ratio.
  const px = (x: number) => `${(x / g.width) * 100}%`;
  const py = (y: number) => `${(y / g.height) * 100}%`;
  const node = { left: px(CX), width: px(9) };

  return (
    <div aria-hidden data-loop className={cn("relative", className)}>
      <svg viewBox={`0 0 ${g.width} ${g.height}`} className="absolute inset-0 size-full">
        <defs>
          <radialGradient id="layerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(var(--glow))" stopOpacity="0.45" />
            <stop offset="100%" stopColor="rgb(var(--glow))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {order.map((i) => {
          const on = i === active;
          const passed = i < active;
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
          const stroke = on ? "rgb(var(--leaf))" : passed ? "rgb(var(--leaf) / 0.6)" : "rgb(var(--line) / 0.26)";
          return (
            <g
              key={i}
              onClick={onSelect ? () => onSelect(i) : undefined}
              className={cn("transition-transform duration-slow ease-expo", onSelect && "cursor-pointer")}
              style={{ transform: `translateY(${i < active ? -LIFT : 0}px)` }}
            >
              {on && <ellipse cx={CX} cy={y + W / 4} rx={W * 0.5} ry={W * 0.28} fill="url(#layerGlow)" />}
              <polygon points={left} fill={on ? "rgb(var(--leaf-deep) / 0.85)" : passed ? "rgb(var(--leaf) / 0.22)" : "rgb(var(--plate-l))"} stroke={stroke} strokeWidth="1" />
              <polygon points={right} fill={on ? "rgb(var(--leaf-deep) / 0.65)" : passed ? "rgb(var(--leaf) / 0.32)" : "rgb(var(--plate-r))"} stroke={stroke} strokeWidth="1" />
              <polygon
                points={top}
                fill={on ? "rgb(var(--leaf) / 0.16)" : "rgb(var(--card))"}
                stroke={stroke}
                strokeWidth={on ? 1.5 : 1}
                className="transition-[fill,stroke] duration-base"
              />
              {/* Leader line out to this layer's label. */}
              <line
                x1={X + W + 4}
                y1={y + W / 4}
                x2={g.labelX - 6}
                y2={y + W / 4}
                stroke={on ? "rgb(var(--leaf))" : "rgb(var(--line) / 0.18)"}
                strokeDasharray={on ? undefined : "2 4"}
              />
              {on && (
                <polygon
                  points={top}
                  fill="none"
                  stroke="rgb(var(--leaf))"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  style={{ transformOrigin: `${CX}px ${y + W / 4}px`, scale: "0.62" }}
                />
              )}
            </g>
          );
        })}

        {/* The signal: from your signature down through every layer to the active one. */}
        {active > 0 && (
          <line x1={CX} y1={topY} x2={CX} y2={activeY} stroke="rgb(var(--leaf))" strokeWidth="1.5" strokeDasharray="4 6" strokeLinecap="round" />
        )}
        <circle cx={CX} cy={topY} r="3.5" fill="rgb(var(--leaf))" />
      </svg>

      {/* A dot dropping down the shaft to the newly active layer (re-keyed per change). */}
      {active > 0 && (
        <div
          key={`signal-${active}`}
          className="stack-signal pointer-events-none absolute inset-0"
          style={{ "--from": py(topY), "--to": py(activeY) } as CSSProperties}
        >
          <span className="absolute top-0 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-leaf shadow-[0_0_8px_rgb(var(--leaf)/0.7)]" style={{ left: node.left, width: px(6) }} />
        </div>
      )}
      {/* The active node travels with the stack, and pulses twice when it arrives. */}
      <div className="pointer-events-none absolute inset-0 transition-transform duration-slow ease-expo" style={{ transform: `translateY(${py(activeY)})` }}>
        <span
          key={`pulse-${active}`}
          // Centred with `translate`, so the ring's scale keyframes don't undo it.
          className="absolute top-0 aspect-square animate-pulse-ring rounded-full bg-leaf [translate:-50%_-50%]"
          style={{ ...node, animationIterationCount: 2 }}
        />
        <span className="absolute top-0 aspect-square rounded-full bg-leaf [translate:-50%_-50%]" style={node} />
      </div>
    </div>
  );
}
