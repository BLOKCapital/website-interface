"use client";

import { useCallback, useId, useRef, useState } from "react";
import Link from "next/link";
import { indices, components, type IndexId, type ComponentSymbol } from "@/lib/data/indices";
import { useComponentPrices } from "@/lib/live/prices";
import { LiveStatus } from "@/components/live/LiveStatus";
import { Badge } from "@/components/ui/Badge";
import { ArrowIcon } from "@/components/ui/icons";
import { BasketOrbit } from "./BasketOrbit";
import { TokenLogo, TokenStack } from "./TokenLogo";
import { LivePrice } from "./LivePrice";
import { cn } from "@/lib/utils";
import { useRovingTabs } from "@/lib/useRovingTabs";
import { trackSelect } from "@/lib/explainers";

/** The rules every index runs on, as stated in the contracts and docs. */
const rules = ["Weights from market cap", "Prices from Chainlink", "Rebalance past 2% drift", "Max 0.5% value loss"];

/** The other indices a token also belongs to. */
const alsoIn = (s: ComponentSymbol, id: IndexId) =>
  indices.filter((o) => o.id !== id && o.components.includes(s)).map((o) => o.name);

/**
 * The home page's look at the three indices. Three cards to choose from
 * (the chosen one turns dark, like the console it opens), then the console:
 * the basket drawn as rings around the index, every component with its live
 * Chainlink price and which other index also holds it, and the rules the
 * index runs on. Weights are never shown: they're set on-chain by market
 * cap and no official deployment is published yet. Addresses and feeds live
 * on each index's own page.
 */
