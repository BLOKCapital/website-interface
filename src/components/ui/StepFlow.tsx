"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const node: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.88 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease, type: "spring", bounce: 0.35 },
  },
};
const copy: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};
// The connectors draw along the axis they run on, so the sequence reads as a
// line being traced through the steps rather than items merely fading in.
const drawY: Variants = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.35, ease } },
};
const drawX: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.35, ease } },
};

export type FlowStep = {
  label: string;
  detail?: string;
};

/**
 * Linear process flow — a vertical rail on phones, a horizontal track from sm+.
 *
 * Built from DOM text rather than <text> inside a fixed viewBox. That is the
 * whole point: a 480-unit viewBox rendered inside a ~295px card on a phone
 * scales to ~0.6, which silently turns an 11px label into a ~6.5px one. Real
 * text in a flex row keeps its specified size at every width, so this needs no
 * separate small-screen variant.
 *
 * The staggered draw-in is the animation — one pass on scroll-in, then it
 * rests. No interval, nothing looping in the corner of the reader's eye.
 */
export function StepFlow({
  steps,
  label,
  className,
}: {
  steps: FlowStep[];
  /** Accessible name for the list, e.g. "How a change reaches production". */
  label: string;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <m.ol
      aria-label={label}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: "some", margin: "0px 0px -60px 0px" }}
      variants={{ show: { transition: { staggerChildren: 0.13 } } }}
      className={cn("flex flex-col sm:flex-row", className)}
    >
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <li
            key={s.label}
            className={cn(
              "relative flex gap-3.5 sm:flex-1 sm:flex-col sm:gap-0",
              !last && "pb-6 sm:pb-0",
            )}
          >
            {!last && (
              <>
                {/* phones: runs down from the marker into the next step */}
                <m.span
                  aria-hidden
                  variants={drawY}
                  className="absolute bottom-1 left-[13.5px] top-8 w-px origin-top bg-ink/15 sm:hidden"
                />
                {/* sm+: runs across to the next marker */}
                <m.span
                  aria-hidden
                  variants={drawX}
                  className="absolute left-8 right-3 top-[13.5px] hidden h-px origin-left bg-ink/15 sm:block"
                />
              </>
            )}

            <div className="shrink-0 sm:mb-3">
              <m.span
                variants={node}
                className="relative z-10 inline-flex size-7 items-center justify-center rounded-full border border-moss/40 bg-moss/10 font-mono text-[11px] font-semibold tabular-nums text-moss-deep"
              >
                {i + 1}
              </m.span>
            </div>

            <m.div variants={copy} className="min-w-0 sm:pr-4">
              <p className="text-[13.5px] font-medium leading-tight text-ink">
                {s.label}
              </p>
              {s.detail && (
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-subtle">
                  {s.detail}
                </p>
              )}
            </m.div>
          </li>
        );
      })}
    </m.ol>
  );
}
