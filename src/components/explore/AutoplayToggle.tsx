"use client";

import { TOGGLE_ATTR } from "@/lib/explainers";
import { cn } from "@/lib/utils";

const LABELS = ["Pause", "Resume", "Replay"] as const;

/**
 * The explainers' play/pause control (lib/explainers.ts): "Pause" while
 * autoplay is on, "Resume" once the visitor has taken over or paused it,
 * "Replay" after a walk has played through to its last step.
 */
export function AutoplayToggle({
  on,
  ended,
  onClick,
  what,
  className,
}: {
  /** Autoplay is on. */
  on: boolean;
  /** The walk played through to its last step. */
  ended: boolean;
  onClick: () => void;
  /** What plays, for screen readers: "the walkthrough". */
  what: string;
  className?: string;
}) {
  const label = on ? "Pause" : ended ? "Replay" : "Resume";
  return (
    <button
      type="button"
      {...TOGGLE_ATTR}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-2 rounded-full border border-line/12 px-3.5 text-caption text-fg-muted transition-colors duration-fast hover:border-line/30 hover:text-fg active:bg-line/[0.06]",
        className,
      )}
    >
      <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden fill="currentColor">
        {on ? <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" /> : <path d="M2.5 1v10l8.5-5z" />}
      </svg>
      <span>
        {/* Sized for its longest label, so the button never changes width. */}
        <span className="inline-grid">
          {LABELS.map((l) => (
            <span key={l} aria-hidden={l !== label || undefined} className={cn("col-start-1 row-start-1", l !== label && "invisible")}>
              {l}
            </span>
          ))}
        </span>
        <span className="sr-only"> {what}</span>
      </span>
    </button>
  );
}
