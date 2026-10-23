import Link from "next/link";
import { indices, components, type ComponentSymbol } from "@/lib/data/indices";
import { TokenLogo } from "./TokenLogo";

/** "BLOKC10" → "C10": the column header on phones, where the full names don't fit. */
const short = (name: string) => name.replace(/^BLOK/, "");

/**
 * Which component sits in which index: a membership map across all three.
 * Shows at a glance that BLOKC2 is the base assets on their own, and that
 * BLOKC10 contains all of BLOKC5 plus five more.
 *
 * Fits a 320px phone with no sideways scroll (MOB-07): below `sm` the
 * columns read C2 / C5 / C10 (the full name stays in the link's accessible
 * name), cells are tighter and the token's full name is hidden.
 */
export function IndexMatrix() {
  // Grouped the way the indices are: base assets, BLOKC5, then BLOKC10's additions.
  const seen = new Set<ComponentSymbol>();
  const all = indices.flatMap((i) => i.components).filter((s) => !seen.has(s) && seen.add(s));
  return (
    <div className="relative max-w-full overflow-x-auto rounded-card border border-subtle bg-card">
      <table className="w-full border-collapse text-left sm:min-w-[520px]">
        <caption className="sr-only">Which tokens each of the BLOK Capital indices holds</caption>
        <thead>
          <tr className="border-b border-subtle">
            <th scope="col" className="px-3 py-4 text-caption font-medium text-fg-subtle sm:px-5">
              Component
            </th>
            {indices.map((i) => (
              <th key={i.id} scope="col" className="px-1.5 py-4 text-center sm:px-3">
                <Link
                  href={`/indices/${i.id}`}
                  className="font-mono text-caption font-medium text-fg transition-colors can-hover:hover:text-leaf"
                >
                  <abbr title={i.name} aria-hidden className="no-underline sm:hidden">
                    {short(i.name)}
                  </abbr>
                  <span className="sr-only sm:not-sr-only">{i.name}</span>
                </Link>
                <span className="block text-label font-normal text-fg-subtle">
                  {i.components.length}
                  <span className="sr-only sm:not-sr-only"> assets</span>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {all.map((s) => (
            <tr key={s} className="border-b border-subtle transition-colors last:border-0 hover:bg-raised/40">
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
      </table>
      <p aria-hidden className="border-t border-subtle px-3 py-2.5 font-mono text-label text-fg-subtle sm:hidden">
        C2, C5, C10 = BLOKC2, BLOKC5, BLOKC10
      </p>
    </div>
  );
}
