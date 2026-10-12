"use client";

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";
import { dwellMs, LG_QUERY, trackSelect, useAutoplay } from "@/lib/explainers";
import { useRovingTabs } from "@/lib/useRovingTabs";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { AutoplayToggle } from "./AutoplayToggle";
import { LayerStack, stackGeometry } from "./LayerStack";

export type ExploreStep = {
  id: string;
  label: string;
  /** One line: what this layer is. */
  title: string;
  body: string;
  /** What actually happens on-chain at this layer. */
  behind: string;
  facts?: { k: string; v: string }[];
  link?: { label: string; href: string };
  /** Optional live or visual element for this layer. */
  extra?: ReactNode;
};

const two = (n: number) => String(n).padStart(2, "0");

/**
 * "Explore the protocol": the layers from your signature down to the DAO.
 * On wide screens the isometric stack is the map: each plate has its tab
 * beside it on a leader line, the stack opens at the layer you pick, and a
 * signal runs down to it. On phones the same tabs become a swipeable strip.
 * Either way it's one proper tablist (arrow keys, Home/End).
 *
 * On wide screens with a mouse it walks itself through the layers once,
 * stopping on the last (lib/explainers.ts has the rules every explainer
 * shares). Each layer stays up long enough to read it. The active segment
 * of the progress bar is the timer: a CSS animation whose end advances the
 * layer, so pausing it (pointer over the explorer, focus inside, off-screen,
 * or the Pause button) simply freezes the bar. Picking a layer, Prev/Next or
 * a swipe on the strip stops the walk for the visit; "Resume" restarts it.
 * Phones, touch screens and reduced motion get no autoplay.
 */
