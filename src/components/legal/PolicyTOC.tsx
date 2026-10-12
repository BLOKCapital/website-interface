"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; text: string };

/**
 * Table of contents with scroll-spy for the legal pages: the sticky column
 * on desktop, the collapsed list at the top on phones, and the list inside
 * the phone Contents sheet (ContentsSheet), which passes `onNavigate` and
 * hides the label because the sheet has its own heading.
 */
export function PolicyTOC({
  headings,
  label = true,
  onNavigate,
}: {
  headings: TocItem[];
  /** Show the "Contents" label above the list. */
  label?: boolean;
  /** Called when a section link is followed; may take over the navigation. */
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);

  // The current section is the last heading above a line 30% down the
  // viewport. Measured on scroll (once per frame) rather than with an
  // IntersectionObserver band, so it's also right after a jump that lands
  // between headings (a TOC link, Home/End, a reload mid-page).
  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top > line) break;
        current = el.id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Contents">
      {label && <p className="text-caption font-semibold uppercase tracking-[0.12em] text-fg-subtle">Contents</p>}
      <ol className={cn("space-y-1 border-l border-line/[0.1]", label && "mt-4")}>
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={active === h.id ? "location" : undefined}
              onClick={onNavigate ? (e) => onNavigate(e, h.id) : undefined}
              className={cn(
                "-ml-px block border-l py-1.5 pl-4 text-small transition-colors",
                active === h.id ? "border-leaf text-fg" : "border-transparent text-fg-subtle hover:text-fg-muted",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
