"use client";

import { useCallback, useEffect, useRef } from "react";
import { themeRgb } from "@/lib/motion";
import { useFieldLoop, type FieldDraw } from "./useFieldLoop";
import { cn } from "@/lib/utils";

const GLYPHS = "0123456789abcdef0x/+·";
const CELL = 16;
/** Heat is drawn in this many alpha steps, so a cooling cell stops changing. */
const HEAT_STEPS = 16;

type State = {
  cols: number;
  rows: number;
  chars: Uint8Array;
  heat: Float32Array;
  /** Falling heads: [column, row position, speed in rows/s] triples. */
  drops: number[];
  last: number;
};

function init(cols: number, rows: number): State {
  const s: State = {
    cols,
    rows,
    chars: Uint8Array.from({ length: cols * rows }, () => (Math.random() * GLYPHS.length) | 0),
    heat: new Float32Array(cols * rows),
    drops: [],
    last: 0,
  };
  const count = Math.max(3, Math.round(cols / 7));
  for (let i = 0; i < count; i++) s.drops.push((Math.random() * cols) | 0, Math.random() * rows, 4 + Math.random() * 7);
  // Warm up, so a still frame (reduced motion) already shows trails.
  for (let i = 0; i < 40; i++) step(s, 1 / 24);
  return s;
}

function step(s: State, dt: number) {
  const { cols, rows, chars, heat, drops } = s;
  for (let i = 0; i < heat.length; i++) heat[i] *= Math.pow(0.12, dt);
  // A few glyphs churn each frame.
  const churn = Math.ceil(chars.length * 0.012);
  for (let i = 0; i < churn; i++) chars[(Math.random() * chars.length) | 0] = (Math.random() * GLYPHS.length) | 0;
  for (let d = 0; d < drops.length; d += 3) {
    drops[d + 1] += drops[d + 2] * dt;
    const row = Math.floor(drops[d + 1]);
    if (row >= rows + 4) {
      drops[d] = (Math.random() * cols) | 0;
      drops[d + 1] = -Math.random() * rows;
      drops[d + 2] = 4 + Math.random() * 7;
    } else if (row >= 0 && row < rows) {
      const i = row * cols + drops[d];
      heat[i] = 1;
      chars[i] = (Math.random() * GLYPHS.length) | 0;
    }
  }
}

/**
 * Every glyph pre-rendered once, in the two colours the field uses (row 0:
 * the resting --line ink, row 1: hot --leaf), at device resolution. A frame
 * then copies cells out of it with drawImage and a globalAlpha, instead of
 * shaping text with fillText.
 */
function makeAtlas(colours: [string, string], font: string, dpr: number) {
  const atlas = document.createElement("canvas");
  const px = Math.round(CELL * dpr);
  atlas.width = px * GLYPHS.length;
  atlas.height = px * 2;
  const a = atlas.getContext("2d");
  if (!a) return null;
  a.scale(dpr, dpr);
  a.font = `12px ${font}`;
  a.textAlign = "center";
  a.textBaseline = "middle";
  colours.forEach((rgb, row) => {
    a.fillStyle = `rgb(${rgb})`;
    for (let g = 0; g < GLYPHS.length; g++) a.fillText(GLYPHS[g], g * CELL + CELL / 2, row * CELL + CELL / 2);
  });
  return { canvas: atlas, px, dpr };
}

type Atlas = NonNullable<ReturnType<typeof makeAtlas>>;

/**
 * A field of hex glyphs: most sit dim and churn quietly while a few columns
 * of leaf-coloured characters fall through, like data settling on-chain.
 * Decorative (aria-hidden). Each frame redraws only the cells whose glyph or
 * brightness changed, from a pre-rendered glyph atlas. It runs at 12 fps
 * only while on screen, settles 5 s after the last scroll or pointer move,
 * and holds a still frame with motion off or Save-Data on (useFieldLoop).
 */
export function GlyphField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const state = useRef<State | null>(null);
  const theme = useRef<{ leaf: string; line: string; font: string } | null>(null);
  const atlas = useRef<Atlas | null>(null);
  // What each cell currently shows (glyph and brightness step), or -1.
  const shown = useRef<Int16Array | null>(null);

  const draw = useCallback<FieldDraw>((ctx, w, h, t, full) => {
    theme.current ??= {
      leaf: themeRgb("--leaf", ctx.canvas),
      line: themeRgb("--line", ctx.canvas),
      font: getComputedStyle(ctx.canvas).getPropertyValue("--font-mono").trim() || "monospace",
    };
    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);
    let s = state.current;
    if (!s || s.cols !== cols || s.rows !== rows) {
      s = state.current = init(cols, rows);
      full = true;
    }
    const dt = s.last ? Math.min(0.1, t - s.last) : 1 / 24;
    s.last = t;
    if (dt > 0) step(s, dt);

    const dpr = ctx.getTransform().a || 1;
    if (!atlas.current || atlas.current.dpr !== dpr) {
      atlas.current = makeAtlas([theme.current.line, theme.current.leaf], theme.current.font, dpr);
      full = true;
    }
    const at = atlas.current;
    if (!at) return;
    if (full || !shown.current || shown.current.length !== cols * rows) {
      shown.current = new Int16Array(cols * rows).fill(-1);
      ctx.clearRect(0, 0, w, h);
    }
    const seen = shown.current;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const g = s.chars[i];
        const heat = s.heat[i];
        const hot = heat > 0.06;
        // A stable per-cell dimness (5 steps), so the resting field has texture.
        const level = hot ? Math.round(heat * HEAT_STEPS) : (c * 7 + r * 13) % 5;
        const key = g * 64 + (hot ? 32 : 0) + level;
        if (seen[i] === key) continue;
        seen[i] = key;
        const x = c * CELL;
        const y = r * CELL;
        ctx.clearRect(x, y, CELL, CELL);
        ctx.globalAlpha = hot ? 0.15 + (level / HEAT_STEPS) * 0.8 : 0.05 + level * 0.018;
        ctx.drawImage(at.canvas, g * at.px, hot ? at.px : 0, at.px, at.px, x, y, CELL, CELL);
      }
    }
    ctx.globalAlpha = 1;
  }, []);

  const repaint = useFieldLoop(ref, draw, { fps: 12, stillAt: 2 });

  // The atlas is drawn with the site's mono font; once that has loaded,
  // redraw it, in case the first frames used the fallback.
  useEffect(() => {
    const font = getComputedStyle(ref.current ?? document.documentElement).getPropertyValue("--font-mono").trim();
    if (!font || !document.fonts?.load) return;
    let live = true;
    document.fonts
      .load(`12px ${font}`)
      .then(() => {
        if (!live) return;
        atlas.current = null;
        repaint();
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [repaint]);

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none block size-full", className)} />;
}