export function ProtocolExplorer({ steps }: { steps: ExploreStep[] }) {
  const [active, setActive] = useState(0);
  // Crossfade the panel only on a change, never on page load.
  const [moved, setMoved] = useState(false);
  const base = useId();
  const tabs = useRef<(HTMLElement | null)[]>([]);
  const strip = useRef<HTMLDivElement>(null);
  const s = steps[active];
  const g = stackGeometry(steps.length);

  const root = useRef<HTMLDivElement>(null);
  const ap = useAutoplay(root, { rootMargin: "-20% 0px -20% 0px" });
  const last = steps.length - 1;
  // Time to read each layer: everything its panel says.
  const dwell = useMemo(
    () => steps.map((st) => dwellMs(st.title, st.body, st.behind, ...(st.facts ?? []).flatMap((f) => [f.k, f.v]))),
    [steps],
  );

  /** The visitor picked a layer (tab, plate, Prev/Next): go there, and stop the walk. */
  const pick = (i: number) => {
    const next = (i + steps.length) % steps.length;
    trackSelect("protocol_layer", steps[next].id);
    ap.stop();
    setMoved(true);
    setActive(next);
  };
  /** The walk's own step; it stops on the last layer. */
  const advance = () => {
    const next = Math.min(active + 1, last);
    setMoved(true);
    setActive(next);
    if (next === last) ap.end();
  };
  const onToggle = () => {
    // Resuming from the last layer starts the walk again from the top.
    if (!ap.on && active === last) {
      setMoved(true);
      setActive(0);
    }
    ap.toggle();
  };

  // A row of tabs on phones, a column beside the stack from lg.
  const rt = useRovingTabs({ count: steps.length, selected: active, onSelect: pick, verticalFrom: LG_QUERY, refs: tabs });

  // Keep the active tab in view in the phone strip (horizontal scroll only).
  useEffect(() => {
    const el = tabs.current[active];
    const st = strip.current;
    if (!el || !st || st.scrollWidth <= st.clientWidth) return;
    st.scrollTo({ left: el.offsetLeft - 20, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [active]);

  return (
    <div
      ref={root}
      {...ap.rootProps}
      className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-10"
    >
      {/* The map */}
      <div className="relative min-w-0 lg:col-span-5">
        {/* A size container from lg, so the tabs can follow their plates in cqh. */}
        <div className="relative lg:[aspect-ratio:var(--ar)] lg:[container-type:size]" style={{ "--ar": `${g.width} / ${g.height}` } as CSSProperties}>
          <LayerStack count={steps.length} active={active} onSelect={pick} className="absolute inset-0 hidden size-full lg:block" />
          <div
            ref={strip}
            {...rt.tablist}
            aria-label="Protocol layers"
            // A swipe along the strip is the visitor taking over, too.
            onTouchStart={ap.stop}
            onWheel={(e) => Math.abs(e.deltaX) > Math.abs(e.deltaY) && ap.stop()}
            // focus-inset: the phone strip scrolls, and would clip an outside ring.
            className="focus-inset relative -mx-5 flex gap-2 overflow-x-auto px-5 py-1.5 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:absolute lg:inset-0 lg:mx-0 lg:block lg:overflow-visible lg:p-0"
          >
            {steps.map((st, i) => {
              const on = i === active;
              return (
                <button
                  key={st.id}
                  {...rt.tab(i)}
                  type="button"
                  id={`${base}-tab-${st.id}`}
                  aria-controls={`${base}-panel`}
                  onClick={() => pick(i)}
                  style={
                    {
                      "--x": `${(g.labelX / g.width) * 100}%`,
                      // Where the plate sits at rest, and how far it has lifted (globals.css .ptab).
                      "--y": `${(g.centreY(i, active) / g.height) * 100}%`,
                      "--y0": `${(g.centreY(i, 0) / g.height) * 100}%`,
                      "--lift": `calc(${((g.centreY(i, active) - g.centreY(i, 0)) / g.height) * 100} * 1cqh)`,
                    } as CSSProperties
                  }
                  className={cn(
                    // The selected look changes at --dur-fast; the label travels with its plate.
                    "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-left [transition:color_var(--dur-fast)_var(--ease-out),background-color_var(--dur-fast)_var(--ease-out),border-color_var(--dur-fast)_var(--ease-out),translate_var(--dur-slow)_var(--ease-expo)]",
                    "ptab lg:absolute lg:left-[var(--x)] lg:-translate-y-1/2 lg:py-1.5",
                    on ? "border-leaf/40 bg-card text-fg shadow-[0_10px_30px_-18px_rgb(var(--shadow))]" : "border-line/10 bg-card/60 text-fg-muted hover:border-line/25 hover:text-fg lg:border-transparent lg:bg-transparent",
                  )}
                >
                  <span className={cn("font-mono text-[11px] tabular", on ? "text-leaf" : "text-fg-subtle")}>{two(i + 1)}</span>
                  <span className="whitespace-nowrap text-small font-medium">{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* The layer */}
      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${s.id}`}
        tabIndex={0}
        className="relative min-w-0 overflow-hidden rounded-3xl border border-line/[0.08] bg-card lg:col-span-7"
      >
        <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_80%_70%_at_85%_0%,black,transparent)]" />

        {/* Where you are, top to bottom */}
        {/* min-h holds the row's height for the toggle, which only appears after hydration. */}
        <div className="relative flex min-h-16 items-center gap-4 border-b border-line/[0.07] px-6 py-4 sm:px-8">
          <p className="shrink-0 font-mono text-[11.5px] uppercase tracking-[0.14em] text-fg-subtle">
            Layer <span className="text-leaf">{two(active + 1)}</span> / {two(steps.length)}
          </p>
          <div aria-hidden className="flex flex-1 gap-1.5">
            {steps.map((st, i) => (
              <span key={st.id} className="h-1 flex-1 overflow-hidden rounded-full bg-line/10">
                {i === active && ap.on && i < last ? (
                  // The timer: when this fill completes, the next layer comes up.
                  <span
                    key={`timer-${active}`}
                    className="block h-full origin-left animate-progress bg-leaf"
                    style={{ animationDuration: `${dwell[active]}ms`, animationPlayState: ap.running ? "running" : "paused" }}
                    onAnimationEnd={advance}
                  />
                ) : (
                  <span
                    className="block h-full origin-left bg-leaf transition-transform duration-slow ease-expo"
                    style={{ transform: `scaleX(${i <= active ? 1 : 0})`, opacity: i === active ? 1 : 0.45 }}
                  />
                )}
              </span>
            ))}
          </div>
          {ap.eligible && <AutoplayToggle on={ap.on} ended={ap.ended} onClick={onToggle} what="the walkthrough" />}
        </div>

        {/* Every layer is laid out in the same grid cell, so the panel is as
            tall as its tallest layer at every width and never changes height
            as the layers change; only the active one is visible (and the
            others are inert). */}
        <div className="grid">
          {steps.map((st, i) => {
            const on = i === active;
            return (
              <div
                key={st.id}
                inert={!on}
                // A plain crossfade on change: no rise, no per-fact stagger.
                className={cn("relative col-start-1 row-start-1 p-6 sm:p-8", !on ? "invisible" : moved && "animate-swap")}
              >
                <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-leaf">{st.label}</p>
                <h3 className="display mt-2 text-h3 text-fg">{st.title}</h3>
                <p className="mt-4 max-w-2xl text-body text-fg-muted">{st.body}</p>

                <div className="relative mt-6 overflow-hidden rounded-2xl border border-line/[0.07] bg-canvas/60 p-5 pl-6">
                  <span aria-hidden className="absolute inset-y-4 left-0 w-0.5 rounded-full bg-leaf/60" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">On-chain, behind the scenes</p>
                  <p className="mt-2 text-small text-fg-muted">{st.behind}</p>
                </div>

                {st.facts && st.facts.length > 0 && (
                  <dl className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-line/[0.07] bg-line/[0.07] sm:grid-cols-3">
                    {st.facts.map((f) => (
                      <div key={f.k} className="bg-card px-4 py-3.5">
                        <dt className="text-caption text-fg-subtle">{f.k}</dt>
                        <dd className="mt-1 font-mono text-[13px] text-fg">{f.v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {st.extra && <div className="mt-5">{st.extra}</div>}
              </div>
            );
          })}
        </div>

        <div className="relative flex flex-wrap items-center justify-between gap-4 border-t border-line/[0.07] px-6 py-4 sm:px-8">
          {/* Every layer's link in one cell too, so the row wraps the same way for all of them. */}
          <span className="grid">
            {steps.map((st, i) =>
              st.link ? (
                <span key={st.id} inert={i !== active} className={cn("col-start-1 row-start-1", i !== active && "invisible")}>
                  <ArrowLink href={st.link.href}>{st.link.label}</ArrowLink>
                </span>
              ) : null,
            )}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => pick(active - 1)}
              className="rounded-full border border-line/12 px-3.5 py-1.5 text-caption text-fg-muted transition-colors duration-fast hover:border-line/30 hover:text-fg"
            >
              <span aria-hidden>←</span> Previous
            </button>
            <button
              type="button"
              onClick={() => pick(active + 1)}
              className="rounded-full border border-leaf/30 bg-leaf/10 px-3.5 py-1.5 text-caption text-leaf transition-colors duration-fast hover:bg-leaf/20"
            >
              {/* Sized for its longest label, so the button never changes width. */}
              <span className="inline-grid">
                {steps.map((st, i) => (
                  <span key={st.id} className={cn("col-start-1 row-start-1", i !== active && "invisible")}>
                    {i === last ? "Start over" : `Next: ${steps[i + 1].label}`}
                  </span>
                ))}
              </span>{" "}
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
