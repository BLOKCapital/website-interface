"use client";

import { useCallback, useRef } from "react";
import { themeRgb, useCanvasLoop, type CanvasDraw } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type DotVariant = "orb" | "wave" | "rings" | "drift";
export type DotTone = "leaf" | "sand" | "cobalt" | "mute";

const toneVar: Record<DotTone, string> = { leaf: "--leaf", sand: "--sand", cobalt: "--cobalt", mute: "--fg-subtle" };

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Brightness 0..1 at (x, y) in px, for a w×h field at time t (s). */
function field(variant: DotVariant, x: number, y: number, w: number, h: number, t: number) {
  const r = Math.min(w, h);
  switch (variant) {
    case "orb": {
      // A slowly drifting globe with ripples running outward from its core.
      const cx = w * (0.5 + 0.07 * Math.sin(t * 0.35));
      const cy = h * (0.56 + 0.05 * Math.cos(t * 0.28));
      const d = Math.hypot(x - cx, y - cy) / (r * 0.62);
      const body = clamp01(1 - d) ** 1.35;
      return body * (0.62 + 0.38 * Math.sin(d * 15 - t * 1.5));
    }
    case "wave": {
      // A band of current flowing across the card.
      const u = x / w;
      const v = y / h;
      const centre = 0.5 + 0.16 * Math.sin(u * 4.2 + t * 0.55);
      const band = Math.exp(-((v - centre) ** 2) / 0.045);
      return band * (0.5 + 0.5 * Math.sin(u * 8 - t * 1.1 + Math.sin(v * 5 + t * 0.6) * 1.3));
    }
    case "rings": {
      // Concentric rings rising from below the bottom edge, like a signal.
      const d = Math.hypot(x - w * 0.5, y - h * 1.08);
      const fade = clamp01(1 - d / (Math.max(w, h) * 0.95));
      return fade * (0.5 + 0.5 * Math.sin(d * 0.085 - t * 1.25));
    }
    case "drift":
    default: {
      const u = x / w;
      const v = y / h;
      return 0.55 * (0.5 + 0.5 * Math.sin(u * 9 + t * 0.45) * Math.cos(v * 7 - t * 0.38));
    }
  }
}

const LEVELS = 6;

/**
 * Halftone dot-matrix art: a grid of dots whose size and brightness follow a
 * slowly moving field. Data-like texture in place of stock imagery, drawn in
 * one of the theme's colours. Decorative (aria-hidden); runs only while on
 * screen, and holds a still frame under reduced motion.
 */
export function DotField({
  variant = "orb",
  tone = "leaf",
  gap = 9,
  className,
}: {
  variant?: DotVariant;
  tone?: DotTone;
  /** Grid spacing in px. */
  gap?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const rgb = useRef<string | null>(null);

  const draw = useCallback<CanvasDraw>(
    (ctx, w, h, t) => {
      rgb.current ??= themeRgb(toneVar[tone], ctx.canvas);
      ctx.clearRect(0, 0, w, h);
      // Bucket dots by brightness so each frame is a handful of fills.
      const buckets: number[][] = Array.from({ length: LEVELS }, () => []);
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const v = field(variant, x, y, w, h, t);
          if (v < 0.06) continue;
          buckets[Math.min(LEVELS - 1, Math.floor(v * LEVELS))].push(x, y);
        }
      }
      buckets.forEach((pts, level) => {
        if (!pts.length) return;
        const v = (level + 0.5) / LEVELS;
        const radius = Math.max(0.6, v * gap * 0.42);
        ctx.fillStyle = `rgb(${rgb.current} / ${(0.18 + 0.72 * v).toFixed(3)})`;
        ctx.beginPath();
        for (let i = 0; i < pts.length; i += 2) {
          ctx.moveTo(pts[i] + radius, pts[i + 1]);
          ctx.arc(pts[i], pts[i + 1], radius, 0, Math.PI * 2);
        }
        ctx.fill();
      });
    },
    [variant, tone, gap],
  );

  useCanvasLoop(ref, draw, { fps: 30, stillAt: 3 });
  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none block size-full", className)} />;
}
