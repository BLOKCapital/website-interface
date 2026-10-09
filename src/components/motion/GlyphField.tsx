"use client";

import { useCallback, useRef } from "react";
import { themeRgb, useCanvasLoop, type CanvasDraw } from "@/lib/motion";
import { cn } from "@/lib/utils";

const GLYPHS = "0123456789abcdef0x/+·";
const CELL = 16;

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
 * A field of hex glyphs: most sit dim and churn quietly while a few columns
 * of leaf-coloured characters fall through, like data settling on-chain.
 * Decorative; runs only on screen; a still frame under reduced motion.
 */
export function GlyphField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const state = useRef<State | null>(null);
  const theme = useRef<{ leaf: string; line: string; font: string } | null>(null);

  const draw = useCallback<CanvasDraw>((ctx, w, h, t) => {
    theme.current ??= {
      leaf: themeRgb("--leaf", ctx.canvas),
      line: themeRgb("--line", ctx.canvas),
      font: getComputedStyle(ctx.canvas).getPropertyValue("--font-mono").trim() || "monospace",
    };
    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);
    let s = state.current;
    if (!s || s.cols !== cols || s.rows !== rows) s = state.current = init(cols, rows);
    const dt = s.last ? Math.min(0.1, t - s.last) : 1 / 24;
    s.last = t;
    if (dt > 0) step(s, dt);

    const { leaf, line, font } = theme.current;
    ctx.clearRect(0, 0, w, h);
    ctx.font = `12px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const heat = s.heat[i];
        // A stable per-cell dimness, so the resting field has texture.
        const base = 0.05 + ((c * 7 + r * 13) % 5) * 0.018;
        ctx.fillStyle = heat > 0.06 ? `rgb(${leaf} / ${(0.15 + heat * 0.8).toFixed(3)})` : `rgb(${line} / ${base.toFixed(3)})`;
        ctx.fillText(GLYPHS[s.chars[i]], c * CELL + CELL / 2, r * CELL + CELL / 2);
      }
    }
  }, []);

  useCanvasLoop(ref, draw, { fps: 24, stillAt: 2 });
  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none block size-full", className)} />;
}
