"use client";

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Link from "next/link";
import { indices, components, type IndexId, type ComponentSymbol } from "@/lib/data/indices";
import { useComponentPrices, formatUsd } from "@/lib/live/prices";
import { LiveStatus } from "@/components/live/LiveStatus";
import { Badge } from "@/components/ui/Badge";
import { ArrowIcon } from "@/components/ui/icons";
import { BasketOrbit } from "./BasketOrbit";
import { TokenLogo, TokenStack } from "./TokenLogo";
import { cn } from "@/lib/utils";

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
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const choose = (next: IndexId) => {
    setId(next);
    setSel(indices.find((i) => i.id === next)!.components[0]);
  };
  const onKey = (e: KeyboardEvent) => {
    const i = indices.findIndex((x) => x.id === id);
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + indices.length) % indices.length;
    choose(indices[n].id);
    tabs.current[n]?.focus();
  };

  const comp = components[selected];

  return (
    <div ref={root}>
      {/* Choose an index */}
      <div role="tablist" aria-label="Choose an index" onKeyDown={onKey} className="grid grid-cols-3 gap-2 sm:gap-4">
        {indices.map((x, i) => {
          const on = x.id === id;
          return (
            <button
              key={x.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-${x.id}`}
              aria-selected={on}
              aria-controls={`${base}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => choose(x.id)}
              className={cn(
                "group/ix relative overflow-hidden rounded-2xl border p-3 text-left transition-[background-color,border-color,transform,box-shadow] duration-base ease-expo sm:rounded-3xl sm:p-5",
                on
                  ? "theme-dark border-leaf/40 bg-card shadow-[0_24px_60px_-30px_rgb(var(--shadow))]"
                  : "border-line/[0.08] bg-card hover:-translate-y-0.5 hover:border-line/20",
              )}
            >
              {on && <span aria-hidden className="glow-leaf pointer-events-none absolute -right-16 -top-16 size-48 opacity-70" />}
              <span className="relative flex items-center justify-between gap-2">
                <span className="font-mono text-[14px] font-medium tracking-wide text-fg sm:text-[20px]">{x.name}</span>
                <span className="hidden font-mono text-[11px] text-fg-subtle sm:inline">{x.components.length} tokens</span>
              </span>
              <span className="relative mt-1 hidden text-small text-fg-muted sm:block">{x.tagline}</span>
              <TokenStack symbols={x.components} size={22} className="relative mt-4 hidden sm:flex" />
              <TokenStack symbols={x.components} size={16} max={4} className="relative mt-2.5 sm:hidden" />
              <span className="relative mt-1.5 block text-[11px] text-fg-subtle sm:hidden">{x.components.length} tokens</span>
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 origin-left bg-leaf transition-transform duration-slow ease-expo",
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
        className="theme-dark mt-4 overflow-clip rounded-3xl border border-line/[0.08] bg-card"
      >
        <div className="grid lg:grid-cols-12">
          <div className="relative min-w-0 border-b border-line/[0.07] px-6 pb-6 pt-14 sm:px-10 lg:col-span-5 lg:border-b-0 lg:border-r">
            <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(circle_at_50%_50%,black,transparent_70%)]" />
            <div className="absolute left-5 top-4 z-10">
              <LiveStatus state={prices.state} updatedAt={prices.updatedAt} source="Chainlink on Arbitrum" onRetry={prices.retry} />
            </div>
            {/* Sticks beside a long component list on wide screens. */}
            <div className="relative flex flex-col items-center gap-6 lg:sticky lg:top-28">
              <BasketOrbit index={idx} selected={selected} onSelect={setSel} className="max-w-[420px]" />
              <p className="text-center text-[11.5px] text-fg-subtle">
                Pick a token. All drawn the same size: weights are set on-chain by market cap.
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col p-5 sm:p-7 lg:col-span-7">
            <div key={id} className="animate-enter-up [animation-duration:450ms]">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-mono text-[22px] font-medium tracking-wide text-fg sm:text-[26px]">{idx.name}</h3>
                <Badge tone="current">{idx.status}</Badge>
              </div>
              <p className="display mt-2 text-[clamp(22px,1.2vw+16px,30px)] leading-tight text-fg">{idx.tagline}</p>
              <p className="mt-3 max-w-2xl text-small text-fg-muted">{idx.summary}</p>
            </div>

            <ul key={`list-${id}`} aria-label={`${idx.name} components`} className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {idx.components.map((s, i) => {
                const on = s === selected;
                const price = prices.data?.[s]?.price;
                const also = alsoIn(s, id);
                return (
                  <li key={s} className="animate-enter-up [animation-duration:450ms]" style={{ animationDelay: `${i * 40}ms` } as CSSProperties}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setSel(s)}
                      className={cn(
                        "w-full rounded-xl border p-3 text-left transition-[background-color,border-color] duration-fast",
                        on ? "border-leaf/45 bg-raised" : "border-line/[0.07] bg-canvas/40 hover:border-line/20 hover:bg-raised/60",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <TokenLogo symbol={s} size={22} />
                        <span className="font-mono text-[12.5px] text-fg">{s}</span>
                      </span>
                      <span className="mt-2 block font-mono text-[13.5px] text-fg tabular">
                        {price !== undefined ? (
                          formatUsd(price)
                        ) : prices.state === "error" ? (
                          "—"
                        ) : (
                          <span aria-label="Loading price" className="inline-block h-3 w-16 animate-pulse rounded bg-raised align-middle" />
                        )}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-fg-subtle">
                        {also.length ? `Also in ${also.join(", ")}` : components[s].name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <p key={`${id}-${selected}`} className="mt-4 animate-enter-fade rounded-xl border border-line/[0.07] bg-canvas/40 px-4 py-3 text-small text-fg-muted">
              <span className="font-medium text-fg">{comp.name}.</span> {comp.role}
            </p>

            <ul aria-label="How every index is kept on target" className="mt-6 flex flex-wrap gap-2">
              {rules.map((r) => (
                <li key={r} className="rounded-full border border-line/10 px-3 py-1 font-mono text-[11px] text-fg-muted">
                  {r}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line/[0.07] pt-5 lg:mt-8">
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
