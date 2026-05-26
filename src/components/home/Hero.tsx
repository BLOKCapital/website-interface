"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ParticleField } from "@/components/ui/ParticleField";
import { GardenAsset } from "@/components/ui/GardenAsset";

/**
 * Home hero — Garden Journal opening page.
 *
 * Two warm columns:
 *   - Left: serif headline, handwritten margin note, plain dated tagline,
 *           two grounded CTAs.
 *   - Right: single garden render, gently swaying, more visible drifting
 *           leaves behind it.
 *
 * Mounted client-side for Framer Motion entrance choreography. Each element
 * fades up in sequence on first paint (greeting → headline → body → CTAs →
 * P.S. on the left; Folio mark → garden → caption on the right). Honors
 * prefers-reduced-motion via `useReducedMotion`.
 */

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease } },
};

export function Hero() {
  const reduce = useReducedMotion();

  // When reduced motion is on, skip the staggered choreography and paint the
  // final state immediately so the page is readable without animation.
  const initial = reduce ? "show" : "hidden";

  return (
    <section className="paper relative isolate flex min-h-svh items-center overflow-hidden">
      {/* Soft moss wash bottom-right, faint clay glow top-left, both warm, both subtle. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 78% 80%, rgb(var(--moss) / 0.10), transparent 55%), radial-gradient(40% 50% at 8% 6%, rgb(var(--clay) / 0.08), transparent 60%)",
        }}
      />

      {/* Drifting leaves, rendered at section level so they're visible across
          the whole hero (copy column + visual column + the gaps in between).
          Inside the visual column they used to get squeezed out by the garden
          image on small screens. */}
      <ParticleField count={16} className="z-0" />

      <m.div
        initial={initial}
        animate="show"
        variants={{
          show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
        }}
        className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-5 py-24 pt-28 sm:gap-10 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-8"
      >
        {/* Copy column */}
        <div className="lg:col-span-6 lg:pr-6">
          <m.div
            variants={fadeUp}
            className="flex items-center gap-2 text-clay"
          >
            <SmallLeaf />
            <span className="script text-[22px] leading-none">
              A letter from the garden
            </span>
          </m.div>

          <m.h1
            variants={fadeUp}
            className="display mt-6 text-[36px] leading-[1.05] text-ink sm:mt-7 sm:text-[48px] sm:leading-[1.02] md:text-[56px] lg:text-[72px] xl:text-[80px]"
          >
            Grow your crypto.
            <br />
            <span className="text-ink-muted">Never hand over</span>
            <br />
            the <em className="font-serif italic text-moss">keys</em>
            <span className="text-moss">.</span>
          </m.h1>

          <m.p
            variants={fadeUp}
            className="mt-7 max-w-xl text-base leading-relaxed text-ink-muted sm:text-[17px]"
          >
            Plant your own garden, or follow a gardener whose record lives
            on-chain. A minimal amount plants the first row, small enough to
            try, real enough to mean something.
          </m.p>

          <m.div
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button href="https://docs.blokcapital.io" size="lg" variant="primary">
              Read the Docs
              <Arrow />
            </Button>
            <Button
              href="https://docsend.com/view/4j6qvvrudyr6izyb"
              size="lg"
              variant="outline"
            >
              Whitepaper
            </Button>
          </m.div>

          <m.p
            variants={fadeUp}
            className="mt-10 max-w-xl text-[13px] leading-relaxed text-ink-subtle"
          >
            <span className="script text-[18px] text-clay">P.S.</span>{" "}
            Live on Arbitrum since spring 2024. No custody. No KYC at the
            protocol layer. Withdraw any time.
          </m.p>
        </div>

        {/* Visual column, single garden, drifting leaves behind */}
        <div className="relative lg:col-span-6">
          {/* Small editorial folio mark, fills the top of the right column
              tastefully without overpowering. */}
          <m.div
            variants={fadeUp}
            className="mb-2 hidden items-center gap-3 lg:flex lg:justify-end"
          >
            <span aria-hidden className="h-px w-12 bg-ink/20" />
            <span className="script text-[20px] leading-none text-clay">
              Folio I · Spring 2026
            </span>
          </m.div>

          <m.div
            variants={fadeIn}
            className="relative mx-auto h-[360px] w-full max-w-[600px] sm:h-[480px] md:h-[520px] lg:h-[560px]"
          >
            {/* Quiet warm halo, no neon */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(50% 50% at 55% 50%, rgb(var(--clay) / 0.12), transparent 70%), radial-gradient(60% 60% at 50% 82%, rgb(var(--moss) / 0.14), transparent 70%)",
              }}
            />

            {/* Soft contact shadow, seen through the transparent render so the
                floating garden gains weight instead of looking pasted. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-[10%] -z-[5] mx-auto h-12 w-[55%] rounded-[50%] blur-2xl"
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, rgb(var(--ink) / 0.20), transparent 72%)",
              }}
            />

            <m.div
              initial={reduce ? false : { scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease, delay: 0.2 }}
              className="absolute inset-0 animate-sway"
            >
              <GardenAsset
                n={11}
                priority
                quality={95}
                sizes="(max-width: 768px) 90vw, 720px"
              />
            </m.div>
          </m.div>

          {/* Handwritten caption */}
          <m.p
            variants={fadeUp}
            className="script mt-2 text-center text-[20px] leading-tight text-clay lg:text-right"
          >
            A garden, in spring.
          </m.p>
        </div>
      </m.div>

      {/* Scroll affordance, hand-set, with smooth-scroll to #problem */}
      <m.a
        href="#problem"
        aria-label="Scroll to next section"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease, delay: 1.1 }}
        className="group absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-ink-subtle transition-colors hover:text-clay"
      >
        <span className="script text-[18px] leading-none">turn the page</span>
        <m.svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          aria-hidden
          animate={reduce ? undefined : { y: [0, 4, 0] }}
          transition={
            reduce
              ? undefined
              : { duration: 2.4, ease: "easeInOut", repeat: Infinity }
          }
          className="transition-transform duration-400 ease-in-soft group-hover:translate-y-0.5"
        >
          <path
            d="M12 3 C 11.4 8 11.4 14 12 19"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M6.5 13.5 C 8.5 16 10 18 12 19.5 C 14 18 15.5 16 17.5 13.5"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </m.svg>
      </m.a>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path
        d="M2 7 H11 M7 3 L11 7 L7 11"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
