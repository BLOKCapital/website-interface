"use client";

import { useEffect, useRef, useState } from "react";
import { easeOut, useInView, useReducedMotion } from "@/lib/motion";
import { useIsClient } from "@/lib/hooks";

const fmt = new Intl.NumberFormat("en-US");

/**
 * A real figure that counts up from zero the first time it scrolls into
 * view. The server HTML holds the final value (so no-JS, crawlers and
 * reduced motion all read the real number), and digits are tabular so the
 * width doesn't jitter while counting. Never use it on an invented number.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1400,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const client = useIsClient();
  const reduce = useReducedMotion();
  // Any part on screen counts as seen, so a visible figure never sits at 0.
  const seen = useInView(ref, { once: true });
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    if (!seen || reduce) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / duration);
      setN(Math.round(value * easeOut(k)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, reduce, value, duration]);

  // Server and reduced motion: the real value. Hydrated but not yet seen: 0.
  const shown = !client || reduce ? value : (n ?? 0);
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">
        {prefix}
        {fmt.format(value)}
        {suffix}
      </span>
      <span aria-hidden className="tabular">
        {prefix}
        {fmt.format(shown)}
        {suffix}
      </span>
    </span>
  );
}
