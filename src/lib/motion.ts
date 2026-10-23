"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import { isMotionPaused, MOTION_EVENT } from "./motion-pref";

export { isMotionPaused, setMotionPaused, MOTION_EVENT, MOTION_KEY } from "./motion-pref";

/**
 * Shared plumbing for the JS-driven effects in components/motion. Every
 * effect has the same contract: it never runs off-screen or in a hidden tab,
 * and with motion off it shows its final, static state. "Motion off" means
 * prefers-reduced-motion OR the site's Pause-motion switch
 * (html[data-motion="paused"], lib/motion-pref.ts); every helper here
 * honours both, and reacts when either changes mid-visit.
 */

const REDUCE = "(prefers-reduced-motion: reduce)";

const subscribeMotion = (cb: () => void) => {
  const m = window.matchMedia(REDUCE);
  m.addEventListener("change", cb);
  window.addEventListener(MOTION_EVENT, cb);
  return () => {
    m.removeEventListener("change", cb);
    window.removeEventListener(MOTION_EVENT, cb);
  };
};

const motionAllowedNow = () => !window.matchMedia(REDUCE).matches && !isMotionPaused();

/**
 * True while motion may run: no reduced-motion preference and Pause motion
 * off. Reactive, so use it as an effect dependency. True on the server.
 */
export function useMotionAllowed() {
  return useSyncExternalStore(subscribeMotion, motionAllowedNow, () => true);
}

/** Whether the site's Pause-motion switch is on. Reactive; false on the server. */
export function useMotionPaused() {
  return useSyncExternalStore(subscribeMotion, isMotionPaused, () => false);
}

/** One-off read of "motion off" (reduced motion or paused). False on the server. */
export const prefersReducedMotion = () => typeof window !== "undefined" && !motionAllowedNow();

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

/**
 * A theme colour as "r g b" (from the CSS variables in globals.css), read
 * on `el` so a surrounding .theme-dark / .theme-light scope applies.
 */
export function themeRgb(name: string, el?: Element, fallback = "17 26 21") {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(el ?? document.documentElement).getPropertyValue(name).trim() || fallback;
}
