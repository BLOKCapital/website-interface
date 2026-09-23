import { shortAddress } from "@/lib/utils";

/** Display-ready proposal, mapped from the on-chain governance API. */
export type ProposalView = {
  id: string;
  title: string;
  /** Yes share of yes + no votes, 0–100. */
  forPct: number;
  /** Votes cast (yes + no + abstain) as a share of total voting power, 0–100. */
  turnoutPct: number;
  /** "Executed", "Active", … */
  statusLabel: string;
  /** Voting end date, e.g. "1 Sept 2026"; empty if unknown. */
  endLabel: string;
  active: boolean;
  passing: boolean;
};

export type GovernanceSnapshot = {
  proposals: ProposalView[];
  /** Latest time the API synced these from chain, formatted; null if unknown. */
  syncedLabel: string | null;
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
  synced_at?: string;
};

const ENDPOINT = "https://worker-governance.sn-75f.workers.dev/proposals";

// Fixed locale and UTC so every build formats identically.
const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const dateTimeFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC", timeZoneName: "short",
});

const pct = (part: bigint, whole: bigint) => (whole > 0n ? Number((part * 10000n) / whole) / 100 : 0);

function statusLabel(p: RawProposal) {
  if (p.active) return "Active";
  if (p.executed || p.status === "EXECUTED") return "Executed";
  if (!p.status) return "Closed";
  return p.status.charAt(0) + p.status.slice(1).toLowerCase();
}

function toSnapshot(raw: RawProposal[]): GovernanceSnapshot {
  const proposals = raw.map((p) => {
    const yes = BigInt(p.yes || "0");
    const no = BigInt(p.no || "0");
    const abstain = BigInt(p.abstain || "0");
    const forPct = pct(yes, yes + no);
    const end = Date.parse(p.end_date);
    return {
      id: shortAddress(p.id),
      title: p.title,
      forPct,
      turnoutPct: pct(yes + no + abstain, BigInt(p.total_voting_power || "0")),
      statusLabel: statusLabel(p),
      endLabel: Number.isFinite(end) ? dateFmt.format(end) : "",
      active: Boolean(p.active),
      passing: forPct >= 50,
    };
  });
  const latest = Math.max(...raw.map((p) => Date.parse(p.synced_at ?? "")).filter(Number.isFinite));
  return { proposals, syncedLabel: Number.isFinite(latest) ? dateTimeFmt.format(latest) : null };
}

/**
 * Governance proposals (Aragon OSx), fetched at build time — the site is a
 * static export, and the API doesn't allow browser requests from this origin.
 *
 * The query string is a per-build cache key: Next's build fetch cache
 * otherwise returns the first response it ever stored, forever
 * (`cache: "no-store"` makes a static-export fetch throw instead). A failed
 * fetch is logged loudly so an empty panel never ships silently.
 */
const BUILD_KEY = Date.now();

export async function getGovernance(): Promise<GovernanceSnapshot> {
  try {
    const res = await fetch(`${ENDPOINT}?build=${BUILD_KEY}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { data?: { proposals?: RawProposal[] } };
    return toSnapshot(json.data?.proposals ?? []);
  } catch (err) {
    console.warn(`[governance] proposals fetch failed: ${err instanceof Error ? err.message : err}`);
    return { proposals: [], syncedLabel: null };
  }
}
