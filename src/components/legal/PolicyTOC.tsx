"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; text: string };

/**
 * Sticky table of contents for legal pages.
 *
 * - Each anchor in `headings` is observed via IntersectionObserver. The
 *   item closest to the top-third of the viewport is highlighted.
 * - Clicking a link jumps to the section with smooth scroll (CSS-level,
 *   already global). Hash updates the URL.
 * - Renders nothing if `headings.length === 0`.
 */
export function PolicyTOC({ headings }: { headings: TocItem[] }) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting heading.
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (intersecting[0]) {
          setActive(intersecting[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 1] },
    );

    const nodes: HTMLElement[] = [];
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) {
        observer.observe(el);
        nodes.push(el);
      }
    }
    return () => {
      for (const el of nodes) observer.unobserve(el);
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Contents" className="text-[13px]">
      <p className="eyebrow mb-4 text-moss">Contents</p>
      <ol className="space-y-1.5">
        {headings.map((h, i) => {
          const isActive = active === h.id;
          return (
            <li key={h.id} className="leading-snug">
              <a
                href={`#${h.id}`}
                className={cn(
                  "group/t inline-flex items-baseline gap-2 py-0.5 transition-colors duration-200",
                  isActive
                    ? "text-moss-deep"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "shrink-0 font-mono text-[10.5px] tracking-wider transition-colors",
                    isActive ? "text-clay" : "text-ink-subtle",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "transition-all duration-200",
                    isActive && "font-medium",
                  )}
                >
                  {h.text}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
