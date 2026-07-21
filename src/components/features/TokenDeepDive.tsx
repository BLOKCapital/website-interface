"use client";

import { useState } from "react";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { TokenMesh } from "@/components/home/TokenMesh";
import { cn } from "@/lib/utils";

const utilities = [
  {
    id: "gov",
    label: "Governance",
    body:
      "Vote on every protocol upgrade, index approval and fee parameter, on-chain via Aragon OSX.",
  },
  {
    id: "loyalty",
    label: "Loyalty Rewards",
    body:
      "BLOKC is distributed to gardeners who actively use the protocol. Stay and grow, earn along the way.",
  },
  {
    id: "stake",
    label: "Staking",
    body:
      "Stake BLOKC to earn a share of protocol fees once the fee switch is turned on by DAO vote.",
  },
  {
    id: "boost",
    label: "Manager Boost",
    body:
      "Delegate BLOKC to boost a Gardener's visibility, align with the managers you trust most.",
  },
];

const tokenomics = [
  { label: "IDO", pct: 20, color: "rgb(86 124 92)" },
  { label: "Team", pct: 12.5, color: "rgb(180 116 83)" },
  { label: "Product Development", pct: 15, color: "rgb(196 154 71)" },
  { label: "Treasury", pct: 12.5, color: "rgb(143 160 136)" },
  { label: "Marketing & PR", pct: 10, color: "rgb(159 113 65)" },
  { label: "Liquidity", pct: 10, color: "rgb(105 122 100)" },
  { label: "Seed", pct: 5, color: "rgb(70 95 75)" },
  { label: "Influencers", pct: 3, color: "rgb(176 156 110)" },
  { label: "Bug Bounty", pct: 3, color: "rgb(138 74 46)" },
  { label: "Presale", pct: 3, color: "rgb(120 99 80)" },
  { label: "Advisors", pct: 3, color: "rgb(126 100 86)" },
  { label: "Community", pct: 2, color: "rgb(94 125 100)" },
  { label: "Air Drop", pct: 1, color: "rgb(160 145 130)" },
];

