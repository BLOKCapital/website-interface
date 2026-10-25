"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AutoplayToggle } from "@/components/explore/AutoplayToggle";
import { OpenGardenMachine } from "@/components/iso/OpenGardenMachine";
import { useFigureLoop } from "@/components/iso/useFigureLoop";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { LG_QUERY, useMediaQuery } from "@/lib/explainers";
import { useIsClient } from "@/lib/hooks";
import { useRovingTabs } from "@/lib/useRovingTabs";
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

/** How long each step stays up in the small-screen loop: its motion, then a read of the note. */
const LOOP_DWELL = () => 5500;

/**
 * Below lg, where there's no room to pin the Garden beside the steps: the
 * Garden plays Open, Fund, Strategy on a loop (useFigureLoop: never with
 * reduced motion or Pause motion, off screen or in a hidden tab), with the
 * step tabs, a Pause button (WCAG 2.2.2) and the step's note under it.
 * Server HTML, reduced motion and Pause motion show the last step's still
 * frame until a tab is picked.
 */
function GardenLoop({ steps, className }: { steps: ScrollStep[]; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const root = useRef<HTMLDivElement>(null);
  const client = useIsClient();
  const loop = useFigureLoop(root, steps.length, LOOP_DWELL);
  const [picked, setPicked] = useState(false);
  const moving = client && loop.canPlay;
  const stage = (moving || picked ? loop.step : 2) as Stage;
  const pick = (i: number) => {
    setPicked(true);
    loop.go(i);
  };
  const rt = useRovingTabs({ count: steps.length, selected: stage, onSelect: pick });

  return (
    <div ref={root} className={cn("relative overflow-hidden rounded-panel border border-subtle bg-canvas/70 shadow-soft", className)}>
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      {/* The steps as the desktop panel's progress bar, here also the tabs. */}
      <div {...rt.tablist} aria-label="Steps" className="relative grid grid-cols-3 gap-2 px-4 pt-3 sm:gap-3 sm:px-6">
        {steps.map((s, i) => (
          <button
            key={s.tag}
            {...rt.tab(i)}
            id={`${uid}-tab-${i}`}
            aria-controls={`${uid}-panel`}
            onClick={() => pick(i)}
            className="group/t min-w-0 py-2 text-left"
          >
            <span className="block h-1 overflow-hidden rounded-full bg-line/10">
              <span
                className="block h-full origin-left bg-leaf transition-transform duration-slow ease-expo"
                style={{ transform: `scaleX(${i <= stage ? 1 : 0})` }}
              />
            </span>
            <span
              className={cn(
                "mt-2 block truncate font-mono text-label uppercase tracking-eyebrow transition-colors duration-fast",
                i === stage ? "text-leaf" : "text-fg-muted can-hover:group-hover/t:text-fg",
              )}
            >
              {String(i + 1).padStart(2, "0")} {s.tag}
            </span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${stage}`} className="relative px-2 pb-4 pt-2 sm:px-8">
        <OpenGardenMachine stage={stage} animate={moving} steadyCaption />
      </div>
      <div className="relative flex items-start gap-4 border-t border-subtle px-4 py-3.5 sm:items-center sm:px-6">
        {/* Room for the longest note, so the card keeps one height as it loops. */}
        <p className="grid min-w-0 flex-1 text-small leading-snug text-fg">
          {steps.map((s, i) => (
            <span key={s.tag} aria-hidden className={cn("col-start-1 row-start-1", i !== stage && "invisible")}>
              {s.callout}
            </span>
          ))}
          <span aria-live="polite" className="sr-only">
            {steps[stage].callout}
          </span>
        </p>
        {moving && <AutoplayToggle on={loop.playing} ended={false} onClick={loop.toggle} what="the illustration" />}
      </div>
    </div>
  );
}

/**
 * How it works, as a scroll story. The three steps scroll past on the left;
 * on the right a Garden (drawn as the app would show it) stays pinned and
 * changes with them: opened, funded, then following an index that may
 * rebalance but never withdraw. Phones and tablets get the same Garden full
 * width under the steps, looping through them on its own (GardenLoop). Only
 * one mock is ever in the page: the server HTML carries the looping one's
 * still frame, and from lg the pinned one replaces it once hydrated.
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
        {/* Below lg: the same Garden, playing the three steps on a loop. */}
        {!wide && <GardenLoop steps={steps} className="mb-12 lg:hidden" />}
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
