"use client";

import { useEffect, type ReactNode } from "react";

// False until the first page has hydrated. A template remounts on every
// navigation, so any later mount is a client-side page change.
let hydrated = false;

/**
 * Wraps every page. On a fresh load the page simply paints (its own hero
 * entrance runs); after a client-side navigation, such as a nav link or
 * the logo, the new page eases in (globals.css, "Page changes").
 */
export default function Template({ children }: { children: ReactNode }) {
  const animate = hydrated;
  useEffect(() => {
    hydrated = true;
  }, []);
  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
