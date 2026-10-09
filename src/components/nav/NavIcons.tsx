/**
 * Small line icons for menu links, keyed by href. Decorative: every link
 * carries its own label.
 */
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const paths: Record<string, React.ReactNode> = {
  // Stacked layers
  "/protocol": <path d="M10 3 3 6.5 10 10l7-3.5L10 3ZM3 10l7 3.5 7-3.5M3 13.5 10 17l7-3.5" {...line} />,
  // A basket on a ring
  "/indices": (
    <>
      <circle cx="10" cy="10" r="6.5" {...line} />
      <circle cx="10" cy="10" r="2" {...line} />
      <path d="M10 3.5v4.5M15.6 13.2 11.8 11M4.4 13.2 8.2 11" {...line} />
    </>
  ),
  // Shield
  "/security": <path d="M10 2.8 4 5v4.6c0 3.6 2.6 6.4 6 7.6 3.4-1.2 6-4 6-7.6V5l-6-2.2ZM7.5 10l1.8 1.8 3.4-3.6" {...line} />,
  // Ballot box
  "/governance": <path d="M4 10h12v6.5H4zM7 10V4.5h6V10M8.5 7.2l1 1 2-2.2" {...line} />,
  // Coin
  "/token": (
    <>
      <circle cx="10" cy="10" r="6.5" {...line} />
      <path d="M8 7.5h3a1.3 1.3 0 0 1 0 2.5H8h3.4a1.3 1.3 0 0 1 0 2.5H8V7.5Z" {...line} />
    </>
  ),
  // Vote, off-site
  aragon: <path d="M4 16h12M6 16V9l4-5 4 5v7M8.5 12h3" {...line} />,
  // Seedling
  "/about": <path d="M10 17v-6M10 11c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6ZM10 13c0-2.6-1.9-4.5-4.5-4.5 0 2.6 1.9 4.5 4.5 4.5Z" {...line} />,
  // A path with a flag
  "/about#roadmap": <path d="M4 17V4M4 4h9l-1.5 3L13 10H4M7 17h9" {...line} />,
  // Speech bubble
  "/contact": <path d="M4 5.5h12v8H9l-3.5 3v-3H4z" {...line} />,
};

export function NavIcon({ href, size = 18, className }: { href: string; size?: number; className?: string }) {
  const key = /aragon/.test(href) ? "aragon" : href;
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden className={className}>
      {paths[key] ?? <circle cx="10" cy="10" r="3" {...line} />}
    </svg>
  );
}

export const ChevronIcon = ({ className }: { className?: string }) => (
  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className={className}>
    <path d="m2 3.75 3 3 3-3" {...line} />
  </svg>
);
