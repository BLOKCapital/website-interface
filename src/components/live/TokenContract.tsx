"use client";

import { Fragment, useId, useRef } from "react";
import { useLive } from "@/lib/live/useLive";
import { rpcBatch, ARBISCAN } from "@/lib/live/rpc";
import { LiveStatus } from "./LiveStatus";
import { CopyButton } from "@/components/ui/CopyButton";
import { Icon } from "@/components/ui/Icon";
import { BLOKC_TOKEN, TOKEN_DOCS } from "@/lib/data/token";

async function readToken() {
  const [r] = await rpcBatch([{ method: "eth_call", params: [{ to: BLOKC_TOKEN, data: "0x18160ddd" }, "latest"] }]);
  if (!r.ok) throw new Error(r.error);
  return { supply: Number(BigInt(r.value as string) / 10n ** 18n) };
}

/**
 * The checksummed address in groups a person can compare by eye (SEC-16):
 * the first 6 and last 4 characters stand out (the ones lookalike
 * addresses try to match), the middle reads in fours. Groups are spaced
 * with a trailing margin and break with <wbr>, never with characters, so a
 * selection (CopyButton's fallback) still copies the exact address, and a
 * wrapped line starts flush.
 */
function GroupedAddress({ address, id }: { address: string; id: string }) {
  const hover = "transition-colors duration-fast can-hover:group-hover/addr:text-leaf";
  const head = address.slice(0, 6);
  const tail = address.slice(-4);
  const middle = address.slice(6, -4).match(/.{1,4}/g) ?? [];
  return (
    <span id={id} className="font-mono text-caption tracking-[0.02em]">
      <span className={`mr-[0.4em] font-semibold text-fg ${hover}`}>{head}</span>
      {middle.map((g, i) => (
        <Fragment key={i}>
          <wbr />
          <span className={`mr-[0.4em] text-fg-muted ${hover}`}>{g}</span>
        </Fragment>
      ))}
      <wbr />
      <span className={`font-semibold text-fg ${hover}`}>{tail}</span>
    </span>
  );
}

/** The live contract: address to check and copy, total supply read from chain. */
export function TokenContract() {
  const ref = useRef<HTMLDivElement>(null);
  const addressId = useId();
  const live = useLive(readToken, { interval: 60000, staleAfter: 180000, ref });
  return (
    <div ref={ref} className="rounded-card border border-subtle bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-subtle px-5 py-3.5">
        <p className="text-small font-medium text-fg">Contract on Arbitrum One</p>
        <LiveStatus state={live.state} updatedAt={live.updatedAt} source="the Arbitrum network" onRetry={live.retry} />
      </div>
      <div className="grid gap-5 px-5 py-5 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="text-caption text-fg-subtle">Address (ERC-20)</p>
          <a
            href={`${ARBISCAN}/token/${BLOKC_TOKEN}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/addr mt-1.5 inline-block rounded-xs leading-relaxed"
          >
            <GroupedAddress address={BLOKC_TOKEN} id={addressId} />
            <Icon name="external" size="sm" className="ml-1 inline-block align-[-3px] text-fg-subtle transition-colors duration-fast can-hover:group-hover/addr:text-leaf" />
            <span className="sr-only"> (view on Arbiscan, opens in a new tab)</span>
          </a>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
            <CopyButton value={BLOKC_TOKEN} label="Copy address" selectTarget={addressId} />
            <p className="font-mono text-label text-fg-subtle">Arbitrum One · chain ID 42161</p>
          </div>
        </div>
        <div>
          <p className="text-caption text-fg-subtle">Total supply, read from chain</p>
          <p className="mt-1.5 font-mono text-ui text-fg tabular">
            {live.data ? (
              `${live.data.supply.toLocaleString("en-GB")} BLOKC`
            ) : live.state === "error" || live.state === "offline" ? (
              "—"
            ) : (
              <span className="inline-block h-4 w-40 animate-pulse rounded bg-raised align-middle motion-off:animate-none">
                <span className="sr-only">Loading supply</span>
              </span>
            )}
          </p>
        </div>
      </div>
      <p className="border-t border-subtle px-5 py-3 text-caption text-fg-subtle">
        {"Address as published in the "}
        {/* Link and full stop stay on one line. */}
        <span className="whitespace-nowrap">
          <a
            href={TOKEN_DOCS}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 rounded-xs text-leaf underline decoration-leaf/40 underline-offset-2 can-hover:hover:decoration-leaf"
          >
            token docs
            <Icon name="external" size="sm" className="-mx-0.5" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </span>
        {" Always check it there before you send anything."}
      </p>
    </div>
  );
}
