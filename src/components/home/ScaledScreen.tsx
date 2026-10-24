"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The widths the app screen is laid out at: a desktop window, or a phone. */
const DESKTOP = 1280;
const PHONE = 430;
/** Below this frame width the phone layout reads better than a shrunken desktop. */
const PHONE_BELOW = 600;

/**
 * Shows a full app screen the way a screenshot would: laid out at a real
 * window width (1280, or 430 in a narrow frame) and scaled down to the frame,
 * so the whole screen fits instead of the top of it at full size. The frame
 * keeps its own aspect ratio (set by the caller), so measuring after
 * hydration never shifts the layout; until then it assumes the desktop
 * frame, which is what it is above the fold on wide screens.
 */
export function ScaledScreen({ children, className }: { children: ReactNode; className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const design = width != null && width < PHONE_BELOW ? PHONE : DESKTOP;
  const scale = (width ?? 1022) / design;

  return (
    <div ref={frame} className={cn("relative overflow-hidden", className)}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: design, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
