import { cn } from "@/lib/utils";

/**
 * Two-tone seed/leaf — used for inline brand sparks (Arbitrum status pip,
 * loader element, list bullets). Custom-drawn, never from an icon pack.
 */
export function SeedIcon({
  className,
  size = 14,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn(className)}
    >
      <path
        d="M8 14 C 4 14 2 11 2 7.5 C 5 7.5 7.6 9 8 14 Z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M8 14 C 12 14 14 11 14 7.5 C 11 7.5 8.4 9 8 14 Z"
        fill="currentColor"
      />
      <path
        d="M8 14 C 8 10 8 6 8 2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
