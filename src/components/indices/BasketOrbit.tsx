"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { indices, components, type IndexDef, type ComponentSymbol } from "@/lib/data/indices";
import { cn } from "@/lib/utils";

const SIZE = 400;
const C = SIZE / 2;
const pct = (v: number) => `${(v / SIZE) * 100}%`;

type Slot = { s: ComponentSymbol; x: number; y: number; ring: "inner" | "outer" };

/**
 * Where each token sits. Tokens go on evenly spaced rings, so they never
 * overlap. When a smaller index sits entirely inside this one (BLOKC5 inside
 * BLOKC10), its tokens form the inner ring and the rest the outer ring, offset
 * half a step so the two interleave.
 */
function layout(index: IndexDef) {
  const subset = indices.find(
    (o) => o.id !== index.id && o.components.length < index.components.length && o.components.every((s) => index.components.includes(s)),
  );
  const inner = subset ? subset.components : index.components;
  const outer = subset ? index.components.filter((s) => !subset.components.includes(s)) : [];
  const rInner = outer.length ? 104 : index.components.length <= 2 ? 118 : 128;
  const rOuter = 162;
  const place = (list: ComponentSymbol[], r: number, offset: number, ring: Slot["ring"]): Slot[] =>
    list.map((s, i) => {
      const a = -Math.PI / 2 + ((i + offset) / list.length) * Math.PI * 2 + (list.length === 2 ? Math.PI / 2 : 0);
      return { s, x: C + Math.cos(a) * r, y: C + Math.sin(a) * r, ring };
    });
  return {
    subset,
    rings: outer.length ? [rInner, rOuter] : [rInner],
    slots: [...place(inner, rInner, 0, "inner"), ...place(outer, rOuter, 0.5, "outer")],
  };
}

/**
 * An index drawn as its basket: the index at the core, each component on a
 * ring around it, all drawn the same size (weights are set on-chain by market
 * cap and aren't published yet, so none are implied). The selected token's
 * spoke carries a flowing signal into the core. The rings turn slowly and
 * stop while the pointer is over them; logos stay upright. Clicking a token
 * selects it, a mouse shortcut for the labelled list beside it, so the
 * drawing is aria-hidden. Still under reduced motion.
 */
export function BasketOrbit({
  index,
  selected,
  onSelect,
  className,
}: {
  index: IndexDef;
  selected: ComponentSymbol | null;
  onSelect?: (s: ComponentSymbol) => void;
  className?: string;
}) {
  const { subset, rings, slots } = layout(index);

  return (
    <div aria-hidden className={cn("w-full", className)}>
      <div className="orbit relative aspect-square w-full">
        {/* Core glow, outside the turning layer */}
        <div className="glow-leaf absolute inset-[22%] rounded-full opacity-90" />

        <div key={index.id} className="orbit-spin absolute inset-0">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 size-full" fill="none">
            {rings.map((r, i) => (
              <circle key={r} cx={C} cy={C} r={r} stroke={`rgb(var(--line) / ${i ? 0.1 : 0.16})`} strokeDasharray={i ? "2 6" : "3 5"} />
            ))}
            {slots.map((t) => (
              <line key={t.s} x1={t.x} y1={t.y} x2={C} y2={C} stroke="rgb(var(--line) / 0.08)" />
            ))}
            {slots
              .filter((t) => t.s === selected)
              .map((t) => (
                // Drawn from the token to the core, so the dashes flow inward.
                <line
                  key={`sel-${t.s}`}
                  x1={t.x}
                  y1={t.y}
                  x2={C}
                  y2={C}
                  stroke="rgb(var(--leaf))"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  strokeLinecap="round"
                  className="animate-flow"
                />
              ))}
          </svg>

          {slots.map((t, i) => {
            const on = t.s === selected;
            return (
              <button
                key={t.s}
                type="button"
                tabIndex={-1}
                onClick={onSelect ? () => onSelect(t.s) : undefined}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2",
                  t.ring === "inner" ? "w-[12%]" : "w-[10.5%]",
                )}
                style={{ left: pct(t.x), top: pct(t.y) }}
              >
                <span className="orbit-counter block">
                  <span
                    className="block animate-enter-fade [animation-duration:500ms]"
                    style={{ animationDelay: `${80 + i * 45}ms` } as CSSProperties}
                  >
                    <span
                      className={cn(
                        "relative block aspect-square w-full overflow-hidden rounded-full bg-white outline outline-1 -outline-offset-1 outline-line/[0.14] transition-[transform,box-shadow] duration-base ease-expo hover:scale-110",
                        on
                          ? "scale-110 shadow-[0_0_0_3px_rgb(var(--card)),0_0_0_5px_rgb(var(--leaf)),0_10px_30px_-8px_rgb(var(--leaf)/0.6)]"
                          : "shadow-[0_0_0_3px_rgb(var(--card)),0_8px_20px_-10px_rgb(0_0_0/0.6)]",
                      )}
                    >
                      <Image src={components[t.s].logo} alt="" fill sizes="48px" unoptimized className="object-cover" />
                    </span>
                    <span
                      className={cn(
                        "absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-card/85 px-1 font-mono text-[11px] tracking-wide transition-colors",
                        on ? "text-leaf" : "text-fg-subtle",
                      )}
                    >
                      {t.s}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* The index itself */}
        <div className="absolute left-1/2 top-1/2 flex aspect-square w-[27%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-leaf/35 bg-raised/90 text-center shadow-[0_0_0_8px_rgb(var(--leaf)/0.06)] backdrop-blur-sm">
          <span key={index.id} className="animate-enter-fade">
            <span className="block font-mono text-[clamp(12px,1.4vw,16px)] font-medium tracking-wide text-fg">{index.name}</span>
            <span className="mt-0.5 block text-[11px] text-fg-subtle">{index.components.length} tokens</span>
          </span>
        </div>

      </div>
      {subset && (
        <p className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-fg-subtle">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full border border-line/40" /> Inner ring: all of {subset.name}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full border border-dashed border-line/40" /> Outer: {index.components.length - subset.components.length} more
          </span>
        </p>
      )}
    </div>
  );
}
