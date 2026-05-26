"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- motion variants ---------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease } },
};

// The left rule "draws down" from the top — like ink flowing along a margin.
const drawRule: Variants = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.8, ease } },
};

// Drop-element entrance for the big decorative roman numeral.
const dropNumeral: Variants = {
  hidden: { opacity: 0, y: -10, rotate: -6 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.9, ease },
  },
};

// Pull-quote ("Ours:") arrives slightly after, like an author's annotation.
const annotation: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease },
  },
};

/* ---------- essay ---------- */

const essay: {
  roman: string;
  q: string;
  old: React.ReactNode;
  ours: string;
  /** Optional handwritten aside that sits in the right margin on desktop. */
  marginNote?: string;
}[] = [
  {
    roman: "I",
    q: "Who holds the keys?",
    old: (
      <>
        For decades the answer was: someone else. A custodian, trustworthy on
        paper, expensive in fees. Most crypto flipped that to: nobody,
        including yourself, your seed phrase on a Post-it.
      </>
    ),
    ours: "Always your wallet. Always.",
    marginNote: "the part that mattered most to us",
  },
  {
    roman: "II",
    q: "Can I see what's actually happening?",
    old: (
      <>
        A custodian sends you a quarterly statement. Most crypto managers
        offer PDFs and screenshots. Neither is a receipt you can verify.
      </>
    ),
    ours: "Every position written on-chain.",
  },
  {
    roman: "III",
    q: "Can I actually use it?",
    old: (
      <>
        Traditional wealth management asks for a minimum ticket and a signed
        accreditation form. Open crypto asks for a wallet, and then leaves
        you to pick from ten thousand uncurated options.
      </>
    ),
    ours: "Open access + curated indices.",
  },
  {
    roman: "IV",
    q: "What does it really cost?",
    old: (
      <>
        Two-and-twenty, written somewhere on page fourteen of a prospectus.
        Or invisibly, in the spread, in MEV, in slippage you never see.
      </>
    ),
    ours: "Gasless today. Future params by DAO vote.",
  },
];

/**
 * ProblemComparison — manuscript essay.
 *
 * Four numbered questions presented as journal entries. Each article gets a
 * choreographed sequence: a decorative roman numeral drops into the margin,
 * a thin left rule "draws" down the page, the question label fades up, the
 * serif headline arrives, the prose follows, and finally the "Ours:" pull-
 * quote lands like an annotation. Stagger between articles is 200ms; within
 * each article the internal beats overlap on a 100ms stagger. All motion
 * respects prefers-reduced-motion.
 */
export function ProblemComparison() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <Section
      id="problem"
      number="01"
      eyebrow="Why we built it"
      title={
        <>
          What if you could grow your money
          <em className="font-serif italic text-clay">
            , and still hold the keys?
          </em>
        </>
      }
      description="Today there are two answers. One holds them for you. One leaves you holding everything. We thought there should be a third."
    >
      {/* Salutation, sets the letter tone before the first question */}
      <m.div
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeIn}
        className="mx-auto mb-12 max-w-3xl"
      >
        <p className="flex items-center gap-2 text-clay">
          <Sprig />
          <span className="script text-[24px] leading-none">Dear reader,</span>
        </p>
      </m.div>

      <m.div
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          show: { transition: { staggerChildren: 0.2 } },
        }}
        className="mx-auto max-w-3xl space-y-14"
      >
        {essay.map((e, i) => (
          <m.article
            key={e.roman}
            // Each article is a stagger group for its own internal beats.
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.1, delayChildren: 0.05 },
              },
            }}
            className="group/q relative pl-8 sm:pl-12 lg:pl-14"
          >
            {/* Animated left rule */}
            <m.span
              aria-hidden
              variants={drawRule}
              className="absolute left-0 top-1 h-[calc(100%-4px)] w-px origin-top bg-ink/20"
            />

            {/* Decorative big roman numeral, sits in the left gutter.
                Right-aligned via flex (not translate-x) because the dropNumeral
                variant sets an inline transform that would override a Tailwind
                translate, letting wider numerals overlap the question label. */}
            <m.span
              aria-hidden
              variants={dropNumeral}
              className="display pointer-events-none absolute -top-1 left-0 flex w-8 select-none justify-end pr-2 text-[40px] leading-none text-clay/35 sm:-top-2 sm:w-12 sm:text-[56px] lg:w-14 lg:text-[72px]"
            >
              {e.roman}
            </m.span>

            {/* Margin note, handwritten aside on desktop, only on some questions */}
            {e.marginNote && (
              <m.aside
                aria-hidden
                variants={fadeIn}
                className="pointer-events-none absolute right-0 top-0 hidden max-w-[160px] -rotate-[4deg] text-clay/75 lg:block"
              >
                <span className="script text-[18px] leading-snug">
                  {e.marginNote}
                </span>
              </m.aside>
            )}

            {/* Question label */}
            <m.p
              variants={fadeUp}
              className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle"
            >
              Question {e.roman}.
            </m.p>

            {/* Headline, fades up, with a hover underline that draws in */}
            <m.h3
              variants={fadeUp}
              className="display relative mt-2 inline-block text-[26px] leading-tight text-ink sm:text-[32px]"
            >
              <span>{e.q}</span>
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-0 bg-clay transition-[width] duration-700 ease-in-soft group-hover/q:w-full"
              />
            </m.h3>

            {/* Body paragraph, drop-cap on the opening question */}
            <m.p
              variants={fadeUp}
              className={cn(
                "mt-4 text-[15.5px] leading-relaxed text-ink-muted sm:text-[16.5px]",
                i === 0 && "drop-cap",
              )}
            >
              {e.old}
            </m.p>

            {/* Pull-quote, arrives last, like an author's annotation */}
            <m.p
              variants={annotation}
              className="mt-5 flex items-start gap-2 text-[16px] leading-snug"
            >
              <span className="script shrink-0 text-[22px] leading-none text-clay">
                ✻ Ours:
              </span>
              <span className="font-serif italic text-moss-deep">{e.ours}</span>
            </m.p>
          </m.article>
        ))}
      </m.div>
    </Section>
  );
}

/* ---------- inline ornaments ---------- */

function Sprig() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden
      className="shrink-0"
    >
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
  );
}
