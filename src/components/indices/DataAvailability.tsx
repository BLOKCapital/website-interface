import { LiveStatus, type StaticState } from "@/components/live/LiveStatus";

type Row = { label: string; state: "live" | StaticState; note: string };

const rows: Row[] = [
  { label: "Component prices", state: "live", note: "Read from Chainlink on Arbitrum, the same feeds the index contracts use." },
  { label: "Component lists", state: "live", note: "Confirmed by the BLOK Capital team. Changes need a DAO vote." },
  { label: "Target weights", state: "soon", note: "Recomputed on-chain from market caps, so they move with the market. Not listed here as fixed numbers." },
  { label: "Index value", state: "nodata", note: "An index has no value until Gardens follow it publicly." },
  { label: "Performance history", state: "nodata", note: "Starts at public launch. We won't show backtests as if they were history." },
  { label: "Rebalance events", state: "soon", note: "Each pooled rebalance is a transaction; they'll stream in here like DAO activity does." },
];

/**
 * An honest ledger of what this page can and can't show yet, and why.
 * Status chips are static: "live" here means the page reads it live above.
 */
export function DataAvailability() {
  return (
    <ul className="divide-y divide-line/[0.06] overflow-hidden rounded-2xl border border-line/[0.08] bg-card">
      {rows.map((r) => (
        <li key={r.label} className="grid gap-1.5 px-5 py-4 sm:grid-cols-[190px_150px_1fr] sm:items-center sm:gap-4">
          <p className="text-small font-medium text-fg">{r.label}</p>
          {r.state === "live" ? (
            <p className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-leaf">
              <span aria-hidden className="size-1.5 rounded-full bg-leaf" /> Available
            </p>
          ) : (
            <LiveStatus state={r.state} className="[&>span:nth-child(2)]:hidden" />
          )}
          <p className="text-small text-fg-muted">{r.note}</p>
        </li>
      ))}
    </ul>
  );
}
