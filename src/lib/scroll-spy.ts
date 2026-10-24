"use client";

import { useEffect, useRef, useState } from "react";

export type SpyFrame = {
  /** The sections, in page order (the ids that exist on the page). */
  els: HTMLElement[];
  /** Index of the current section, or -1 above the first one. */
  index: number;
  /** The reading line, in px from the top of the viewport. */
  line: number;
};

/**
 * Scroll-spy: the current section is the last of `ids` whose top is above a
 * reading line (30% down the viewport unless `line` says otherwise).
 * Measured on scroll, once per frame, rather than with an
 * IntersectionObserver band, so it's also right after a jump that lands
 * between sections (a contents link, Home/End, a reload mid-page).
 *
 * Returns the current section's id (null above the first one). `onFrame`
 * runs on every measured frame, for work that shouldn't re-render (a
 * progress bar).
 */
export function useScrollSpy(
  ids: readonly string[],
  { line = (vh: number) => vh * 0.3, onFrame }: { line?: (vh: number) => number; onFrame?: (f: SpyFrame) => void } = {},
) {
  const [active, setActive] = useState<string | null>(null);
  // Latest callbacks, without re-subscribing on every render.
  const opts = useRef({ line, onFrame });
  opts.current = { line, onFrame };
  const key = ids.join(" ");

  useEffect(() => {
    const els = key
      .split(" ")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const at = opts.current.line(window.innerHeight);
      let i = -1;
      for (const el of els) {
        if (el.getBoundingClientRect().top > at) break;
        i++;
      }
      setActive(els[i]?.id ?? null);
      opts.current.onFrame?.({ els, index: i, line: at });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [key]);

  return active;
}
