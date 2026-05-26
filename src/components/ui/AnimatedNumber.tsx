"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Note: `format` is a *string mode*, not a function. Functions cannot cross the
 * Server → Client Component boundary (RSC serializes props as JSON), so this
 * component owns its formatters and the server picks one by name.
 */
type FormatMode = "number" | "compactUsd" | "compactNumber" | "percent";

type Props = {
  value: number;
  /** ms to count up. Default 1600. */
  duration?: number;
  /** Number of decimal places (only honored when format = "number"). Default 0. */
  decimals?: number;
  /** Built-in formatter to apply. Default "number". */
  format?: FormatMode;
  /** Prefix (e.g. "$"). */
  prefix?: string;
  /** Suffix. */
  suffix?: string;
  className?: string;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const formatters: Record<FormatMode, (n: number, decimals: number) => string> = {
  number: (n, d) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }),
  compactUsd: (n) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${n.toFixed(0)}`;
  },
  compactNumber: (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toFixed(0);
  },
  percent: (n, d) => `${n.toFixed(d)}%`,
};

export function AnimatedNumber({
  value,
  duration = 1600,
  decimals = 0,
  format = "number",
  prefix = "",
  suffix = "",
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setDisplay(value * easeOut(t));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) run();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  const formatted = formatters[format](display, decimals);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
