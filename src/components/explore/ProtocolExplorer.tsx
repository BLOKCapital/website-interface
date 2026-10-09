"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion, useInView, useReducedMotion } from "@/lib/motion";
import { useIsClient } from "@/lib/hooks";
import { ArrowLink } from "@/components/ui/ArrowLink";
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

/** How long each layer stays up while autoplaying. */
const DWELL_MS = 6500;

/**
 * "Explore the protocol": the layers from your signature down to the DAO.
 * On wide screens the isometric stack is the map: each plate has its tab
 * beside it on a leader line, the stack opens at the layer you pick, and a
 * signal runs down to it. On phones the same tabs become a swipeable strip.
 * Either way it's one proper tablist (arrow keys, Home/End).
 *
 * It walks itself through the layers on a loop. The active segment of the
 * progress bar is the timer: a CSS animation whose end advances the layer, so
 * pausing it (pointer over the explorer, keyboard focus inside, off-screen,
 * or the pause button) simply freezes the bar. Picking a layer jumps there
 * and the walk carries on from it. No autoplay under reduced motion.
 */
export function ProtocolExplorer({ steps }: { steps: ExploreStep[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const strip = useRef<HTMLDivElement>(null);
  const s = steps[active];
  const g = stackGeometry(steps.length);

  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { rootMargin: "-20% 0px -20% 0px" });
  const client = useIsClient();
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const auto = client && !reduce && playing;
  const running = auto && inView && !hovered && !focused;

  const go = (i: number) => setActive((i + steps.length) % steps.length);

  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: steps.length - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key] + steps.length) % steps.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

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
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      // Keyboard focus pauses the walk; a mouse click (no focus ring) doesn't.
      onFocus={(e) => (e.target as HTMLElement).matches(":focus-visible") && setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-10"
    >
      {/* The map */}
      <div className="relative min-w-0 lg:col-span-5">
        <div className="relative lg:[aspect-ratio:var(--ar)]" style={{ "--ar": `${g.width} / ${g.height}` } as CSSProperties}>
          <LayerStack count={steps.length} active={active} onSelect={go} className="absolute inset-0 hidden size-full lg:block" />
          <div
            ref={strip}
            role="tablist"
            aria-label="Protocol layers"
            aria-orientation="vertical"
            onKeyDown={onKey}
            className="relative -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:absolute lg:inset-0 lg:mx-0 lg:block lg:overflow-visible lg:p-0"
          >
            {steps.map((st, i) => {
              const on = i === active;
              return (
                <button
                  key={st.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${base}-tab-${st.id}`}
                  aria-selected={on}
                  aria-controls={`${base}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  style={
                    {
                      "--x": `${(g.labelX / g.width) * 100}%`,
                      "--y": `${(g.centreY(i, active) / g.height) * 100}%`,
                    } as CSSProperties
                  }
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-left transition-[background-color,border-color,color,top] duration-slow ease-expo",
                    "lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] lg:-translate-y-1/2 lg:py-1.5",
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
        <div className="relative flex items-center gap-4 border-b border-line/[0.07] px-6 py-4 sm:px-8">
          <p className="shrink-0 font-mono text-[11.5px] uppercase tracking-[0.14em] text-fg-subtle">
            Layer <span className="text-leaf">{two(active + 1)}</span> / {two(steps.length)}
          </p>
          <div aria-hidden className="flex flex-1 gap-1.5">
            {steps.map((st, i) => (
              <span key={st.id} className="h-1 flex-1 overflow-hidden rounded-full bg-line/10">
                {i === active && auto ? (
                  // The timer: when this fill completes, the next layer comes up.
                  <span
                    key={`timer-${active}`}
                    className="block h-full origin-left animate-progress bg-leaf"
                    style={{ animationDuration: `${DWELL_MS}ms`, animationPlayState: running ? "running" : "paused" }}
                    onAnimationEnd={() => {
                      if (!reduce) go(active + 1);
                    }}
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
          {client && !reduce && (
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause the walkthrough" : "Play the walkthrough"}
              className="grid size-8 shrink-0 place-items-center rounded-full border border-line/12 text-fg-muted transition-colors duration-fast hover:border-line/30 hover:text-fg"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden fill="currentColor">
                {playing ? <path d="M3 2h2v8H3zM7 2h2v8H7z" /> : <path d="M3 1.5v9l7.5-4.5z" />}
              </svg>
            </button>
          )}
        </div>

        <div key={s.id} className="relative animate-enter-up p-6 sm:p-8 [animation-duration:450ms]">
          <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-leaf">{s.label}</p>
          <h3 className="display mt-2 text-h3 text-fg">{s.title}</h3>
          <p className="mt-4 max-w-2xl text-body text-fg-muted">{s.body}</p>

          <div className="relative mt-6 overflow-hidden rounded-2xl border border-line/[0.07] bg-canvas/60 p-5 pl-6">
            <span aria-hidden className="absolute inset-y-4 left-0 w-0.5 rounded-full bg-leaf/60" />
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">On-chain, behind the scenes</p>
            <p className="mt-2 text-small text-fg-muted">{s.behind}</p>
          </div>

          {s.facts && s.facts.length > 0 && (
            <dl className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-line/[0.07] bg-line/[0.07] sm:grid-cols-3">
              {s.facts.map((f, i) => (
                <div
                  key={f.k}
                  className="animate-enter-up bg-card px-4 py-3.5 [animation-duration:450ms]"
                  style={{ animationDelay: `${120 + i * 60}ms` } as CSSProperties}
                >
                  <dt className="text-caption text-fg-subtle">{f.k}</dt>
                  <dd className="mt-1 font-mono text-[13px] text-fg">{f.v}</dd>
                </div>
              ))}
            </dl>
          )}
          {s.extra && <div className="mt-5">{s.extra}</div>}
        </div>

        <div className="relative flex flex-wrap items-center justify-between gap-4 border-t border-line/[0.07] px-6 py-4 sm:px-8">
          {s.link ? <ArrowLink href={s.link.href}>{s.link.label}</ArrowLink> : <span />}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(active - 1)}
              className="rounded-full border border-line/12 px-3.5 py-1.5 text-caption text-fg-muted transition-colors duration-fast hover:border-line/30 hover:text-fg"
            >
              <span aria-hidden>←</span> Previous
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              className="rounded-full border border-leaf/30 bg-leaf/10 px-3.5 py-1.5 text-caption text-leaf transition-colors duration-fast hover:bg-leaf/20"
            >
              {active === steps.length - 1 ? "Start over" : `Next: ${steps[active + 1].label}`} <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
