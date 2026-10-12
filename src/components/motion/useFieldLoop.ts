"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { useMotionAllowed } from "@/lib/motion";

/**
 * Paints one frame of a decorative canvas field. `t` is the field's clock in
 * seconds (it only advances while the field runs). `full` is true when the
 * canvas was just sized or reset, so everything must be repainted; otherwise
 * a field may redraw only what changed since its last frame.
 */
export type FieldDraw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, full: boolean) => void;

/** Loops settle within 5 s of the last scroll or pointer move (D-33, MOT-04). */
const SETTLE_MS = 5000;
/** Never faster than this, whatever the caller asks for (E R4). */
const MAX_FPS = 15;

type Connection = { saveData?: boolean };
const saveData = () =>
  typeof navigator !== "undefined" && (navigator as Navigator & { connection?: Connection }).connection?.saveData === true;

/**
 * The loop behind DotField and GlyphField (G-15). Frames are paced by
 * setTimeout at ≤ 15 fps, never a requestAnimationFrame every display frame,
 * and only while the canvas is on screen and the tab is visible. A field
 * runs for 5 s after it enters view, then settles on its current frame; any
 * scroll or pointer move while it's on screen wakes it for another 5 s, like
 * soil settling after it's disturbed.
 *
 * With motion off (reduced motion or Pause motion, followed live through
 * `useMotionAllowed()`), or when the browser asks to save data, the canvas
 * holds one still frame drawn at `stillAt` seconds and no timer runs.
 *
 * Returns `repaint()`, which redraws the whole current frame (for example
 * once a web font the field draws with has loaded).
 */
export function useFieldLoop(
  ref: RefObject<HTMLCanvasElement | null>,
  draw: FieldDraw,
  { fps = 12, stillAt = 2 }: { fps?: number; stillAt?: number } = {},
) {
  const allowed = useMotionAllowed();
  const drawRef = useRef(draw);
  const repaintRef = useRef<() => void>(() => {});
  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const animate = allowed && !saveData();
    const frameMs = 1000 / Math.min(Math.max(fps, 1), MAX_FPS);
    let w = 0;
    let h = 0;
    let timer = 0;
    let onScreen = false;
    // Run until this moment (performance.now()), then settle.
    let until = 0;
    // The field's own clock: starts on the still frame, so motion picks up
    // from it, and stands still while the field is settled.
    let t = stillAt;
    let last = 0;
    let full = true;

    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      full = true;
    };
    const paint = () => {
      if (!w || !h) return;
      drawRef.current(ctx, w, h, t, full);
      full = false;
    };
    const live = () => onScreen && document.visibilityState === "visible";

    const tick = () => {
      timer = 0;
      const now = performance.now();
      if (!live() || now >= until) return; // settled: the last frame stays
      // A late timer (busy main thread) advances the clock by at most 4 frames.
      t += Math.min(now - last, frameMs * 4) / 1000;
      last = now;
      paint();
      timer = window.setTimeout(tick, frameMs);
    };
    const start = () => {
      if (timer || !live() || performance.now() >= until) return;
      last = performance.now();
      timer = window.setTimeout(tick, frameMs);
    };
    const stop = () => {
      window.clearTimeout(timer);
      timer = 0;
    };
    const wake = () => {
      if (!animate || !live()) return;
      until = performance.now() + SETTLE_MS;
      start();
    };

    repaintRef.current = () => {
      full = true;
      paint();
    };

    size();
    paint();
    const ro = new ResizeObserver(() => {
      size();
      paint();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) wake();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.visibilityState === "visible" ? start() : stop());
    document.addEventListener("visibilitychange", onVisibility);
    if (animate) {
      window.addEventListener("scroll", wake, { passive: true });
      window.addEventListener("pointermove", wake, { passive: true });
      window.addEventListener("pointerdown", wake, { passive: true });
    }
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("pointerdown", wake);
      repaintRef.current = () => {};
    };
  }, [ref, fps, stillAt, allowed]);

  return useCallback(() => repaintRef.current(), []);
}
