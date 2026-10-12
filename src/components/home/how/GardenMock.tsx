"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { easeOut, useMotionAllowed } from "@/lib/motion";
import { indices } from "@/lib/data/indices";
import { TokenLogo } from "@/components/indices/TokenLogo";
import { CheckIcon, CrossIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/** Illustrative figures for the mock; the caption says they're examples. */
const DEPOSIT = 1000;
const ADDRESS = "0x7a3c…f1c2";
const FOLLOWING = indices.find((i) => i.id === "blokc5")!;

const usdc = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Runs a number from its previous value to `target`; instantly when not
 * animating or with motion off (reduced motion or Pause motion, live).
 */
function useTween(target: number, animate: boolean, duration = 1200) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  const motion = useMotionAllowed();
  useEffect(() => {
    const start = from.current;
    let raf = 0;
    if (!animate || !motion || start === target) {
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
  }, [target, animate, motion, duration]);
  return value;
}

/**
 * A block that's always laid out, so the card keeps its full height at
 * every stage and nothing around it moves; it fades and rises in once `on`
 * (opacity and transform only).
 */
function Fold({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <div className={cn("transition-[opacity,transform] duration-slow ease-expo", on ? "opacity-100" : "translate-y-2 opacity-0")}>
      {children}
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
          <Image src="/brand/mark-96.webp" alt="" width={40} height={40} unoptimized className="size-10 rounded-xl" />
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
          {/* Sized for the widest figure, with the unit always laid out, so the
              row never reflows as the balance counts up or the stage changes. */}
          <p className="mt-2 flex items-baseline gap-2">
            <span className="display inline-grid text-[40px] leading-none text-fg tabular">
              <span className="invisible col-start-1 row-start-1">${usdc(DEPOSIT)}</span>
              <span className="col-start-1 row-start-1">
                {stage >= 2 ? "$" : ""}
                {usdc(balance)}
              </span>
            </span>
            <span className={cn("text-small text-fg-subtle", stage >= 2 && "invisible")}>USDC</span>
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
            {/* A plain label, not a control: nothing here is tappable. */}
            <p className="flex items-center justify-between gap-3 rounded-xl bg-raised px-3 py-2 text-caption">
              <span className="text-fg-muted">Strategy</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-fg">
                <span className="size-1.5 rounded-full bg-leaf" />
                {FOLLOWING.name} index
              </span>
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="flex">
                {FOLLOWING.components.map((s, i) => (
                  <span key={s} className={cn(i > 0 && "-ml-1.5")}>
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
