import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { type Pt, type Rect, type V3, offset, shift } from "./geometry";
import s from "./iso.module.css";

/**
 * The stage for the protocol figures: a box of a fixed aspect ratio, HTML
 * layers for everything that moves (each holding a small SVG drawn in scene
 * units, so it moves on the compositor), and marks pinned to scene points.
 * The parts themselves are drawn with the kit in machine.tsx. No hooks here;
 * the motion is CSS (iso.module.css).
 */

const pct = (n: number) => `${+(n * 100).toFixed(3)}%`;

/** Where a scene rectangle sits inside the scene, in %. */
export const place = (r: Rect, view: Rect): CSSProperties => ({
  left: pct((r.x - view.x) / view.w),
  top: pct((r.y - view.y) / view.h),
  width: pct(r.w / view.w),
  height: pct(r.h / view.h),
});

/** A point of the scene, in % of the scene. */
export const at = (p: Pt, view: Rect): CSSProperties => ({ left: pct((p[0] - view.x) / view.w), top: pct((p[1] - view.y) / view.h) });

export type Motion = {
  /** hop: an arc from `from` through `via` · bounce: out to `via` and back · exit: away to `to`, then gone. */
  anim?: "hop" | "bounce" | "exit";
  /** Start, as a move in scene space from the resting place. */
  from?: V3;
  /** The top of an arc (hop), or the far point of a bounce, the same way. */
  via?: V3;
  /** Where an exit ends, the same way. */
  to?: V3;
  delay?: number;
  dur?: number;
};

/** An HTML layer over the scene, holding SVG drawn in scene units, that can move. */
/** A motion's custom properties, as offsets in % of `rect`. */
function vars(m: Motion | undefined, rect: Rect) {
  const v: Record<string, string> = {};
  if (!m) return v;
  if (m.from) [v["--fx"], v["--fy"]] = offset(shift(...m.from), rect);
  if (m.via) {
    const [x, y] = offset(shift(...m.via), rect);
    if (m.anim === "bounce") [v["--bx"], v["--by"]] = [x, y];
    else [v["--mx"], v["--my"]] = [x, y];
  }
  if (m.to) [v["--tx"], v["--ty"]] = offset(shift(...m.to), rect);
  if (m.delay != null) v["--delay"] = `${m.delay}ms`;
  if (m.dur != null) v["--dur"] = `${m.dur}ms`;
  return v;
}

/**
 * An HTML layer over the scene, holding SVG drawn in scene units, that can
 * move. `inner` is a second motion on a wrapper inside it, for a part that
 * does two things at different times (drops in, then later hops away): each
 * element runs one animation, so their transforms never fight.
 */
export function Layer({
  view,
  rect,
  motion,
  inner,
  className,
  children,
}: {
  view: Rect;
  rect: Rect;
  motion?: Motion;
  inner?: Motion;
  className?: string;
  children: ReactNode;
}) {
  const svg = (
    <svg viewBox={`${rect.x} ${rect.y} ${rect.w} ${rect.h}`} className="block size-full overflow-visible">
      {children}
    </svg>
  );
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute", motion?.anim && s[motion.anim], className)}
      style={{ ...place(rect, view), ...vars(motion, rect) } as CSSProperties}
    >
      {inner ? (
        <div className={cn("size-full", inner.anim && s[inner.anim])} style={vars(inner, rect) as CSSProperties}>
          {svg}
        </div>
      ) : (
        svg
      )}
    </div>
  );
}

/**
 * A small round mark (a check, a stop, or a caution flag) pinned to a scene
 * point, popping in at `delay`. `size` (scene units) scales it with the
 * drawing, so on a phone it stays in proportion to the parts it marks.
 */
export function IsoMark({ view, at: p, delay, kind, size }: { view: Rect; at: Pt; delay?: number; kind: "stop" | "ok" | "flag"; size?: number }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute grid place-items-center rounded-full border-2 bg-card shadow-e1 [transform:translate(-50%,-50%)]",
        size ? "aspect-square" : "size-5 sm:size-7",
        kind === "stop" ? "border-danger text-danger" : kind === "flag" ? "border-caution text-caution" : "border-leaf text-leaf",
        s.pop,
      )}
      style={{ ...at(p, view), ...(size ? { width: pct(size / view.w) } : {}), "--delay": `${delay ?? 0}ms` } as CSSProperties}
    >
      <svg
        viewBox="0 0 16 16"
        className={size ? "size-[55%]" : "size-2.5 sm:size-3.5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {kind === "stop" ? <path d="M4 4l8 8M12 4l-8 8" /> : kind === "flag" ? <path d="M8 3.5v5.5M8 12.2v.3" /> : <path d="M3.5 8.5l3 3 6-7" />}
      </svg>
    </span>
  );
}

/**
 * The scene: a fixed-ratio box that plays once when it comes on screen.
 * `label` describes the whole picture for screen readers; everything
 * inside is aria-hidden.
 */
export function IsoScene({
  view,
  label,
  ground,
  className,
  children,
}: {
  view: Rect;
  label: string;
  ground?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      data-loop
      className={cn("art-tile relative w-full select-none", className)}
      style={{ aspectRatio: `${view.w} / ${view.h}` }}
    >
      {ground && (
        <svg aria-hidden viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} className="absolute inset-0 size-full overflow-visible">
          {ground}
        </svg>
      )}
      {children}
    </div>
  );
}
