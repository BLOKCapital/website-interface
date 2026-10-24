import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The site's line icons on one grid (VIS-18): drawn on 20 × 20, stroked at
 * 1.5px, round caps and joins, in currentColor. The stroke doesn't scale
 * (vector-effect: non-scaling-stroke), so every size renders the same 1.5px
 * line. Sizes: sm 16 · md 20 · lg 24.
 *
 * Decorative by default (aria-hidden): name the parent link or button.
 * Pass `label` only for an icon that stands alone and carries meaning.
 */
const glyphs = {
  "arrow-right": <path d="M4 10h11.5M11 5.5l4.5 4.5-4.5 4.5" />,
  "arrow-down": <path d="M10 4v11.5M5.5 11l4.5 4.5 4.5-4.5" />,
  external: <path d="M6.5 13.5l7-7M8 6.5h5.5V12" />,
  check: <path d="M4.5 10.5l3.5 3.5 7.5-8" />,
  cross: <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" />,
  plus: <path d="M10 4.5v11M4.5 10h11" />,
  minus: <path d="M4.5 10h11" />,
  menu: <path d="M3.5 7h13M3.5 13h13" />,
  "chevron-down": <path d="M6 8l4 4 4-4" />,
  copy: (
    <>
      <rect x="7" y="7" width="9.5" height="9.5" rx="1.75" />
      <path d="M13 7V5.25C13 4.56 12.44 4 11.75 4h-6.5C4.56 4 4 4.56 4 5.25v6.5c0 .69.56 1.25 1.25 1.25H7" />
    </>
  ),
  // An open book: documentation, whitepaper, guides.
  doc: (
    <>
      <path d="M10 5.75C8.75 4.75 6.75 4.25 3.5 4.25v10.5c3.25 0 5.25.5 6.5 1.5 1.25-1 3.25-1.5 6.5-1.5V4.25c-3.25 0-5.25.5-6.5 1.5z" />
      <path d="M10 5.75v10.5" />
    </>
  ),
  info: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 9.25v4.25M10 6.75v.01" />
    </>
  ),
  shield: <path d="M10 3.5l5.5 2v4.25c0 3.4-2.3 5.85-5.5 6.75-3.2-.9-5.5-3.35-5.5-6.75V5.5l5.5-2z" />,
  // Two chain links (the Trust menu's "Official links" mark): a link to this place.
  link: <path d="M8.6 11.4 11.4 8.6M9.2 6.2l1-1a3 3 0 0 1 4.6 4.6l-1 1M10.8 13.8l-1 1a3 3 0 0 1-4.6-4.6l1-1" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof glyphs;

const sizes = { sm: 16, md: 20, lg: 24 } as const;
export type IconSize = keyof typeof sizes;

export function Icon({
  name,
  size = "md",
  label,
  className,
}: {
  name: IconName;
  size?: IconSize;
  /** Accessible name, for a meaningful stand-alone icon only. */
  label?: string;
  className?: string;
}) {
  const px = sizes[size];
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={cn("shrink-0 [&_*]:[vector-effect:non-scaling-stroke]", className)}
    >
      {glyphs[name]}
    </svg>
  );
}
