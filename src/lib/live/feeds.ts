import { rpcBatch, word, type RpcCall } from "./rpc";
import { components, type ComponentSymbol } from "@/lib/data/indices";

/**
 * Chainlink USD price feeds on Arbitrum One — the same feeds the protocol's
 * component registry reads. Every address was checked on-chain (description()
 * returns the pair). All report 8 decimals. Prices come from
 * latestRoundData(), exactly as a contract reads them, including the oracle's
 * own update time.
 */
export const FEEDS = Object.fromEntries(
  Object.values(components).map((c) => [c.symbol, { pair: `${c.symbol} / USD`, address: c.feed, decimals: 8 }]),
) as Record<ComponentSymbol, { pair: string; address: string; decimals: number }>;

export type FeedSymbol = ComponentSymbol;

export type FeedReading = {
  symbol: FeedSymbol;
  price: number;
  /** When the oracle itself last updated this answer (ms since epoch). */
  oracleUpdatedAt: number;
};

const LATEST_ROUND_DATA = "0xfeaf968c";

/**
 * Reads every feed in one batch. Each feed stands alone: one that errors or
 * reports a non-positive answer is left out of the result, and the rest are
 * returned. Throws if the request fails, or, tagged `source: "chainlink"`,
 * if no feed answered at all.
 */
export async function readFeeds(symbols: readonly FeedSymbol[]): Promise<Record<string, FeedReading>> {
  const calls: RpcCall[] = symbols.map((s) => ({
    method: "eth_call",
    params: [{ to: FEEDS[s].address, data: LATEST_ROUND_DATA }, "latest"],
  }));
  const results = await rpcBatch(calls);
  const out: Record<string, FeedReading> = {};
  symbols.forEach((s, i) => {
    const r = results[i];
    if (!r.ok || typeof r.value !== "string") return;
    // (roundId, answer, startedAt, updatedAt, answeredInRound)
    const answer = word(r.value, 1, true);
    const updatedAt = word(r.value, 3);
    if (answer <= 0n) return;
    out[s] = {
      symbol: s,
      price: Number(answer) / 10 ** FEEDS[s].decimals,
      oracleUpdatedAt: Number(updatedAt) * 1000,
    };
  });
  if (symbols.length && !Object.keys(out).length) throw Object.assign(new Error("No price feed answered"), { source: "chainlink" });
  return out;
}
