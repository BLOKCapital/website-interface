import { cn } from "@/lib/utils";

type Props = {
  score: number; // 0–100
  className?: string;
};

/**
 * Soulbound (ERC-5484) reputation badge — a small octagonal mark with a
 * tinted core. Color steps with score so investors can read it at a glance
 * before reading the number.
 */
export function SoulboundBadge({ score, className }: Props) {
  const tone = score >= 90 ? "primary" : score >= 75 ? "secondary" : "blue";
  const fill =
    tone === "primary"
      ? "rgb(var(--moss))"
      : tone === "secondary"
        ? "rgb(var(--moss))"
        : "rgb(var(--sage))";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-rule/[0.08] bg-paper-warm/60 px-2 py-1",
        className,
      )}
      title={`Soulbound reputation · ${score}/100 (ERC-5484)`}
    >
      <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden>
        <polygon
          points="8,1.5 13,4.5 14.5,10 11,14.5 5,14.5 1.5,10 3,4.5"
          fill={fill}
          opacity="0.85"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.6"
        />
        <polygon
          points="8,4.5 11,6.5 11.8,10 9.5,12.2 6.5,12.2 4.2,10 5,6.5"
          fill="rgba(255,255,255,0.18)"
        />
      </svg>
      <span className="mono text-[11px] text-ink">{score}</span>
      <span className="eyebrow">SBT</span>
    </span>
  );
}
