"use client";

import Link from "next/link";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

/**
 * Core values — four principle cards in the Garden Journal style.
 *
 * Each principle has a roman numeral that pops in with a stamp animation,
 * a serif label, prose, and a context-aware footer tag ("In the contracts",
 * "In the receipts", etc.). Cards sit on the paper palette and shift
 * slightly vertically (lg+) for a layered scrapbook feel. Hover lifts and
 * tightens the moss border — no more tech-y 3D tilt.
 */

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
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

type Accent = "moss" | "clay" | "sage" | "ochre";

type Value = {
  numeral: string;
  label: string;
  body: string;
  accent: Accent;
  glyph: "key" | "receipt" | "people" | "growth";
  /** Context-aware footer tag — tells the reader where the value lives. */
  encoded: string;
};

const values: Value[] = [
  {
    numeral: "I",
    label: "Self-custody always",
    body: "If we ever build a custodial product, we've gotten lost.",
    accent: "moss",
    glyph: "key",
    encoded: "In the contracts",
  },
  {
    numeral: "II",
    label: "Transparency by default",
    body: "If it can be on-chain, it should be on-chain. Receipts beat reports.",
    accent: "clay",
    glyph: "receipt",
    encoded: "In the receipts",
  },
  {
    numeral: "III",
    label: "Community-owned",
    body: "BLOK is governed by people who actually use it. Not us.",
    accent: "sage",
    glyph: "people",
    encoded: "In the votes",
  },
  {
    numeral: "IV",
    label: "Long-term wealth",
    body: "Compound, not pump. Boring is a feature.",
    accent: "ochre",
    glyph: "growth",
    encoded: "In the rebalance",
  },
];

// Tailwind doesn't generate dynamic class names — keep the per-accent classes
// explicit so they're present in the final stylesheet.
const accentClasses: Record<
  Accent,
  {
    text: string;
    bg: string;
    border: string;
    hoverBorder: string;
    rule: string;
  }
> = {
  moss: {
    text: "text-moss-deep",
    bg: "bg-moss/[0.08]",
    border: "border-moss/35",
    hoverBorder: "hover:border-moss/55",
    rule: "from-moss/60",
  },
  clay: {
    text: "text-clay-deep",
    bg: "bg-clay/[0.08]",
    border: "border-clay/35",
    hoverBorder: "hover:border-clay/55",
    rule: "from-clay/60",
  },
  sage: {
    text: "text-ink",
    bg: "bg-sage/[0.12]",
    border: "border-sage/55",
    hoverBorder: "hover:border-sage",
    rule: "from-sage",
  },
  ochre: {
    text: "text-ochre",
    bg: "bg-ochre/[0.10]",
    border: "border-ochre/40",
    hoverBorder: "hover:border-ochre/60",
    rule: "from-ochre/60",
  },
};

export function CoreValues() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <Section
      id="values"
      eyebrow="Core values"
      title={
        <>
          What we won&apos;t{" "}
          <em className="font-serif italic text-clay">trade away.</em>
        </>
      }
      description="Four principles. Encoded in the protocol where it matters, and in the people where it doesn't."
    >
      <m.ul
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
        }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {values.map((v, i) => (
          <ValueCard key={v.numeral} v={v} index={i} />
        ))}
      </m.ul>

      {/* Closing P.S. */}
      <m.p
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
        className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[14.5px] leading-relaxed text-ink-muted sm:text-[15.5px]"
      >
        <span className="script text-[22px] leading-none text-clay">
          P.S.
        </span>
        <span>
          Two of these are enforced by the smart contracts. Two are enforced
          by the people who hold the keys.{" "}
          <Link
            href="https://github.com/BLOKCapital"
            target="_blank"
            rel="noreferrer"
            className="group/g relative font-medium text-ink transition-colors hover:text-clay-deep"
          >
            <span className="underline decoration-clay decoration-[1.5px] underline-offset-[6px]">
              Read either
            </span>
            <span
              aria-hidden
              className="inline-block translate-x-1 transition-transform duration-300 ease-in-soft group-hover/g:translate-x-2"
            >
              {" "}
              →
            </span>
          </Link>
          .
        </span>
      </m.p>
    </Section>
  );
}

