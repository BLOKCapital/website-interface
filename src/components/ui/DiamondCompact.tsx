"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const badgeReveal: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease } },
};

/**
 * EIP-2535 diamond, told as a pill and a facet grid instead of a schematic.
 *
 * This is the small-screen half of every diamond diagram on the site. The SVG
 * versions are authored in a 480-unit viewBox; inside a paper-card on a phone
 * that scales to roughly 0.6, so their 10-11px labels land at ~6px. Rather
 * than shrink the type further, the layout changes: real DOM text that holds
 * its size, in a grid that reflows.
 *
 * Pair it with the schematic — `<DiamondCompact className="lg:hidden" />` next
 * to a `hidden lg:block` wrapper around the SVG.
 */
export function DiamondCompact({
  facets,
  caption = "Diamond proxy",
  className,
}: {
  /** Facet names, in reading order. */
  facets: string[];
  /** Label on the central pill. */
  caption?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <m.div
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: "some", margin: "0px 0px -60px 0px" }}
      variants={{
        show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
      }}
      className={cn("mt-3", className)}
    >
      <m.div variants={badgeReveal} className="mb-3 flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-moss/45 bg-moss/[0.06] px-3.5 py-1.5 text-[13px] font-medium text-moss-deep">
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
            <polygon
              points="12,2 22,12 12,22 2,12"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
          {caption}
        </span>
      </m.div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {facets.map((f) => (
          <m.span
            key={f}
            variants={badgeReveal}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-ink/10 bg-paper-deep p-2 text-[12.5px] font-medium text-ink sm:text-[12px]"
          >
            <span aria-hidden className="text-moss-deep/75">
              <svg width="9" height="9" viewBox="0 0 12 12">
                <polygon points="6,1 11,4 11,8 6,11 1,8 1,4" fill="currentColor" />
              </svg>
            </span>
            {f}
          </m.span>
        ))}
      </div>
    </m.div>
  );
}
