"use client";

import { Badge } from "@/components/ui/Badge";
import { CrossIcon } from "@/components/ui/icons";
import { announcement, BAR_KEY } from "@/lib/announce";
import { social } from "@/lib/data/socials";
import { cn } from "@/lib/utils";

/**
 * A thin dark strip above the header: what's coming next, and one action.
 * It folds away once the page scrolls, and stays gone once dismissed:
 * RevealScript hides it before first paint on later visits, so it never
 * flashes. `inert` while folded keeps its link out of the tab order.
 *
 * - Below 640 px, and in short (landscape) viewports, it isn't shown at all
 *   (D-05): the phone header carries a Discord button instead.
 * - Only the descriptive text truncates; the Discord link keeps its whole
 *   label and the bar's full height as its hit area. Rings are drawn inset
 *   (`focus-inset`), so the fold wrapper's overflow can't clip them.
 * - Dismissing calls `onDismiss`, which Nav uses to put focus on the logo
 *   rather than letting it drop to <body>.
 */
export function AnnouncementBar({ collapsed, onDismiss }: { collapsed: boolean; onDismiss?: () => void }) {
  const dismiss = () => {
    document.documentElement.setAttribute("data-bar", "hidden");
    try {
      localStorage.setItem(BAR_KEY, announcement.id);
    } catch {
      // Storage blocked: it stays hidden for this page view only.
    }
    onDismiss?.();
  };

  return (
    <div
      id="announce"
      inert={collapsed}
      className={cn(
        "hidden transition-[grid-template-rows] duration-base ease-expo sm:grid [@media(max-height:500px)]:hidden",
        collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="theme-dark focus-inset relative border-b border-line/[0.07] bg-canvas">
          <div className="mx-auto flex h-11 w-full max-w-page items-center justify-center gap-3 px-14 text-caption">
            <Badge tone="soon" className="self-center py-0.5 font-mono text-[11px] uppercase tracking-[0.12em]">
              {announcement.label}
            </Badge>
            <p className="hidden min-w-0 truncate text-fg-muted md:block">{announcement.text}</p>
            <a
              href={social("discord").href}
              data-placement="announcement_bar"
              target="_blank"
              rel="noopener noreferrer"
              className="-mx-2 inline-flex shrink-0 items-center gap-1 self-stretch whitespace-nowrap rounded-md px-2 font-medium text-fg underline decoration-line/30 underline-offset-4 transition-colors duration-fast hover:decoration-leaf"
            >
              <span className="md:hidden">{announcement.cta.short}</span>
              <span className="hidden md:inline">{announcement.cta.long}</span> <span aria-hidden>→</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss announcement"
            className="absolute right-3 top-0 inline-flex size-11 items-center justify-center rounded-full text-fg-subtle transition-colors duration-fast hover:text-fg"
          >
            <CrossIcon size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
