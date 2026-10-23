"use client";

import { useEffect, type ReactNode } from "react";

// False until the first page has hydrated. A template remounts on every
// navigation, so any later mount is a client-side page change.
let hydrated = false;

/**
 * Wraps every page. On a fresh load the page simply paints (its own hero
 * entrance runs); after a client-side navigation, such as a nav link or
 * the logo, the new page appears at once with its hero already settled
 * (globals.css, "Page changes": no fade, no replayed entrance) and focus
 * moves to the start of its content, #main (A11Y-22): otherwise it stays
 * on the link that was clicked, often in the footer, and the next Tab
 * carries on from there. Next's route announcer still reads the title.
 */
export default function Template({ children }: { children: ReactNode }) {
  const navigated = hydrated;
  useEffect(() => {
    if (!hydrated) {
      hydrated = true;
      return;
    }
    // Leave it alone if something on the new page has already taken focus
    // (an autofocus field, or a dialog).
    const active = document.activeElement;
    const main = document.getElementById("main");
    if (!main || (active && active !== document.body && main.contains(active))) return;
    // A programmatic focus target: in the tab order nowhere, and no ring
    // around the whole page.
    if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
    main.style.outline = "none";
    main.focus({ preventScroll: true });
  }, []);
  return <div className={navigated ? "page-enter" : undefined}>{children}</div>;
}
