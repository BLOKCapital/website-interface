"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * Mounts the easter eggs (./Eggs.tsx) after the browser goes idle, so their
 * code and global keydown listener never compete with loading or hydration
 * (PERF-12). Eggs is its own chunk, fetched then; nothing of it is in the
 * shared layout bundle or the static HTML. A plain dynamic import() rather
 * than next/dynamic: the eggs never render on the server, and next/dynamic's
 * loader would add more to the layout chunk than the eggs themselves weigh.
 *
 * 👋 Curious developer — try ↑ ↑ ↓ ↓ ← → ← → B A in the page.
 * Also: type "wagmi" anywhere (no input focus needed).
 */
export function EasterEggs() {
  const [Eggs, setEggs] = useState<ComponentType | null>(null);
  useEffect(() => {
    let live = true;
    const load = () =>
      import("./Eggs").then(
        (m) => live && setEggs(() => m.Eggs),
        () => {}, // A failed chunk load only costs the eggs.
      );
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 4000 });
      return () => {
        live = false;
        window.cancelIdleCallback(id);
      };
    }
    const t = setTimeout(load, 2000);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, []);
  return Eggs ? <Eggs /> : null;
}
