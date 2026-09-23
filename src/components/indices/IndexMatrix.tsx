import Link from "next/link";
import { indices, components, type ComponentSymbol } from "@/lib/data/indices";
import { TokenLogo } from "./TokenLogo";

/**
 * Which component sits in which index: a membership map across all three.
 * Shows at a glance that BLOKC2 is the base assets on their own, and that
 * BLOKC10 contains all of BLOKC5 plus five more.
 */
export function IndexMatrix() {
  // Grouped the way the indices are: base assets, BLOKC5, then BLOKC10's additions.
  const seen = new Set<ComponentSymbol>();
  const all = indices.flatMap((i) => i.components).filter((s) => !seen.has(s) && seen.add(s));
  return (
    <div className="relative max-w-full overflow-x-auto rounded-2xl border border-line/[0.08] bg-card">
      <table className="w-full min-w-[520px] border-collapse text-left">
        <caption className="sr-only">Components of each BLOKC index</caption>
        <thead>
          <tr className="border-b border-line/[0.08]">
            <th scope="col" className="px-5 py-4 text-caption font-medium text-fg-subtle">
              Component
            </th>
            {indices.map((i) => (
              <th key={i.id} scope="col" className="px-3 py-4 text-center">
                <Link href={`/indices/${i.id}`} className="font-mono text-[13px] font-medium text-fg transition-colors hover:text-leaf">
                  {i.name}
                </Link>
                <span className="block text-[11px] font-normal text-fg-subtle">{i.components.length} assets</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {all.map((s) => (
            <tr key={s} className="border-b border-line/[0.05] transition-colors last:border-0 hover:bg-raised/40">
              <th scope="row" className="px-5 py-2.5 font-normal">
                <span className="flex items-center gap-3">
                  <TokenLogo symbol={s} size={22} />
                  <span className="w-14 font-mono text-[12.5px] text-fg">{s}</span>
                  <span className="hidden text-caption text-fg-subtle sm:inline">{components[s].name}</span>
                </span>
              </th>
              {indices.map((i) => {
                const has = i.components.includes(s);
                return (
                  <td key={i.id} className="px-3 py-2.5 text-center">
                    {has ? (
                      <span className="inline-block size-2.5 rounded-full bg-leaf shadow-[0_0_0_4px_rgb(var(--leaf)/0.12)]">
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
    </div>
  );
}
