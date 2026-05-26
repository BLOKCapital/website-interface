"use client";

import Link from "next/link";
import { m, useReducedMotion, type Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const chapters = [
  { id: "investors", num: "I", label: "For Investors" },
  { id: "managers", num: "II", label: "For Managers" },
  { id: "builders", num: "III", label: "For Builders" },
  { id: "token", num: "IV", label: "$BLOKC" },
  { id: "audits", num: "V", label: "Security & Audits" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

/**
 * Features hero — Folio III · Index.
 *
 * Editorial letterhead, italic emphasis on "wealth", and a roman-numeral
 * chapter index that links into the five sections below. No drifting leaves;
 * the section relies on the cream-paper palette and a quiet ink letterhead.
 */
export function FeaturesHero() {
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
            BLOK Capital · Field Manual
          </p>
          <p className="script text-[20px] leading-none text-clay">Folio III</p>
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
              <p className="eyebrow text-moss">Features · Index</p>
              <span aria-hidden className="h-px w-8 bg-ink/15" />
              <span className="text-[11.5px] font-medium uppercase tracking-wider text-ink-subtle">
                Five chapters · One protocol
              </span>
            </m.div>

            <m.h1
              variants={fadeUp}
              className="display mt-6 text-[44px] leading-[1.02] text-ink sm:text-[64px] lg:text-[84px]"
            >
              Everything you need
              <br />
              <span className="text-ink-muted">to manage</span>{" "}
              <em className="font-serif italic text-moss">wealth</em>
              <br />
              on-chain<span className="text-clay">.</span>
            </m.h1>

            <m.p
              variants={fadeUp}
              className="mt-7 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-[17px]"
            >
              Five chapters. Each earns its place, by the contract it ships,
              the audit it passes, and the receipts it leaves behind.
            </m.p>
          </div>

          {/* Right column, quiet quick facts */}
          <m.div variants={fadeUp} className="lg:col-span-4">
            <ul className="space-y-3 border-l-2 border-moss/30 pl-4">
              <QuickFact label="Network" value="Arbitrum One" />
              <QuickFact label="License" value="MIT · open source" />
              <QuickFact label="Custody" value="Always yours" />
              <QuickFact label="Governance" value="DAO · Aragon OSX" />
            </ul>
          </m.div>
        </m.div>

        {/* Chapter index, Roman-numeral entries with hairline rule */}
        <m.div
          initial={initial}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="mt-14"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="script text-[20px] leading-none text-clay">
              Index
            </span>
            <span aria-hidden className="h-px flex-1 bg-ink/15" />
            <span className="text-[11.5px] font-medium uppercase tracking-wider text-moss-deep">
              {String(chapters.length).padStart(2, "0")} entries
            </span>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {chapters.map((c) => (
              <li key={c.id}>
                <Link
                  href={`#${c.id}`}
                  className="group/c flex items-baseline gap-3 rounded-xl border border-ink/10 bg-paper/60 px-4 py-3 transition-[transform,border-color,background-color] duration-300 ease-in-soft hover:-translate-y-0.5 hover:border-moss/35 hover:bg-paper"
                >
                  <span className="script text-[20px] leading-none text-clay">
                    {c.num}
                  </span>
                  <span className="text-[13.5px] text-ink-muted transition-colors group-hover/c:text-ink">
                    {c.label}
                  </span>
                  <span
                    aria-hidden
                    className="ml-auto inline-block translate-x-0 text-clay opacity-0 transition-all duration-300 ease-in-soft group-hover/c:translate-x-0.5 group-hover/c:opacity-100"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </m.div>
      </div>
    </section>
  );
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <li>
      <p className="text-[10.5px] font-medium uppercase tracking-wider text-ink-subtle">
        {label}
      </p>
      <p className="mt-0.5 text-[14px] text-ink">{value}</p>
    </li>
  );
}
