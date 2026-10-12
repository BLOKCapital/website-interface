"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { dwellMs, useAutoplay } from "@/lib/explainers";
import { AutoplayToggle } from "@/components/explore/AutoplayToggle";
import { cn } from "@/lib/utils";

export type Stage = { label: string; detail: string; where: string };

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const icons: ReactNode[] = [
  // Propose: a document with a pen stroke
  <path key="p" d="M6 3h6l3 3v11H6zM12 3v3h3M8.5 10h4M8.5 13h2.5" {...line} />,
  // Discuss: two speech bubbles
  <path key="d" d="M3.5 5h9v6h-5l-2.5 2v-2H3.5zM12.5 8h4v6h-1.5v2l-2.5-2h-3" {...line} />,
  // Vote: a ballot dropping into a box
  <path key="v" d="M3.5 11h13v5.5h-13zM7 11V4h6v7M8.5 7.5l1.2 1.2L12 6.2" {...line} />,
  // Execute: a play mark in a circle
  <path key="e" d="M10 3.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM8.5 7.5l3.5 2.5-3.5 2.5z" {...line} />,
];

/**
 * How a decision is made: the four stages as a plain ordered list, so the
 * content never depends on motion. On wide screens with a mouse it also
 * plays once as a pipeline (lib/explainers.ts has the rules every explainer
 * shares): a proposal travels the stages, lighting each in turn and ticking
 * the ones it has passed, staying long enough on each to read it, and stops
 * on the last. Pause/Play controls it; pointer over it, focus inside it or
 * scrolling away pauses it; picking a stage jumps there and stops it for
 * the visit. Phones, touch screens and reduced motion get the still list,
 * every stage equal.
 */
export function DecisionPipeline({ stages }: { stages: Stage[] }) {
  const root = useRef<HTMLDivElement>(null);
  const ap = useAutoplay(root, { rootMargin: "-15% 0px -15% 0px" });
  const [active, setActive] = useState(0);
  const last = stages.length - 1;
  const animate = ap.eligible;
  const dwell = useMemo(() => stages.map((s) => dwellMs(s.label, s.detail, s.where)), [stages]);
  const { running, end } = ap;

  // The walk: one stage at a time, stopping on the last.
  useEffect(() => {
    if (!running || active >= last) return;
    const t = setTimeout(() => {
      setActive(active + 1);
      if (active + 1 === last) end();
    }, dwell[active]);
    return () => clearTimeout(t);
  }, [running, active, last, dwell, end]);

  const onToggle = () => {
    // Playing again from the last stage starts from the first.
    if (!ap.on && active === last) setActive(0);
    ap.toggle();
  };

  // From lg the stages are grid columns (gap 1.5rem) with the icon at each
  // column's start, so stage i's icon sits i/n of (100% + gap) along.
  const span = "(100% + 1.5rem)";
  const at = stages.length > 1 ? active / (stages.length - 1) : 0;

  return (
    <div
      ref={root}
      {...ap.rootProps}
      data-loop
      className="theme-dark relative overflow-hidden rounded-[28px] border border-line/[0.08] bg-card p-6 sm:p-8 lg:p-10 lg:pt-20"
    >
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,black,transparent)]" />

      {animate && (
        // Clear of the proposal chip, which rides above the track.
        <AutoplayToggle on={ap.on} ended={ap.ended} onClick={onToggle} what="the pipeline" className="absolute right-6 top-5 z-raised" />
      )}

      <ol className="relative grid gap-6 lg:grid-cols-4 lg:gap-6">
        {/* Phones: a still line down through the stage icons. */}
        <span aria-hidden className="absolute bottom-6 left-[22px] top-6 w-px bg-line/12 lg:hidden" />
        {/* Wide screens: the track and the proposal travelling it. */}
        {animate && (
          <>
            <span aria-hidden className="absolute left-[22px] right-[22px] top-[22px] hidden h-px bg-line/12 lg:block" />
            <span
              aria-hidden
              className="absolute left-[22px] top-[22px] hidden h-px origin-left bg-leaf transition-transform duration-slow ease-expo lg:block"
              // From the first icon to the last; filled up to the active one.
              style={{ width: `calc(${span} * ${last / stages.length})`, transform: `scaleX(${at})` }}
            />
            {/* Rides just above the track, so it never covers a stage's icon. The
                rail is one column-step × n wide, so translating it by i/n of
                its own width puts the chip over stage i (transform, not `left`). */}
            <span
              aria-hidden
              className="absolute left-[22px] -top-7 z-raised hidden transition-transform duration-slow ease-expo lg:block"
              style={{ width: `calc${span}`, transform: `translateX(${(active / stages.length) * 100}%)` }}
            >
              <span className="absolute left-0 top-0 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-leaf/50 bg-canvas px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-leaf shadow-[0_0_0_4px_rgb(var(--leaf)/0.12)]">
                {/* Pulses twice as it arrives at each stage, then rests. */}
                <span key={active} className="size-1.5 animate-pulse rounded-full bg-leaf" style={{ animationIterationCount: 2 }} /> Proposal
              </span>
            </span>
          </>
        )}

        {stages.map((s, i) => {
          const on = animate && i === active;
          const passed = animate && i < active;
          // A stage is a button only while the pipeline plays; still, it's a plain list item.
          const El = animate ? "button" : "div";
          return (
            <li key={s.label} aria-current={on ? "step" : undefined} className="relative">
              <El
                {...(animate && {
                  type: "button" as const,
                  onClick: () => {
                    ap.stop();
                    setActive(i);
                  },
                })}
                className="group/s grid w-full grid-cols-[44px_1fr] gap-4 text-left lg:block"
              >
                <span
                  className={cn(
                    "relative z-[1] grid size-11 place-items-center rounded-2xl border transition-[background-color,border-color,color,box-shadow] duration-base",
                    on
                      ? "border-leaf bg-leaf text-canvas shadow-[0_0_0_6px_rgb(var(--leaf)/0.14)]"
                      : passed
                        ? "border-leaf/50 bg-raised text-leaf"
                        : "border-line/12 bg-raised text-fg-muted group-hover/s:text-fg",
                  )}
                >
                  {passed ? (
                    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden>
                      <path d="m5 10.5 3.2 3.2L15 6.8" {...line} />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
                      {icons[i % icons.length]}
                    </svg>
                  )}
                </span>
                <span className="block min-w-0 lg:mt-6">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                    <span className={cn("text-[17px] font-medium transition-colors duration-base", on || !animate ? "text-fg" : "text-fg-muted")}>
                      {s.label}
                    </span>
                  </span>
                  <span className={cn("mt-2 block text-small transition-colors duration-base", on || !animate ? "text-fg-muted" : "text-fg-subtle")}>
                    {s.detail}
                  </span>
                  <span
                    className={cn(
                      "mt-3 inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors duration-base",
                      on ? "border-leaf/40 text-leaf" : "border-line/12 text-fg-subtle",
                    )}
                  >
                    {s.where}
                  </span>
                </span>
              </El>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
