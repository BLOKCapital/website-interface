"use client";

import { setMotionPaused, useMotionPaused } from "@/lib/motion";

/**
 * The site-wide "Pause motion" switch (D-12): a toggle button, pressed while
 * motion is paused. It sets html[data-motion="paused"] (globals.css then
 * treats the page like prefers-reduced-motion), remembers the choice for
 * later visits (RevealScript re-applies it before first paint) and tells
 * every motion hook (lib/motion.ts) to settle.
 *
 * Unstyled on purpose: the footer and mobile menu style it to fit with
 * `className`. Its accessible name is always "Pause motion"; the pressed
 * state carries on/off.
 */
export function MotionToggle({ className }: { className?: string }) {
  const paused = useMotionPaused();
  return (
    <button type="button" aria-pressed={paused} onClick={() => setMotionPaused(!paused)} className={className}>
      Pause motion
    </button>
  );
}
