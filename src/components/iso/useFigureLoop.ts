"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";
import { usePageVisible } from "@/lib/explainers";
import { useInView, useMotionAllowed } from "@/lib/motion";

/**
 * The machine figures' loop (components/iso): the steps play one after
 * another and start over, for as long as the figure is on screen, until the
 * visitor presses Pause. Picking a step jumps there and the loop carries on
 * from it. Unlike the one-pass explainers (lib/explainers.ts), a figure is a
 * running machine, so it keeps running; the Pause button (WCAG 2.2.2) is the
 * way to stop it, and it never runs with reduced motion or the site's Pause
 * motion switch (the figure then holds the picked step's still frame), off
 * screen, or in a hidden tab.
 *
 * `dwell` must be stable (define it outside the component): how long step i
 * stays up, which covers its motion and a read of its readout.
 */
export function useFigureLoop(root: RefObject<HTMLElement | null>, count: number, dwell: (i: number) => number) {
  const motion = useMotionAllowed();
  const inView = useInView(root, { rootMargin: "0px 0px -15% 0px" });
  const visible = usePageVisible();
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0); // re-keys the moving parts, so a step always replays
  const [playing, setPlaying] = useState(true);

  const go = useCallback((i: number) => {
    setStep(i);
    setRun((r) => r + 1);
  }, []);

  const running = motion && playing && inView && visible;
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => go((step + 1) % count), dwell(step));
    return () => clearTimeout(t);
  }, [running, step, run, count, dwell, go]);

  return {
    step,
    /** Changes on every step change, to re-key the moving parts. */
    key: `${step}-${run}`,
    go,
    /** Motion is allowed, so there is a loop to pause. */
    canPlay: motion,
    playing: motion && playing,
    toggle: () => setPlaying((p) => !p),
  };
}
