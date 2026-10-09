"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

/**
 * Shared plumbing for the JS-driven effects in components/motion. Every
 * effect has the same contract: it never runs off-screen or in a hidden tab,
 * and under prefers-reduced-motion it shows its final, static state.
 */

const REDUCE = "(prefers-reduced-motion: reduce)";

const subscribeReduce = (cb: () => void) => {
  const m = window.matchMedia(REDUCE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/** True when the visitor asked for reduced motion. False on the server. */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(REDUCE).matches;

/**
 * Whether `ref` is on screen. With `once`, it latches true the first time.
 * Without IntersectionObserver it reports true, so effects still play.
 */
export function useInView(
  ref: RefObject<Element | null>,
  { once = false, rootMargin = "0px", threshold = 0 }: { once?: boolean; rootMargin?: string; threshold?: number } = {},
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      const t = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(t);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (once && e.isIntersecting) io.disconnect();
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, rootMargin, threshold]);
  return inView;
}

/** Ease-out (expo-ish) for number tweens. */
export const easeOut = (k: number) => 1 - Math.pow(1 - k, 4);

/**
 * A theme colour as "r g b" (from the CSS variables in globals.css), read
 * on `el` so a surrounding .theme-dark / .theme-light scope applies.
 */
export function themeRgb(name: string, el?: Element, fallback = "17 26 21") {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(el ?? document.documentElement).getPropertyValue(name).trim() || fallback;
}

export type CanvasDraw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

/**
 * Runs `draw` on a canvas at up to `fps`, sized to its CSS box at device
 * pixel ratio (capped at 2). The loop only runs while the canvas is on
 * screen and the tab is visible; otherwise, and always under reduced motion,
 * the canvas holds one still frame drawn at `stillAt` seconds.
 */
export function useCanvasLoop(
  ref: RefObject<HTMLCanvasElement | null>,
  draw: CanvasDraw,
  { fps = 30, stillAt = 2 }: { fps?: number; stillAt?: number } = {},
) {
  const drawRef = useRef(draw);
  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = prefersReducedMotion();
    const frameMs = 1000 / fps;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let onScreen = false;
    // Start the clock at the still frame, so motion picks up from it.
    const origin = performance.now() - stillAt * 1000;

    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const still = () => {
      if (w && h) drawRef.current(ctx, w, h, stillAt);
    };
    const running = () => onScreen && !reduce && document.visibilityState === "visible";
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < frameMs) return;
      last = now;
      drawRef.current(ctx, w, h, (now - origin) / 1000);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      if (running()) raf = requestAnimationFrame(frame);
    };

    size();
    still();
    const ro = new ResizeObserver(() => {
      size();
      if (!running()) still();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ref, fps, stillAt]);
}
