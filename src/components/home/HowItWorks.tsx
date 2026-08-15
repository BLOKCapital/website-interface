"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/ui/GlassCard";
import { GrowthVine } from "@/components/ui/GrowthVine";
import { TiltCard } from "@/components/ui/TiltCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Sparkline } from "@/components/ui/Sparkline";
import { DiamondCompact } from "@/components/ui/DiamondCompact";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease } },
};
// Sparkline "draw" — left-to-right clip reveal.
const drawSpark: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  show: {
    clipPath: "inset(0 0 0 0)",
    transition: { duration: 1.1, ease, delay: 0.3 },
  },
};
// Progress bar fill — width 0→target.
const drawBar: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.9, ease, delay: 0.3 } },
};
// Step number circles — spring-in.
const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease, type: "spring", bounce: 0.4 },
  },
};
// A small grouper that staggers its inline children — for badge / facet grids.
const staggerGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};
// Badge / chip reveal — y + scale.
const badgeReveal: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease },
  },
};

/**
 * HowItWorks — "Three doors. One garden."
 *
 * The section reads as a chooser, not a corridor: three gates across the top,
 * and the one you pick swings open onto its chapter. That is what the heading
 * and description have always promised ("pick your way in", "written for one
 * of you"); stacking all three chapters contradicted the copy and made this
 * the tallest section on the page (~4,000px on a phone) — tall enough that its
 * own scroll trigger could not fire. See the note on Reveal's `amount`.
 *
 * All three panels stay mounted and the inactive ones are hidden, so the full
 * copy is still in the prerendered HTML — `output: "export"` means what ships
 * in the static file is what a crawler reads.
 *
 * The mocks are small but data-real: the Investor sees a portfolio with a
 * drawn-on growth sparkline, an allocation breakdown and a chain-style
 * activity log; the Gardener sees a strategy ledger with a 24-week track
 * record sparkline and a live strategy roster; the Builder sees a diamond
 * proxy diagram, a composability matrix, an actual Solidity facet snippet
 * and a tests/coverage/gas line.
 */

type Chapter = {
  /** Stable id — used for the tab/panel aria wiring. */
  id: string;
  roman: string;
  persona: string;
  eyebrow: string;
  headline: string;
  steps: string[];
  mock: React.ReactNode;
};

