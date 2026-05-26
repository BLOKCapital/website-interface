import { cn } from "@/lib/utils";

/**
 * GardenEmblem — botanical SVG glyph in the Garden Journal style.
 *
 * One component, several motifs. All variants share the same visual language:
 * cream paper, clay/ochre/moss palette, soft shapes, an optional dashed halo
 * ring, and a gentle "breathe" animation. Drop one into any section that
 * needs a quiet focal point.
 *
 * Usage:
 *   <GardenEmblem variant="flower" className="size-40" />
 *   <GardenEmblem variant="sprout" halo={false} animated={false} />
 */

export type EmblemVariant =
  | "flower"
  | "bloom"
  | "sprout"
  | "seed"
  | "leaf"
  | "sun"
  | "vine";

type Props = {
  variant?: EmblemVariant;
  /** Show the dashed outer halo ring. Default true. */
  halo?: boolean;
  /** Animate (breathe / drift). Respect reduced-motion at the parent if needed. */
  animated?: boolean;
  className?: string;
};

export function GardenEmblem({
  variant = "flower",
  halo = true,
  animated = true,
  className,
}: Props) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={cn("block size-full", className)}
      aria-hidden
    >
      {halo && <Halos />}
      <Motif variant={variant} animated={animated} />
    </svg>
  );
}

/* ---------- halos ---------------------------------------------------------- */

function Halos() {
  return (
    <g>
      <circle
        cx="120"
        cy="120"
        r="100"
        fill="none"
        stroke="rgb(var(--ink) / 0.08)"
        strokeDasharray="2 6"
      />
      <circle
        cx="120"
        cy="120"
        r="76"
        fill="none"
        stroke="rgb(var(--moss) / 0.18)"
      />
    </g>
  );
}

/* ---------- motif dispatcher ---------------------------------------------- */

function Motif({
  variant,
  animated,
}: {
  variant: EmblemVariant;
  animated: boolean;
}) {
  switch (variant) {
    case "bloom":
      return <Bloom animated={animated} />;
    case "sprout":
      return <Sprout animated={animated} />;
    case "seed":
      return <Seed animated={animated} />;
    case "leaf":
      return <Leaf animated={animated} />;
    case "sun":
      return <Sun animated={animated} />;
    case "vine":
      return <Vine animated={animated} />;
    case "flower":
    default:
      return <Flower animated={animated} />;
  }
}

/* ---------- motifs --------------------------------------------------------- */

function Flower({ animated }: { animated: boolean }) {
  return (
    <g>
      <g
        style={{
          transformOrigin: "120px 120px",
          animation: animated ? "breathe 5s ease-in-out infinite" : undefined,
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <ellipse
            key={i}
            cx="120"
            cy="74"
            rx="14"
            ry="30"
            fill="rgb(var(--clay) / 0.55)"
            transform={`rotate(${i * 72} 120 120)`}
          />
        ))}
      </g>
      <circle cx="120" cy="120" r="12" fill="rgb(var(--ochre))" />
      <circle cx="120" cy="120" r="5" fill="rgb(var(--paper))" opacity="0.9" />

      <path
        d="M120 132 Q116 162 122 192"
        stroke="rgb(var(--moss-deep))"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M120 156 Q104 152 96 162 Q108 168 120 162"
        fill="rgb(var(--moss) / 0.7)"
      />
      <path
        d="M122 176 Q138 172 146 184 Q132 190 121 182"
        fill="rgb(var(--moss) / 0.7)"
      />
    </g>
  );
}

function Bloom({ animated }: { animated: boolean }) {
  // Denser 8-petal flower with an inner 4-petal layer
  return (
    <g>
      <g
        style={{
          transformOrigin: "120px 120px",
          animation: animated ? "breathe 6s ease-in-out infinite" : undefined,
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={`outer-${i}`}
            cx="120"
            cy="68"
            rx="11"
            ry="32"
            fill="rgb(var(--clay) / 0.45)"
            transform={`rotate(${i * 45} 120 120)`}
          />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <ellipse
            key={`inner-${i}`}
            cx="120"
            cy="90"
            rx="9"
            ry="18"
            fill="rgb(var(--ochre) / 0.55)"
            transform={`rotate(${i * 90 + 22} 120 120)`}
          />
        ))}
      </g>
      <circle cx="120" cy="120" r="10" fill="rgb(var(--ochre))" />
      <circle cx="120" cy="120" r="4" fill="rgb(var(--paper))" opacity="0.9" />
    </g>
  );
}

function Sprout({ animated }: { animated: boolean }) {
  // Two cotyledons rising from a soil mound
  return (
    <g>
      {/* mound */}
      <path
        d="M70 180 Q120 168 170 180 L170 196 L70 196 Z"
        fill="rgb(var(--clay) / 0.18)"
      />
      <path
        d="M70 180 Q120 168 170 180"
        stroke="rgb(var(--clay-deep) / 0.45)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* stem */}
      <path
        d="M120 180 Q120 150 120 110"
        stroke="rgb(var(--moss-deep))"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <g
        style={{
          transformOrigin: "120px 130px",
          animation: animated ? "sway 4.5s ease-in-out infinite" : undefined,
        }}
      >
        {/* left cotyledon */}
        <path
          d="M120 130 Q90 118 80 136 Q104 144 120 138"
          fill="rgb(var(--moss) / 0.75)"
        />
        {/* right cotyledon */}
        <path
          d="M120 122 Q150 110 160 128 Q136 136 120 130"
          fill="rgb(var(--moss) / 0.75)"
        />
        {/* small bud at top */}
        <circle cx="120" cy="108" r="5" fill="rgb(var(--ochre))" />
      </g>
    </g>
  );
}

