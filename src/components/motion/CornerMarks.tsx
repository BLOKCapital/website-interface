import { cn } from "@/lib/utils";

const corners = [
  "left-5 top-0 -translate-x-1/2 -translate-y-1/2 sm:left-8",
  "right-5 top-0 translate-x-1/2 -translate-y-1/2 sm:right-8",
  "bottom-0 left-5 -translate-x-1/2 translate-y-1/2 sm:left-8",
  "bottom-0 right-5 translate-x-1/2 translate-y-1/2 sm:right-8",
];

/**
 * "+" registration marks where a band's top and bottom edges meet the page
 * gutter, so sections read like sheets of one engineering drawing. Place
 * inside a `relative` full-bleed band; purely decorative.
 */
export function CornerMarks({ className, only }: { className?: string; only?: "top" | "bottom" }) {
  const marks = only === "top" ? corners.slice(0, 2) : only === "bottom" ? corners.slice(2) : corners;
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 mx-auto w-full max-w-page", className)}>
      {marks.map((c) => (
        <span key={c} className={cn("corner-mark absolute", c)} />
      ))}
    </div>
  );
}
