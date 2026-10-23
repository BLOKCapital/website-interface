import Link from "next/link";
import { indices, components, methodology, type ComponentSymbol } from "@/lib/data/indices";
import { TokenLogo } from "./TokenLogo";

/** "BLOKC10" → "C10": the column header on phones, where the full names don't fit. */
const short = (name: string) => name.replace(/^BLOK/, "");

const guard = (k: string) => methodology.guardrails.find((g) => g.k === k)!.v;

/** Rows that read the same for all three, said once across (from the methodology data). */
const method = [
  { k: "Weighting", v: `By market cap, minimum ${guard("Minimum weight")}` },
  { k: "Prices", v: "Chainlink USD feeds on Arbitrum" },
  { k: "Rebalance", v: `Past ${guard("Drift tolerance")}, pooled, ${guard("Pooled rebalance").toLowerCase()}` },
  { k: "Max value loss", v: `${guard("Max value loss")} per rebalance` },
];

/**
 * Which component sits in which index: a membership map across all three,
 * after Safe's plan tables. Each column is headed like a plan (name, what it
 * holds, how many); rows are grouped the way the indices are built (base
 * assets, the five DeFi blue chips, then BLOKC10's additions), and a last
 * "Method" group reads the same across all three, said once. Shows at a
 * glance that BLOKC2 shares nothing with the other two, and that BLOKC10
 * contains all of BLOKC5 plus five more. No "recommended" column: they're
 * different exposures, not tiers.
 *
 * Fits a 320px phone with no sideways scroll (MOB-07): below `sm` the
 * columns read C2 / C5 / C10 (the full name stays in the link's accessible
 * name), cells are tighter, and the taglines and the token's full name are
 * hidden.
 */
export function IndexMatrix() {
  const [c2, c5, c10] = ["blokc2", "blokc5", "blokc10"].map((id) => indices.find((i) => i.id === id)!);
  const groups: { title: string; rows: ComponentSymbol[] }[] = [
    { title: "Base assets", rows: [...c2.components] },
    { title: "DeFi blue chips", rows: [...c5.components] },
    { title: `${c10.name} adds`, rows: c10.components.filter((s) => !c5.components.includes(s)) },
  ];
  const cols = indices.length;
  return (
    <div className="relative max-w-full overflow-x-auto rounded-card border border-subtle bg-card">
      <table className="w-full border-collapse text-left sm:min-w-[520px]">
        <caption className="sr-only">Which tokens each of the BLOK Capital indices holds, and the method all three share</caption>
        <thead>
          <tr className="border-b border-subtle align-bottom">
            <th scope="col" className="px-3 py-4 text-caption font-medium text-fg-subtle sm:px-5">
              Component
            </th>
            {indices.map((i) => (
              <th key={i.id} scope="col" className="px-1.5 py-4 text-center font-normal sm:px-3">
                <Link
                  href={`/indices/${i.id}`}
                  className="font-mono text-caption font-medium text-fg transition-colors can-hover:hover:text-leaf sm:text-small"
                >
                  <abbr title={i.name} aria-hidden className="no-underline sm:hidden">
                    {short(i.name)}
                  </abbr>
                  <span className="sr-only sm:not-sr-only">{i.name}</span>
                </Link>
                <span className="mt-0.5 hidden text-caption text-fg-muted sm:block">{i.tagline}</span>
                <span className="mt-1 block font-mono text-label text-fg-subtle">
                  {i.components.length}
                  <span className="sr-only sm:not-sr-only"> assets</span>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        {groups.map((g) => (
          <tbody key={g.title}>
            <tr className="border-b border-subtle bg-surface/60">
              <th scope="colgroup" colSpan={cols + 1} className="label-caps px-3 py-2 font-normal sm:px-5">
                {g.title}
              </th>
            </tr>
            {g.rows.map((s) => (
              <tr key={s} className="border-b border-subtle transition-colors hover:bg-raised/40">
                <th scope="row" className="px-3 py-2.5 font-normal sm:px-5">
                  <span className="flex items-center gap-2 sm:gap-3">
                    <TokenLogo symbol={s} size={22} />
                    <span className="font-mono text-caption text-fg sm:w-14">{s}</span>
                    <span className="hidden text-caption text-fg-subtle sm:inline">{components[s].name}</span>
                  </span>
                </th>
                {indices.map((i) => {
                  const has = i.components.includes(s);
                  return (
                    <td key={i.id} className="px-1.5 py-2.5 text-center sm:px-3">
                      {has ? (
                        <span className="inline-block size-2.5 rounded-full bg-leaf shadow-halo">
                          <span className="sr-only">Included</span>
                        </span>
                      ) : (
                        <span className="inline-block h-px w-3 bg-line/15">
                          <span className="sr-only">Not included</span>
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        ))}
        <tbody>
          <tr className="border-b border-subtle bg-surface/60">
            <th scope="colgroup" colSpan={cols + 1} className="label-caps px-3 py-2 font-normal sm:px-5">
              Method, the same for all three
            </th>
          </tr>
          {method.map((m) => (
            <tr key={m.k} className="border-b border-subtle last:border-0">
              <th scope="row" className="px-3 py-2.5 text-caption font-normal text-fg-muted sm:px-5">
                {m.k}
              </th>
              <td colSpan={cols} className="px-3 py-2.5 text-center text-caption text-fg">
                {m.v}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p aria-hidden className="border-t border-subtle px-3 py-2.5 font-mono text-label text-fg-subtle sm:hidden">
        C2, C5, C10 = BLOKC2, BLOKC5, BLOKC10
      </p>
    </div>
  );
}
