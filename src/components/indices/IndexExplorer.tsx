"use client";

import { useCallback, useId, useRef, useState } from "react";
import Link from "next/link";
import { cn, shortAddress } from "@/lib/utils";
import { indices, components, type IndexId, type ComponentSymbol } from "@/lib/data/indices";
import { useComponentPrices, feedState } from "@/lib/live/prices";
import { ago } from "@/lib/live/useLive";
import { ARBISCAN } from "@/lib/live/rpc";
import { LiveStatus } from "@/components/live/LiveStatus";
import { CopyButton } from "@/components/ui/CopyButton";
import { Hint } from "@/components/ui/Hint";
import { Badge } from "@/components/ui/Badge";
import { ArrowIcon, ExternalIcon } from "@/components/ui/icons";
import { BasketOrbit } from "./BasketOrbit";
import { TokenLogo, TokenStack } from "./TokenLogo";
import { LivePrice } from "./LivePrice";
import { useRovingTabs } from "@/lib/useRovingTabs";
import { trackSelect } from "@/lib/explainers";

/**
 * Pick an index → see what's in it → pick a component → see its role, its
 * live oracle price and the exact token and feed contracts the index reads.
 *
 * Weights aren't shown as numbers: they're computed on-chain from market caps
 * and no official deployment is published yet. The orb therefore sizes
 * components equally and says so.
 */
