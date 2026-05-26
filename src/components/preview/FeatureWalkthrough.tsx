"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  m,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

/**
 * FeatureWalkthrough — six "rooms in the same Garden".
 *
 * Each tab renders a stylized HTML/SVG mock of the dashboard view. To swap in
 * a real screenshot for any tab, drop the file at /public/preview/<id>.png
 * and add the path to PREVIEW_IMAGES below — the image will replace the
 * mockup automatically.
 */

const ROMANS = ["I", "II", "III", "IV", "V", "VI"];
const ease = [0.22, 1, 0.36, 1] as const;

/** Map of tab id → screenshot path. Add entries when assets land. */
const PREVIEW_IMAGES: Record<string, string | undefined> = {
  // overview: "/preview/overview.png",
  // indices: "/preview/indices.png",
  // managers: "/preview/managers.png",
  // positions: "/preview/positions.png",
  // governance: "/preview/governance.png",
  // reputation: "/preview/reputation.png",
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

type Tab = {
  id: string;
  label: string;
  caption: string;
};

const tabs: Tab[] = [
  {
    id: "overview",
    label: "Overview",
    caption: "Garden header, balance, ambient stats.",
  },
  {
    id: "indices",
    label: "Indices",
    caption: "Curated portfolios, allocation drift, rebalance log.",
  },
  {
    id: "managers",
    label: "Managers",
    caption: "Marketplace + soulbound rep + sparklines.",
  },
  {
    id: "positions",
    label: "Positions",
    caption: "Per-asset detail with on-chain receipts.",
  },
  {
    id: "governance",
    label: "Governance",
    caption: "Live proposals, vote, delegate.",
  },
  {
    id: "reputation",
    label: "Reputation",
    caption: "Your soulbound badges and earned skills.",
  },
];

export function FeatureWalkthrough() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";
  const [active, setActive] = useState(tabs[0].id);

  return (
    <Section
      eyebrow="Feature walkthrough"
      title={
        <>
          Six rooms in{" "}
          <em className="font-serif italic text-clay">the same Garden.</em>
        </>
      }
      description="Pick a room. Each panel is the same dashboard, seen from a different chair."
    >
      <m.div
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
        }}
        className="grid gap-6 lg:grid-cols-12"
      >
        {/* Tabs (left) */}
        <m.ul variants={fadeUp} className="lg:col-span-4">
          {tabs.map((t, i) => {
            const isActive = t.id === active;
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setActive(t.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "group/t block w-full border-l-2 py-3.5 pl-4 pr-2 text-left transition-colors duration-200",
                    isActive
                      ? "border-moss bg-moss/[0.05]"
                      : "border-ink/10 hover:border-moss/40 hover:bg-paper-deep/40",
                  )}
                >
                  <div className="flex items-baseline gap-2.5">
                    <span
                      className={cn(
                        "script text-[16px] leading-none transition-colors",
                        isActive ? "text-moss-deep" : "text-clay",
                      )}
                    >
                      {ROMANS[i] ?? `${i + 1}`}
                    </span>
                    <p
                      className={cn(
                        "text-[14.5px] font-medium transition-colors",
                        isActive ? "text-ink" : "text-ink-muted",
                      )}
                    >
                      {t.label}
                    </p>
                  </div>
                  <p className="mt-1 pl-[26px] text-[12px] leading-relaxed text-ink-muted">
                    {t.caption}
                  </p>
                </button>
              </li>
            );
          })}
        </m.ul>

        {/* Visual (right), cross-fade */}
        <m.div
          variants={fadeUp}
          className="paper-card relative min-h-[440px] overflow-hidden p-0 lg:col-span-8"
        >
          <AnimatePresence mode="wait" initial={false}>
            {tabs.map((t) =>
              t.id === active ? (
                <m.div
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease }}
                  className="absolute inset-0"
                >
                  <Visual id={t.id} label={tabs.find((x) => x.id === t.id)!.label} />
                </m.div>
              ) : null,
            )}
          </AnimatePresence>
        </m.div>
      </m.div>
    </Section>
  );
}

/* ---------- visual dispatcher --------------------------------------------- */

