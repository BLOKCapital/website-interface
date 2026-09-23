"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; text: string };

/** Sticky table of contents with scroll-spy for the legal pages. */
export function PolicyTOC({ headings }: { headings: TocItem[] }) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Contents">
      <p className="text-caption font-semibold uppercase tracking-[0.12em] text-fg-subtle">Contents</p>
      <ol className="mt-4 space-y-1 border-l border-line/[0.1]">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={active === h.id ? "location" : undefined}
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
