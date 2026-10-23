"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Replays a product picture when its card is hovered or focused: the card
 * comes alive under the pointer instead of only on first view. Restarts the
 * picture's finished CSS animations from their first frame (Web Animations
 * API), leaves any still playing alone, and does nothing with reduced motion
 * or Pause motion. The card is the closest <li>.
 */
export function ArtReplay({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const card = el?.closest("li");
    if (!el || !card || typeof el.getAnimations !== "function") return;
    const replay = () => {
      if (prefersReducedMotion()) return;
      for (const a of el.getAnimations({ subtree: true })) {
        if (a.playState !== "finished") continue;
        a.currentTime = 0;
        a.play();
      }
    };
    card.addEventListener("pointerenter", replay);
    card.addEventListener("focusin", replay);
    return () => {
      card.removeEventListener("pointerenter", replay);
      card.removeEventListener("focusin", replay);
    };
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