function Visual({ id, label }: { id: string; label: string }) {
  const image = PREVIEW_IMAGES[id];

  if (image) {
    return (
      <div className="relative size-full">
        <Image
          src={image}
          alt={`${label} dashboard view`}
          fill
          sizes="(max-width: 1024px) 100vw, 800px"
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="eyebrow text-moss">{label}</p>
        <span className="script text-[18px] leading-none text-clay">
          Mock · No real chain
        </span>
      </div>
      <div className="mt-4 flex-1">
        <Mock id={id} />
      </div>
    </div>
  );
}

function Mock({ id }: { id: string }) {
  switch (id) {
    case "overview":
      return <OverviewMock />;
    case "indices":
      return <IndicesMock />;
    case "managers":
      return <ManagersMock />;
    case "positions":
      return <PositionsMock />;
    case "governance":
      return <GovernanceMock />;
    case "reputation":
      return <ReputationMock />;
    default:
      return null;
  }
}

/* ---------- mocks --------------------------------------------------------- */

function OverviewMock() {
  return (
    <div className="grid h-full gap-4 sm:grid-cols-12">
      {/* Balance card */}
      <div className="rounded-xl border border-ink/10 bg-paper-deep/40 p-5 sm:col-span-7">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">
            Garden · Balanced
          </p>
          <span className="mono text-[10.5px] text-clay-deep">№ G-241</span>
        </div>
        <p className="display mt-3 text-[32px] leading-none text-ink sm:text-[40px]">
          $12,481.04
        </p>
        <p className="mono mt-2 text-[12px] text-moss-deep">
          +0.83% · 24h
        </p>

        <svg viewBox="0 0 240 60" className="mt-5 w-full">
          <path
            d="M0 42 L18 38 L36 40 L54 30 L72 32 L90 24 L108 26 L126 20 L144 22 L162 14 L180 18 L198 10 L216 14 L240 6"
            fill="none"
            stroke="rgb(var(--moss-deep))"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M0 42 L18 38 L36 40 L54 30 L72 32 L90 24 L108 26 L126 20 L144 22 L162 14 L180 18 L198 10 L216 14 L240 6 L240 60 L0 60 Z"
            fill="rgb(var(--moss) / 0.16)"
          />
        </svg>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 gap-3 sm:col-span-5">
        <StatTile label="TVL" value="$12.48k" hint="Garden total" />
        <StatTile label="P&L · 30d" value="+$612.40" tone="moss" />
        <StatTile label="Streak" value="14 days" hint="Compounding" />
      </div>
    </div>
  );
}

function IndicesMock() {
  const rows = [
    {
      name: "Balanced",
      bars: [
        { c: "rgb(86 124 92)", w: 40 },
        { c: "rgb(196 154 71)", w: 30 },
        { c: "rgb(180 116 83)", w: 20 },
        { c: "rgb(143 160 136)", w: 10 },
      ],
      drift: "0.4%",
    },
    {
      name: "Conservative",
      bars: [
        { c: "rgb(86 124 92)", w: 55 },
        { c: "rgb(143 160 136)", w: 30 },
        { c: "rgb(196 154 71)", w: 15 },
      ],
      drift: "0.2%",
    },
    {
      name: "Aggressive",
      bars: [
        { c: "rgb(180 116 83)", w: 50 },
        { c: "rgb(196 154 71)", w: 30 },
        { c: "rgb(86 124 92)", w: 20 },
      ],
      drift: "1.1%",
    },
  ];
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div
          key={r.name}
          className="rounded-xl border border-ink/10 bg-paper-deep/40 p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-[13.5px] font-medium text-ink">{r.name}</p>
            <span className="mono text-[11px] text-ink-muted">
              drift {r.drift}
            </span>
          </div>
          <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
            {r.bars.map((b, i) => (
              <span
                key={i}
                style={{ width: `${b.w}%`, background: b.c }}
                className="opacity-90"
              />
            ))}
          </div>
        </div>
      ))}
      <div aria-hidden className="rule-hand" />
      <p className="text-[11.5px] text-ink-subtle">
        Next rebalance · in 4d 02h · DAO-set cadence
      </p>
    </div>
  );
}

