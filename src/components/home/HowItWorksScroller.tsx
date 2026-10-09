"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { GardenMock } from "./how/GardenMock";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { cn } from "@/lib/utils";

export type ScrollStep = {
  title: string;
  body: string;
  /** One word for the progress bar: Open, Fund, Strategy. */
  tag: string;
  /** What's true on-chain at this step, as a short mono line. */
  chain: string;
  /** A fact pinned beside the Garden while this step is active (xl+). */
  callout: string;
};

type Stage = 0 | 1 | 2;

/** A note pinned beside the mock while its step is active. */
function Callout({ on, className, children }: { on: boolean; className: string; children: ReactNode }) {
  return (
    <p
      className={cn(
        "absolute right-0 hidden w-[180px] rounded-2xl border border-line/10 bg-card px-3.5 py-2.5 text-[11.5px] leading-snug text-fg-muted shadow-[0_16px_40px_-20px_rgb(var(--shadow))] transition-[opacity,transform] duration-slow ease-expo xl:block",
        on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        className,
      )}
    >
      {/* Connector back to the card. */}
      <span aria-hidden className="absolute right-full top-4 w-6 border-t border-dashed border-leaf/50" />
      <span className="mb-1 block size-1.5 rounded-full bg-leaf" />
      {children}
    </p>
  );
}

/**
 * How it works, as a scroll story. The three steps scroll past on the left;
 * on the right a Garden (drawn as the app would show it) stays pinned and
 * changes with them: opened, funded, then following an index that may
 * rebalance but never withdraw. Phones and tablets get that same Garden
 * inline under each step instead. Nothing depends on the effect: before
 * hydration the first step simply shows.
 */
export function HowItWorksScroller({ steps }: { steps: ScrollStep[] }) {
  const [active, setActive] = useState(-1);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      // A thin band across the middle of the viewport.
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // The leaf rail runs down to the active step's marker.
  const fill = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = active >= 0 ? items.current[active] : null;
    if (fill.current) fill.current.style.height = `${el ? el.offsetTop : 0}px`;
  }, [active]);

  const stage = Math.max(active, 0) as Stage;

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      <ol className="relative lg:col-span-5">
        <span aria-hidden className="absolute bottom-16 left-[21px] top-6 w-px bg-line/10" />
        <span
          ref={fill}
          aria-hidden
          className="absolute left-[21px] top-6 h-0 w-px bg-leaf transition-[height] duration-slow ease-expo"
        />
        {steps.map((s, i) => {
          const on = active === i;
          const dim = active >= 0 && !on;
          return (
            <li
              key={s.title}
              data-step={i}
              ref={(el) => {
                items.current[i] = el;
              }}
              aria-current={on ? "step" : undefined}
              className="relative grid grid-cols-[44px_1fr] gap-5 pb-14 lg:min-h-[56vh] lg:pb-16"
            >
              <span
                className={cn(
                  "relative z-10 inline-flex size-11 items-center justify-center rounded-full border font-mono text-[13px] transition-[background-color,color,box-shadow,border-color] duration-base",
                  on
                    ? "border-leaf bg-leaf text-canvas shadow-[0_0_0_7px_rgb(var(--leaf)/0.12)]"
                    : "border-leaf/35 bg-surface text-leaf",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 pt-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
                  Step {i + 1} of {steps.length}
                </p>
                <h3 className={cn("display mt-2 text-h3 transition-colors duration-slow", dim ? "text-fg-muted" : "text-fg")}>{s.title}</h3>
                <p className={cn("mt-3 text-[15.5px] leading-relaxed transition-colors duration-slow", dim ? "text-fg-subtle" : "text-fg-muted")}>
                  {s.body}
                </p>
                <p className="mt-4 inline-flex rounded-full border border-line/12 bg-card/70 px-3 py-1 font-mono text-[11px] text-fg-muted">
                  {s.chain}
                </p>
                {/* Below lg: this step's moment of the Garden, inline. */}
                <GardenMock stage={i as Stage} animate={false} className="mt-7 lg:hidden" />
              </div>
            </li>
          );
        })}
        <li className="pl-16">
          <ArrowLink href="/protocol">The full protocol</ArrowLink>
        </li>
      </ol>

      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-28">
          <div className="relative overflow-hidden rounded-[32px] border border-line/[0.08] bg-canvas/70 px-6 pb-6 pt-6 xl:px-8">
            <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            {/* Progress through the three steps */}
            <div aria-hidden className="relative flex gap-3">
              {steps.map((s, i) => (
                <div key={s.tag} className="flex-1">
                  <div className="h-1 overflow-hidden rounded-full bg-line/10">
                    <div
                      className="h-full origin-left bg-leaf transition-transform duration-slow ease-expo"
                      style={{ transform: `scaleX(${i <= stage ? 1 : 0})` }}
                    />
                  </div>
                  <p
                    className={cn(
                      "mt-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
                      i === stage ? "text-leaf" : "text-fg-subtle",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")} {s.tag}
                  </p>
                </div>
              ))}
            </div>
            <div className="relative mt-8">
              <GardenMock stage={stage} className="xl:ml-0" />
              {steps.map((s, i) => (
                <Callout
                  key={s.tag}
                  on={i === stage}
                  className={["top-[72px]", "top-[46%]", "bottom-[118px]"][i]}
                >
                  {s.callout}
                </Callout>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
