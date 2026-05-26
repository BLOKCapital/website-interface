import { shortAddress } from "@/lib/utils";

/** Display-ready proposal, mapped from the on-chain governance API. */
export type ProposalView = {
  id: string;
  title: string;
  /** Yes share of yes+no votes, 0–100. */
  forPct: number;
  /** Pre-formatted total voting power, e.g. "9.62B $BLOKC". */
  totalLabel: string;
  /** Pre-formatted status / time-left, e.g. "Executed" or "36h left". */
  statusLabel: string;
  passing: boolean;
};

type RawProposal = {
  id: string;
  title: string;
  status: string;
  active: boolean;
  executed: boolean;
  end_date: string;
  yes: string;
  no: string;
  abstain: string;
  total_voting_power: string;
};

const ENDPOINT = "https://worker-governance.sn-75f.workers.dev/proposals";

// Vote values arrive as 18-decimal wei strings. Collapse to whole tokens and
// format with a B/M/K suffix.
function formatTokens(wei: bigint): string {
  const tokens = Number(wei / 10n ** 18n);
  if (tokens >= 1e9) return `${(tokens / 1e9).toFixed(2)}B`;
  if (tokens >= 1e6) return `${(tokens / 1e6).toFixed(2)}M`;
  if (tokens >= 1e3) return `${(tokens / 1e3).toFixed(1)}K`;
  return `${tokens}`;
}

function statusLabel(p: RawProposal, nowMs: number): string {
  const endMs = Date.parse(p.end_date);
  if (p.active && Number.isFinite(endMs) && endMs > nowMs) {
    const hours = Math.round((endMs - nowMs) / 3_600_000);
    return hours >= 48 ? `${Math.round(hours / 24)}d left` : `${hours}h left`;
  }
  if (p.executed || p.status === "EXECUTED") return "Executed";
  if (!p.status) return "Closed";
  return p.status.charAt(0) + p.status.slice(1).toLowerCase();
}

/**
 * Fetches live governance proposals (Aragon OSx) on the server and maps them to
 * a display-ready, SSR-stable shape. All time/number formatting happens here so
 * the values can be passed as plain props to client components without a
 * hydration mismatch. Cached for 5 minutes (ISR). Returns [] if the API fails.
 */
export async function getProposals(): Promise<ProposalView[]> {
  try {
    const res = await fetch(ENDPOINT, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: { proposals?: RawProposal[] } };
    const raw = json.data?.proposals ?? [];
    const now = Date.now();

    return raw.map((p) => {
      const yes = BigInt(p.yes || "0");
      const no = BigInt(p.no || "0");
      const totalVotes = yes + no;
      const forPct =
        totalVotes > 0n ? Number((yes * 10000n) / totalVotes) / 100 : 0;
      return {
        id: shortAddress(p.id),
        title: p.title,
        forPct,
        totalLabel: `${formatTokens(totalVotes)} $BLOKC`,
        statusLabel: statusLabel(p, now),
        passing: forPct >= 50,
      };
    });
  } catch {
    return [];
  }
}
