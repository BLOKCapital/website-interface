/**
 * Minimal JSON-RPC client for public Arbitrum endpoints. No wallet, no
 * library: one batched POST per poll. The public Arbitrum One endpoint sends
 * `Access-Control-Allow-Origin: *`, so this runs straight from the browser.
 */

export const ARBITRUM_RPC = "https://arb1.arbitrum.io/rpc";
export const ARBISCAN = "https://arbiscan.io";

export type RpcCall = { method: string; params: unknown[] };

export async function rpcBatch<T extends unknown[] = unknown[]>(
  calls: RpcCall[],
  { url = ARBITRUM_RPC, timeoutMs = 8000 }: { url?: string; timeoutMs?: number } = {},
): Promise<T> {
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
    const out = (await res.json()) as { id: number; result?: unknown; error?: { message: string } }[];
    if (!Array.isArray(out)) throw new Error("RPC returned no batch");
    const byId = new Map(out.map((r) => [r.id, r]));
    return calls.map((_, i) => {
      const r = byId.get(i);
      if (!r || r.error) throw new Error(r?.error?.message ?? "RPC call missing");
      return r.result;
    }) as T;
  } finally {
    clearTimeout(timer);
  }
}

export const hexToBigInt = (h: string) => BigInt(h);

/** Reads the n-th 32-byte word of ABI-encoded return data as a signed int. */
export function word(data: string, n: number, signed = false): bigint {
  const hex = data.slice(2 + n * 64, 2 + (n + 1) * 64);
  let v = BigInt(`0x${hex || "0"}`);
  if (signed && v >= 1n << 255n) v -= 1n << 256n;
  return v;
}
