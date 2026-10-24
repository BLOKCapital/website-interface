"use client";

import { useRef } from "react";
import { useInView, useMotionAllowed } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A handwritten payoff word that writes itself in, left to right, the first
 * time it scrolls into view; then its underline draws under it (globals.css,
 * "Handwriting"). For the script <em> in a headline.
 *
 * Pure CSS once started: the text is the only copy in the DOM, revealed by
 * a clip, so screen readers and crawlers read it once and it holds its
 * layout throughout. The wrapper is inline, so the space before it stays in
 * the accessible name. Server HTML, no JS and motion off (reduced motion or
 * Pause motion) show the word at rest.
 */
export function Handwrite({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const allowed = useMotionAllowed();
  const seen = useInView(ref, { once: true, rootMargin: "0px 0px -15% 0px" });
  return (
    <span ref={ref} className={cn("whitespace-nowrap", seen && allowed && "write-in", className)}>
      {text}
    </span>
  );
}