export function IndexShowcase({ initial = "blokc5" }: { initial?: IndexId }) {
  const [id, setId] = useState<IndexId>(initial);
  const idx = indices.find((i) => i.id === id)!;
  const [sel, setSel] = useState<ComponentSymbol>(idx.components[0]);
  const selected = idx.components.includes(sel) ? sel : idx.components[0];
  const root = useRef<HTMLDivElement>(null);
  const prices = useComponentPrices(root);
  const base = useId();
  // Crossfade the console only after a pick, never on page load.
  const [picked, setPicked] = useState(false);

  const choose = (next: IndexId) => {
    trackSelect("index", next);
    setPicked(true);
    setId(next);
    setSel(indices.find((i) => i.id === next)!.components[0]);
  };
  const pickComponent = useCallback((s: ComponentSymbol) => {
    trackSelect("index_component", s.toLowerCase());
    setPicked(true);
    setSel(s);
  }, []);
  const rt = useRovingTabs({
    count: indices.length,
    selected: indices.findIndex((x) => x.id === id),
    onSelect: (i) => choose(indices[i].id),
  });

  const comp = components[selected];

  return (
    <div ref={root}>
      {/* Choose an index */}
      <div {...rt.tablist} aria-label="Choose an index" className="grid grid-cols-3 gap-2 sm:gap-4">
        {indices.map((x, i) => {
          const on = x.id === id;
          return (
            <button
              key={x.id}
              {...rt.tab(i)}
              type="button"
              id={`${base}-${x.id}`}
              aria-controls={`${base}-panel`}
              onClick={() => choose(x.id)}
              className={cn(
                "group/ix relative overflow-hidden rounded-card border p-3 text-left transition-[background-color,border-color,transform,box-shadow] duration-fast ease-out sm:rounded-panel sm:p-5",
                on
                  ? "theme-dark border-leaf/40 bg-card shadow-e2"
                  : "border-subtle bg-card hover:border-line/20 can-hover:hover:-translate-y-0.5",
              )}
            >
              {on && <span aria-hidden className="glow-leaf pointer-events-none absolute -right-16 -top-16 size-48 opacity-70" />}
              <span className="relative flex items-center justify-between gap-2">
                <span className="font-mono text-small font-medium tracking-wide text-fg sm:text-h4">{x.name}</span>
                <span className="hidden font-mono text-label text-fg-subtle sm:inline">{x.components.length} tokens</span>
              </span>
              <span className="relative mt-1 hidden text-small text-fg-muted sm:block">{x.tagline}</span>
              <TokenStack symbols={x.components} size={22} className="relative mt-4 hidden sm:flex" />
              <TokenStack symbols={x.components} size={16} max={4} className="relative mt-2.5 sm:hidden" />
              <span className="relative mt-1.5 block text-label text-fg-subtle sm:hidden">{x.components.length} tokens</span>
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 origin-left bg-leaf transition-transform duration-base ease-expo",
                  on ? "scale-x-100" : "scale-x-0",
                )}
              />
            </button>
          );
        })}
      </div>

      {/* The console */}
      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-${id}`}
        // overflow-clip (not hidden) rounds the corners without breaking the sticky basket.
        className="theme-dark mt-4 overflow-clip rounded-panel border border-subtle bg-card"
      >
        <div className="grid lg:grid-cols-12">
          <div className="relative min-w-0 border-b border-subtle px-6 pb-6 pt-14 sm:px-10 lg:col-span-5 lg:border-b-0 lg:border-r">
            <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(circle_at_50%_50%,black,transparent_70%)]" />
            <div className="absolute left-5 top-4 z-raised">
              <LiveStatus state={prices.state} updatedAt={prices.updatedAt} source="Chainlink on Arbitrum" onRetry={prices.retry} />
            </div>
            {/* Sticks beside a long component list on wide screens. */}
            <div className="relative flex flex-col items-center gap-6 lg:sticky lg:top-28">
              <BasketOrbit index={idx} selected={selected} onSelect={pickComponent} picked={picked} className="max-w-[420px]" />
              <p className="text-center text-label text-fg-subtle">
                Pick a token. All drawn the same size: weights are set on-chain by market cap.
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col p-5 sm:p-7 lg:col-span-7">
            <div key={id} className={cn(picked && "animate-swap")}>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-mono text-h3 font-medium tracking-wide text-fg">{idx.name}</h3>
                <Badge tone="current">{idx.status}</Badge>
              </div>
              <p className="display mt-2 text-h3 leading-tight text-fg">{idx.tagline}</p>
              <p className="mt-3 max-w-2xl text-small text-fg-muted">{idx.summary}</p>
            </div>

            {/* One crossfade for the whole list on a switch: no per-item stagger, prices included. */}
            <ul key={`list-${id}`} aria-label={`${idx.name} components`} className={cn("mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3", picked && "animate-swap")}>
              {idx.components.map((s) => {
                const on = s === selected;
                const price = prices.data?.[s]?.price;
                const also = alsoIn(s, id);
                return (
                  <li key={s}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => pickComponent(s)}
                      className={cn(
                        "w-full rounded-control border p-3 text-left transition-[background-color,border-color] duration-fast",
                        on ? "border-leaf/45 bg-raised" : "border-subtle bg-canvas/40 hover:border-line/20 hover:bg-raised/60",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <TokenLogo symbol={s} size={22} />
                        <span className="font-mono text-caption text-fg">{s}</span>
                      </span>
                      <span className="mt-2 block font-mono text-caption text-fg tabular">
                        <LivePrice price={price} state={prices.state} />
                      </span>
                      <span className="mt-0.5 block truncate text-label text-fg-subtle">
                        {also.length ? `Also in ${also.join(", ")}` : components[s].name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <p key={`${id}-${selected}`} className={cn("mt-4 rounded-control border border-subtle bg-canvas/40 px-4 py-3 text-small text-fg-muted", picked && "animate-swap")}>
              <span className="font-medium text-fg">{comp.name}.</span> {comp.role}
            </p>

            <ul aria-label="How every index is kept on target" className="mt-6 flex flex-wrap gap-2">
              {rules.map((r) => (
                <li key={r} className="rounded-full border border-line/10 px-3 py-1 font-mono text-label text-fg-muted">
                  {r}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-subtle pt-5 lg:mt-8">
              <p className="max-w-sm text-caption text-fg-subtle">{idx.forWho}</p>
              <Link href={`/indices/${idx.id}`} className="group/l inline-flex items-center gap-1.5 text-small font-medium text-leaf">
                {idx.name} methodology and contracts
                <ArrowIcon size={13} className="transition-transform group-hover/l:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
