"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

/**
 * Preview hero — Folio IV · Specimen.
 *
 * Editorial letterhead, italic emphasis on "before", and a quiet
 * lab-specimen constants panel. No drifting leaves; cream-paper palette only.
 */
export function PreviewHero() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <section className="paper relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background: `
            radial-gradient(45% 65% at 18% 18%, rgb(var(--moss) / 0.10), transparent 65%),
            radial-gradient(55% 70% at 82% 110%, rgb(var(--clay) / 0.12), transparent 70%)
          `,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-28 sm:px-8 sm:pt-36 lg:pt-40">
        {/* Letterhead */}
        <m.div
          initial={initial}
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUp}
          className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/10 pb-5"
        >
          <p className="text-[12px] font-medium tracking-wide text-ink-subtle">
            BLOK Capital · Specimen Sheet
          </p>
          <p className="script text-[20px] leading-none text-clay">Folio IV</p>
        </m.div>

        <m.div
          initial={initial}
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
          className="mt-12 grid grid-cols-1 items-end gap-12 lg:grid-cols-12"
        >
          <div className="lg:col-span-8">
            <m.div variants={fadeUp} className="flex items-center gap-3">
              <p className="eyebrow text-moss">Sandbox preview</p>
              <span aria-hidden className="h-px w-8 bg-ink/15" />
              <span className="text-[11.5px] font-medium uppercase tracking-wider text-ink-subtle">
                Specimen Nº 03 · No wallet required
              </span>
            </m.div>

            <m.h1
              variants={fadeUp}
              className="display mt-6 text-[44px] leading-[1.02] text-ink sm:text-[64px] lg:text-[84px]"
            >
              Try it{" "}
              <em className="font-serif italic text-moss">before</em>
              <br />
              <span className="text-ink-muted">you</span>{" "}
              connect<span className="text-clay">.</span>
            </m.h1>

            <m.p
              variants={fadeUp}
              className="mt-7 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-[17px]"
            >
              A real, interactive sandbox of the Garden dashboard. Switch
              presets, rebalance, hire a Gardener, nothing here touches a real
              chain.
            </m.p>

            <m.div
              variants={fadeUp}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button href="#sandbox" size="lg" variant="primary">
                Start the demo
                <Arrow />
              </Button>
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper-deep/60 px-3 py-1.5">
                <span className="relative inline-flex size-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-clay/45" />
                  <span className="relative inline-block size-1.5 rounded-full bg-clay" />
                </span>
                <span className="text-[10.5px] font-medium uppercase tracking-wider text-moss-deep">
                  Sandbox · no wallet required
                </span>
              </span>
            </m.div>
          </div>

          {/* Lab-style constants column */}
          <m.div variants={fadeUp} className="lg:col-span-4">
            <div className="paper-card ml-auto inline-flex w-full flex-col gap-3 p-5 lg:max-w-[300px]">
              <div className="flex items-baseline justify-between gap-3 border-b border-ink/10 pb-3">
                <span className="script text-[18px] leading-none text-clay">
                  Constants
                </span>
                <span className="text-[10.5px] font-medium uppercase tracking-wider text-moss-deep">
                  Test environment
                </span>
              </div>
              <Constant label="Network" value="Arbitrum (sim)" />
              <Constant label="Custody" value="Self · always" />
              <Constant label="Chain calls" value="0" />
              <Constant label="Reset" value="On reload" />
            </div>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}

function Constant({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-left">
      <span className="text-[10.5px] font-medium uppercase tracking-wider text-ink-subtle">
        {label}
      </span>
      <span className="mono text-[12.5px] text-ink">{value}</span>
    </div>
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
