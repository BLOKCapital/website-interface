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
