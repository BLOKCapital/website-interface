"use client";

import { useCallback, useState, useSyncExternalStore, type FocusEvent, type PointerEvent, type RefObject } from "react";
import { useInView, useMotionAllowed } from "./motion";
import { useIsClient } from "./hooks";

/**
 * Shared rules for the explainers, so they all behave the same way.
 *
 * Autoplay (ProtocolExplorer, RulesDemo):
 * - runs only on wide screens with a real pointer (lg and `(hover: hover)`),
 *   only with motion allowed (reduced motion and the site's Pause-motion
 *   switch both turn it off, live), and only on screen in a visible tab;
 * - any user input (a tap, click or key on a tab, a stage or Prev/Next, a
 *   swipe on the strip) stops it for the rest of the visit, and the toggle
 *   then offers "Resume";
 * - the pointer over the explainer, or keyboard focus inside it, pauses it;
 * - each step stays up long enough to read (about 200 words a minute, plus
 *   2 s), and a walk plays once, stopping on its last step.
 */

/** Where autoplay may run: lg and up, with a pointer that can hover. */
export const AUTOPLAY_QUERY = "(min-width: 1024px) and (hover: hover)";

/** The lg breakpoint (tailwind.config.ts uses Tailwind's default screens). */
export const LG_QUERY = "(min-width: 1024px)";

/** Whether a media query matches. Reactive; false on the server and during hydration. */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

const subscribeVisibility = (cb: () => void) => {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
};

/** Whether the tab is visible. Reactive; true on the server. */
export function usePageVisible() {
  return useSyncExternalStore(subscribeVisibility, () => document.visibilityState === "visible", () => true);
}

/** How long a step stays up: its words at about 200 a minute, plus 2 s. */
export function dwellMs(...texts: string[]) {
  const words = texts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.round((words / 200) * 60_000) + 2000;
}

/** Marks the play/pause toggle, so focusing it doesn't count as reading inside. */
export const TOGGLE_ATTR = { "data-autoplay-toggle": "" } as const;

/**
 * Autoplay state for one explainer. Spread `rootProps` on its outermost
 * element (pointer and focus pausing), call `stop()` from every user-input
 * handler and `end()` when the walk reaches its last step, and render the
 * toggle (with TOGGLE_ATTR) only while `eligible`.
 */
export function useAutoplay(root: RefObject<HTMLElement | null>, { rootMargin = "0px" }: { rootMargin?: string } = {}) {
  const client = useIsClient();
  const motion = useMotionAllowed();
  const wide = useMediaQuery(AUTOPLAY_QUERY);
  const visible = usePageVisible();
  const inView = useInView(root, { rootMargin });
  const [playing, setPlaying] = useState(true);
  const [ended, setEnded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  /** Autoplay may run here at all: a wide screen, a real pointer, motion allowed. */
  const eligible = client && motion && wide;
  /** Autoplay is on (the toggle reads "Pause"). */
  const on = eligible && playing;
  /** Autoplay is on and nothing is holding it, so its timers run. */
  const running = on && inView && visible && !hovered && !focused;

  /** Any user input: stop for the rest of the visit. */
  const stop = useCallback(() => setPlaying(false), []);
  /** The walk reached its last step: stop there, and offer a replay. */
  const end = useCallback(() => {
    setPlaying(false);
    setEnded(true);
  }, []);
  /** The toggle: pause, or resume (the caller starts again from the top when `ended`). */
  const toggle = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    // Resuming with the mouse: the pointer is over the explainer, which would
    // otherwise hold it paused until it leaves and comes back.
    setHovered(false);
    setEnded(false);
    setPlaying(true);
  };

  const rootProps = {
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType === "mouse") setHovered(true);
    },
    onPointerLeave: () => setHovered(false),
    onFocus: (e: FocusEvent) => setFocused(!(e.target as HTMLElement).closest("[data-autoplay-toggle]")),
    onBlur: (e: FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
    },
  };

  return { eligible, on, running, ended, inView, stop, end, toggle, rootProps };
}

/* ---------- Analytics, decoupled ------------------------------------------
   Components only announce what the visitor chose, as a "blok:track" event
   on document; whatever handles analytics (consent-gated) listens for it.
   Fire from user input only: never from autoplay, hover or page load. */

export type TrackParams = Record<string, string | number | boolean>;

export function track(name: string, params: TrackParams = {}) {
  if (typeof document === "undefined") return;
  document.dispatchEvent(new CustomEvent("blok:track", { detail: { name, params } }));
}

export type ContentType = "index" | "index_component" | "protocol_layer" | "rules_scenario" | "allocation_share";

/** GA4's `select_content`, for a pick the visitor made. */
export function trackSelect(content_type: ContentType, content_id: string) {
  track("select_content", { content_type, content_id });
}

/** A stable id from a label: "Marketing & PR" -> "marketing-pr". */
export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
