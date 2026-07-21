"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A horizontal bar that draws in from the left when scrolled into view.
 * Drop-in replacement for a static `<span>` fill inside a track — keep the
 * width/color on this element (className or style) and it scales open once.
 * Usable from server components; reduced-motion users get the final state
 * via the global MotionConfig.
 */
export function DrawBar({
  className,
  style,
  delay = 0,
}: {
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  return (
    <m.span
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn("origin-left", className)}
      style={style}
    />
  );
}
