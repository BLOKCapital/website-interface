"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { OpenGardenMachine } from "@/components/iso/OpenGardenMachine";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { LG_QUERY, useMediaQuery } from "@/lib/explainers";
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

/** A note card pinned in the empty corner of the drawing while its step is active. */
function Callout({ on, className, children }: { on: boolean; className: string; children: ReactNode }) {
  return (
    <p
      className={cn(
        "note-card absolute right-0 hidden w-[180px] rotate-1 px-3.5 py-2.5 font-mono text-label leading-snug text-fg transition-[opacity,transform] duration-slow ease-expo xl:block",
        on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * How it works, as a scroll story. The three steps scroll past on the left;
 * on the right a Garden (drawn as the app would show it) stays pinned and
 * changes with them: opened, funded, then following an index that may
 * rebalance but never withdraw. Phones and tablets get one still Garden,
 * full width under the steps, showing where they end up. Only one mock is
 * ever in the page: the server HTML carries the still one, and from lg the
 * pinned one replaces it once hydrated. Nothing depends on the effect.
 */
export function HowItWorksScroller({ steps }: { steps: ScrollStep[] }) {
  const [active, setActive] = useState(-1);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const list = useRef<HTMLOListElement>(null);
  const wide = useMediaQuery(LG_QUERY);

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

  // The leaf rail runs down to the active step's marker: a full-length rail
  // scaled from the top (transform, not height), kept right on resize.
  const fill = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const ol = list.current;
    const f = fill.current;
    if (!ol || !f) return;
    const update = () => {
      const el = active >= 0 ? items.current[active] : null;
      const length = f.offsetHeight;
      f.style.transform = `scaleY(${el && length ? Math.min(1, el.offsetTop / length) : 0})`;
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(ol);
    return () => ro.disconnect();
  }, [active]);

  const stage = Math.max(active, 0) as Stage;

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      <div className="min-w-0 lg:col-span-5">
        <ol ref={list} className="relative">
          <span aria-hidden className="absolute bottom-16 left-[21px] top-6 w-px bg-line/10" />
          <span
            ref={fill}
            aria-hidden
            className="absolute bottom-16 left-[21px] top-6 w-px origin-top scale-y-0 bg-leaf transition-transform duration-slow ease-expo"
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
                    "relative z-raised inline-flex size-11 items-center justify-center rounded-full border font-mono text-caption transition-[background-color,color,box-shadow,border-color] duration-base",
                    on
                      ? "border-leaf bg-leaf text-canvas shadow-[0_0_0_7px_rgb(var(--leaf)/0.12)]"
                      : "border-leaf/35 bg-surface text-leaf",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 pt-1">
                  <p className="label-caps">
                    Step {i + 1} of {steps.length}
                  </p>
                  <h3 className={cn("display mt-2 text-h3 transition-colors duration-slow", dim ? "text-fg-muted" : "text-fg")}>{s.title}</h3>
                  <p className={cn("mt-3 text-ui leading-relaxed transition-colors duration-slow", dim ? "text-fg-subtle" : "text-fg-muted")}>
                    {s.body}
                  </p>
                  <p className="strip mt-4 text-fg-muted">
                    {s.chain}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
        {/* Below lg: one still Garden, full width, where the three steps end up. */}
        {!wide && <OpenGardenMachine stage={2} animate={false} className="mb-12 lg:hidden" />}
        <p className="pl-16">
          <ArrowLink href="/protocol">The full protocol</ArrowLink>
        </p>
      </div>

      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-28">
          <div className="relative overflow-hidden rounded-panel border border-subtle bg-canvas/70 px-6 pb-6 pt-6 xl:px-8 shadow-soft">
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
                      "mt-2 font-mono text-label uppercase tracking-eyebrow transition-colors duration-fast",
                      i === stage ? "text-leaf" : "text-fg-subtle",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")} {s.tag}
                  </p>
                </div>
              ))}
            </div>
            {/* Mounted from lg only, after hydration (the still one serves phones). */}
            {wide && (
              <div className="relative mt-8">
                <OpenGardenMachine stage={stage} />
                {steps.map((s, i) => (
                  // One place for all three: the empty space top right, above the plate's edge, so a note never covers the drawing.
                  <Callout key={s.tag} on={i === stage} className="top-[56px]">
                    {s.callout}
                  </Callout>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
