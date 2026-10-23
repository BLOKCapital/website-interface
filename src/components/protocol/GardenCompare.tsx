import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { products } from "@/components/home/Products";
import { links } from "@/lib/data/socials";
import { cn } from "@/lib/utils";
import { fees } from "./FeesRisks";

type Id = "index" | "yield" | "gardeners";
/** A row is either the same for all three (said once, across) or one value each. */
type Row = { k: string; same?: ReactNode; each?: Record<Id, ReactNode>; accent?: boolean };

const fee = (label: string) => fees.find((f) => f.label === label)!;
const dash = <span className="text-fg-subtle">—</span>;

const appLink = (p: (typeof products)[number]) =>
  p.app ? (
    <a
      href={new URL(p.app, links.app).href}
      target="_blank"
      rel="noopener noreferrer"
      data-cta={`compare_${p.id}_app`}
      data-placement="protocol_compare"
      className="inline-flex items-center gap-1 text-leaf underline decoration-leaf/30 underline-offset-[3px] can-hover:hover:decoration-leaf"
    >
      Open in blokc.app
      <Icon name="external" size="sm" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <span className="text-fg-muted">Not yet</span>
  );

const byId = Object.fromEntries(products.map((p) => [p.id, p])) as Record<Id, (typeof products)[number]>;
const each = (f: (p: (typeof products)[number]) => ReactNode) =>
  ({ index: f(byId.index), yield: f(byId.yield), gardeners: f(byId.gardeners) }) as Record<Id, ReactNode>;

/**
 * Every row restates a claim made elsewhere on the site: steering and status
 * from the products (home/Products.tsx), custody and trading limits from
 * /security's controls, costs from the fees list (FeesRisks). The custody
 * row is the point: it reads the same across all three.
 */
const groups: { title: string; rows: Row[] }[] = [
  {
    title: "Steering",
    rows: [
      { k: "Steered by", each: each((p) => p.steer) },
      {
        k: "Who trades",
        each: {
          index: "The index rebalancer: past 2% drift, at most daily, ≤ 0.5% value loss",
          yield: "You, across the venues a Garden composes with",
          gardeners: "Your Gardener, within the permissions you grant",
        },
      },
    ],
  },
  {
    title: "Custody",
    rows: [
      { k: "Where funds sit", same: "In your own Garden, at your address" },
      { k: "Who can move funds out", same: "Only you", accent: true },
    ],
  },
  {
    title: "Costs",
    rows: [
      { k: fee("Protocol fee").label, same: fee("Protocol fee").body },
      { k: "Manager fee", each: { index: dash, yield: dash, gardeners: "Set by each Gardener, under DAO-set ceilings" } },
      { k: "Trading costs", same: fee("Swaps").body },
    ],
  },
  {
    title: "Status",
    rows: [
      { k: "Status", each: each((p) => <Badge tone={p.status.tone}>{p.status.label}</Badge>) },
      { k: "In the app", each: each(appLink) },
    ],
  },
];

const ids: Id[] = ["index", "yield", "gardeners"];

/** The "same for all three" value, said once. */
function Same({ row }: { row: Row }) {
  return (
    <span className={cn("flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1", row.accent && "text-leaf")}>
      <span className="flex items-baseline gap-2">
        {row.accent && <Icon name="check" size="sm" className="translate-y-0.5" />}
        <span className={row.accent ? "font-medium" : undefined}>{row.same}</span>
      </span>
      <span className="font-mono text-label uppercase tracking-caps text-fg-subtle">All three</span>
    </span>
  );
}

/**
 * The three Gardens side by side (after Safe's plan comparison tables, with
 * grouped rows), for /protocol#compare: the product deck above shows one at
 * a time; this lets a visitor choose. No "recommended" column: they differ
 * in who steers, not in how good they are. A table from md; one card per
 * Garden below it, where three columns don't fit.
 */
export function GardenCompare() {
  return (
    <Reveal>
      {/* md and up: one table, grouped rows. */}
      <div className="hidden overflow-hidden rounded-panel border border-subtle bg-card md:block">
        <table className="w-full table-fixed border-collapse text-left text-small">
          <caption className="sr-only">The three kinds of Garden compared: steering, custody, costs and status</caption>
          <colgroup>
            <col className="w-[22%]" />
            {ids.map((id) => (
              <col key={id} className="w-[26%]" />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-subtle align-top">
              <td className="px-5 py-5" />
              {ids.map((id) => {
                const p = byId[id];
                return (
                  <th key={id} scope="col" className="px-4 py-5 font-normal">
                    <a href={`#${id}`} className="display text-h4 text-fg can-hover:hover:text-leaf">
                      {p.name}
                    </a>
                    <span className="mt-1.5 block text-caption text-fg-muted">{p.audience}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g.title} className="border-b border-subtle last:border-0">
              <tr className="bg-surface/60">
                <th scope="colgroup" colSpan={4} className="label-caps px-5 py-2.5 font-normal">
                  {g.title}
                </th>
              </tr>
              {g.rows.map((r) => (
                <tr key={r.k} className={cn("border-t border-subtle align-top", r.accent && "bg-leaf/5")}>
                  <th scope="row" className="px-5 py-3.5 font-normal text-fg-muted">
                    {r.k}
                  </th>
                  {r.same != null ? (
                    <td colSpan={3} className="px-4 py-3.5 text-fg">
                      <Same row={r} />
                    </td>
                  ) : (
                    ids.map((id) => (
                      <td key={id} className="px-4 py-3.5 text-fg">
                        {r.each![id]}
                      </td>
                    ))
                  )}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      {/* Phones: one card per Garden, the same rows. */}
      <ul className="grid gap-4 md:hidden">
        {ids.map((id) => {
          const p = byId[id];
          return (
            <li key={id} className="rounded-card border border-subtle bg-card p-5">
              <h4 className="display text-h4 text-fg">{p.name}</h4>
              <p className="mt-1 text-caption text-fg-muted">{p.audience}</p>
              {groups.map((g) => (
                <div key={g.title} className="mt-4 border-t border-subtle pt-3">
                  <p className="label-caps">{g.title}</p>
                  <dl>
                    {g.rows.map((r) => (
                      <div key={r.k} className="mt-2.5">
                        <dt className="text-caption text-fg-subtle">{r.k}</dt>
                        <dd className={cn("mt-0.5 text-small text-fg", r.accent && "font-medium text-leaf")}>
                          {r.same ?? r.each![id]}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}
