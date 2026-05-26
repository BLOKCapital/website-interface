"use client";

import { m, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { GardenAsset } from "@/components/ui/GardenAsset";
import { SeedIcon } from "@/components/ui/SeedIcon";

/**
 * The Story — founder narrative panel beside a pull-quote panel.
 *
 * Structured as a proper letter: dated dateline → "Dear reader," opener →
 * three passages with a margin note alongside the first → hand-drawn rule
 * → "Yours in the soil, / S. Nehra" valediction → publication-style meta
 * footer. On the right, a magazine pull-quote with a clay hand-drawn
 * underline + a garden accent below.
 */

const ease = [0.22, 1, 0.36, 1] as const;

type Passage = {
  text: string;
  /** Optional handwritten aside that appears in the right margin on desktop. */
  marginNote?: string;
};

const passages: Passage[] = [
  {
    text: "The first wallet I ever made was on a flight to Lagos in 2017. By the time I landed I understood what was wrong with crypto, but I also understood what was wrong with the alternative.",
    marginNote: ", scribbled on the flight",
  },
  {
    text: "Custodians don't run away with your money very often. They just quietly tell you no when you ask the wrong question. They charge you 2-and-20 to invest in the same five things. They send you a PDF every quarter and call it transparency.",
  },
  {
    text: "BLOK is the protocol I wanted to use myself: a way to follow real managers, with on-chain receipts, without ever handing anyone the keys. We didn't invent any of the primitives, but we put them together in a way no one else had.",
  },
];

export function Story() {
  const reduce = useReducedMotion();

  return (
    <Section
      id="story"
      eyebrow="The story"
      title={
        <>
          One question,{" "}
          <em className="font-serif italic text-moss">a single answer.</em>
        </>
      }
      description="We started by asking why every wealth manager looked the same. Then we built something that didn't."
    >
      <div className="relative">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Founder narrative, cols 1-7 */}
          <m.article
            className="lg:col-span-7"
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease }}
          >
            <GlassPanel className="p-7 sm:p-9 lg:p-10">
              {/* Letter header, masthead style */}
              <header className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <SeedIcon size={12} className="text-moss" />
                <p className="eyebrow text-moss">A letter from BLOK Capital</p>
                <span className="ml-auto inline-flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-wider text-ink-subtle">
                  <span aria-hidden className="h-px w-6 bg-ink/20" />
                  Lagos · 2017
                </span>
              </header>

              {/* "Dear reader," opener in script */}
              <p className="script mt-7 text-[24px] leading-none text-clay">
                Dear reader,
              </p>

              <div className="mt-5 space-y-5 text-[15px] leading-relaxed text-ink-muted sm:text-base">
                {passages.map((p, i) => (
                  <m.div
                    key={p.text}
                    className="relative"
                    initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.12 }}
                  >
                    <p className={i === 0 ? "drop-cap" : ""}>{p.text}</p>

                    {/* Margin note, handwritten aside on desktop only */}
                    {p.marginNote && (
                      <span
                        aria-hidden
                        className="script pointer-events-none hidden text-clay/80 lg:absolute lg:-right-2 lg:top-1 lg:block lg:max-w-[110px] lg:-rotate-[4deg] lg:translate-x-full lg:text-[17px] lg:leading-snug"
                      >
                        {p.marginNote}
                      </span>
                    )}
                  </m.div>
                ))}
              </div>

              <div aria-hidden className="rule-hand mt-9" />

              {/* Valediction + signature */}
              <div className="mt-5 flex items-center gap-3">
                <span className="script text-[20px] leading-none text-clay/85">
                  Yours in the soil,
                </span>
                <span aria-hidden className="h-px w-10 bg-ink/20" />
                <span className="script text-[24px] leading-none text-clay">
                  BLOK Capital
                </span>
              </div>

              <p className="mt-3 text-[12.5px] leading-relaxed text-ink-subtle">
                Wyoming · Founded 2023 · Read in about two minutes
              </p>
            </GlassPanel>
          </m.article>

          {/* Right column: pull-quote + accent garden, stacked */}
          <div className="space-y-6 lg:col-span-5 lg:pt-16">
            {/* Pull-quote card */}
            <m.aside
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
            >
              <GlassPanel className="p-6 sm:p-7 lg:p-8" elevation={3}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="eyebrow text-moss">Pull quote</p>
                  <p className="text-[10.5px] font-medium uppercase tracking-wider text-ink-subtle">
                    From the letter
                  </p>
                </div>

                <blockquote className="display mt-5 text-[26px] leading-[1.2] italic text-ink sm:text-[30px] lg:text-[34px]">
                  <span className="text-clay">&ldquo;</span>
                  We didn&apos;t invent any of the primitives, but we put them
                  together in{" "}
                  <span className="relative inline-block">
                    a way no one else had
                    <span
                      aria-hidden
                      className="absolute -bottom-1 left-0 right-0 h-[3px] bg-clay/35"
                      style={{
                        clipPath:
                          "polygon(0 50%, 4% 30%, 12% 70%, 22% 25%, 34% 75%, 46% 30%, 58% 70%, 70% 25%, 82% 70%, 92% 30%, 100% 50%)",
                      }}
                    />
                  </span>
                  <span className="text-clay">.&rdquo;</span>
                </blockquote>

                <div aria-hidden className="rule-hand mt-7" />

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="script text-[22px] leading-none text-clay">
                    BLOK Capital
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">
                    The team
                  </span>
                </div>
              </GlassPanel>
            </m.aside>

            {/* Garden accent, sits below the pull-quote, drifts gently */}
            <m.div
              aria-hidden
              className="relative hidden h-[280px] w-full lg:block"
              initial={reduce ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.2, ease, delay: 0.5 }}
            >
              <div
                aria-hidden
                className="absolute inset-0 -z-10 blur-3xl"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, rgb(var(--clay) / 0.18), transparent 70%)",
                }}
              />
              <div className="absolute inset-0 animate-drift">
                <GardenAsset
                  n={4}
                  quality={94}
                  sizes="(max-width: 1024px) 360px, 440px"
                />
              </div>
            </m.div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function GlassPanel({
  children,
  className = "",
  elevation = 2,
}: {
  children: React.ReactNode;
  className?: string;
  elevation?: 1 | 2 | 3;
}) {
  const shadow =
    elevation === 3
      ? "shadow-[0_30px_60px_-30px_rgba(31,26,20,0.25)]"
      : "shadow-[0_20px_40px_-25px_rgba(31,26,20,0.18)]";
  return (
    <div
      className={[
        "paper-card relative overflow-hidden transition-transform duration-400 ease-in-soft hover:-translate-y-0.5",
        shadow,
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
