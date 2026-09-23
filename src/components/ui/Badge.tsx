import { cn } from "@/lib/utils";

export type Tone = "live" | "current" | "done" | "soon" | "example" | "neutral";

const tones: Record<Tone, string> = {
  live: "border-leaf/35 bg-leaf/10 text-leaf",
  current: "border-bloom/35 bg-bloom/10 text-bloom",
  done: "border-leaf/25 bg-leaf/[0.06] text-leaf",
  soon: "border-dashed border-line/25 text-fg-muted",
  example: "border-caution/35 bg-caution/10 text-caution",
  neutral: "border-line/15 bg-raised text-fg-muted",
};

/**
 * Status chip with fixed meanings, site-wide:
 *   live — real data updating now (the only one that pulses)
 *   current — in progress · done — shipped · soon — planned
 *   example — illustrative, never real accounts or figures
 */
export function Badge({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 self-start whitespace-nowrap rounded-full border px-2.5 py-1 text-[11.5px] font-medium leading-none",
        tones[tone],
        className,
      )}
    >
      {tone !== "example" && tone !== "neutral" && (
        <span aria-hidden className="relative inline-flex size-1.5">
          {tone === "live" && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-current" />}
          <span className={cn("relative size-1.5 rounded-full", tone === "soon" ? "border border-current" : "bg-current")} />
        </span>
      )}
      {children}
    </span>
  );
}