function Seed({ animated }: { animated: boolean }) {
  // A pebble-seed with a hairline crack and a tiny radicle peeking out
  return (
    <g>
      <g
        style={{
          transformOrigin: "120px 130px",
          animation: animated ? "breathe 5s ease-in-out infinite" : undefined,
        }}
      >
        <ellipse
          cx="120"
          cy="130"
          rx="38"
          ry="46"
          fill="rgb(var(--clay) / 0.55)"
        />
        <ellipse
          cx="120"
          cy="130"
          rx="38"
          ry="46"
          fill="none"
          stroke="rgb(var(--clay-deep) / 0.55)"
          strokeWidth="1.4"
        />
        {/* highlight */}
        <ellipse
          cx="108"
          cy="112"
          rx="8"
          ry="12"
          fill="rgb(var(--paper) / 0.45)"
        />
        {/* crack */}
        <path
          d="M120 96 Q124 110 120 124 Q116 138 120 154"
          stroke="rgb(var(--ink) / 0.35)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      {/* radicle */}
      <path
        d="M120 176 Q118 188 122 196"
        stroke="rgb(var(--moss-deep))"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="122" cy="198" r="2.5" fill="rgb(var(--moss-deep))" />
    </g>
  );
}

function Leaf({ animated }: { animated: boolean }) {
  // Single big leaf with veins, gently swaying
  return (
    <g
      style={{
        transformOrigin: "120px 180px",
        animation: animated ? "sway 5s ease-in-out infinite" : undefined,
      }}
    >
      {/* stem */}
      <path
        d="M120 196 Q120 170 122 150"
        stroke="rgb(var(--moss-deep))"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* leaf body */}
      <path
        d="M122 150 Q72 88 90 56 Q156 64 168 124 Q162 156 122 150 Z"
        fill="rgb(var(--moss) / 0.7)"
      />
      <path
        d="M122 150 Q72 88 90 56 Q156 64 168 124 Q162 156 122 150 Z"
        fill="none"
        stroke="rgb(var(--moss-deep) / 0.55)"
        strokeWidth="1.2"
      />
      {/* midrib */}
      <path
        d="M122 150 Q116 110 100 70"
        stroke="rgb(var(--moss-deep) / 0.55)"
        strokeWidth="1"
        fill="none"
      />
      {/* veins */}
      <path
        d="M118 132 Q108 124 96 122"
        stroke="rgb(var(--moss-deep) / 0.45)"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M115 116 Q104 108 92 102"
        stroke="rgb(var(--moss-deep) / 0.45)"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M110 96 Q104 88 100 80"
        stroke="rgb(var(--moss-deep) / 0.45)"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M122 138 Q138 132 152 130"
        stroke="rgb(var(--moss-deep) / 0.45)"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M118 116 Q138 110 156 108"
        stroke="rgb(var(--moss-deep) / 0.45)"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M112 94 Q132 90 148 86"
        stroke="rgb(var(--moss-deep) / 0.45)"
        strokeWidth="0.8"
        fill="none"
      />
    </g>
  );
}

function Sun({ animated }: { animated: boolean }) {
  // Sun with radiating rays
  return (
    <g>
      <g
        style={{
          transformOrigin: "120px 120px",
          animation: animated ? "breathe 6s ease-in-out infinite" : undefined,
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={i}
            x="118"
            y="50"
            width="4"
            height="18"
            rx="2"
            fill="rgb(var(--ochre) / 0.85)"
            transform={`rotate(${i * 30} 120 120)`}
          />
        ))}
      </g>
      <circle
        cx="120"
        cy="120"
        r="32"
        fill="rgb(var(--ochre) / 0.75)"
        stroke="rgb(var(--ochre))"
        strokeWidth="1.5"
      />
      <circle cx="112" cy="112" r="5" fill="rgb(var(--paper) / 0.6)" />
    </g>
  );
}

function Vine({ animated }: { animated: boolean }) {
  // A spiraling vine with three pairs of leaves
  return (
    <g
      style={{
        transformOrigin: "120px 120px",
        animation: animated ? "sway 6s ease-in-out infinite" : undefined,
      }}
    >
      <path
        d="M120 200 C 60 180 60 140 120 120 C 180 100 180 60 120 40"
        stroke="rgb(var(--moss-deep))"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* leaf pair 1 (low) */}
      <path
        d="M84 174 Q70 160 70 144 Q88 152 92 168"
        fill="rgb(var(--moss) / 0.7)"
      />
      <path
        d="M104 184 Q120 178 132 184 Q124 196 110 194"
        fill="rgb(var(--moss) / 0.7)"
      />
      {/* leaf pair 2 (mid) */}
      <path
        d="M150 132 Q166 124 178 132 Q170 146 154 146"
        fill="rgb(var(--moss) / 0.7)"
      />
      <path
        d="M86 108 Q72 100 64 112 Q78 124 92 120"
        fill="rgb(var(--moss) / 0.7)"
      />
      {/* leaf pair 3 (top) */}
      <path
        d="M152 70 Q166 60 178 68 Q170 82 156 84"
        fill="rgb(var(--moss) / 0.7)"
      />
      {/* tendril tip */}
      <path
        d="M120 40 Q116 32 122 26"
        stroke="rgb(var(--moss-deep))"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="123" cy="25" r="3" fill="rgb(var(--ochre))" />
    </g>
  );
}
