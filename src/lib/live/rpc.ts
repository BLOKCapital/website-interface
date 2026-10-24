/**
 * Minimal JSON-RPC client for public Arbitrum endpoints. No wallet, no
 * library: one batched POST per poll. The public Arbitrum One endpoint sends
 * `Access-Control-Allow-Origin: *`, so this runs straight from the browser.
 */

export const RPC_ORIGIN = "https://arb1.arbitrum.io";
export const ARBITRUM_RPC = `${RPC_ORIGIN}/rpc`;
export const ARBISCAN = "https://arbiscan.io";

export type RpcCall = { method: string; params: unknown[] };

/** One call's outcome inside a batch: its result, or why that call alone failed. */
export type RpcResult = { ok: true; value: unknown } | { ok: false; error: string };

/**
 * Which system a failed read points at, for the `blok:error` event
 * (src/lib/analytics.ts). An error carrying no `source` is the RPC's.
 */
export type LiveSource = "arbitrum-rpc" | "chainlink";

/**
 * Sends `calls` as one batched POST and returns one result per call, in
 * order. A call that errors (or is missing from the reply) fails on its own,
 * so one bad feed no longer blanks the rest (UX-10). Throws only when the
 * request as a whole fails: offline, timeout, an HTTP error or a reply that
 * isn't a batch (all "arbitrum-rpc" failures).
 */
export async function rpcBatch(
  calls: RpcCall[],
  { url = ARBITRUM_RPC, timeoutMs = 8000 }: { url?: string; timeoutMs?: number } = {},
): Promise<RpcResult[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(calls.map((c, id) => ({ jsonrpc: "2.0", id, ...c }))),
      signal: ctrl.signal,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`RPC ${res.status}`);
    const out = (await res.json()) as { id: number; result?: unknown; error?: { message?: string } }[];
    if (!Array.isArray(out)) throw new Error("RPC returned no batch");
    const byId = new Map(out.map((r) => [r.id, r]));
    return calls.map((_, i) => {
      const r = byId.get(i);
      return r && !r.error ? { ok: true, value: r.result } : { ok: false, error: r?.error?.message ?? "RPC call missing" };
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Reads the n-th 32-byte word of ABI-encoded return data as a signed int. */
export function word(data: string, n: number, signed = false): bigint {
  const hex = data.slice(2 + n * 64, 2 + (n + 1) * 64);
  let v = BigInt(`0x${hex || "0"}`);
  if (signed && v >= 1n << 255n) v -= 1n << 256n;
  return v;
}
