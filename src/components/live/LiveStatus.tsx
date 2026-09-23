"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ago, type LiveState } from "@/lib/live/useLive";

/** Static states for data that has no live source (yet). */
export type StaticState = "nodata" | "soon";

const look: Record<LiveState | StaticState, { label: string; dot: string; text: string }> = {
  live: { label: "Live", dot: "bg-leaf", text: "text-leaf" },
  updating: { label: "Updating", dot: "bg-leaf", text: "text-leaf" },
  loading: { label: "Syncing", dot: "bg-cobalt", text: "text-cobalt" },
  delayed: { label: "Delayed", dot: "bg-caution", text: "text-caution" },
  offline: { label: "Offline", dot: "bg-fg-subtle", text: "text-fg-muted" },
  error: { label: "Unavailable", dot: "bg-negative", text: "text-negative" },
  paused: { label: "Paused", dot: "bg-fg-subtle", text: "text-fg-muted" },
  nodata: { label: "No data yet", dot: "border border-fg-subtle", text: "text-fg-muted" },
  soon: { label: "Coming soon", dot: "border border-dashed border-fg-subtle", text: "text-fg-muted" },
};

function detail(state: LiveState | StaticState, updatedAt: number | null, now: number, source?: string) {
  const when = updatedAt ? ago(updatedAt, now) : null;
  switch (state) {
    case "live":
    case "updating":
      return when ? `Updated ${when}` : "";
    case "loading":
      return source ? `Reading ${source}` : "Waiting for the latest data";
    case "delayed":
      return when ? `Last good read ${when}; retrying` : "Retrying";
    case "offline":
      return when ? `You're offline. Showing the read from ${when}` : "You're offline";
    case "error":
      return source ? `Couldn't reach ${source}` : "Couldn't load this data";
    case "paused":
      return when ? `Paused off-screen · last read ${when}` : "Paused off-screen";
    case "nodata":
      return "Published here once it exists on-chain";
    case "soon":
      return "Not connected yet";
  }
}

/**
 * The one status line for any piece of data. "Live" appears only when a real
 * read succeeded recently; everything else says plainly what's going on.
 */
export function LiveStatus({
  state,
  updatedAt = null,
  source,
  onRetry,
  className,
}: {
  state: LiveState | StaticState;
  updatedAt?: number | null;
  /** Human name of the source, e.g. "Arbitrum RPC". */
  source?: string;
  onRetry?: () => void;
  className?: string;
}) {
  const [now, setNow] = useState(() => Date.now());
  const ticking = state === "live" || state === "updating" || state === "delayed";
  useEffect(() => {
    if (!ticking) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [ticking]);

  const l = look[state];
  const text = detail(state, updatedAt, now, source);
  return (
    <p
      className={cn("flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1 text-caption text-fg-subtle", className)}
      // Announce state changes, not every second of the clock.
      aria-live="polite"
      aria-atomic="false"
    >
      <span className={cn("inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em]", l.text)}>
        <span aria-hidden className="relative inline-flex size-1.5">
          {state === "live" && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-leaf" />}
          {state === "updating" && <span className="absolute inset-[-2px] animate-spin rounded-full border border-leaf/60 border-t-transparent" />}
          {state === "loading" && <span className="absolute inset-0 animate-pulse rounded-full bg-cobalt" />}
          <span className={cn("relative size-1.5 rounded-full", l.dot)} />
        </span>
        {l.label}
      </span>
      <span className="tabular" aria-hidden={ticking}>{text}</span>
      {ticking && <span className="sr-only">{l.label}</span>}
      {(state === "error" || state === "delayed") && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-line/15 px-2 py-0.5 text-[11px] text-fg-muted transition-colors hover:border-leaf/40 hover:text-fg"
        >
          Retry now
        </button>
      )}
    </p>
  );
}