const chapters: Chapter[] = [
  {
    id: "investor",
    roman: "I",
    persona: "The Investor",
    eyebrow: "Garden owner",
    headline: "Plant a garden in a minute or two.",
    steps: [
      "Sign in with your wallet. We never touch the keys, they stay where you set them.",
      "Fund it with a minimal amount. Pick a curated index that rebalances itself, or follow a gardener whose record lives on-chain.",
      "Watch it grow. Every move is written on-chain. Pull what you've planted out any morning.",
    ],
    mock: <InvestorMock />,
  },
  {
    id: "gardener",
    roman: "II",
    persona: "The Gardener",
    eyebrow: "Manager",
    headline: "Run real strategies. Build a record no one else can move.",
    steps: [
      "Publish your strategy on-chain. Onboard clients with a single pass.",
      "Trades settle through the Garden. Your performance writes itself to a reputation badge you take with you.",
      "Fees settle on-chain, per the terms you set. No invoicing, no escrow, no platform middleman.",
    ],
    mock: <ManagerMock />,
  },
  {
    id: "builder",
    roman: "III",
    persona: "The Builder",
    eyebrow: "Developer",
    headline: "Read the contracts. Compose what you'd actually use.",
    steps: [
      "Everything is MIT on GitHub. Read it, fork it, run the front-end locally.",
      "Add facets without migrating (EIP-2535). Storage namespacing (EIP-7201) keeps slots clean.",
      "Compose with Uniswap, Camelot, GMX, Aave, Pendle, and Chainlink, all wired through the Facet Registry.",
    ],
    mock: <BuilderMock />,
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";
  const [openId, setOpenId] = useState(chapters[0].id);
  const gateRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // WAI-ARIA tabs keyboard model — arrows walk the gates, Home/End jump to the
  // ends. Selection follows focus, which is the right call for three cheap
  // panels: no extra keypress to see what a door opens onto.
  function onGateKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const from = chapters.findIndex((c) => c.id === openId);
    const to =
      e.key === "ArrowRight"
        ? (from + 1) % chapters.length
        : e.key === "ArrowLeft"
          ? (from - 1 + chapters.length) % chapters.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? chapters.length - 1
              : -1;
    if (to < 0) return;
    e.preventDefault();
    setOpenId(chapters[to].id);
    gateRefs.current[chapters[to].id]?.focus();
  }

  return (
    <Section
      id="how"
      eyebrow="How it works"
      title={
        <>
          Three doors.{" "}
          <em className="font-serif italic text-moss">One garden.</em>
        </>
      }
      description="Investor, gardener, builder, pick your way in. Each chapter below is written for one of you."
    >
      <div className="relative">
        <GrowthVine className="-left-8 top-2 hidden xl:block" />

        {/* The three doors. */}
        <div
          role="tablist"
          aria-label="Choose your way in"
          onKeyDown={onGateKeyDown}
          className="grid grid-cols-3 gap-2.5 sm:gap-4"
        >
          {chapters.map((c) => {
            const open = c.id === openId;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  gateRefs.current[c.id] = el;
                }}
                type="button"
                role="tab"
                id={`gate-${c.id}`}
                aria-selected={open}
                aria-controls={`chapter-${c.id}`}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpenId(c.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-[12px] border px-2 py-3.5 text-center transition-colors duration-300 sm:gap-2.5 sm:px-4 sm:py-5",
                  open
                    ? "border-moss/45 bg-moss/[0.06]"
                    : "border-ink/10 bg-paper-warm/50 hover:border-moss/35 hover:bg-paper-warm",
                )}
              >
                <Gate open={open} reduce={!!reduce} />
                <span className="flex items-baseline gap-1.5">
                  <span className="display text-[12px] leading-none text-clay/70 sm:text-[13px]">
                    {c.roman}
                  </span>
                  <span
                    className={cn(
                      "display text-[13px] leading-tight transition-colors sm:text-[17px]",
                      open ? "text-ink" : "text-ink-muted",
                    )}
                  >
                    {c.persona}
                  </span>
                </span>
                <span
                  className={cn(
                    "eyebrow hidden transition-colors sm:block",
                    open ? "text-moss" : "text-ink-subtle",
                  )}
                >
                  {c.eyebrow}
                </span>
              </button>
            );
          })}
        </div>

        {/* The chapter behind the open door. Every panel stays mounted and the
            unchosen ones are `hidden`, so all three chapters are still in the
            prerendered HTML rather than one-third of the copy. */}
        <div className="mt-10 sm:mt-14">
          {chapters.map((c) => {
            const open = c.id === openId;
            return (
              <div
                key={c.id}
                id={`chapter-${c.id}`}
                role="tabpanel"
                aria-labelledby={`gate-${c.id}`}
                hidden={!open}
              >
                <m.article
                  // Re-keying on open replays the entrance each time a door is
                  // picked. whileInView still drives the very first reveal: a
                  // freshly mounted element already in view fires immediately.
                  key={open ? `${c.id}-open` : c.id}
                  initial={initial}
                  whileInView="show"
                  viewport={{
                    once: true,
                    amount: "some",
                    margin: "0px 0px -120px 0px",
                  }}
                  variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                  className="grid items-start gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-14"
                >
                  <div>
                    <m.h3
                      variants={fadeUp}
                      className="display text-[26px] leading-tight text-ink sm:text-[32px] lg:text-[36px]"
                    >
                      {c.headline}
                    </m.h3>

                    <ol className="mt-8 space-y-4">
                      {c.steps.map((s, j) => (
                        <m.li key={s} variants={fadeUp} className="flex gap-4">
                          <m.span
                            variants={popIn}
                            className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-moss/40 bg-moss/10 text-center text-[12px] font-semibold leading-6 text-moss-deep"
                          >
                            {j + 1}
                          </m.span>
                          <p className="text-[15px] leading-relaxed text-ink-muted">
                            {s}
                          </p>
                        </m.li>
                      ))}
                    </ol>
                  </div>

                  <m.div variants={fadeIn} className="relative">
                    <TiltCard maxTilt={3.5} className="rounded-[14px]">
                      <GlassCard className="p-5 sm:p-6">{c.mock}</GlassCard>
                    </TiltCard>
                  </m.div>
                </m.article>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ---------- the gate on each door ------------------------------------------ */

/**
 * A garden gate drawn in ink. Picking a door swings both leaves back to a
 * sliver, so the moss and the path beyond read through the opening — the
 * selected state is the door being *open*, not a colour swap.
 */
function Gate({ open, reduce }: { open: boolean; reduce: boolean }) {
  const t = reduce ? { duration: 0 } : { duration: 0.5, ease };
  const leaf = { scaleX: open ? 0.14 : 1 };

  return (
    <svg
      viewBox="0 0 44 56"
      className="h-10 w-8 shrink-0 sm:h-12 sm:w-10"
      aria-hidden
    >
      {/* the garden beyond */}
      <m.path
        d="M6 51 V20 A16 16 0 0 1 38 20 V51 Z"
        fill="rgb(var(--moss))"
        initial={false}
        animate={{ opacity: open ? 0.18 : 0.05 }}
        transition={t}
      />
      {/* a path leading in */}
      <m.path
        d="M17 51 L20.5 36 H23.5 L27 51 Z"
        fill="rgb(var(--ochre))"
        initial={false}
        animate={{ opacity: open ? 0.55 : 0 }}
        transition={t}
      />
      {/* jambs + arch */}
      <path
        d="M6 51 V20 A16 16 0 0 1 38 20 V51"
        fill="none"
        stroke="rgb(var(--ink) / 0.38)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      {/* leaves, hinged on the outer jambs */}
      <m.g
        initial={false}
        animate={leaf}
        transition={t}
        style={{ transformBox: "view-box", transformOrigin: "6px 34px" }}
      >
        <path
          d="M7 50 V21 A15 15 0 0 1 21.6 6.2 V50 Z"
          fill="rgb(var(--paper-warm))"
          stroke="rgb(var(--ink) / 0.3)"
          strokeWidth="1.2"
        />
        <path
          d="M11.5 44 V25 M16 42.5 V21.5"
          stroke="rgb(var(--ink) / 0.15)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </m.g>
      <m.g
        initial={false}
        animate={leaf}
        transition={t}
        style={{ transformBox: "view-box", transformOrigin: "38px 34px" }}
      >
        <path
          d="M37 50 V21 A15 15 0 0 0 22.4 6.2 V50 Z"
          fill="rgb(var(--paper-warm))"
          stroke="rgb(var(--ink) / 0.3)"
          strokeWidth="1.2"
        />
        <path
          d="M32.5 44 V25 M28 42.5 V21.5"
          stroke="rgb(var(--ink) / 0.15)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </m.g>
      {/* ground */}
      <path
        d="M2 51.5 H42"
        stroke="rgb(var(--ink) / 0.32)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- shared mock primitives ------------------------------------------ */

function JournalHeader({ date, mark }: { date: string; mark: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-b border-ink/10 pb-2.5">
      <p className="script text-[16px] leading-none text-clay sm:text-[18px]">
        {date}
      </p>
      <span className="flex items-baseline gap-2">
        {/* Disclaimer: every mock panel carries this so the figures below are
            never mistaken for a real user's account or actual returns. */}
        <span className="rounded-full border border-clay/30 bg-clay/[0.06] px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-clay-deep">
          Illustrative
        </span>
        <span className="text-[10.5px] font-medium uppercase tracking-wider text-ink-subtle sm:text-[11px]">
          {mark}
        </span>
      </span>
    </div>
  );
}

function MockStagger({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: "some", margin: "0px 0px -80px 0px" }}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
    >
      {children}
    </m.div>
  );
}

/* ---------- INVESTOR MOCK — Garden ledger page ------------------------------ */

const investorTrail = [42100, 42800, 43200, 43050, 44300, 45100, 44800, 45900, 47000, 47600, 48210];
const investorActivity = [
  { kind: "Auto-rebalance", when: "2h ago", amount: "−0.04 ETH ↔ +13 USDC", hash: "0xae3a…c4f1" },
  { kind: "Deposit", when: "12h ago", amount: "+200 USDC", hash: "0x82e9…e3a9" },
  { kind: "Yield claim", when: "1d ago", amount: "+0.31 ARB", hash: "0x092b…7b22" },
];

function InvestorMock() {
  return (
    <MockStagger>
      <JournalHeader date="April 14, 2026" mark="Folio · 0421" />

      <m.div variants={fadeUp} className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-moss">Your garden</p>
          <p className="display mt-1 text-[28px] leading-none text-ink sm:text-[32px]">
            $<AnimatedNumber value={48210} duration={1400} />
          </p>
          <p className="mt-1 text-[12.5px] text-moss-deep">
            +<AnimatedNumber value={2.41} duration={1400} decimals={2} format="number" />% this week
          </p>
        </div>
        <m.div variants={drawSpark} className="origin-left">
          <Sparkline
            values={investorTrail}
            width={140}
            height={44}
            strokeColor="rgb(var(--moss))"
            fillColor="rgba(79, 111, 79, 0.16)"
          />
        </m.div>
      </m.div>

      {/* Allocation */}
      <m.div variants={fadeUp} className="mt-5 grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <DonutMini />
        </div>
        <div className="col-span-2 space-y-2.5">
          {[
            { sym: "ETH", pct: 42, c: "rgb(var(--moss))" },
            { sym: "ARB", pct: 28, c: "rgb(var(--clay))" },
            { sym: "BLOKC", pct: 20, c: "rgb(var(--ochre))" },
            { sym: "USDC", pct: 10, c: "rgb(var(--sage))" },
          ].map((a) => (
            <div key={a.sym} className="flex items-center gap-2">
              <span
                className="size-1.5 rounded-full"
                style={{ background: a.c }}
              />
              <span className="text-[12.5px] font-medium text-ink">{a.sym}</span>
              <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-paper-deep">
                <m.span
                  variants={drawBar}
                  className="absolute inset-y-0 left-0 origin-left rounded-full"
                  style={{ width: `${a.pct}%`, background: a.c, opacity: 0.9 }}
                />
              </div>
              <span className="mono w-8 text-right text-[11px] text-ink-muted">
                {a.pct}%
              </span>
            </div>
          ))}
        </div>
      </m.div>

      {/* KPIs */}
      <m.div
        variants={fadeUp}
        className="mt-5 grid grid-cols-3 gap-3 border-t border-ink/10 pt-4"
      >
        <Kpi label="Balance" value="$48,210" />
        <Kpi label="This week" value="+2.41%" tone="primary" />
        <Kpi label="Since planted" value="+18.4%" tone="primary" />
      </m.div>

      {/* Activity log, chain-style */}
      <m.div variants={fadeUp} className="mt-5">
        <p className="eyebrow mb-2.5 text-ink-subtle">Recent activity</p>
        <m.ul variants={staggerGroup} className="space-y-1.5">
          {investorActivity.map((a) => (
            <m.li
              key={a.hash}
              variants={badgeReveal}
              className="flex items-center justify-between gap-3 rounded-md bg-paper px-2.5 py-1.5 text-[12px] transition-colors hover:bg-paper-deep"
            >
              <span className="flex items-center gap-2 text-ink">
                <span className="inline-block size-1.5 rounded-full bg-moss/70" />
                {a.kind}
              </span>
              <span className="text-ink-muted">{a.amount}</span>
              <span className="text-ink-subtle">{a.when}</span>
              <span className="mono text-[10.5px] text-ink-subtle">{a.hash}</span>
            </m.li>
          ))}
        </m.ul>
      </m.div>

      <m.p variants={fadeUp} className="script mt-4 text-[18px] leading-snug text-clay">
        Rebalanced last Tuesday. Soil&apos;s good.
      </m.p>
    </MockStagger>
  );
}

/* ---------- MANAGER MOCK — Gardener's diary entry --------------------------- */

const managerTrail = [
  100, 101, 103, 102, 105, 107, 106, 110, 112, 111, 114,
  117, 116, 120, 122, 121, 124, 126, 129, 128, 131, 134, 136, 139,
];
const strategies = [
  { name: "Momentum", v: "v3", change: "+2.4%", positive: true },
  { name: "ARB Yield", v: "v2", change: "+1.1%", positive: true },
  { name: "Stable Rebalance", v: "v1", change: "+0.5%", positive: true },
];

function ManagerMock() {
  const reduce = useReducedMotion();
  return (
    <MockStagger>
      <JournalHeader date="April 14, 2026" mark="Entry XII" />

      <m.div
        variants={fadeUp}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <p className="eyebrow text-moss">Gardener&apos;s ledger</p>
          <p className="display mt-1 text-[28px] leading-none text-ink sm:text-[32px]">
            $<AnimatedNumber value={4.22} duration={1400} decimals={2} format="number" />M
          </p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-medium text-clay-deep">
            <m.span
              aria-hidden
              className="relative inline-flex size-1.5 items-center justify-center"
            >
              <m.span
                className="absolute inset-0 rounded-full bg-clay/40"
                animate={reduce ? undefined : { scale: [1, 2.3, 1], opacity: [0.55, 0, 0.55] }}
                transition={
                  reduce
                    ? undefined
                    : { duration: 2.2, ease: "easeOut", repeat: Infinity }
                }
              />
              <span className="relative size-1.5 rounded-full bg-clay" />
            </m.span>
            Open to clients · 24-week record
          </p>
        </div>
        <m.div variants={drawSpark} className="origin-left">
          <Sparkline
            values={managerTrail}
            width={150}
            height={44}
            strokeColor="rgb(var(--moss))"
            fillColor="rgba(79, 111, 79, 0.16)"
          />
        </m.div>
      </m.div>

      {/* Kpi grid */}
      <m.div variants={fadeUp} className="mt-5 grid grid-cols-2 gap-4">
        <Kpi label="Plants tended" value="$4.22M" />
        <Kpi label="Hired you" value="184 gardeners" />
        <Kpi label="This week" value="+1.84%" tone="primary" />
        <Kpi label="Reputation" value="94 / 100" tone="primary" />
      </m.div>

      {/* Active strategies */}
      <m.div variants={fadeUp} className="mt-5">
        <p className="eyebrow mb-2.5 text-ink-subtle">Active strategies</p>
        <m.ul variants={staggerGroup} className="space-y-1.5">
          {strategies.map((s) => (
            <m.li
              key={s.name}
              variants={badgeReveal}
              className="flex items-center justify-between gap-3 rounded-md bg-paper px-2.5 py-1.5 text-[12.5px] transition-colors hover:bg-paper-deep"
            >
              <span className="text-ink">{s.name}</span>
              <span className="mono text-[10.5px] uppercase tracking-wider text-ink-subtle">
                {s.v}
              </span>
              <span
                className={cn(
                  "font-mono tabular-nums",
                  s.positive ? "text-moss-deep" : "text-clay-deep",
                )}
              >
                {s.change}
              </span>
            </m.li>
          ))}
        </m.ul>
      </m.div>

      {/* Reputation badge */}
      <m.div
        variants={fadeUp}
        className="mt-5 flex items-center justify-between rounded-lg border border-moss/30 bg-moss/[0.06] px-3 py-2.5"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex size-7 items-center justify-center rounded-full border border-moss/50 bg-paper text-moss-deep">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M7 1 L 12 4 L 11 11 L 7 13 L 3 11 L 2 4 Z"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
              />
              <path
                d="M5 7 L 6.5 8.5 L 9 5.5"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div>
            <p className="text-[12.5px] font-medium text-ink">Reputation badge</p>
            <p className="mono text-[11px] text-ink-subtle">ERC-5484 · #178</p>
          </div>
        </div>
        <span className="text-[11px] font-medium tracking-wider text-moss-deep">
          SOULBOUND
        </span>
      </m.div>

      <m.div
        variants={fadeUp}
        className="mt-5 rounded-lg border border-ink/10 bg-paper p-3"
      >
        <p className="eyebrow text-ink-subtle">Last entry</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink">
          Rotated into momentum basket. Slight overweight on ARB this season,
          will re-check after the next epoch.
        </p>
      </m.div>

      <m.p
        variants={fadeUp}
        className="script mt-4 text-right text-[20px] leading-none text-clay"
      >
        A.V.
      </m.p>
    </MockStagger>
  );
}

/* ---------- BUILDER MOCK — From the maintainer's notebook ------------------- */

const composability = [
  { name: "Uniswap", v: "V3" },
  { name: "Camelot", v: "V3" },
  { name: "GMX", v: "V2" },
  { name: "Aave", v: "V3" },
  { name: "Pendle", v: "V2" },
  { name: "Chainlink", v: ", " },
];

function BuilderMock() {
  return (
    <MockStagger>
      <JournalHeader date="April 14, 2026" mark="Commit log" />

      <m.div
        variants={fadeUp}
        className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1"
      >
        <p className="eyebrow text-moss">The protocol&apos;s plan</p>
        <span className="text-[11.5px] font-medium text-ink-subtle sm:text-[12px]">
          EIP-2535 · Diamond
        </span>
      </m.div>

      {/* Mobile: compact stacked Diamond + facet grid (the SVG schematic is
          too dense at ≤lg viewports, labels render at ~8px). Desktop: the
          full SVG diagram with stagger animations. */}
      <DiamondCompact
        facets={diamondFacets.map((f) => f.label)}
        className="lg:hidden"
      />
      <div className="hidden lg:block">
        <DiamondDiagram />
      </div>

      {/* Composability matrix, one chip at a time, cycling */}
      <m.div variants={fadeUp} className="mt-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="eyebrow text-ink-subtle">Composability matrix</p>
          <p className="text-[10.5px] font-medium tracking-wider text-ink-subtle">
            {composability.length} integrations
          </p>
        </div>
        <ComposabilityTicker />
      </m.div>

      {/* Code snippet, reformatted with short lines so it fits a 320px
          viewport at 11px mono without horizontal scroll. `whitespace-pre-wrap`
          is a safety net for anything narrower; the indents are preserved
          either way. */}
      <m.pre
        variants={fadeUp}
        className="mono mt-4 whitespace-pre-wrap break-words rounded-lg border border-ink/10 bg-paper-deep p-3 text-[11px] leading-relaxed text-ink sm:overflow-x-auto sm:whitespace-pre sm:text-[11.5px]"
      >
        <code>
          <span className="text-ink-subtle">{"// IndexFacet.sol"}</span>
          {"\n"}
          <span className="text-clay-deep">{"contract"}</span>
          {" "}
          <span className="text-moss-deep">{"IndexFacet"}</span>
          {" "}
          <span className="text-clay-deep">{"is"}</span>
          {" "}
          <span className="text-moss-deep">{"BaseFacet"}</span>
          {" {\n  "}
          <span className="text-clay-deep">{"function"}</span>
          {" "}
          <span className="text-moss-deep">{"rebalance"}</span>
          {"(\n    Asset[] calldata assets\n  ) "}
          <span className="text-clay-deep">{"external"}</span>
          {" "}
          <span className="text-ink-subtle">{"onlyOwner"}</span>
          {" {\n    "}
          <span className="text-ink-subtle">
            {"// route through Uniswap V3"}
          </span>
          {"\n  }\n}"}
        </code>
      </m.pre>

      {/* Tests / coverage / gas */}
      <m.div
        variants={fadeUp}
        className="mt-4 grid grid-cols-3 gap-2 border-t border-ink/10 pt-3 text-center sm:gap-3"
      >
        <CodeStat label="Tests" value="142" sub="passing" />
        <CodeStat label="Coverage" value="94%" sub="branches" />
        <CodeStat label="Avg gas" value="23k" sub="per call" />
      </m.div>

      <m.p
        variants={fadeUp}
        className="mono mt-4 break-words text-[11px] leading-snug text-ink-subtle sm:text-[11.5px]"
      >
        <span className="text-clay">{"// "}</span>0xa8e1…e3c1 · currently in review
      </m.p>
    </MockStagger>
  );
}

/* ---------- composability ticker — cycles through one chip at a time ------- */

function ComposabilityTicker() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(
      () => setI((prev) => (prev + 1) % composability.length),
      1600,
    );
    return () => clearInterval(t);
  }, [reduce]);

  const current = composability[i];

  return (
    <div className="relative mt-2.5 h-[44px] overflow-hidden rounded-md border border-ink/10 bg-paper">
      <AnimatePresence mode="wait">
        <m.div
          key={current.name}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease }}
          className="absolute inset-0 flex items-center justify-between px-3"
        >
          <span className="text-[13.5px] font-medium text-ink">
            {current.name}
          </span>
          <span className="mono text-[10.5px] uppercase tracking-wider text-moss-deep">
            {current.v}
          </span>
        </m.div>
      </AnimatePresence>

      {/* Bottom progress dots, show position in the cycle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-1 flex items-center justify-center gap-1.5"
      >
        {composability.map((_, idx) => (
          <span
            key={idx}
            className={cn(
              "size-1 rounded-full transition-colors duration-300",
              idx === i ? "bg-moss" : "bg-ink/15",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- diamond diagram with stagger animation ------------------------- */

const diamondFacets = [
  { x: 50, y: 50, label: "Vault" },
  { x: 270, y: 50, label: "Index" },
  { x: 30, y: 150, label: "Rep" },
  { x: 290, y: 150, label: "Fees" },
  { x: 160, y: 30, label: "Auth" },
  { x: 160, y: 175, label: "Router" },
];

function DiamondDiagram() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <m.div
      initial={initial}
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
      }}
      className="mt-3 flex items-center justify-center"
    >
      {/* viewBox 360x220 with bigger labels + rects, so when the SVG scales
          down to ~240px on a small phone the labels stay legible (~9–10px
          rendered) and the rects don't bunch together. h-[180px] on phones,
          h-[170px] sm, h-[160px] lg, the diagram is intentionally bigger
          on mobile because it's the only schematic on the page. */}
      <svg
        viewBox="0 0 360 220"
        className="h-[180px] w-full sm:h-[170px] lg:h-[160px]"
        aria-hidden
      >
        {/* Central diamond, circle outline draws on */}
        <m.circle
          cx="180"
          cy="110"
          r="44"
          fill="none"
          stroke="rgb(var(--moss))"
          strokeWidth="1.6"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            show: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 1.0, ease },
            },
          }}
        />
        <m.text
          x="180"
          y="114"
          textAnchor="middle"
          fontSize="13"
          fill="rgb(var(--ink))"
          fontFamily="var(--font-display)"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.5, ease } },
          }}
        >
          Diamond
        </m.text>

        {diamondFacets.map((f) => {
          // Re-map the original 320×200 positions onto the new 360×220 grid
          // and nudge the side facets a touch inward so the labels never
          // sit on the SVG edge at narrow viewport scales.
          const x = f.x + 20;
          const y = f.y + 10;
          return (
            <m.g
              key={f.label}
              variants={{
                hidden: { opacity: 0, scale: 0.85 },
                show: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.55, ease },
                },
              }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            >
              <line
                x1="180"
                y1="110"
                x2={x}
                y2={y}
                stroke="rgb(var(--ink) / 0.18)"
                strokeDasharray="2 3"
              />
              <rect
                x={x - 34}
                y={y - 13}
                width="68"
                height="26"
                rx="7"
                fill="rgb(var(--paper-deep))"
                stroke="rgb(var(--ink) / 0.15)"
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontSize="12"
                fill="rgb(var(--ink) / 0.78)"
                fontFamily="var(--font-body)"
              >
                {f.label}
              </text>
            </m.g>
          );
        })}
      </svg>
    </m.div>
  );
}