function ManagersMock() {
  const rows = [
    { name: "Mango Grove", handle: "mango.eth", score: 94, roi: "+2.14%" },
    { name: "Cedar Cove", handle: "cedar.eth", score: 87, roi: "+1.42%" },
    { name: "Willow Field", handle: "willow.eth", score: 79, roi: "+0.91%" },
  ];
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li
          key={r.handle}
          className="flex items-center gap-3 rounded-xl border border-ink/10 bg-paper-deep/40 p-3.5"
        >
          <span
            className="inline-flex size-10 items-center justify-center rounded-full text-[11px] font-semibold text-paper"
            style={{
              background:
                "linear-gradient(135deg, rgb(86 124 92), rgb(42 64 48))",
            }}
          >
            {r.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-medium text-ink">{r.name}</p>
            <p className="mono text-[11px] text-ink-muted">{r.handle}</p>
          </div>
          <svg viewBox="0 0 60 24" className="h-6 w-16 shrink-0">
            <path
              d="M0 18 L10 16 L20 12 L30 14 L40 8 L50 6 L60 4"
              fill="none"
              stroke="rgb(var(--moss-deep))"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <div className="text-right">
            <p className="mono text-[12px] text-moss-deep">{r.roi}</p>
            <span className="inline-flex items-baseline gap-1 rounded-full border border-clay/35 bg-clay/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-clay-deep">
              <span>★</span>
              <span>{r.score}</span>
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function PositionsMock() {
  const rows = [
    { sym: "ETH", qty: "1.2400", val: "$4,212", d: "+1.40%", tone: "moss" },
    { sym: "ARB", qty: "1,840", val: "$3,128", d: "-0.62%", tone: "clay" },
    { sym: "GMX", qty: "84.20", val: "$2,206", d: "+2.81%", tone: "moss" },
    { sym: "USDC", qty: "1,420", val: "$1,420", d: ", ", tone: "ink" },
    { sym: "BLOKC", qty: "12,400", val: "$1,515", d: "+5.92%", tone: "moss" },
  ];
  return (
    <div>
      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 border-b border-ink/10 pb-2 text-[10.5px] font-medium uppercase tracking-wider text-ink-subtle">
        <span>Asset</span>
        <span>Qty</span>
        <span>Value</span>
        <span>24h</span>
      </div>
      <ul className="mt-2 space-y-1.5">
        {rows.map((r) => (
          <li
            key={r.sym}
            className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-paper-deep/40"
          >
            <span className="text-[13px] font-medium text-ink">{r.sym}</span>
            <span className="mono text-[12px] tabular-nums text-ink-muted">
              {r.qty}
            </span>
            <span className="mono text-[12px] tabular-nums text-ink">
              {r.val}
            </span>
            <span
              className={cn(
                "mono w-16 text-right text-[12px] tabular-nums",
                r.tone === "moss" && "text-moss-deep",
                r.tone === "clay" && "text-clay-deep",
                r.tone === "ink" && "text-ink-subtle",
              )}
            >
              {r.d}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GovernanceMock() {
  const rows = [
    {
      title: "BLOKC-042 · Approve Aggressive Index",
      for: 78,
      status: "Active",
      ends: "2d 14h",
    },
    {
      title: "BLOKC-041 · Raise fee ceiling to 4%",
      for: 41,
      status: "Active",
      ends: "4d 02h",
    },
  ];
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div
          key={r.title}
          className="rounded-xl border border-ink/10 bg-paper-deep/40 p-4"
        >
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[13.5px] font-medium text-ink">{r.title}</p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-clay/35 bg-clay/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-clay-deep">
              <span className="relative inline-flex size-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-clay/45" />
                <span className="relative inline-block size-1.5 rounded-full bg-clay" />
              </span>
              {r.status}
            </span>
          </div>
          <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
            <span
              style={{ width: `${r.for}%` }}
              className="bg-[rgb(86_124_92)]"
            />
            <span
              style={{ width: `${100 - r.for}%` }}
              className="bg-[rgb(180_116_83)] opacity-80"
            />
          </div>
          <div className="mt-2 flex items-baseline justify-between text-[11px] text-ink-muted">
            <span>
              For <span className="text-moss-deep">{r.for}%</span> · Against{" "}
              {100 - r.for}%
            </span>
            <span className="mono text-ink-subtle">ends in {r.ends}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReputationMock() {
  const badges = [
    { label: "Trader", score: 94, tone: "moss" },
    { label: "Voter", score: 88, tone: "clay" },
    { label: "Builder", score: 72, tone: "ochre" },
    { label: "LP", score: 81, tone: "moss" },
    { label: "Bounty", score: 64, tone: "clay" },
    { label: "Mentor", score: 58, tone: "ochre" },
  ];
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {badges.map((b) => (
        <li
          key={b.label}
          className="flex flex-col items-center gap-2 rounded-xl border border-ink/10 bg-paper-deep/40 p-4"
        >
          <svg width="44" height="48" viewBox="0 0 16 18" aria-hidden>
            <polygon
              points="8,1.5 13,4.5 14.5,10 11,16.5 5,16.5 1.5,10 3,4.5"
              fill={
                b.tone === "moss"
                  ? "rgb(86 124 92)"
                  : b.tone === "clay"
                    ? "rgb(180 116 83)"
                    : "rgb(196 154 71)"
              }
              opacity="0.85"
              stroke="rgb(var(--paper))"
              strokeWidth="0.5"
            />
            <polygon
              points="8,4.5 11,6.5 11.8,10 9.5,13.2 6.5,13.2 4.2,10 5,6.5"
              fill="rgb(var(--paper) / 0.35)"
            />
          </svg>
          <p className="text-[12.5px] font-medium text-ink">{b.label}</p>
          <p className="mono text-[11px] text-ink-muted">{b.score} / 100</p>
        </li>
      ))}
    </ul>
  );
}

/* ---------- helpers ------------------------------------------------------- */

function StatTile({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "moss";
}) {
  return (
    <div className="rounded-lg border border-ink/10 bg-paper/60 p-3">
      <p className="text-[10.5px] font-medium uppercase tracking-wider text-ink-subtle">
        {label}
      </p>
      <p
        className={cn(
          "mono mt-1 text-[14px] tabular-nums",
          tone === "moss" ? "text-moss-deep" : "text-ink",
        )}
      >
        {value}
      </p>
      {hint && (
        <p className="mt-0.5 text-[10.5px] text-ink-subtle">{hint}</p>
      )}
    </div>
  );
}
