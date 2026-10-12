import type { ReactNode } from "react";
import { protocolStatus } from "@/lib/data/status";
import { cn } from "@/lib/utils";

export type Tone = "live" | "current" | "done" | "soon" | "example" | "neutral";

// Text ≥ 4.5:1 on canvas, surface, card and raised, under each tone's own
// tint (Day, 12px): live 4.59–5.25, current 5.01–5.74 (the darker
// --bloom-text step), done 4.85–5.56, soon 7.3–8.5, example 5.13–5.86 (the
// darker --caution-text step). Night tones are 6.5:1 or more.
const tones: Record<Tone, string> = {
  live: "border-success/35 bg-success/10 text-success",
  current: "border-progress/35 bg-progress/10 text-progress-text",
  done: "border-success/25 bg-success/6 text-success",
  soon: "border-dashed border-line/25 text-fg-muted",
  example: "border-warning/35 bg-warning/10 text-warning-text",
  neutral: "border-line/15 bg-raised text-fg-muted",
};

/**
 * The fixed status vocabulary (CRO-26, CRO-27): one wording and one tone per
 * meaning, site-wide. Prefer `<Badge status="…" />` over a free label.
 */
export const BADGE_STATUS = {
  /** Real data updating now; the only badge that pulses. */
  live: { tone: "live", label: "Live" },
  /** The protocol's launch state (lib/data/status.ts). */
  testing: { tone: "current", label: protocolStatus.label },
  progress: { tone: "current", label: "In progress" },
  planned: { tone: "soon", label: "Planned" },
  done: { tone: "done", label: "Done" },
  /** Illustrative content: never real accounts or figures. */
  example: { tone: "example", label: "Example" },
  /** A DAO proposal that can be voted on now. */
  voting: { tone: "live", label: "Voting open" },
} as const satisfies Record<string, { tone: Tone; label: string }>;

export type BadgeStatus = keyof typeof BADGE_STATUS;

type Props = { className?: string } & (
  | { status: BadgeStatus; tone?: never; children?: never }
  | { tone: Tone; status?: never; children: ReactNode }
);

/**
 * Status chip with fixed meanings, site-wide:
 *   live / voting open — real, happening now (pulses)
 *   in private testing / in progress — current · done — shipped · planned
 *   example — illustrative, never real accounts or figures
 * `status` picks the tone and the wording; `tone` with your own label is the
 * older form, kept while pages move over.
 */
export function Badge(props: Props) {
  const { className } = props;
  const tone: Tone = props.status ? BADGE_STATUS[props.status].tone : props.tone;
  const label = props.status ? BADGE_STATUS[props.status].label : props.children;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 self-start whitespace-nowrap rounded-full border px-2.5 py-1 text-label font-medium leading-none",
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
      {label}
    </span>
  );
}