/* ---------- small components ------------------------------------------------ */

function DonutMini() {
  const reduce = useReducedMotion();
  const C = 2 * Math.PI * 36;
  const slices = [
    { pct: 42, color: "rgb(var(--moss))" },
    { pct: 28, color: "rgb(var(--clay))" },
    { pct: 20, color: "rgb(var(--ochre))" },
    { pct: 10, color: "rgb(var(--sage))" },
  ];
  let acc = 0;
  return (
    <svg viewBox="0 0 100 100" className="size-[90px] animate-breathe" aria-hidden>
      <circle
        cx="50"
        cy="50"
        r="36"
        fill="none"
        stroke="rgb(var(--ink) / 0.10)"
        strokeWidth="9"
      />
      {slices.map((s, i) => {
        const dash = (s.pct / 100) * C;
        const offset = -((acc / 100) * C);
        acc += s.pct;
        return (
          <m.circle
            key={s.color}
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke={s.color}
            strokeWidth="9"
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            initial={
              reduce ? false : { strokeDasharray: `0 ${C.toFixed(2)}` }
            }
            whileInView={{
              strokeDasharray: `${dash.toFixed(2)} ${(C - dash).toFixed(2)}`,
            }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease, delay: 0.3 + i * 0.1 }}
          />
        );
      })}
    </svg>
  );
}

function Kpi({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "primary";
}) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p
        className={`mt-1.5 font-mono text-[14px] tabular-nums ${
          tone === "primary" ? "text-moss-deep" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function CodeStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-ink-subtle sm:text-[10.5px]">
        {label}
      </p>
      <p className="mt-1 font-mono text-[14px] font-medium tabular-nums text-moss-deep sm:text-[16px]">
        {value}
      </p>
      <p className="text-[10px] text-ink-subtle sm:text-[10.5px]">{sub}</p>
    </div>
  );
}