function ValueCard({ v, index }: { v: Value; index: number }) {
  const a = accentClasses[v.accent];

  // Each card sits at a slightly different vertical offset for a layered look.
  const offsetClasses = [
    "lg:translate-y-0",
    "lg:translate-y-6",
    "lg:translate-y-3",
    "lg:translate-y-9",
  ];

  return (
    <m.li
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.05 } },
      }}
      className={cn(offsetClasses[index] ?? "")}
    >
      <m.article
        variants={fadeUp}
        className={cn(
          "paper-card group/v relative flex h-full flex-col p-5 transition-[transform,border-color,box-shadow] duration-400 ease-in-soft hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(31,26,20,0.22)] sm:p-6",
          a.hoverBorder,
        )}
      >
        {/* Numeral + glyph row */}
        <div className="flex items-center justify-between gap-3">
          <m.span
            variants={popStamp}
            className={cn(
              "inline-flex items-baseline gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider",
              a.border,
              a.bg,
              a.text,
            )}
          >
            <span className="script text-[15px] leading-none">
              {v.numeral}
            </span>
            <span>Principle</span>
          </m.span>
          <ValueGlyph kind={v.glyph} accent={v.accent} />
        </div>

        {/* Label with hover underline */}
        <m.p
          variants={fadeUp}
          className="display relative mt-5 inline-block text-[22px] leading-tight text-ink"
        >
          <span>{v.label}</span>
          <span
            aria-hidden
            className="absolute -bottom-1 left-0 h-px w-0 bg-clay transition-[width] duration-500 ease-in-soft group-hover/v:w-full"
          />
        </m.p>

        {/* Body */}
        <m.p
          variants={fadeUp}
          className="mt-3 text-[14px] leading-relaxed text-ink-muted"
        >
          {v.body}
        </m.p>

        {/* Spacer to push footer to the bottom of equal-height cards */}
        <div className="flex-1" />

        {/* Footer tag, context-aware (In the contracts / receipts / votes / rebalance) */}
        <m.div
          variants={fadeUp}
          className="relative mt-6 border-t border-ink/10 pt-3"
        >
          <span
            aria-hidden
            className={cn(
              "absolute -top-px left-0 h-px w-0 origin-left bg-gradient-to-r to-transparent transition-all duration-700 ease-in-soft group-hover/v:w-full",
              a.rule,
            )}
          />
          <p
            className={cn(
              "text-[10.5px] font-medium uppercase tracking-wider",
              a.text,
            )}
          >
            {v.encoded}
          </p>
        </m.div>
      </m.article>
    </m.li>
  );
}

/**
 * Small accented glyph for each value. All draw in `currentColor`, set by
 * the wrapper span's text class.
 */
function ValueGlyph({
  kind,
  accent,
}: {
  kind: Value["glyph"];
  accent: Accent;
}) {
  const a = accentClasses[accent];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border bg-paper transition-transform duration-300 group-hover/v:scale-110",
        a.border,
        a.text,
      )}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        {kind === "key" && (
          <>
            <circle cx="5" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.3" />
            <path
              d="M7 8 H13 M11 8 V11 M13 8 V10.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </>
        )}
        {kind === "receipt" && (
          <>
            <path
              d="M3.5 2 V14 L5 13 L6.5 14 L8 13 L9.5 14 L11 13 L12.5 14 V2 Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M5.5 5.5 H10.5 M5.5 8 H10.5 M5.5 10.5 H8.5"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </>
        )}
        {kind === "people" && (
          <>
            <circle cx="5.5" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="10.5" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M2 13 C 2.5 10.5, 4 9.5, 5.5 9.5 C 7 9.5, 8.5 10.5, 9 13"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M7 13 C 7.5 10.5, 9 9.5, 10.5 9.5 C 12 9.5, 13.5 10.5, 14 13"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}
        {kind === "growth" && (
          <>
            <path
              d="M2.5 13 L 6 9 L 9 11 L 13.5 4.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M10 4.5 H 13.5 V 8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        )}
      </svg>
    </span>
  );
}
