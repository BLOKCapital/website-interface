import type { CSSProperties, ReactNode } from "react";
import { splitWords } from "./SplitText";
import { cn } from "@/lib/utils";

/**
 * A statement that inks in word by word as it scrolls through the viewport
 * (a CSS view timeline; see "Scroll ink" in globals.css). Unlike a fade
 * from invisible, every word starts readable, so skimmers, screenshots and
 * crawlers always get the full sentence. No client JS.
 */
export function ScrollInk({ children, className }: { children: ReactNode; className?: string }) {
  const { nodes, count } = splitWords(children, "ink-word");
  return (
    <p className={cn("ink-scope", className)} style={{ "--n": Math.max(count - 1, 1) } as CSSProperties}>
      {nodes}
    </p>
  );
}
