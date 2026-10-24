"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Below this a page change feels instant, so the bar never flashes. */
const SHOW_AFTER = 120;
/** A navigation that never lands (offline, an error) doesn't leave it up. */
const GIVE_UP = 10000;

/**
 * A thin bar along the top while a page change is still loading: on a slow
 * connection, or for a link that wasn't prefetched yet. A prefetched page
 * swaps in within about 120ms and never shows it. The click listener runs in
 * the capture phase, before next/link calls preventDefault; only plain
 * left-clicks on same-site links to another page count. Decorative: the
 * route announcer and the focus move in app/template.tsx carry the change
 * for assistive tech. Styles: globals.css, "Page-change progress".
 */
export function NavProgress() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const stop = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    bar.current?.removeAttribute("data-state");
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      stop();
      timers.current.push(
        window.setTimeout(() => bar.current?.setAttribute("data-state", "loading"), SHOW_AFTER),
        window.setTimeout(stop, GIVE_UP),
      );
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // The new page has rendered: done.
  useEffect(stop, [pathname]);

  return <div ref={bar} aria-hidden className="nav-progress pointer-events-none fixed inset-x-0 top-0 z-toast h-0.5 origin-left bg-leaf" />;
}
