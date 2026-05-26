"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  index: number;
  eyebrow: string;
  title: React.ReactNode;
  body: React.ReactNode;
  visual: React.ReactNode;
  reverse?: boolean;
};

const ROMANS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const popStamp: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -8 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.7, ease, type: "spring", bounce: 0.35 },
  },
};

/**
 * Alternating left/right feature block on cream paper.
 *
 * Copy column has a roman-numeral pop-stamp, eyebrow, display-serif title,
 * and body text. Visual column lives inside a paper-card. Used by For
 * Investors / For Managers / For Builders.
 */
export function FeatureBlock({
  index,
  eyebrow,
  title,
  body,
  visual,
  reverse,
}: Props) {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";
  const roman = ROMANS[index - 1] ?? String(index);

  return (
    <m.article
      initial={initial}
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
      }}
      className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14"
    >
      <m.div
        variants={fadeUp}
        className={cn(
          "order-2 lg:col-span-5",
          reverse ? "lg:order-2" : "lg:order-1",
        )}
      >
        <m.span
          variants={popStamp}
          className="inline-flex items-baseline gap-1.5 rounded-full border border-moss/35 bg-moss/[0.08] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-moss-deep"
        >
          <span className="script text-[15px] leading-none">{roman}</span>
          <span>Chapter</span>
        </m.span>

        <p className="eyebrow mt-5 text-moss">{eyebrow}</p>
        <h3 className="display mt-3 text-[26px] leading-[1.08] text-ink sm:text-[34px] lg:text-[40px]">
          {title}
        </h3>
        <div className="mt-5 text-[15px] leading-relaxed text-ink-muted sm:text-[16px]">
          {body}
        </div>
      </m.div>

      <m.div
        variants={fadeUp}
        className={cn(
          "paper-card order-1 p-5 sm:p-6 lg:col-span-7",
          reverse ? "lg:order-1" : "lg:order-2",
        )}
      >
        {visual}
      </m.div>
    </m.article>
  );
}
