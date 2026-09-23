"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { cn, shortAddress } from "@/lib/utils";
import { indices, components, type IndexId, type ComponentSymbol } from "@/lib/data/indices";
import { useComponentPrices, formatUsd } from "@/lib/live/prices";
import { ago } from "@/lib/live/useLive";
import { ARBISCAN } from "@/lib/live/rpc";
import { LiveStatus } from "@/components/live/LiveStatus";
import { CopyButton } from "@/components/ui/CopyButton";
import { Hint } from "@/components/ui/Hint";
import { Badge } from "@/components/ui/Badge";
import { ArrowIcon, ExternalIcon } from "@/components/ui/icons";
import { CompositionOrb } from "./CompositionOrb";
import { TokenLogo, TokenStack } from "./TokenLogo";

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
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const choose = (next: IndexId) => {
    setId(next);
    setSel(indices.find((i) => i.id === next)!.components[0]);
  };
  const onKey = (e: KeyboardEvent) => {
    const i = indices.findIndex((x) => x.id === id);
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + indices.length) % indices.length;
    choose(indices[n].id);
    tabs.current[n]?.focus();
  };

  const c = components[selected];
  const reading = prices.data?.[selected];

  return (
    <div ref={root} className="overflow-hidden rounded-3xl border border-line/[0.08] bg-card">
      {/* Selector */}
      <div className="flex flex-col gap-4 border-b border-line/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        {fixed ? (
          <p className="text-small text-fg-muted">
            <span className="font-mono text-fg">{idx.name}</span> · {idx.components.length} components · live oracle prices
          </p>
        ) : (
        <div role="tablist" aria-label="Choose an index" onKeyDown={onKey} className="grid grid-cols-3 gap-1 rounded-2xl bg-canvas/70 p-1 sm:inline-grid">
          {indices.map((x, i) => (
            <button
              key={x.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`${base}-${x.id}`}
              aria-selected={x.id === id}
              aria-controls={`${base}-panel`}
              tabIndex={x.id === id ? 0 : -1}
              onClick={() => choose(x.id)}
              className={cn(
                "relative rounded-xl px-3 py-2.5 text-left transition-[background-color,color,box-shadow] duration-300 sm:px-5",
                x.id === id ? "bg-raised text-fg shadow-[inset_0_0_0_1px_rgb(var(--leaf)/0.35)]" : "text-fg-muted hover:bg-raised/50 hover:text-fg",
              )}
            >
              <span className="block font-mono text-[13px] font-medium tracking-wide">{x.name}</span>
              <span className="mt-1 flex items-center gap-2 text-[11.5px] text-fg-subtle">
                <TokenStack symbols={x.components} size={16} max={5} className="hidden sm:flex" />
                {x.components.length} tokens
              </span>
            </button>
          ))}
        </div>
        )}
        <LiveStatus state={prices.state} updatedAt={prices.updatedAt} source="Chainlink on Arbitrum" onRetry={prices.retry} />
      </div>

      <div
        id={`${base}-panel`}
        role={fixed ? undefined : "tabpanel"}
        aria-labelledby={fixed ? undefined : `${base}-${id}`}
        className="grid lg:grid-cols-12"
      >
        {/* Orb */}
        <div className="relative flex min-w-0 flex-col border-b border-line/[0.07] lg:col-span-5 lg:border-b-0 lg:border-r">
          <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(circle_at_50%_50%,black,transparent_70%)]" />
          <div key={id} className="relative aspect-square w-full animate-enter-fade sm:aspect-[4/3] lg:aspect-auto lg:min-h-[360px] lg:flex-1">
            <CompositionOrb
              nodes={idx.components.map((s) => ({ id: s, label: s, color: components[s].color, logo: components[s].logo }))}
              selected={selected}
              onSelect={(s) => setSel(s as ComponentSymbol)}
              className="absolute inset-0 size-full touch-pan-y"
            />
          </div>
          <p className="relative px-5 pb-5 text-center text-caption text-fg-subtle">
            Move your pointer to tilt · click a token to inspect it. Tokens are drawn the same size: weights aren&apos;t shown.
          </p>
        </div>

        {/* Detail */}
        <div className="flex min-w-0 flex-col p-5 sm:p-7 lg:col-span-7">
          {!fixed && (
          <div key={id} className="animate-enter-up [animation-duration:450ms]">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-mono text-[22px] font-medium tracking-wide text-fg">{idx.name}</h3>
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
                    onClick={() => setSel(s)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors duration-200",
                      on ? "border-leaf/35 bg-raised" : "border-transparent hover:border-line/10 hover:bg-raised/50",
                    )}
                  >
                    <TokenLogo symbol={s} size={28} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[13px] text-fg">{s}</span>
                      <span className="block truncate text-[11.5px] text-fg-subtle">{comp.name}</span>
                    </span>
                    <span className="font-mono text-[12.5px] text-fg-muted tabular">
                      {r ? formatUsd(r.price) : prices.state === "error" ? "—" : <span aria-label="Loading price" className="inline-block h-3 w-14 animate-pulse rounded bg-raised align-middle" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Component drill-down */}
          <div key={`${id}-${selected}`} className="mt-5 animate-enter-fade rounded-2xl border border-line/[0.07] bg-canvas/50 p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="flex items-center gap-2.5 text-small font-medium text-fg">
                <TokenLogo symbol={selected} size={26} />
                {c.name} <span className="font-mono text-fg-subtle">· {c.token.symbol}</span>
              </p>
              <p className="font-mono text-[15px] text-fg tabular">{reading ? formatUsd(reading.price) : "—"}</p>
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
