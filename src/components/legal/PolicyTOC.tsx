"use client";

import { useMemo, type MouseEvent } from "react";
import { useScrollSpy } from "@/lib/scroll-spy";
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
  // The current section is the last heading above a line 30% down the
  // viewport (useScrollSpy); above the first heading, it's the first.
  const ids = useMemo(() => headings.map((h) => h.id), [headings]);
  const active = useScrollSpy(ids) ?? headings[0]?.id ?? null;

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Contents">
      {label && <p className="text-caption font-semibold uppercase tracking-caps text-fg-subtle">Contents</p>}
      <ol className={cn("space-y-1 border-l border-line/10", label && "mt-4")}>
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
