"use client";

import { useRef } from "react";
import { useLive } from "@/lib/live/useLive";
import { rpcBatch, ARBISCAN } from "@/lib/live/rpc";
import { LiveStatus } from "./LiveStatus";
import { CopyButton } from "@/components/ui/CopyButton";
import { ExternalIcon } from "@/components/ui/icons";
import { BLOKC_TOKEN, TOKEN_DOCS } from "@/lib/data/token";


async function readToken() {
  const [supply] = await rpcBatch<[string]>([{ method: "eth_call", params: [{ to: BLOKC_TOKEN, data: "0x18160ddd" }, "latest"] }]);
  return { supply: Number(BigInt(supply) / 10n ** 18n) };
}

/** The live contract: address to copy, total supply read from chain. */
export function TokenContract() {
  const ref = useRef<HTMLDivElement>(null);
  const live = useLive(readToken, { interval: 60000, staleAfter: 180000, ref });
  return (
    <div ref={ref} className="rounded-2xl border border-line/[0.08] bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/[0.07] px-5 py-3.5">
        <p className="text-small font-medium text-fg">Contract on Arbitrum One</p>
        <LiveStatus state={live.state} updatedAt={live.updatedAt} source="Arbitrum RPC" onRetry={live.retry} />
      </div>
      <div className="grid gap-5 px-5 py-5 sm:grid-cols-2">
        <div>
          <p className="text-caption text-fg-subtle">Address (ERC-20)</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <a
              href={`${ARBISCAN}/token/${BLOKC_TOKEN}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 break-all font-mono text-[13px] text-fg transition-colors hover:text-leaf"
            >
              {BLOKC_TOKEN}
              <ExternalIcon size={11} />
              <span className="sr-only"> (view on Arbiscan, opens in a new tab)</span>
            </a>
            <CopyButton value={BLOKC_TOKEN} label="Copy address" />
          </div>
        </div>
        <div>
          <p className="text-caption text-fg-subtle">Total supply, read from chain</p>
          <p className="mt-1.5 font-mono text-[15px] text-fg tabular">
            {live.data ? `${live.data.supply.toLocaleString("en-US")} BLOKC` : live.state === "error" ? "—" : (
              <span aria-label="Loading" className="inline-block h-4 w-40 animate-pulse rounded bg-raised align-middle" />
            )}
          </p>
        </div>
      </div>
      <p className="border-t border-line/[0.07] px-5 py-3 text-caption text-fg-subtle">
        Address as published in the{" "}
        <a href={TOKEN_DOCS} target="_blank" rel="noopener noreferrer" className="text-leaf underline underline-offset-2">
          token docs
        </a>
        . Always check it there before you send anything.
      </p>
    </div>
  );
}
