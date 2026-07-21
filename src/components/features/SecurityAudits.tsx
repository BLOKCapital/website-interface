"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { audits } from "@/lib/data/audits";
const ease = [0.22, 1, 0.36, 1] as const;
const ROMANS = ["I", "II", "III", "IV", "V", "VI"];

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

export function SecurityAudits() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <Section
      id="audits"
      eyebrow="Security & audits"
      title={
        <>
          Receipts, not{" "}
          <em className="font-serif italic text-clay">trust-me-bros.</em>
        </>
      }
      description="V1 audit completed by CredShields, with continuous automated review by SolidityScan and Octane."
    >
      {/* Ledger header */}
      <m.div
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
        className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-ink/10 py-4 text-[12px]"
      >
        <span className="inline-flex items-center gap-2 text-clay">
          <span className="script text-[20px] leading-none">Ledger</span>
          <span aria-hidden className="text-ink/20">·</span>
          <span className="text-[11.5px] font-medium uppercase tracking-wider text-ink-subtle">
            Audits
          </span>
        </span>
        <span aria-hidden className="hidden h-px flex-1 bg-ink/15 sm:block" />
        <span className="text-[11.5px] font-medium uppercase tracking-wider text-moss-deep">
          {String(audits.length).padStart(2, "0")} entries · Public record
        </span>
      </m.div>

      <m.ul
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
        }}
        className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4"
      >
        {audits.map((a, i) => (
          <m.li key={a.partner} variants={fadeUp}>
            <article className="paper-card group/a relative flex h-full flex-col p-5 transition-[transform,border-color,box-shadow] duration-400 ease-in-soft hover:-translate-y-1 hover:border-moss/35 hover:shadow-[0_22px_44px_-26px_rgba(31,26,20,0.20)]">
              {/* Numeral stamp + date */}
              <div className="flex items-center justify-between gap-3">
                <m.span
                  variants={popStamp}
                  className="inline-flex items-baseline gap-1.5 rounded-full border border-moss/35 bg-moss/[0.08] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-moss-deep"
                >
                  <span className="script text-[15px] leading-none">
                    {ROMANS[i] ?? `${i + 1}`}
                  </span>
                  <span>Audit</span>
                </m.span>
                <span className="text-[10.5px] font-medium uppercase tracking-wider text-clay-deep">
                  {a.date}
                </span>
              </div>

              <p className="display relative mt-5 inline-block text-[20px] leading-tight text-ink">
                <span>{a.partner}</span>
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-px w-0 bg-clay transition-[width] duration-500 ease-in-soft group-hover/a:w-full"
                />
              </p>

              <p className="mt-3 flex-1 text-[12.5px] leading-relaxed text-ink-muted">
                {a.scope}
              </p>
            </article>
          </m.li>
        ))}
      </m.ul>

      {/* Bottom row, Bounty + security contact */}
      <m.div
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
        }}
        className="mt-8 grid gap-4 sm:grid-cols-2"
      >
        <m.div variants={fadeUp} className="paper-card p-6">
          <div className="flex items-baseline justify-between gap-3">
            <p className="eyebrow text-moss">Continuous scanning</p>
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wider text-clay-deep">
              <span className="relative inline-flex size-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-clay/45" />
                <span className="relative inline-block size-1.5 rounded-full bg-clay" />
              </span>
              Live
            </span>
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
            Automated review by{" "}
            <span className="font-medium text-moss-deep">SolidityScan</span> and{" "}
            <span className="font-medium text-moss-deep">Octane</span>, re-run
            against deployed contracts on every release.
          </p>
          <Button
            href="https://github.com/BLOKCapital/audits"
            target="_blank"
            rel="noreferrer"
            variant="outline"
            size="sm"
            className="mt-5"
          >
            See the reports
          </Button>
        </m.div>

        <m.div variants={fadeUp} className="paper-card p-6">
          <p className="eyebrow text-moss">Report a vulnerability</p>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
            Found a security issue? Email{" "}
            {/* TODO(blok): confirm the dedicated security address + PGP key. */}
            <a
              href="mailto:security@blokcapital.io"
              className="font-medium text-ink underline decoration-clay decoration-[1.5px] underline-offset-[4px] transition-colors hover:text-clay-deep"
            >
              security@blokcapital.io
            </a>{" "}
            with steps to reproduce and impact. Please don&apos;t open a public
            issue or post in Discord. We acknowledge within{" "}
            <span className="font-medium text-ink">24 hours</span> and agree a fix
            and disclosure timeline with you.
          </p>
          <div aria-hidden className="rule-hand mt-5" />
          <p className="mt-3 text-[11.5px] leading-relaxed text-ink-subtle">
            In scope: the Garden Diamond, facets, indices and rebalancer
            contracts, and this site. Give us time to remediate before any
            public disclosure — we credit reporters who follow this process.
          </p>
        </m.div>
      </m.div>
    </Section>
  );
}
