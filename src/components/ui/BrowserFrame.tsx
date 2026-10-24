import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A browser window around a product preview: three window dots and a locked
 * address bar. The chrome is decorative; the content inside carries the
 * meaning (give the surrounding <figure> a caption). Pure CSS, no images.
 */
export function BrowserFrame({ url, children, className }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-panel border border-subtle bg-card shadow-e3", className)}>
      <div aria-hidden className="flex items-center gap-3 border-b border-subtle bg-raised px-4 py-2.5">
        <span className="flex w-12 shrink-0 gap-1.5">
          <span className="size-2.5 rounded-full bg-line/15" />
          <span className="size-2.5 rounded-full bg-line/15" />
          <span className="size-2.5 rounded-full bg-line/15" />
        </span>
        <span className="mx-auto flex min-w-0 items-center gap-1.5 rounded-full border border-subtle bg-card px-3 py-1 font-mono text-label text-fg-muted">
          <svg width="11" height="11" viewBox="0 0 16 16" className="shrink-0 text-leaf">
            <rect x="3" y="7" width="10" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="truncate">{url}</span>
        </span>
        <span className="w-12 shrink-0" />
      </div>
      {children}
    </div>
  );
}
