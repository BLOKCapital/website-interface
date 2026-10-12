"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Its own module, not lib/hooks.ts: only the header needs it, and pages that
// import useIsClient shouldn't carry it.

/**
 * True while a dark band ([data-band="dark"]) sits under the line `y` px
 * from the top of the viewport, so the sticky header can switch to the dark
 * theme over it.
 *
 * An IntersectionObserver watches a 1 px strip at `y` (the viewport, inset by
 * rootMargin), so scrolling costs nothing on the main thread: no scroll
 * listener, no querySelectorAll or getBoundingClientRect per event. The
 * bands are found again on each route change (the header outlives pages),
 * and the strip is re-measured on resize.
 */
export function useOverDarkBand(y = 36) {
  const pathname = usePathname();
  const [over, setOver] = useState(false);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const hits = new Set<Element>();
    let io: IntersectionObserver | null = null;
    let frame = 0;
    const observe = () => {
      frame = 0;
      io?.disconnect();
      hits.clear();
      const bands = document.querySelectorAll('[data-band="dark"]');
      if (!bands.length) {
        setOver(false);
        return;
      }
      const below = Math.max(0, window.innerHeight - y - 1);
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) hits.add(e.target);
            else hits.delete(e.target);
          }
          setOver(hits.size > 0);
        },
        { rootMargin: `${-y}px 0px ${-below}px 0px` },
      );
      bands.forEach((el) => io!.observe(el));
    };
    const onResize = () => {
      if (!frame) frame = requestAnimationFrame(observe);
    };
    observe();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      io?.disconnect();
    };
  }, [y, pathname]);
  return over;
}
