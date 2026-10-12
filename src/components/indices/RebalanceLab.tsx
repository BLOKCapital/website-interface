"use client";

import { useEffect, useId, useRef, useState } from "react";
import { track } from "@/lib/explainers";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { TokenLogo } from "./TokenLogo";

/**
 * Why a market-cap index rarely needs to trade. Uses the docs' own worked
 * example (1,000 USDC split 80/20 between BTC and ETH) and the contracts'
 * 2% drift rule. Illustrative only, and labelled that way.
 *
 * The point it makes is real maths: when a price moves, holdings and target
 * weights move together, so drift stays ~0. Trades happen when something
 * else changes, like a component's circulating supply.
 *
 * Direct manipulation: the bars follow the sliders 1:1 (transform, no
 * easing), and only the verdict changes colour. Screen readers hear the
 * slider's own value ("+12%") and, once the slider rests for 400 ms, the
 * verdict, not a running commentary.
 */
const BASE = { btc: 800, eth: 200 };
const THRESHOLD = 0.02;

const usd = (n: number) => `$${n.toFixed(n < 10 ? 2 : 0)}`;

export function RebalanceLab() {
  const [price, setPrice] = useState(0);
  const [supply, setSupply] = useState(0);
  const pid = useId();
  const sid = useId();

  // Once per page view: the first time the visitor moves a slider.
  const used = useRef(false);
  const onUse = () => {
    if (used.current) return;
    used.current = true;
    const m = window.location.pathname.match(/^\/indices\/([^/.]+)/);
    track("rebalance_lab_use", { index_id: m ? m[1] : "none" });
  };

  // Holdings: the Garden still holds the same coins; ETH's value moves with price.
  const hold = { btc: BASE.btc, eth: BASE.eth * (1 + price / 100) };
  const total = hold.btc + hold.eth;
  // Targets: market caps. ETH's market cap moves with price AND supply.
  const cap = { btc: 0.8, eth: 0.2 * (1 + price / 100) * (1 + supply / 100) };
  const capTotal = cap.btc + cap.eth;
  const target = { btc: (cap.btc / capTotal) * total, eth: (cap.eth / capTotal) * total };
  const rows = (["btc", "eth"] as const).map((k) => {
    const drift = target[k] ? (hold[k] - target[k]) / target[k] : 0;
    return { k, label: k.toUpperCase(), hold: hold[k], target: target[k], drift, trade: Math.abs(drift) > THRESHOLD };
  });
  const trades = rows.some((r) => r.trade);
  const move = Math.abs(hold.eth - target.eth);
  const verdict = trades
    ? `Outside the 2% band: the next pooled rebalance would move about ${usd(move)} between BTC and ETH to restore the target.`
    : price !== 0
      ? "No trade. The price moved, but the target moved with it: a market-cap index mostly rebalances itself."
      : "Inside the 2% band: nothing to trade. Try moving the sliders.";

  // The announced verdict waits until the slider has rested for 400 ms.
  const [said, setSaid] = useState(verdict);
  useEffect(() => {
    const t = setTimeout(() => setSaid(verdict), 400);
    return () => clearTimeout(t);
  }, [verdict]);

  return (
    <div className="rounded-3xl border border-line/[0.08] bg-card p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-small font-medium text-fg">A 1,000 USDC Garden following an 80/20 BTC–ETH index</p>
        <Badge tone="example">Example · numbers from the docs</Badge>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {[
          { id: pid, label: "ETH price moves", value: price, set: setPrice, min: -50, max: 50 },
          { id: sid, label: "ETH circulating supply changes", value: supply, set: setSupply, min: -10, max: 10 },
        ].map((c) => (
          <div key={c.label}>
            <div className="flex items-baseline justify-between">
              <label htmlFor={c.id} className="text-small text-fg-muted">
                {c.label}
              </label>
              {/* The slider announces its own value (aria-valuetext); this is for the eye. */}
              <output htmlFor={c.id} aria-hidden className="font-mono text-small text-fg tabular">
                {c.value > 0 ? "+" : ""}
                {c.value}%
              </output>
            </div>
            <input
              id={c.id}
              type="range"
              min={c.min}
              max={c.max}
              step={1}
              value={c.value}
              aria-valuetext={`${c.value > 0 ? "+" : ""}${c.value}%`}
              onChange={(e) => {
                onUse();
                c.set(Number(e.target.value));
              }}
              className="lab-range mt-1"
            />
          </div>
        ))}
      </div>

      <div className="mt-7 space-y-5">
        {rows.map((r) => {
          const max = Math.max(total, 1);
          return (
            <div key={r.k}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-caption">
                <span className="flex items-center gap-2 font-mono text-fg">
                  <TokenLogo symbol={r.label as "BTC" | "ETH"} size={18} />
                  {r.label}
                </span>
                <span className="font-mono text-fg-subtle tabular">
                  holds {usd(r.hold)} · target {usd(r.target)} ·{" "}
                  <span className={r.trade ? "text-caution" : "text-leaf"}>
                    drift {(r.drift * 100).toFixed(1)}%
                  </span>
                </span>
              </div>
              <div className="relative mt-2 h-2.5 rounded-full bg-line/[0.07]">
                {/* 2% tolerance band around the target */}
                <span
                  aria-hidden
                  className="absolute inset-y-[-3px] rounded bg-leaf/15"
                  style={{ left: `${((r.target * (1 - THRESHOLD)) / max) * 100}%`, width: `${((r.target * THRESHOLD * 2) / max) * 100}%` }}
                />
                {/* The holding: a full-length bar slid in from the left inside its own
                    clip, so it moves 1:1 with the slider by transform and keeps
                    its rounded end. Only its colour eases, when the verdict flips. */}
                <span aria-hidden className="absolute inset-0 overflow-hidden rounded-full">
                  <span
                    className={cn("block h-full w-full rounded-full transition-colors duration-fast", r.trade ? "bg-caution" : "bg-leaf")}
                    style={{ transform: `translateX(${(r.hold / max) * 100 - 100}%)` }}
                  />
                </span>
                <span aria-hidden className="absolute inset-y-[-5px] w-px bg-fg" style={{ left: `${(r.target / max) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <p
        aria-hidden
        className={cn(
          "mt-7 rounded-2xl border px-4 py-3.5 text-small transition-colors duration-fast",
          trades ? "border-caution/30 bg-caution/[0.07] text-fg" : "border-leaf/25 bg-leaf/[0.06] text-fg",
        )}
      >
        {verdict}
      </p>
      <p className="sr-only" aria-live="polite">
        {said}
      </p>
      <p className="mt-3 text-caption text-fg-subtle">
        The marker is the target; the shaded band is the 2% tolerance from the Rebalancer contract. Real rebalances also
        cap slippage at 0.5% and run at most once a day.
      </p>
    </div>
  );
}
