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
 */
export function AnnouncementBar({ collapsed }: { collapsed: boolean }) {
  const dismiss = () => {
    document.documentElement.setAttribute("data-bar", "hidden");
    try {
      localStorage.setItem(BAR_KEY, announcement.id);
    } catch {
      // Storage blocked: it stays hidden for this page view only.
    }
  };

  return (
    <div
      id="announce"
      inert={collapsed}
      className={cn(
        "grid transition-[grid-template-rows] duration-base ease-expo",
        collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="theme-dark relative border-b border-line/[0.07] bg-canvas">
          <div className="mx-auto flex h-10 w-full max-w-page items-center justify-center gap-3 pl-5 pr-12 text-caption sm:px-12">
            <Badge tone="soon" className="self-center py-0.5 font-mono text-[11px] uppercase tracking-[0.12em]">
              {announcement.label}
            </Badge>
            <p className="min-w-0 truncate text-fg-muted">
              <span className="hidden md:inline">{announcement.text} </span>
              <a
                href={social("discord").href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-fg underline decoration-line/30 underline-offset-4 transition-colors duration-fast hover:decoration-leaf"
              >
                <span className="sm:hidden">{announcement.cta.short}</span>
                <span className="hidden sm:inline">{announcement.cta.long}</span> <span aria-hidden>→</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss announcement"
            className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-fg-subtle transition-colors duration-fast hover:text-fg sm:right-4"
          >
            <CrossIcon size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
