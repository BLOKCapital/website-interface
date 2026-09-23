import { cn } from "@/lib/utils";

/**
 * Labelled horizontal bars, sorted as given. Bars read more accurately than a
 * donut and every value is printed, so nothing depends on telling colours
 * apart. All rows share one label width so the bars start on the same line.
 */
export function AllocationBars({
  items,
  className,
  caption,
}: {
  items: { label: string; pct: number }[];
  className?: string;
  /** Accessible description of what the percentages are of. */
  caption: string;
}) {
  const labelWidth = `${Math.max(...items.map((i) => i.label.length)) + 1}ch`;
  const max = Math.max(...items.map((i) => i.pct));
  return (
    <figure className={className}>
      <figcaption className="sr-only">{caption}</figcaption>
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i.label} className="flex items-center gap-3 text-small">
            <span className="shrink-0 text-fg" style={{ width: labelWidth, maxWidth: "46%" }}>
              {i.label}
            </span>
            <span aria-hidden className="relative h-2 flex-1 overflow-hidden rounded-full bg-line/[0.07]">
              <span
                className={cn("absolute inset-y-0 left-0 rounded-full", i.pct === max ? "bg-leaf" : "bg-leaf/55")}
                style={{ width: `${(i.pct / max) * 100}%` }}
              />
            </span>
            <span className="w-12 shrink-0 text-right font-mono text-[13px] text-fg tabular">{i.pct}%</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
