"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { PolicyTOC, type TocItem } from "@/components/legal/PolicyTOC";
import { cn } from "@/lib/utils";

/**
 * Phones and tablets (below lg, UX-24): once the Contents list at the top of
 * a policy has scrolled away, a small "Contents" button sticks to the foot
 * of the screen and reopens the list as a bottom sheet, so a reader 10,000px
 * into the User Agreement can jump sections without losing their place.
 *
 * Place it last in the policy's text column: it sticks to the bottom of the
 * viewport while that column is on screen and comes to rest at the column's
 * end. `watch` is the id of the top Contents list; the button shows once
 * that list is above the viewport. A native modal <dialog> brings focus
 * containment, Escape and focus return; the sheet opens at the section
 * being read, and choosing a section closes it and moves focus to that
 * section's heading. Without JS the button stays hidden and the top list
 * still works. Hidden in print.
 */
export function ContentsSheet({ headings, watch }: { headings: TocItem[]; watch: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watch);
    if (!target || typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(target);
    return () => io.disconnect();
  }, [watch]);

  if (headings.length === 0) return null;

  const open = () => {
    const d = dialog.current;
    if (!d) return;
    d.showModal();
    // Start the list at the section being read.
    d.querySelector('[aria-current="location"]')?.scrollIntoView({ block: "center" });
  };
  const close = () => dialog.current?.close();

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    // A modified click opens a new tab or window: leave it to the browser.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const heading = document.getElementById(id);
    if (!heading) return;
    e.preventDefault();
    close();
    history.pushState(history.state, "", `#${id}`);
    // Smooth or instant per the page's scroll-behavior (instant with motion
    // off), and below the sticky header via scroll-padding-top.
    heading.scrollIntoView({ block: "start" });
    // A programmatic focus target: out of the tab order, no ring.
    if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
    heading.style.outline = "none";
    heading.focus({ preventScroll: true });
  };

  return (
    <>
      {/* Toggled by class, not the hidden attribute, which `flex` would override. */}
      <div data-print-hide className={cn("pointer-events-none sticky bottom-4 z-raised mt-10 justify-end lg:hidden", show ? "flex" : "hidden")}>
        <button
          type="button"
          onClick={open}
          aria-haspopup="dialog"
          className="pointer-events-auto inline-flex h-11 items-center gap-2 rounded-full border border-line/15 bg-card px-4 text-small font-medium text-fg shadow-e2 transition-[border-color,background-color,transform] duration-fast ease-out active:scale-[var(--scale-press)] active:duration-instant can-hover:hover:border-line/30 can-hover:hover:bg-raised"
        >
          <Icon name="menu" size="sm" />
          Contents
        </button>
      </div>

      {/* Outside the button's wrapper: a dialog under a hidden ancestor
          isn't rendered, even in the top layer. */}
      <dialog
        ref={dialog}
        aria-labelledby="contents-sheet-title"
        // A click on the backdrop (the dialog box itself, outside the panel) closes it.
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-0 mt-auto max-h-[min(80dvh,40rem)] w-full max-w-none overflow-hidden rounded-t-panel border border-b-0 border-subtle bg-card p-0 text-fg shadow-e3 backdrop:bg-black/40 open:animate-rise motion-off:open:animate-none sm:mx-auto sm:max-w-lg"
      >
        <div className="flex max-h-[inherit] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-subtle px-5 py-3">
            <h2 id="contents-sheet-title" className="text-caption font-semibold uppercase tracking-[0.12em] text-fg-subtle">
              Contents
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Close contents"
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-fg-muted transition-colors duration-fast can-hover:hover:bg-raised can-hover:hover:text-fg"
            >
              <Icon name="cross" />
            </button>
          </div>
          <div className="overflow-y-auto overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            <PolicyTOC headings={headings} label={false} onNavigate={go} />
          </div>
        </div>
      </dialog>
    </>
  );
}
