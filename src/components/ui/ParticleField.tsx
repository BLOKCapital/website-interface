"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useIsClient } from "@/lib/hooks";

/**
 * FloatingLeaves — replaces the previous neon particle field.
 *
 * A small set of hand-drawn leaves drift slowly behind a hero illustration.
 * Pure CSS animation, no canvas, no rAF — keeps the main thread free and
 * honors prefers-reduced-motion via globals.css.
 *
 * The export name is kept as `ParticleField` so existing call sites keep
 * working while the rest of the site migrates to the Garden Journal theme.
 */
export function ParticleField({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => (Math.sin(i * 97 + n) + 1) / 2;
        return {
          x: 4 + r(1) * 92,
          y: 2 + r(2) * 94,
          size: 22 + r(3) * 26, // 22–48px, readable as leaves, not specks
          delay: r(4) * 8,
          duration: 8 + r(5) * 8,
          rotate: r(6) * 360,
          tone: r(7) > 0.5 ? "moss" : "clay",
          opacity: 0.4 + r(8) * 0.3, // 0.4–0.7, clearly visible on cream
        } as const;
      }),
    [count],
  );

  // The leaves are decorative only. Their sub-pixel positions/rotations get
  // rounded by the browser's CSSOM on parse (and the `animation` shorthand is
  // expanded into longhands), which trips React 19's strict hydration check.
  // Rendering them only on the client sidesteps the mismatch with no layout
  // shift, since the container is an absolutely-positioned aria-hidden overlay.
  const mounted = useIsClient();

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {mounted &&
        seeds.map((s) => (
        <span
          key={`${s.x}-${s.y}-${s.rotate}`}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: `rotate(${s.rotate}deg)`,
            animation: `sway ${s.duration}s ease-in-out ${s.delay}s infinite`,
            opacity: s.opacity,
          }}
        >
          <Leaf size={s.size} tone={s.tone} />
        </span>
      ))}
    </div>
  );
}

function Leaf({ size, tone }: { size: number; tone: "moss" | "clay" }) {
  const fill =
    tone === "moss" ? "rgb(var(--moss) / 0.85)" : "rgb(var(--clay) / 0.78)";
  const stroke =
    tone === "moss" ? "rgb(var(--moss-deep))" : "rgb(var(--clay-deep))";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 3 C 18 5 20 12 14 20 C 8 18 5 12 12 3 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="0.8"
      />
      <path
        d="M12 5 C 12 9 13 14 14 19"
        stroke={stroke}
        strokeWidth="0.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
