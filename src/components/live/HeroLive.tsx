"use client";

import { useRef } from "react";
import { useLive } from "@/lib/live/useLive";
import { readNetwork } from "@/lib/live/network";
import { readFeeds } from "@/lib/live/feeds";
import { LiveStatus } from "./LiveStatus";

async function read() {
  const [net, feeds] = await Promise.all([readNetwork(), readFeeds(["ETH"])]);
  return { block: net.blockNumber, eth: feeds.ETH?.price ?? null };
}

/** One quiet line under the hero: the chain is right there, ticking. */
export function HeroLive() {
  const ref = useRef<HTMLDivElement>(null);
  const live = useLive(read, { interval: 8000, staleAfter: 40000, ref });
  const d = live.data;
  return (
    <div ref={ref} className="inline-flex flex-wrap items-center gap-x-4 gap-y-1 rounded-full border border-line/10 bg-card/60 px-4 py-2 backdrop-blur">
      <LiveStatus state={live.state} updatedAt={live.updatedAt} source="Arbitrum" onRetry={live.retry} className="[&>span:nth-child(2)]:hidden" />
      <span className="font-mono text-[12px] text-fg-muted tabular">
        Arbitrum <span className="text-fg">{d ? `#${d.block.toLocaleString("en-US")}` : "…"}</span>
      </span>
      <span className="font-mono text-[12px] text-fg-muted tabular">
        ETH <span className="text-fg">{d?.eth ? `$${d.eth.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "…"}</span>
        <span className="text-fg-subtle"> via Chainlink</span>
      </span>
    </div>
  );
}
