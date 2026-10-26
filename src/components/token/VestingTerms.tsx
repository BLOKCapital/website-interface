import { Badge } from "@/components/ui/Badge";
import { fmtPct, fullyUnlockedAt, unlockedOfSupply, type Vesting } from "@/lib/data/vesting";

const months = (n: number) => `${n} mo`;

/** Four headline numbers, as pinned note cards (TokenSpec's look). */
export function VestingSummary({ items }: { items: Vesting[] }) {
  const longestCliff = Math.max(...items.map((v) => v.cliff));
  const end = Math.max(...items.map(fullyUnlockedAt));
  const cards = [
    { k: "unlocked at tge", v: fmtPct(unlockedOfSupply(items, 0)), note: "of the 10B supply" },
    { k: "after 12 months", v: fmtPct(unlockedOfSupply(items, 12)), note: "of the 10B supply" },
    {
      k: "longest cliff",
      v: months(longestCliff),
      note: items.filter((v) => v.cliff === longestCliff).map((v) => v.label).join(", "),
    },
    { k: "fully unlocked", v: `+${months(end)}`, note: "after the TGE" },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.k} className="note-card flex flex-col justify-between gap-6 p-5 sm:p-6">
          <dt className="font-mono text-label lowercase text-fg-subtle">{c.k}</dt>
          <dd>
            <span className="display block text-display-sm leading-none text-fg tabular">{c.v}</span>
            <span className="mt-2 block font-mono text-label text-fg-subtle">{c.note}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The schedule as a table: the source the chart is drawn from, and the
 * accessible version of it. One row per share, in the allocation's order.
 */
export function VestingTerms({ items }: { items: Vesting[] }) {
  return (
    <div className="rounded-panel border border-subtle bg-card shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-subtle px-5 py-3.5 sm:px-6">
        <p className="text-small font-medium text-fg">Vesting terms, by share</p>
        <Badge status="example" />
      </div>
      {/* Scrolls sideways on a phone; the first column stays readable. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <caption className="sr-only">$BLOKC vesting terms by allocation share. Example terms.</caption>
          <thead>
            <tr className="border-b border-subtle">
              {["Share", "Supply", "At TGE", "Cliff", "Then", "Fully unlocked", "Revocable"].map((h, i) => (
                <th key={h} scope="col" className={`label-caps px-5 py-3 font-normal sm:px-6 ${i ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((v) => (
              <tr key={v.label} className="border-b border-subtle last:border-0 can-hover:hover:bg-raised/60">
                <th scope="row" className="px-5 py-3 text-small font-medium text-fg sm:px-6">
                  {v.label}
                </th>
                <td className="px-5 py-3 text-right font-mono text-caption text-fg tabular sm:px-6">{v.pct}%</td>
                <td className="px-5 py-3 text-right font-mono text-caption text-fg tabular sm:px-6">{v.tge ? fmtPct(v.tge * 100) : "—"}</td>
                <td className="px-5 py-3 text-right font-mono text-caption text-fg-muted tabular sm:px-6">{v.cliff ? months(v.cliff) : "None"}</td>
                <td className="px-5 py-3 text-right font-mono text-caption text-fg-muted tabular sm:px-6">
                  {v.duration ? `Linear, ${months(v.duration)}` : "—"}
                </td>
                <td className="px-5 py-3 text-right font-mono text-caption text-fg tabular sm:px-6">
                  {fullyUnlockedAt(v) ? `TGE + ${months(fullyUnlockedAt(v))}` : "At TGE"}
                </td>
                <td className="px-5 py-3 text-right sm:px-6">
                  {v.revocable ? (
                    <span className="font-mono text-caption text-warning-text">Yes, by the DAO</span>
                  ) : (
                    <span className="font-mono text-caption text-fg-muted">No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-subtle px-5 py-3 text-caption text-fg-subtle sm:px-6">
        &ldquo;Revocable&rdquo; means tokens not yet vested can be taken back. Months count from the TGE. Source: the whitepaper, once the
        terms are final.
      </p>
    </div>
  );
}
