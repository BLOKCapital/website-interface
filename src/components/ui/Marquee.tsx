import { cn } from "@/lib/utils";

/**
 * Editorial marquee — a slow ticker of the protocol's promises set in serif
 * italic, separated by pressed-leaf marks. Reads like a margin note that
 * runs off the page.
 *
 * Pure CSS animation (see `marquee` keyframes in tailwind.config.ts): the
 * track holds two identical copies and translates -50%, so the loop is
 * seamless. Pauses on hover. Under prefers-reduced-motion the global CSS
 * freezes the animation, and the phrases stay readable as a static strip;
 * a visually-hidden list keeps the content available to screen readers
 * (the moving track is aria-hidden).
 */

const DEFAULT_ITEMS = [
  "Self-custody, always",
  "On-chain receipts",
  "No KYC at the protocol layer",
  "Withdraw any time",
  "Rooted on Arbitrum",
  "Tended by the DAO",
  "It's crypto, but different",
];

export function Marquee({
  items = DEFAULT_ITEMS,
  className,
}: {
  items?: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "paper group relative isolate overflow-hidden border-y border-ink/8 bg-paper-warm/70 py-5",
        className,
      )}
    >
      {/* Screen-reader copy — the animated track below is decorative. */}
      <ul className="sr-only">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <div
        aria-hidden
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((t) => (
              <span key={t} className="flex items-center">
                <span className="display whitespace-nowrap px-7 text-[19px] italic leading-none text-ink-muted sm:text-[22px]">
                  {t}
                </span>
                <SprigMark />
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Paper fade at both edges so phrases dissolve into the margin. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent sm:w-28"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent sm:w-28"
      />
    </div>
  );
}

/** Small pressed-leaf separator between phrases, in clay. */
function SprigMark() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      aria-hidden
      className="shrink-0 -rotate-12 text-clay/80"
    >
      <path
        d="M12 3 C 18 5 20 12 14 20 C 8 18 5 12 12 3 Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M12 5 C 12 9 13 14 14 19"
        stroke="rgb(var(--paper))"
        strokeWidth="0.7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
