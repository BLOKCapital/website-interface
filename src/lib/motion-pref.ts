/**
 * The site-wide "Pause motion" switch (D-12). Stored in localStorage and
 * applied as `<html data-motion="paused">` before first paint by
 * RevealScript; globals.css then treats the page exactly like
 * prefers-reduced-motion, and lib/motion.ts's hooks report motion as off.
 *
 * No "use client" here: RevealScript is a server component and inlines the
 * key into its script, so it must import a plain string.
 */
export const MOTION_KEY = "blok:motion";
/** Dispatched on window whenever the switch changes. */
export const MOTION_EVENT = "blok:motion";

export const isMotionPaused = () =>
  typeof document !== "undefined" && document.documentElement.getAttribute("data-motion") === "paused";

/** Turns Pause motion on or off for this visit and later ones. */
export function setMotionPaused(paused: boolean) {
  const root = document.documentElement;
  if (paused) root.setAttribute("data-motion", "paused");
  else root.removeAttribute("data-motion");
  try {
    if (paused) localStorage.setItem(MOTION_KEY, "paused");
    else localStorage.removeItem(MOTION_KEY);
  } catch {
    // Storage blocked: the choice holds for this page view only.
  }
  window.dispatchEvent(new Event(MOTION_EVENT));
}
