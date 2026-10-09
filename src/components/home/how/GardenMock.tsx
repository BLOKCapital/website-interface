"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { easeOut, prefersReducedMotion } from "@/lib/motion";
import { indices } from "@/lib/data/indices";
import { TokenLogo } from "@/components/indices/TokenLogo";
import { CheckIcon, CrossIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/** Illustrative figures for the mock; the caption says they're examples. */
const DEPOSIT = 1000;
const ADDRESS = "0x7a3c…f1c2";
const FOLLOWING = indices.find((i) => i.id === "blokc5")!;

const usdc = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Runs a number from its previous value to `target` (instantly when not animating). */
function useTween(target: number, animate: boolean, duration = 1200) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = from.current;
    let raf = 0;
    if (!animate || start === target || prefersReducedMotion()) {
      raf = requestAnimationFrame(() => {
        from.current = target;
        setValue(target);
      });
      return () => cancelAnimationFrame(raf);
    }
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / duration);
      const v = start + (target - start) * easeOut(k);
      from.current = v;
      setValue(v);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, animate, duration]);
  return value;
}

/** A block that unfolds (height via grid rows, plus a fade) once `on`. */
function Fold({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-slow ease-expo",
        on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

const label = "font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle";

/**
 * The Garden app, drawn as the product would show it, at one of three
 * moments: 0 opened (a wallet at your address, signed in with Google),
 * 1 funded (a deposit lands in it), 2 following a strategy (an index is
 * attached, and may rebalance but never withdraw). Decorative: the steps
 * beside it say the same in words, so it's aria-hidden.
 */
export function GardenMock({
  stage,
  animate = true,
  className,
}: {
  stage: 0 | 1 | 2;
  /** Tween the balance between stages (the sticky desktop stage does). */
  animate?: boolean;
  className?: string;
}) {
  const balance = useTween(stage >= 1 ? DEPOSIT : 0, animate);

  return (
    <div aria-hidden className={cn("relative mx-auto w-full max-w-[380px]", className)}>
      <div className="relative overflow-hidden rounded-[28px] border border-line/10 bg-card p-5 shadow-[0_30px_70px_-34px_rgb(var(--shadow))] sm:p-6">
        <div aria-hidden className="glow-leaf pointer-events-none absolute -right-24 -top-24 size-64 opacity-70" />

        {/* Account */}
        <div className="relative flex items-center gap-3">
          <Image src="/brand/mark.png" alt="" width={40} height={40} unoptimized className="size-10 rounded-xl" />
          <div className="min-w-0 flex-1">
            <p className="text-small font-medium text-fg">My Garden</p>
            <p className="font-mono text-[11.5px] text-fg-subtle">{ADDRESS}</p>
          </div>
          <span className="rounded-full border border-line/12 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-muted">
            ERC-4337
          </span>
        </div>

        <div className="relative mt-4 flex items-center gap-2.5 rounded-xl bg-raised px-3 py-2 text-caption text-fg-muted">
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-leaf/15 text-leaf">
            <CheckIcon size={11} />
          </span>
          Signed in with Google · no seed phrase
        </div>

        {/* Balance */}
        <div className="relative mt-6">
          <p className={label}>{stage >= 2 ? `Following ${FOLLOWING.name}` : "Balance"}</p>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="display text-[40px] leading-none text-fg tabular">
              {stage >= 2 ? "$" : ""}
              {usdc(balance)}
            </span>
            {stage < 2 && <span className="text-small text-fg-subtle">USDC</span>}
          </p>
        </div>

        {/* Funded */}
        <Fold on={stage >= 1}>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-leaf/25 bg-leaf/[0.06] px-3 py-2.5">
            {/* The on-ramp's logo; dropped on narrow phones to give the text room. */}
            <span className="hidden h-8 w-14 shrink-0 place-items-center rounded-lg bg-white px-1.5 min-[400px]:grid">
              <Image src="/Socialtrust/transak-logo.svg" alt="" width={56} height={18} unoptimized className="h-auto w-full" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block whitespace-nowrap text-caption text-fg">Deposit by card</span>
              <span className="block text-[11px] text-fg-subtle">Lands at your address, not a pool</span>
            </span>
            <span className="font-mono text-caption text-leaf tabular">+{usdc(DEPOSIT)}</span>
          </div>
        </Fold>

        {/* Strategy */}
        <Fold on={stage >= 2}>
          <div className="mt-4">
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-raised p-1 font-mono text-[11px]">
              {indices.map((x) => (
                <span
                  key={x.id}
                  className={cn(
                    "rounded-lg py-1.5 text-center transition-colors",
                    x.id === FOLLOWING.id ? "bg-card text-fg ring-1 ring-leaf/35" : "text-fg-subtle",
                  )}
                >
                  {x.name}
                </span>
              ))}
            </div>
            <div key={stage >= 2 ? "on" : "off"} className="mt-3 flex items-center justify-between gap-3">
              <span className="flex">
                {FOLLOWING.components.map((s, i) => (
                  <span
                    key={s}
                    className={cn("animate-enter-up", i > 0 && "-ml-1.5")}
                    style={{ animationDelay: `${200 + i * 70}ms` } as CSSProperties}
                  >
                    <TokenLogo symbol={s} size={26} className="ring-2 ring-card" />
                  </span>
                ))}
              </span>
              <span className="text-right text-[11px] leading-tight text-fg-subtle">
                Weights set on-chain
                <br />
                by market cap
              </span>
            </div>
            <div className="mt-4 space-y-2 border-t border-line/[0.07] pt-3 text-caption">
              <p className="flex items-center justify-between gap-3">
                <span className="text-fg-muted">Strategy can rebalance</span>
                <span className="inline-flex items-center gap-1 font-medium text-leaf">
                  <CheckIcon size={12} /> Allowed
                </span>
              </p>
              <p className="flex items-center justify-between gap-3">
                <span className="text-fg-muted">Strategy can move funds out</span>
                <span className="inline-flex items-center gap-1 font-medium text-negative">
                  <CrossIcon size={12} /> Never
                </span>
              </p>
            </div>
          </div>
        </Fold>
      </div>
      <p className="mt-3 text-center text-[11px] text-fg-subtle">Illustration · example address and amounts</p>
    </div>
  );
}