const WHITEPAPER = "https://docsend.com/view/4j6qvvrudyr6izyb";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export function TokenDeepDive() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";
  const [active, setActive] = useState(utilities[0].id);

  return (
    <Section
      id="token"
      eyebrow="$BLOKC"
      title={
        <>
          The token,{" "}
          <em className="font-serif italic text-moss">end to end.</em>
        </>
      }
      description="Why it exists, where it goes, and how to get it."
    >
      <m.div
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
        }}
        className="grid gap-5 lg:grid-cols-12"
      >
        {/* Utility */}
        <m.div variants={fadeUp} className="paper-card p-6 lg:col-span-7">
          <div className="flex items-baseline justify-between gap-3">
            <p className="eyebrow text-moss">Utility</p>
            <span className="script text-[18px] leading-none text-clay">
              Four uses
            </span>
          </div>
          <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {utilities.map((u) => {
              const isActive = u.id === active;
              const dimmed = active && !isActive;
              return (
                <li key={u.id}>
                  <button
                    type="button"
                    onClick={() => setActive(u.id)}
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-left transition-colors duration-200",
                      isActive
                        ? "border-moss/40 bg-moss/[0.08]"
                        : "border-ink/10 bg-paper/60 hover:border-moss/30",
                      dimmed && "opacity-55",
                    )}
                  >
                    <p
                      className={cn(
                        "text-[14px] font-medium",
                        isActive ? "text-moss-deep" : "text-ink",
                      )}
                    >
                      {u.label}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">
                      {u.body}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </m.div>

        {/* Tokenomics */}
        <m.div variants={fadeUp} className="paper-card p-6 lg:col-span-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="eyebrow text-moss">Tokenomics</p>
            <span className="text-[10.5px] font-medium uppercase tracking-wider text-clay-deep">
              10B supply
            </span>
          </div>
          <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <TokenomicsDonut slices={tokenomics} />
            <ul className="grid w-full grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
              {tokenomics.map((t) => (
                <li
                  key={t.label}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-2 text-[12px] text-ink-muted">
                    <span
                      className="size-1.5 shrink-0 rounded-full"
                      style={{ background: t.color }}
                    />
                    <span className="truncate">{t.label}</span>
                  </span>
                  <span className="mono shrink-0 text-[12px] text-ink">
                    {t.pct}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </m.div>

        {/* Token overview */}
        <m.div
          variants={fadeUp}
          className="paper-card flex flex-col items-center gap-5 p-6 lg:col-span-7"
        >
          <div className="flex h-[200px] w-full items-center justify-center">
            <TokenMesh />
          </div>
          <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
            <Kpi label="Symbol" value="BLOKC" />
            <Kpi label="Supply" value="10B" />
            <Kpi label="Chain" value="Arbitrum" />
            <Kpi label="Decimals" value="18" />
          </div>
          <p className="w-full text-center text-[11px] leading-relaxed text-ink-subtle">
            Contract address publishes at token-generation event.
          </p>
        </m.div>

        {/* Read Whitepaper */}
        <m.div
          variants={fadeUp}
          className="paper-card flex flex-col gap-4 p-6 lg:col-span-5"
        >
          <div className="flex items-baseline justify-between gap-3">
            <p className="eyebrow text-moss">Whitepaper</p>
            <span className="text-[10.5px] font-medium uppercase tracking-wider text-clay-deep">
              PDF · DocSend
            </span>
          </div>
          <p className="text-[13.5px] leading-relaxed text-ink-muted">
            The long-form thinking behind the protocol, token economics,
            governance, the index methodology, and the cap table. Read it before
            you stake anything more important than time.
          </p>
          <div aria-hidden className="rule-hand my-1" />
          <div className="mt-auto">
            <Button href={WHITEPAPER} variant="primary" size="md">
              Read Whitepaper
              <Arrow />
            </Button>
          </div>
        </m.div>
      </m.div>
    </Section>
  );
}

function TokenomicsDonut({
  slices,
}: {
  slices: { label: string; pct: number; color: string }[];
}) {
  // Slices sweep open around the ring on scroll-into-view (matching the
  // DonutMini draw in HowItWorks), instead of the old opacity-only fade.
  const reduce = useReducedMotion();
  const C = 2 * Math.PI * 40;
  let acc = 0;
  return (
    <svg viewBox="0 0 110 110" className="size-[130px]" aria-hidden>
      <circle
        cx="55"
        cy="55"
        r="40"
        fill="none"
        stroke="rgb(var(--ink) / 0.08)"
        strokeWidth="11"
      />
      {slices.map((s, i) => {
        const dash = (s.pct / 100) * C;
        const offset = -((acc / 100) * C);
        acc += s.pct;
        return (
          <m.circle
            key={i}
            cx="55"
            cy="55"
            r="40"
            fill="none"
            stroke={s.color}
            strokeWidth="11"
            strokeDashoffset={offset}
            transform="rotate(-90 55 55)"
            initial={reduce ? false : { strokeDasharray: `0 ${C.toFixed(2)}` }}
            whileInView={{
              strokeDasharray: `${dash.toFixed(2)} ${(C - dash).toFixed(2)}`,
            }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease, delay: 0.25 + i * 0.1 }}
          />
        );
      })}
      <text
        x="55"
        y="60"
        textAnchor="middle"
        className="display"
        fontSize="13"
        fill="rgb(var(--ink))"
      >
        10B
      </text>
    </svg>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-paper/60 p-2.5 text-center">
      <p className="text-[10px] font-medium uppercase tracking-wider text-ink-subtle">
        {label}
      </p>
      <p className="mono mt-1 text-[12.5px] text-ink">{value}</p>
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
