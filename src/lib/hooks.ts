import { useSyncExternalStore } from "react";

// Stable no-op subscription — client-vs-server never changes after hydration.
const noop = () => () => {};

/**
 * Returns false during SSR and the first client render, then true once mounted.
 * Uses useSyncExternalStore (the SSR-safe primitive) so it doesn't initialize
 * state from a mount-only effect. Handy for gating client-only / non-deterministic
 * UI (e.g. randomized decorative layers) past hydration without a mismatch.
 */
export function useIsClient() {
  return useSyncExternalStore(
    noop,
    () => true, // client snapshot
    () => false, // server snapshot
  );
}

const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

/**
 * True once the page has scrolled past `threshold` px. Reads live scroll
 * position via useSyncExternalStore (false on the server) so there's no
 * mount-effect state initialization.
 */
export function useScrolled(threshold = 12) {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > threshold,
    () => false,
  );
}

const subscribeView = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  window.addEventListener("resize", cb);
  return () => {
    window.removeEventListener("scroll", cb);
    window.removeEventListener("resize", cb);
  };
};

/** Whether a dark band ([data-band="dark"]) spans the horizontal line at `y` px. */
function darkBandAt(y: number) {
  for (const el of document.querySelectorAll('[data-band="dark"]')) {
    const r = el.getBoundingClientRect();
    if (r.top <= y && r.bottom > y) return true;
  }
  return false;
}

/**
 * True while a dark band sits under the line `y` px from the top of the
 * viewport, so the sticky header can switch to the dark theme over it.
 */
export function useOverDarkBand(y = 36) {
  return useSyncExternalStore(
    subscribeView,
    () => darkBandAt(y),
    () => false,
  );
}
