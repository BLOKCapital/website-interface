"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CopyButton } from "@/components/ui/CopyButton";
import { useScrollSpy } from "@/lib/scroll-spy";
import { useOverDarkBand } from "@/lib/dark-band";
import { prefersReducedMotion } from "@/lib/motion";
import { siteConfig } from "@/lib/seo/site";
import { cn } from "@/lib/utils";

export type SectionNavItem = { id: string; label: string };

/**
 * A long page's sections, as a bar that sticks under the header: where you
 * are, how far through it you've read, and a jump to any other part (the
 * Trust menu lands visitors mid-page). Put it right after the PageHero.
 *
 * - The current section is the last one whose top has passed a reading line
 *   (useScrollSpy); its underline fills as you read through it. The fill is
 *   written as a CSS variable each frame, so scrolling never re-renders.
 * - Over a dark band it turns dark, like the header; past the last section
 *   (the closing band and footer) it steps aside.
 * - Phones: the tabs scroll sideways, and the current one is kept in view.
 * - "Copy link" copies the current section's URL, for pasting in Discord.
 *
 * It takes no room in the flow (h-0): the bar overlaps the top padding of the
 * section after the hero, and the header row's heights (Nav.tsx) set where it
 * sticks. On its page, html gets --subnav (its height): anchors land below
 * it, and pinned panels (ProductStack, IndexExplorer) pin below it.
 */
export function SectionNav({ items, label = "On this page" }: { items: SectionNavItem[]; label?: string }) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const active = useScrollSpy(ids, {
    // Below the header and the bar themselves, wherever 30% falls.
    line: (vh) => Math.max(vh * 0.3, 160),
    onFrame: ({ els, index, line }) => {
      const el = root.current;
      if (!el) return;
      const cur = els[index];
      const r = cur?.getBoundingClientRect();
      const read = r ? Math.min(1, Math.max(0, (line - r.top) / r.height)) : 0;
      el.style.setProperty("--read", read.toFixed(3));
      const last = els[els.length - 1]?.getBoundingClientRect();
      el.toggleAttribute("data-done", !!last && last.bottom < line);
    },
  });
  // The bar's middle, under the header row.
  const overDark = useOverDarkBand(100);

  // Keep the current tab in view when the tabs overflow (phones).
  useEffect(() => {
    const ol = list.current;
    const tab = ol?.querySelector<HTMLElement>("[aria-current]");
    if (!ol || !tab || ol.scrollWidth <= ol.clientWidth) return;
    ol.scrollTo({ left: tab.offsetLeft - (ol.clientWidth - tab.offsetWidth) / 2, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [active]);

  const current = active ?? items[0]?.id;

  return (
    <div
      ref={root}
      // html:has([data-subnav]) moves anchors and pinned panels below the bar (globals.css).
      data-subnav=""
      className={cn(
        "group/bar pointer-events-none sticky z-subnav h-0",
        // Under the header row (64 / 72 / 52 px), or the top when a short viewport hides it.
        "top-16 sm:top-[72px] [@media(max-height:500px)]:top-[52px] [html[data-header=hidden]_&]:top-0",
        "transition-[top] duration-base ease-out",
      )}
    >
      <Container>
        <nav
          aria-label={label}
          className={cn(
            "pointer-events-auto -mx-3 mt-2 flex h-12 items-center gap-2 rounded-lg border border-line/10 bg-canvas/[0.92] pl-1 pr-1.5 shadow-e1 backdrop-blur-xl sm:-mx-5",
            "transition-[opacity,transform,visibility] duration-base ease-out",
            "group-data-[done]/bar:invisible group-data-[done]/bar:-translate-y-2 group-data-[done]/bar:opacity-0",
            overDark && "theme-dark",
          )}
        >
          <ol
            ref={list}
            className="focus-inset relative flex min-w-0 flex-1 gap-0.5 overflow-x-auto [mask-image:linear-gradient(90deg,transparent,#000_12px,#000_calc(100%-12px),transparent)] [scrollbar-width:none]"
          >
            {items.map((item, i) => {
              const on = item.id === active;
              return (
                <li key={item.id} className="shrink-0">
                  <a
                    href={`#${item.id}`}
                    aria-current={on ? "location" : undefined}
                    className={cn(
                      "relative flex h-10 items-center gap-2 whitespace-nowrap rounded-control px-3 text-small transition-colors duration-fast",
                      on ? "text-fg" : "text-fg-subtle can-hover:hover:text-fg-muted",
                    )}
                  >
                    <span aria-hidden className="font-mono text-label tabular-nums text-fg-subtle">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                    {on && (
                      <span aria-hidden className="absolute inset-x-3 bottom-1 h-0.5 overflow-hidden rounded-full bg-line/10">
                        <span className="block h-full origin-left scale-x-[var(--read,0)] bg-leaf" />
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ol>
          <CopyButton
            value={`${siteConfig.url}${pathname}#${current}`}
            label="Copy link"
            failed="Copy failed. Copy the tab's link instead"
            className="hidden shrink-0 md:inline-flex"
          />
        </nav>
      </Container>
    </div>
  );
}
