import type { Pillar } from "@/lib/data/pillars";
import { cn } from "@/lib/utils";

/**
 * Custom two-tone line icons for the trust pillars (Section 1.5).
 * Hand-drawn — never imported from an icon pack. Slight organic bend.
 */

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.4,
  fill: "none" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const accent = {
  // Clay highlight reads warmly against the ink outline on cream paper.
  stroke: "rgb(var(--clay))",
  strokeWidth: 1.4,
  fill: "none" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="32"
      height="32"
      aria-hidden
      className={cn("text-ink", className)}
    >
      {children}
    </svg>
  );
}

const NonCustodialIcon = () => (
  <Frame>
    <path d="M10 14 V11 a 6 6 0 0 1 12 0 V14" {...stroke} />
    <rect x="7" y="14" width="18" height="13" rx="2.5" {...stroke} />
    <circle cx="16" cy="20.5" r="1.6" {...accent} />
    <path d="M16 22 V25" {...accent} />
  </Frame>
);

const UpgradableIcon = () => (
  <Frame>
    <polygon points="16,4 24,9 24,21 16,28 8,21 8,9" {...stroke} />
    <polygon points="16,10 20,12.5 20,18.5 16,21.5 12,18.5 12,12.5" {...accent} />
    <path d="M16 4 V10 M24 9 L20 12.5 M8 9 L12 12.5 M16 28 V21.5 M24 21 L20 18.5 M8 21 L12 18.5" {...stroke} />
  </Frame>
);

const ReputationIcon = () => (
  <Frame>
    <polygon points="16,4 28,11 24,26 8,26 4,11" {...stroke} />
    <polygon points="16,9 23,13 21,22 11,22 9,13" {...accent} />
    <path d="M14 17 L 16 19 L 19 14" {...accent} />
  </Frame>
);

const AuditedIcon = () => (
  <Frame>
    <rect x="6" y="6" width="20" height="22" rx="2" {...stroke} />
    <path d="M11 13 H21 M11 17 H19 M11 21 H17" {...stroke} />
    <circle cx="22" cy="22" r="4" {...accent} />
    <path d="M20.5 22 L 21.7 23.2 L 23.5 21" {...accent} />
  </Frame>
);

const DaoIcon = () => (
  <Frame>
    <circle cx="10" cy="10" r="3" {...stroke} />
    <circle cx="22" cy="10" r="3" {...stroke} />
    <circle cx="16" cy="22" r="3" {...accent} />
    <path d="M11.8 12.4 L 14.5 19.5 M20.2 12.4 L 17.5 19.5 M13 10 H19" {...stroke} />
  </Frame>
);

const OpenSourceIcon = () => (
  <Frame>
    <path d="M11 7 L5 16 L11 25" {...stroke} />
    <path d="M21 7 L27 16 L21 25" {...stroke} />
    <path d="M19 6 L13 26" {...accent} />
  </Frame>
);

const map: Record<Pillar["id"], React.FC> = {
  "non-custodial": NonCustodialIcon,
  upgradable: UpgradableIcon,
  reputation: ReputationIcon,
  audited: AuditedIcon,
  dao: DaoIcon,
  "open-source": OpenSourceIcon,
};

export function PillarIcon({ id }: { id: Pillar["id"] }) {
  const C = map[id];
  return <C />;
}
