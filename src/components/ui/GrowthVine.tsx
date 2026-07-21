"use client";

import { useRef } from "react";
import {
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Scroll-drawn vine — a hand-wavering moss stem that draws itself down the
 * margin as you read, sprouting a leaf as it passes each milestone. The
 * growth metaphor rendered literally: progress through the content is
 * progress in the garden.
 *
 * Position it absolutely inside a `relative` container; it stretches to the
 * container's full height and tracks its own scroll progress. Decorative
 * only (aria-hidden); renders fully grown under prefers-reduced-motion.
 */
export function GrowthVine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Start growing once the top clears the lower viewport, finish a bit
    // before the container's end so the vine completes while still in view.
    offset: ["start 0.85", "end 0.55"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.6,
  });

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-y-0 w-8", className)}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 32 800"
        preserveAspectRatio="none"
        fill="none"
      >
        <m.path
          d="M16 0 C 22 90, 10 180, 16 270 C 22 360, 10 450, 16 540 C 21 630, 12 710, 16 800"
          stroke="rgb(var(--moss) / 0.45)"
          strokeWidth="1.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: reduce ? 1 : progress }}
        />
      </svg>

      {/* Leaves sprout as the stem passes them, alternating sides. */}
      {[0.22, 0.5, 0.78].map((at, i) => (
        <Sprout
          key={at}
          at={at}
          progress={progress}
          flip={i % 2 === 1}
          reduce={!!reduce}
        />
      ))}
    </div>
  );
}

function Sprout({
  at,
  progress,
  flip,
  reduce,
}: {
  at: number;
  progress: MotionValue<number>;
  flip: boolean;
  reduce: boolean;
}) {
  // The leaf unfurls just after the stem tip passes its node. The outer span
  // owns position + mirroring; the inner m.span owns the animated transform,
  // so framer's inline `transform` never clobbers the layout classes.
  const opacity = useTransform(progress, [at, at + 0.06], [0, 1]);
  const scale = useTransform(progress, [at, at + 0.09], [0.4, 1]);

  return (
    <span
      style={{ top: `${at * 100}%` }}
      className={cn(
        "absolute left-1/2 -translate-x-1/2",
        flip && "-scale-x-100",
      )}
    >
      <m.span
        style={reduce ? undefined : { opacity, scale }}
        className="block origin-bottom-left"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" className="text-moss/70">
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
      </m.span>
    </span>
  );
}
