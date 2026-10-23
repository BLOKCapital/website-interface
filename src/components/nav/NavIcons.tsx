/**
 * Small line icons for menu links, keyed by href. Decorative: every link
 * carries its own label.
 */
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/**
 * One set, drawn alike: a 20px grid, a 1.7 stroke, round ends, two or three
 * strokes each, so they read at 18px in a menu tile.
 */
const paths: Record<string, React.ReactNode> = {
  // Layers: the protocol
  "/protocol": <path d="M10 3 3 6.5 10 10l7-3.5L10 3ZM3 10l7 3.5 7-3.5M3 13.5 10 17l7-3.5" {...line} />,
  // A pie with a slice out: the indices
  "/indices": (
    <>
      <path d="M8.8 4.2a6.3 6.3 0 1 0 7 7H8.8v-7Z" {...line} />
      <path d="M11.4 2.6a6.2 6.2 0 0 1 6 6h-6v-6Z" {...line} />
    </>
  ),
  // A ballot box: how the DAO decides
  "/governance": <path d="M3.5 10.5h13v6h-13zM6.5 10.5v-7h7v7M8.4 7.2l1.2 1.2 2.1-2.4" {...line} />,
  // A coin: the token
  "/token": (
    <>
      <circle cx="10" cy="10" r="7" {...line} />
      <circle cx="10" cy="10" r="3.6" {...line} />
    </>
  ),
  // A sparkle: earn $BLOKC
  contribute: <path d="M10 3c.7 3.6 3.4 6.3 7 7-3.6.7-6.3 3.4-7 7-.7-3.6-3.4-6.3-7-7 3.6-.7 6.3-3.4 7-7Z" {...line} />,
  // Columns: the DAO, off-site
  aragon: <path d="M3 8 10 4l7 4M4.8 9v6M8.3 9v6M11.7 9v6M15.2 9v6M3 16.5h14" {...line} />,
  // Two people: about the team
  "/about": (
    <>
      <circle cx="7.5" cy="7" r="2.6" {...line} />
      <path d="M2.8 16.2c.4-2.7 2.3-4.3 4.7-4.3s4.3 1.6 4.7 4.3M12.8 4.5a2.6 2.6 0 0 1 0 5M14.6 12.1c1.5.5 2.5 1.9 2.7 4.1" {...line} />
    </>
  ),
  // A route between two points: the roadmap
  "/about#roadmap": (
    <>
      <circle cx="5" cy="15.5" r="1.7" {...line} />
      <circle cx="15" cy="4.5" r="1.7" {...line} />
      <path d="M6.7 15.5H13a2.5 2.5 0 0 0 0-5H7a2.5 2.5 0 0 1 0-5h6.3" {...line} />
    </>
  ),
  // A speech bubble: contact
  "/contact": <path d="M4.5 4h11A1.5 1.5 0 0 1 17 5.5v7a1.5 1.5 0 0 1-1.5 1.5H9.5L6 17v-3H4.5A1.5 1.5 0 0 1 3 12.5v-7A1.5 1.5 0 0 1 4.5 4Z" {...line} />,
  // A page with lines: the whitepaper
  whitepaper: <path d="M5.5 2.8h6.5l3.5 3.5v10.9h-10V2.8ZM12 2.8v3.5h3.5M8 10h5M8 13h5" {...line} />,
  // An open book: the docs
  docs: <path d="M10 6c-1.6-1.3-3.6-1.8-6-1.5v10.5c2.4-.3 4.4.2 6 1.5 1.6-1.3 3.6-1.8 6-1.5V4.5c-2.4-.3-4.4.2-6 1.5ZM10 6v10.5" {...line} />,
  // A shield with a tick: security
  "/security": <path d="M10 2.8 4 5v4.6c0 3.6 2.6 6.4 6 7.6 3.4-1.2 6-4 6-7.6V5l-6-2.2ZM7.5 10l1.8 1.8 3.4-3.6" {...line} />,
  // A magnifier: the audits
  "/security#audits": (
    <>
      <circle cx="9" cy="9" r="5.3" {...line} />
      <path d="m13 13 4 4" {...line} />
    </>
  ),
  // Code brackets: the contracts
  "/security#contracts": <path d="M7 6.5 3.5 10 7 13.5M13 6.5l3.5 3.5-3.5 3.5M11 4.5l-2 11" {...line} />,
  // A key: who can change what
  "/security#controls": (
    <>
      <circle cx="7" cy="13" r="3.3" {...line} />
      <path d="m9.4 10.6 7-7M14 6l2 2M11.9 8.1l1.6 1.6" {...line} />
    </>
  ),
  // A link: the official links
  "/security#official": <path d="M8.6 11.4 11.4 8.6M9.2 6.2l1-1a3 3 0 0 1 4.6 4.6l-1 1M10.8 13.8l-1 1a3 3 0 0 1-4.6-4.6l1-1" {...line} />,
  // A warning sign: report a vulnerability
  "/security#disclosure": <path d="M10 3.5 17.2 16H2.8L10 3.5ZM10 8.5v3.6M10 14.3v.01" {...line} />,
};

/** Off-site links share one icon per destination, whatever the full URL. */
const keyOf = (href: string) =>
  /aragon/.test(href)
    ? "aragon"
    : /docsend/.test(href)
      ? "whitepaper"
      : /^https:\/\/docs\./.test(href)
        ? "docs"
        : /^https:\/\/contribute\./.test(href)
          ? "contribute"
          : href;

export function NavIcon({ href, size = 18, className }: { href: string; size?: number; className?: string }) {
  const key = keyOf(href);
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
