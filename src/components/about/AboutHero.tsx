"use client";

import Link from "next/link";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { GardenAsset } from "@/components/ui/GardenAsset";
import { ParticleField } from "@/components/ui/ParticleField";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease } },
};

/**
 * About hero — personal letterhead.
 *
 * "Folio II · About" mark in the masthead corner echoes the home Hero's
 * "Folio I · Spring 2026", setting up a multi-page editorial system. Ambient
 * leaves drift across the section like on the home Hero. Each element fades
 * up in sequence on first paint; respects prefers-reduced-motion.
 */
export function AboutHero() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <section className="paper relative isolate flex flex-col overflow-hidden lg:min-h-[100dvh]">
      {/* Atmosphere, moss wash from below, faint clay corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background: `
            radial-gradient(60% 80% at 50% 110%, rgb(var(--moss) / 0.18), transparent 70%),
            radial-gradient(35% 50% at 88% 12%, rgb(var(--clay) / 0.10), transparent 65%)
          `,
        }}
      />

      {/* Drifting leaves, ambient layer across the whole hero */}
      <ParticleField count={14} className="z-0" />

      <m.div
        initial={initial}
        animate="show"
        variants={{
          show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
        }}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-12 pt-20 sm:px-8 sm:pb-20 sm:pt-28 lg:flex lg:flex-1 lg:items-center lg:pb-20 lg:pt-32"
      >
        <div className="grid w-full items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Heading column */}
          <div className="lg:col-span-7 xl:col-span-8">
            <m.div
              variants={fadeUp}
              className="flex items-center gap-2 text-clay"
            >
              <SmallLeaf />
              <span className="script text-[22px] leading-none">
                A note from the gardeners
              </span>
            </m.div>

            <m.h1
              variants={fadeUp}
              className="display mt-6 text-[36px] leading-[1.04] text-ink sm:mt-7 sm:text-[52px] md:text-[64px] lg:text-[76px] xl:text-[84px]"
            >
              Built by the
              <br />
              <span className="text-ink-muted">community,</span>
              <br />
              for the <em className="font-serif italic text-moss">world</em>
              <span className="text-moss">.</span>
            </m.h1>

            <m.p
              variants={fadeUp}
              className="drop-cap mt-7 max-w-2xl text-base leading-relaxed text-ink-muted sm:mt-8 sm:text-[17px]"
            >
              BLOK is a protocol, not a product owned by anyone. The team that
              shipped it doesn&apos;t hold the keys to your money, the right to
              change it without a vote, or the ability to take it down.
            </m.p>

            {/* Quick facts, small mono credentials row */}
            <m.div
              variants={fadeUp}
              className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-ink-subtle"
            >
              <span className="inline-flex items-center gap-1.5 font-medium uppercase tracking-wider">
                <span aria-hidden className="size-1 rounded-full bg-moss" />
                MIT on GitHub
              </span>
              <span aria-hidden className="text-ink/15">·</span>
              <span className="inline-flex items-center gap-1.5 font-medium uppercase tracking-wider">
                <span aria-hidden className="size-1 rounded-full bg-clay" />
                DAO-governed since 2023
              </span>
              <span aria-hidden className="text-ink/15">·</span>
              <span className="inline-flex items-center gap-1.5 font-medium uppercase tracking-wider">
                <span aria-hidden className="size-1 rounded-full bg-ochre" />
                Live on Arbitrum
              </span>
            </m.div>

            <m.p
              variants={fadeUp}
              className="mt-8 max-w-2xl text-[13.5px] leading-relaxed text-ink-subtle sm:text-[14px]"
            >
              <span className="script mr-1 text-[20px] leading-none text-clay">
                P.S.
              </span>
              We work in the open.{" "}
              <Link
                href="https://github.com/BLOKCapital"
                target="_blank"
                rel="noreferrer"
                className="group/g relative font-medium text-ink transition-colors hover:text-clay-deep"
              >
                <span className="underline decoration-clay decoration-[1.5px] underline-offset-[5px]">
                  Read the contracts
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
            </m.p>
          </div>

          {/* Masthead column, Folio mark + garden + founder card */}
          <div className="lg:col-span-5 xl:col-span-4">
            {/* Folio II mark (desktop only, mobile already has the script
                "A note from the gardeners" greeting on the left) */}
            <m.div
              variants={fadeUp}
              className="mb-6 hidden items-center justify-end gap-3 lg:flex"
            >
              <span aria-hidden className="h-px w-12 bg-ink/20" />
              <span className="script text-[20px] leading-none text-clay">
                Folio II · About
              </span>
            </m.div>

            {/* Garden render, gently sways, scales in on mount */}
            <m.div
              initial={reduce ? false : { scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.0, ease, delay: 0.4 }}
              className="relative mx-auto h-[340px] w-full max-w-[420px] sm:h-[420px] sm:max-w-[480px] lg:ml-auto lg:mr-0 lg:h-[500px] lg:max-w-[500px] xl:h-[560px] xl:max-w-[560px]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, rgb(var(--moss) / 0.20), transparent 70%), radial-gradient(55% 55% at 50% 70%, rgb(var(--clay) / 0.12), transparent 70%)",
                }}
              />
              <div className="absolute inset-0 animate-sway">
                <GardenAsset
                  n={2}
                  priority
                  quality={95}
                  sizes="(max-width: 768px) 420px, (max-width: 1280px) 500px, 560px"
                />
              </div>
            </m.div>

            {/* Garden caption, fills the void under the image and mirrors
                the home Hero's "A garden, in spring." pattern. */}
            <m.p
              variants={fadeUp}
              className="script mt-1 text-center text-[20px] leading-tight text-clay lg:text-right"
            >
              Specimen II · in full bloom.
            </m.p>

            {/* Founder card, tighter to the caption, opens with a valediction */}
            <m.div
              variants={fadeIn}
              className="mt-5 flex flex-col items-start sm:items-center lg:items-end"
            >
              <p className="script text-[18px] leading-none text-clay/85">
                Yours in the soil,
              </p>
              <div className="mt-2 flex items-center gap-3 lg:flex-row-reverse">
                <span aria-hidden className="h-px w-12 bg-ink/20" />
                <span className="script text-[26px] leading-none text-clay">
                  BLOK Capital
                </span>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-subtle sm:text-center lg:text-right">
                BLOK Capital DAO
                <br />
                Founded 2023
              </p>
            </m.div>
          </div>
        </div>
      </m.div>

      {/* Bottom hairline */}
      <div aria-hidden className="mx-auto h-px max-w-7xl px-5 sm:px-8">
        <span className="rule-hand block h-full" />
      </div>
    </section>
  );
}

function SmallLeaf() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
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
