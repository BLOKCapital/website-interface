"use client";

import { useEffect, useRef } from "react";
import { formatUsd } from "@/lib/live/prices";
import type { LiveState } from "@/lib/live/useLive";
import { cn } from "@/lib/utils";

/**
 * One live price. While the first read is in flight: a skeleton the width
 * of a price (7ch of tabular digits) that says "Loading price" to screen
 * readers. Offline or failing with nothing to show: "—", not a skeleton
 * that suggests data is on its way. When a price arrives or changes, a
 * single leaf tint fades out behind it (colour only, never under reduced
 * motion or Pause motion; globals.css "Live values"). Mounting with a price
 * already known, as on a tab switch, doesn't tint.
 */
export function LivePrice({ price, state, className }: { price: number | undefined; state: LiveState; className?: string }) {
  const text = price === undefined ? undefined : formatUsd(price);
  const el = useRef<HTMLSpanElement>(null);
  const last = useRef(text);

  useEffect(() => {
    if (last.current === text) return;
    last.current = text;
    const node = el.current;
    if (!node || text === undefined) return;
    // Restart the tint, even if the previous one is still fading.
    node.classList.remove("value-tint");
    void node.offsetWidth;
    node.classList.add("value-tint");
  }, [text]);

  if (text !== undefined) {
    return (
      <span ref={el} className={cn("rounded-xs", className)}>
        {text}
      </span>
    );
  }
  if (state === "offline" || state === "error") {
    return (
      <span className={className}>
        <span aria-hidden>—</span>
        <span className="sr-only">No price available</span>
      </span>
    );
  }
  return (
    <span className={cn("inline-block h-[1em] w-[7ch] animate-pulse rounded bg-raised align-middle", className)}>
      <span className="sr-only">Loading price</span>
    </span>
  );
}
