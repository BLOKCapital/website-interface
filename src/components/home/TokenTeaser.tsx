"use client";

import Link from "next/link";
import {
  m,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/ui/GlassCard";
import { TokenMesh } from "@/components/home/TokenMesh";
import { cn } from "@/lib/utils";

/**
 * TokenTeaser — $BLOKC presented as a seed packet.
 *
 * Left card: utilities numbered I–IV (matches the editorial rhythm of
 * ProblemComparison + WhyItsSafe). Right card: a "seed packet" with a
 * BLOK·CAPITAL nursery header, the $BLOKC variety name, the rotating
 * coin as the specimen, and a sowing-instructions panel for the specs.
 * Closing P.S. links to the full token paper.
 */

const ease = [0.22, 1, 0.36, 1] as const;
const ROMANS = ["I", "II", "III", "IV"];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease } },
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

const utilities = [
  {
    id: "gov",
    label: "Governance",
    note: "Vote on every protocol change via Aragon OSX.",
  },
  {
    id: "loyalty",
    label: "Loyalty Rewards",
    note: "Active gardeners earn BLOKC as they use the protocol.",
  },
  {
    id: "stake",
    label: "Staking",
    note: "Stake BLOKC to earn protocol fees once the fee switch is live.",
  },
  {
    id: "boost",
    label: "Manager Boost",
    note: "Delegate BLOKC to amplify a Gardener's visibility.",
  },
];

export function TokenTeaser() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <Section
      id="token"
      eyebrow="$BLOKC"
      title={
        <>
          A seed that{" "}
          <em className="font-serif italic text-moss">grows with the garden.</em>
        </>
      }
      description="Loyalty rewards for active gardeners. Governance for everyone who holds. Aligned with the people who tend the protocol most."
    >
      <m.div
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
        }}
        className="grid gap-6 lg:grid-cols-12 lg:gap-8"
      >
        {/* Utilities panel, numbered I–IV */}
        <m.div variants={fadeUp} className="lg:col-span-7">
          <GlassCard className="h-full">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <p className="eyebrow text-moss">Utilities</p>
              <span className="inline-flex items-center gap-2 rounded-full border border-clay/35 bg-clay/[0.06] px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-clay-deep">
                <span className="size-1.5 rounded-full bg-clay" />
                Launches at IDO · Q1 2026
              </span>
            </div>

            <m.ol
              variants={{
                show: {
                  transition: { staggerChildren: 0.07, delayChildren: 0.15 },
                },
              }}
              className="mt-6 space-y-3"
            >
              {utilities.map((u, i) => (
                <m.li
                  key={u.id}
                  variants={fadeUp}
                  className="group/u flex items-start gap-3 rounded-xl border border-ink/10 bg-paper p-4 transition-colors duration-400 ease-in-soft hover:border-moss/30 hover:bg-moss/[0.04]"
                >
                  <m.span
                    variants={popStamp}
                    className="display flex size-7 shrink-0 items-center justify-center rounded-full border border-moss/40 bg-moss/10 text-[14px] leading-none text-moss-deep"
                  >
                    {ROMANS[i]}
                  </m.span>
                  <div className="flex-1">
                    <p className="text-[14.5px] font-medium text-ink">
                      {u.label}
                    </p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-muted">
                      {u.note}
                    </p>
                  </div>
                </m.li>
              ))}
            </m.ol>
          </GlassCard>
        </m.div>

        {/* Seed packet, reframes the rotating coin as a botanical specimen */}
        <m.div variants={fadeUp} className="lg:col-span-5">
          <SeedPacket />
        </m.div>
      </m.div>

      {/* Closing P.S. CTA */}
      <m.p
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
        className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[14.5px] leading-relaxed text-ink-muted sm:text-[15.5px]"
      >
        <span className="script text-[22px] leading-none text-clay">P.S.</span>
        <span>
          The full token paper is on the next shelf.{" "}
          <Link
            href="/features#token"
            className="group/t relative font-medium text-ink transition-colors hover:text-clay-deep"
          >
            <span className="underline decoration-clay decoration-[1.5px] underline-offset-[6px]">
              Read the token plan
            </span>
            <span
              aria-hidden
              className="inline-block translate-x-1 transition-transform duration-300 ease-in-soft group-hover/t:translate-x-2"
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

/* ---------- seed packet card ----------------------------------------------- */

function SeedPacket() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <m.article
      initial={initial}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
      }}
      className={cn(
        "paper-card paper-card-deep relative flex h-full flex-col items-center overflow-hidden p-6 text-center sm:p-7",
      )}
    >
      {/* Corner botanical sprigs, quiet ornaments at all 4 corners */}
      <Sprig className="pointer-events-none absolute left-3 top-3 -rotate-12 text-moss/45" />
      <Sprig className="pointer-events-none absolute right-3 top-3 rotate-12 text-clay/45" />
      <Sprig className="pointer-events-none absolute bottom-3 left-3 -rotate-[30deg] text-clay/40" />
      <Sprig className="pointer-events-none absolute bottom-3 right-3 rotate-[30deg] text-moss/45" />

      {/* Nursery header */}
      <m.div
        variants={fadeUp}
        className="flex flex-col items-center"
      >
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-subtle">
          BLOK · Capital Nursery
        </p>
        <span aria-hidden className="mt-2 h-px w-12 bg-ink/15" />
      </m.div>

      {/* Variety name */}
      <m.div variants={fadeUp} className="mt-4">
        <h3 className="display text-[34px] leading-none text-ink sm:text-[38px]">
          <span className="text-moss">$</span>BLOKC
        </h3>
        <p className="script mt-1.5 text-[18px] leading-none text-clay">
          a perennial governance seed
        </p>
      </m.div>

      {/* Specimen, rotating coin */}
      <m.div
        variants={fadeIn}
        className="relative mt-4 flex h-[180px] w-full items-center justify-center"
      >
        <TokenMesh />
      </m.div>

      {/* Sowing instructions divider */}
      <m.div
        variants={fadeUp}
        className="mt-2 flex w-full items-center gap-3"
      >
        <span aria-hidden className="h-px flex-1 bg-ink/15" />
        <p className="text-[10.5px] font-medium uppercase tracking-wider text-ink-subtle">
          Sowing instructions
        </p>
        <span aria-hidden className="h-px flex-1 bg-ink/15" />
      </m.div>

      <m.div variants={fadeUp} className="mt-3 grid w-full grid-cols-3 gap-2">
        <Spec label="Yield" value="10B" sub="seeds" />
        <Spec label="Soil" value="Arbitrum" sub="layer 2" />
        <Spec label="Decimals" value="18" sub="standard" />
      </m.div>

      {/* Plant after, a script tag at the bottom */}
      <m.p
        variants={fadeUp}
        className="script mt-4 text-[18px] leading-none text-clay"
      >
        plant after Q1 2026
      </m.p>
    </m.article>
  );
}

function Spec({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-lg border border-ink/10 bg-paper p-2.5 text-center">
      <p className="text-[9.5px] font-medium uppercase tracking-wider text-ink-subtle">
        {label}
      </p>
      <p className="mt-1 font-mono text-[13px] tabular-nums text-ink">{value}</p>
      <p className="mt-0.5 text-[9.5px] text-ink-subtle">{sub}</p>
    </div>
  );
}

function Sprig({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
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