export function IndexExplorer({
  initial = "blokc5",
  linkToPages = true,
  fixed = false,
}: {
  initial?: IndexId;
  linkToPages?: boolean;
  /** On an index's own page: no index switcher, just its components. */
  fixed?: boolean;
}) {
  const [id, setId] = useState<IndexId>(initial);
  const idx = indices.find((i) => i.id === id)!;
  const [sel, setSel] = useState<ComponentSymbol>(idx.components[0]);
  const selected = idx.components.includes(sel) ? sel : idx.components[0];
  const root = useRef<HTMLDivElement>(null);
  const prices = useComponentPrices(root);
  const base = useId();
  // Crossfade the panels only after a pick, never on page load.
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

  const c = components[selected];
  const reading = prices.data?.[selected];

  return (
    // A dark console on either theme: the component colours are tuned for it.
    // overflow-clip (not hidden) rounds the corners without breaking the sticky basket.
    <div ref={root} className="theme-dark overflow-clip rounded-panel border border-subtle bg-card">
      {/* Selector */}
      <div className="flex flex-col gap-4 border-b border-subtle p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        {fixed ? (
          <p className="text-small text-fg-muted">
            <span className="font-mono text-fg">{idx.name}</span> · {idx.components.length} components · live oracle prices
          </p>
        ) : (
        <div {...rt.tablist} aria-label="Choose an index" className="grid grid-cols-3 gap-1 rounded-card bg-canvas/70 p-1 sm:inline-grid">
          {indices.map((x, i) => (
            <button
              key={x.id}
              {...rt.tab(i)}
              type="button"
              id={`${base}-${x.id}`}
              aria-controls={`${base}-panel`}
              onClick={() => choose(x.id)}
              className={cn(
                "relative rounded-control px-3 py-2.5 text-left transition-[background-color,color,box-shadow] duration-fast sm:px-5",
                // A full-strength 1.5px leaf ring (>= 3:1 on the strip), not just a fill change.
                x.id === id ? "bg-raised text-fg shadow-[inset_0_0_0_1.5px_rgb(var(--leaf))]" : "text-fg-muted hover:bg-raised/50 hover:text-fg",
              )}
            >
              <span className="block font-mono text-caption font-medium tracking-wide">{x.name}</span>
              <span className="mt-1 flex items-center gap-2 text-label text-fg-subtle">
                <TokenStack symbols={x.components} size={16} max={5} className="hidden sm:flex" />
                {x.components.length} tokens
              </span>
            </button>
          ))}
        </div>
        )}
        <LiveStatus state={prices.state} updatedAt={prices.updatedAt} source="the Arbitrum network" onRetry={prices.retry} />
      </div>

      <div
        id={`${base}-panel`}
        role={fixed ? undefined : "tabpanel"}
        aria-labelledby={fixed ? undefined : `${base}-${id}`}
        className="grid lg:grid-cols-12"
      >
        {/* Orb */}
        <div className="relative min-w-0 border-b border-subtle px-6 py-8 sm:px-10 lg:col-span-5 lg:border-b-0 lg:border-r">
          <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(circle_at_50%_50%,black,transparent_70%)]" />
          {/* Sticks beside the long detail column on wide screens. */}
          <div className="relative flex flex-col items-center gap-6 lg:sticky lg:top-[calc(7rem+var(--subnav,0px))]">
            <BasketOrbit index={idx} selected={selected} onSelect={pickComponent} picked={picked} className="max-w-[400px]" />
            <p className="text-center text-caption text-fg-subtle">
              Tap or select a token to inspect it. All drawn the same size: weights are set on-chain by market cap and aren&apos;t shown.
            </p>
          </div>
        </div>

        {/* Detail */}
        <div className="flex min-w-0 flex-col p-5 sm:p-7 lg:col-span-7">
          {!fixed && (
          <div key={id} className={cn(picked && "animate-swap")}>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-mono text-h3 font-medium tracking-wide text-fg">{idx.name}</h3>
              <Badge tone="current">{idx.status}</Badge>
            </div>
            <p className="mt-1 text-body text-fg">{idx.tagline}</p>
            <p className="mt-3 max-w-xl text-small text-fg-muted">{idx.summary}</p>
          </div>
          )}

          {/* Components */}
          <ul aria-label={`${idx.name} components`} className={cn("grid gap-1.5 sm:grid-cols-2", !fixed && "mt-6")}>
            {idx.components.map((s) => {
              const comp = components[s];
              const r = prices.data?.[s];
              const on = s === selected;
              return (
                <li key={s}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => pickComponent(s)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-control border px-3 py-2.5 text-left transition-colors duration-fast",
                      on ? "border-leaf/35 bg-raised" : "border-transparent hover:border-line/10 hover:bg-raised/50",
                    )}
                  >
                    <TokenLogo symbol={s} size={28} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-caption text-fg">{s}</span>
                      <span className="block truncate text-label text-fg-subtle">{comp.name}</span>
                    </span>
                    <span className="font-mono text-caption text-fg-muted tabular">
                      <LivePrice price={r?.price} state={feedState(prices, s)} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Component drill-down */}
          <div key={`${id}-${selected}`} className={cn("mt-5 rounded-card border border-subtle bg-canvas/50 p-5", picked && "animate-swap")}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="flex items-center gap-2.5 text-small font-medium text-fg">
                <TokenLogo symbol={selected} size={26} />
                {c.name} <span className="font-mono text-fg-subtle">· {c.token.symbol}</span>
              </p>
              <p className="font-mono text-ui text-fg tabular">
                <LivePrice price={reading?.price} state={feedState(prices, selected)} />
              </p>
            </div>
            <p className="mt-1.5 text-small text-fg-muted">{c.role}</p>
            <dl className="mt-4 grid gap-3 text-caption sm:grid-cols-2">
              <div>
                <dt className="text-fg-subtle">
                  <Hint text="The index recomputes each weight from market caps, at most once an hour, so it moves with the market. We list what's in each index rather than a snapshot that would go stale.">Target weight</Hint>
                </dt>
                <dd className="mt-0.5 text-fg-muted">Set on-chain by market cap</dd>
              </div>
              <div>
                <dt className="text-fg-subtle">
                  <Hint text="Chainlink posts a new price when it moves past a set threshold or when the feed's heartbeat runs out. In a quiet market an older timestamp is normal, not stale.">Oracle last updated</Hint>
                </dt>
                <dd className="mt-0.5 text-fg-muted tabular">
                  {reading ? `${ago(reading.oracleUpdatedAt)} (by Chainlink)` : "—"}
                </dd>
              </div>
              {[
                { k: "Token on Arbitrum", v: c.token.address },
                { k: `Chainlink ${c.symbol} / USD feed`, v: c.feed },
              ].map((a) => (
                <div key={a.k}>
                  <dt className="text-fg-subtle">{a.k}</dt>
                  <dd className="mt-1 flex items-center gap-2">
                    <a
                      href={`${ARBISCAN}/address/${a.v}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-fg-muted transition-colors hover:text-leaf"
                    >
                      {shortAddress(a.v)}
                      <ExternalIcon size={11} />
                      <span className="sr-only"> view on Arbiscan (opens in a new tab)</span>
                    </a>
                    <CopyButton value={a.v} label="Copy" />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
            {!fixed && <p className="max-w-sm text-caption text-fg-subtle">{idx.forWho}</p>}
            {linkToPages && (
              <Link
                href={`/indices/${idx.id}`}
                className="group/l inline-flex items-center gap-1.5 text-small font-medium text-leaf"
              >
                {idx.name} methodology and details
                <ArrowIcon size={13} className="transition-transform group-hover/l:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
