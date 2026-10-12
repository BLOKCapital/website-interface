import { cn } from "@/lib/utils";

const fmt = new Intl.NumberFormat("en-GB");

/**
 * A real figure, formatted, in tabular digits. It no longer counts up from
 * zero (D-34, MOT-12): counting 0 → 3 told the reader nothing, and a
 * hydrated page read "0B" and "Decimals 0" until it was scrolled to, on
 * screen, in screenshots and on paper. The value is the same on the server
 * and the client, in one copy (no sr-only twin, SEO-17), and it doesn't
 * move: figures are data being read (C-motion §4.5).
 *
 * The name and props stay so existing callers compile; `duration` is
 * accepted and ignored. Server-safe. Never use it on an invented number.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  /** @deprecated No longer animates; ignored. */
  duration?: number;
  className?: string;
}) {
  return (
    <span className={cn("tabular", className)}>
      {prefix}
      {fmt.format(value)}
      {suffix}
    </span>
  );
}
