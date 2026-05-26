"use client";

import Link from "next/link";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";

/**
 * Legal block — the colophon at the back of the journal.
 *
 * Entity / Jurisdiction / Of record columns sit on cream paper. The
 * disclaimer reads as a hand-written marginal note. Legal documents link to
 * the three policies under /legal/[slug].
 */

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const legalLinks = [
  { label: "User Agreement", href: "/legal/user-agreement" },
  { label: "Acceptable Use Policy", href: "/legal/acceptable-use" },
  { label: "Cookie Policy", href: "/legal/cookie-policy" },
];

export function LegalBlock() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <Section vine={false} className="!pt-0">
      <m.article
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
        }}
        className="paper-card relative overflow-hidden p-7 sm:p-10 lg:p-12"
      >
        {/* Warm corner halos */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `
              radial-gradient(45% 55% at 0% 0%, rgb(var(--moss) / 0.06), transparent 70%),
              radial-gradient(50% 60% at 100% 100%, rgb(var(--clay) / 0.08), transparent 70%)
            `,
          }}
        />

        {/* Letterhead */}
        <m.div
          variants={fadeUp}
          className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink/10 pb-5"
        >
          <div className="flex items-baseline gap-3">
            <p className="script text-[22px] leading-none text-clay">
              Colophon
            </p>
            <span aria-hidden className="text-ink/20">·</span>
            <p className="text-[11.5px] font-medium uppercase tracking-wider text-ink-subtle">
              Of record
            </p>
          </div>
          <p className="text-[11.5px] font-medium uppercase tracking-wider text-moss-deep">
            Issued · BLOK Capital DAO LLC
          </p>
        </m.div>

        {/* Three columns: Entity / Jurisdiction / Documents */}
        <div className="mt-9 grid gap-9 sm:grid-cols-3 sm:gap-7 lg:gap-10">
          <m.div variants={fadeUp}>
            <p className="eyebrow text-moss">Entity</p>
            <p className="display mt-3 text-[20px] leading-[1.2] text-ink sm:text-[22px]">
              BLOK Capital{" "}
              <em className="font-serif italic text-moss">DAO LLC</em>
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">
              Non-profit limited liability company
            </p>
          </m.div>

          <m.div variants={fadeUp}>
            <p className="eyebrow text-moss">Jurisdiction</p>
            <p className="display mt-3 text-[20px] leading-[1.2] text-ink sm:text-[22px]">
              Marshall <em className="font-serif italic text-moss">Islands</em>
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">
              Incorporated under the RMI Non-Profit Entities Act
            </p>
          </m.div>

          <m.div variants={fadeUp}>
            <p className="eyebrow text-moss">Documents</p>
            <ul className="mt-3 space-y-2">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group/l inline-flex items-center gap-1.5 text-[13px] text-ink-muted transition-colors duration-200 hover:text-ink sm:text-[13.5px]"
                  >
                    <span className="underline decoration-clay/40 decoration-[1.5px] underline-offset-[4px] transition-colors group-hover/l:decoration-clay">
                      {l.label}
                    </span>
                    <span
                      aria-hidden
                      className="inline-block translate-x-0 text-clay opacity-60 transition-transform duration-300 ease-in-soft group-hover/l:translate-x-1 group-hover/l:opacity-100"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </m.div>
        </div>

        {/* Hand-drawn rule */}
        <div aria-hidden className="rule-hand mt-10" />

        {/* Disclaimer, marginal note */}
        <m.div
          variants={fadeUp}
          className="mt-7 grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-7"
        >
          <p className="script text-[26px] leading-none text-clay sm:mt-1">
            N.B.
          </p>
          <p className="max-w-3xl text-[13px] leading-relaxed text-ink-subtle sm:text-[13.5px]">
            BLOK Capital DAO LLC publishes this protocol but does not custody
            assets, act as a broker, or provide investment advice. Cryptoassets
            carry risk,{" "}
            <Link
              href="/legal/user-agreement"
              className="font-medium text-ink underline decoration-clay decoration-[1.5px] underline-offset-[4px] transition-colors hover:text-clay-deep"
            >
              read the User Agreement
            </Link>{" "}
            before connecting a wallet.
          </p>
        </m.div>
      </m.article>
    </Section>
  );
}
