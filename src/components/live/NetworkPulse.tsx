"use client";

import { useRef } from "react";
import { useLive } from "@/lib/live/useLive";
import { readNetwork } from "@/lib/live/network";
import { ARBISCAN } from "@/lib/live/rpc";
import { LiveStatus } from "./LiveStatus";
import { cn } from "@/lib/utils";
import { Hint } from "@/components/ui/Hint";

const gwei = (n: number) => (n < 0.1 ? n.toFixed(3) : n.toFixed(2));

/**
 * The network Gardens run on, read live from the public Arbitrum One RPC:
 * latest block and base fee. Real chain state, not a protocol metric; it's
 * here so the "on-chain" claim is something you can watch tick.
 */
export function NetworkPulse({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useLive(readNetwork, { interval: 6000, staleAfter: 30000, ref });
  const d = live.data;
  const cells = [
    {
      k: "Latest block",
      v: d ? `#${d.blockNumber.toLocaleString("en-US")}` : null,
      href: d ? `${ARBISCAN}/block/${d.blockNumber}` : undefined,
      hint: "Arbitrum One produces a block roughly every quarter second; we sample it every few seconds.",
    },
    {
      k: "Base fee",
      v: d ? `${gwei(d.baseFeeGwei)} gwei` : null,
      hint: "What a transaction pays per unit of gas right now. It's why rebalancing on Arbitrum costs cents, not dollars.",
    },
  ];
  return (
    <div ref={ref} className={cn("rounded-2xl border border-line/[0.08] bg-card", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/[0.07] px-5 py-3">
        <p className="text-small font-medium text-fg">Arbitrum One</p>
        <LiveStatus state={live.state} updatedAt={live.updatedAt} source="Arbitrum RPC" onRetry={live.retry} />
      </div>
      <dl className="grid grid-cols-2">
        {cells.map((c, i) => (
          <div key={c.k} className={cn("px-5 py-4", i > 0 && "border-l border-line/[0.07]")}>
            <dt className="text-caption text-fg-subtle">
              <Hint text={c.hint}>{c.k}</Hint>
            </dt>
            <dd className="mt-1 font-mono text-[15px] text-fg tabular">
              {c.v === null ? (
                <span aria-label="Loading" className="inline-block h-4 w-24 animate-pulse rounded bg-raised align-middle" />
              ) : c.href ? (
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-leaf">
                  {c.v}
                  <span className="sr-only"> (view on Arbiscan, opens in a new tab)</span>
                </a>
              ) : (
                c.v
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
