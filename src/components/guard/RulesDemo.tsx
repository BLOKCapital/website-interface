"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { scenarios, type TraceLine, type Verdict } from "@/lib/data/scenarios";
import { prefersReducedMotion, useInView, useReducedMotion } from "@/lib/motion";
import { useIsClient } from "@/lib/hooks";
import { Badge } from "@/components/ui/Badge";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { cn } from "@/lib/utils";

/** How long a finished trace stays up before autoplay moves on. */
const HOLD_MS = 4500;

const look: Record<Verdict, { label: string; stamp: string; mark: string; text: string; border: string; bg: string }> = {
  allow: { label: "Allow", stamp: "Allowed", mark: "✓", text: "text-leaf", border: "border-leaf/45", bg: "bg-leaf/[0.07]" },
  block: { label: "Block", stamp: "Blocked", mark: "✕", text: "text-negative", border: "border-negative/45", bg: "bg-negative/[0.07]" },
  hold: { label: "Hold", stamp: "Held", mark: "‖", text: "text-caution", border: "border-caution/45", bg: "bg-caution/[0.07]" },
};

const toneText: Record<TraceLine["tone"], string> = {
  pass: "text-leaf",
  fail: "text-negative",
  warn: "text-caution",
  info: "text-fg-subtle",
};

const Cursor = () => <span className="ml-0.5 inline-block h-[1.05em] w-[0.5em] translate-y-[2px] animate-blink bg-leaf/80" />;

type Run = { i: number; shown: number; typed: number };

/**
 * The rules, running: pick a situation and watch a Garden's checks trace out
 * line by line to a verdict. Autoplays through the scenarios while on screen
 * (a bar under the active tab shows the wait); any click takes over, and
 * there's a pause control. Server HTML, no-JS and reduced motion all get the
 * complete trace with no typing. The visual terminal is aria-hidden; a plain
 * transcript of the active scenario carries the same content.
 */
export function RulesDemo() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { rootMargin: "0px 0px -25% 0px" });
  const client = useIsClient();
  const reduce = useReducedMotion();
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [run, setRun] = useState<Run>({ i: 0, shown: 0, typed: 0 });
  const [started, setStarted] = useState(false);
  const [auto, setAuto] = useState(true);

  const sc = scenarios[run.i];
  const stages = sc.lines.length + 1; // every line, then the verdict
  const instant = !client || reduce;
  const done = instant || run.shown >= stages;
  const typing = !instant && started && run.shown === 0;
  const holding = !instant && started && auto && inView && done;

  // Begin the first time the demo scrolls into view.
  useEffect(() => {
    if (!inView || started) return;
    const f = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(f);
  }, [inView, started]);

  // The clock: type the call, reveal each check, land the verdict, then
  // (autoplay) hold and move to the next scenario.
  useEffect(() => {
    if (instant || !started) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    if (run.shown === 0) {
      t =
        run.typed < sc.lines[0].text.length
          ? setTimeout(() => setRun((r) => ({ ...r, typed: r.typed + 2 })), 24)
          : setTimeout(() => setRun((r) => ({ ...r, shown: 1 })), 260);
    } else if (run.shown < stages) {
      t = setTimeout(() => setRun((r) => ({ ...r, shown: r.shown + 1 })), run.shown === stages - 1 ? 560 : 380);
    } else if (auto && inView) {
      t = setTimeout(() => setRun((r) => ({ i: (r.i + 1) % scenarios.length, shown: 0, typed: 0 })), HOLD_MS);
    }
    return () => clearTimeout(t);
  }, [instant, started, run, sc, stages, auto, inView]);

  // Keep the active scenario in view in the small-screen strip (horizontal
  // scroll only, so the page itself never jumps).
  const strip = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const s = strip.current;
    const el = tabs.current[run.i];
    if (!s || !el || s.scrollWidth <= s.clientWidth) return;
    s.scrollTo({ left: el.offsetLeft - 20, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [run.i]);

  const select = (i: number) => {
    setAuto(false);
    setStarted(true);
    setRun({ i, shown: 0, typed: 0 });
  };

  const onKey = (e: KeyboardEvent) => {
    const n = scenarios.length;
    const map: Record<string, number> = {
      ArrowDown: run.i + 1,
      ArrowRight: run.i + 1,
      ArrowUp: run.i - 1,
      ArrowLeft: run.i - 1,
      Home: 0,
      End: n - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key] + n) % n;
    select(next);
    tabs.current[next]?.focus();
  };

  const v = look[sc.verdict.kind];

  return (
    <div ref={root} className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      {/* Scenarios */}
      <div className="min-w-0 lg:col-span-4">
        {/* A swipeable strip on small screens, a list beside the trace from lg. */}
        <div
          ref={strip}
          role="tablist"
          aria-label="Scenarios"
          aria-orientation="vertical"
          onKeyDown={onKey}
          className="relative -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:block lg:space-y-2 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {scenarios.map((s, i) => {
            const on = i === run.i;
            const sv = look[s.verdict.kind];
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${base}-tab-${s.id}`}
                aria-selected={on}
                aria-controls={`${base}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => select(i)}
                className={cn(
                  "group/sc relative block shrink-0 overflow-hidden rounded-2xl border px-4 py-3 text-left transition-[background-color,border-color] duration-base lg:w-full lg:py-3.5",
                  on ? "border-leaf/30 bg-card" : "border-line/[0.07] hover:border-line/20 hover:bg-card/60",
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className={cn("font-mono text-[11px] tabular", on ? "text-leaf" : "text-fg-subtle")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={cn("whitespace-nowrap text-small font-medium lg:truncate", on ? "text-fg" : "text-fg-muted group-hover/sc:text-fg")}>
                      {s.label}
                    </span>
                  </span>
                  <span className={cn("shrink-0 rounded-full border px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em]", sv.border, sv.text)}>
                    {sv.label}
                  </span>
                </span>
                <span className="mt-1 hidden pl-[30px] text-caption text-fg-subtle lg:block">{s.caption}</span>
                {on && holding && (
                  <span
                    aria-hidden
                    key={`hold-${run.i}`}
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left animate-progress bg-leaf/70"
                    style={{ animationDuration: `${HOLD_MS}ms` }}
                  />
                )}
              </button>
            );
          })}
        </div>
        {client && !reduce && (
          <button
            type="button"
            onClick={() => setAuto((a) => !a)}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-line/12 px-3.5 py-1.5 text-caption text-fg-muted transition-colors duration-fast hover:border-line/30 hover:text-fg"
          >
            <span aria-hidden className="font-mono">{auto ? "❚❚" : "▶"}</span>
            {auto ? "Pause autoplay" : "Resume autoplay"}
          </button>
        )}
      </div>

      {/* Trace */}
      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${sc.id}`}
        tabIndex={0}
        className="relative min-w-0 overflow-hidden rounded-3xl border border-line/[0.08] bg-surface lg:col-span-8"
      >
        <div aria-hidden className="scanlines pointer-events-none absolute inset-0 overflow-hidden" />

        <div className="relative flex items-center justify-between gap-3 border-b border-line/[0.07] px-5 py-3">
          <p className="flex min-w-0 items-center gap-2 font-mono text-[12px] text-fg-muted">
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-leaf" />
            <span className="truncate">
              garden.trace <span className="text-fg-subtle">/ {sc.id}</span>
            </span>
          </p>
          <div className="flex shrink-0 items-center gap-2">
            {done && (
              <span
                key={`stamp-${run.i}`}
                aria-hidden
                className={cn(
                  "hidden animate-stamp rounded-md border-2 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] sm:inline-block",
                  v.border,
                  v.text,
                )}
              >
                {v.stamp}
              </span>
            )}
            <Badge tone="example">Illustrative</Badge>
          </div>
        </div>

        {/* Screen readers get the trace as plain text. */}
        <div className="sr-only">
          <p>
            {sc.label}: {sc.caption}
          </p>
          <ul>
            {sc.lines.map((l) => (
              <li key={l.text}>
                {l.text}: {l.result}.
              </li>
            ))}
          </ul>
          <p>
            Verdict: {v.label}. {sc.verdict.text}
          </p>
        </div>

        <div aria-hidden className="relative min-h-[320px] px-5 py-5 font-mono text-[12px] leading-relaxed sm:text-[13px]">
          <ol className="space-y-2">
            {sc.lines.map((l, k) => {
              const visible = instant || k < run.shown || (k === 0 && typing);
              const text = k === 0 && typing ? l.text.slice(0, run.typed) : l.text;
              const result = instant || k < run.shown;
              return (
                <li
                  key={`${sc.id}-${k}`}
                  className={cn("grid grid-cols-[14px_1fr_auto] gap-x-3 sm:grid-cols-[68px_1fr_auto]", !visible && "invisible")}
                >
                  {/* Phones get just the symbol, leaving room for the trace itself. */}
                  <span className={l.kind === "call" ? "text-cobalt" : "text-fg-subtle"}>
                    {l.kind === "call" ? "→" : "·"}
                    <span className="hidden sm:inline">{l.kind === "call" ? " call" : " check"}</span>
                  </span>
                  <span className={cn("min-w-0", l.kind === "call" ? "text-fg" : "text-fg-muted")}>
                    {text}
                    {k === 0 && typing && <Cursor />}
                  </span>
                  <span className={cn("max-w-[7.5rem] text-right transition-opacity duration-base sm:max-w-none", toneText[l.tone], result ? "opacity-100" : "opacity-0")}>
                    {l.result}
                  </span>
                </li>
              );
            })}
          </ol>

          <div
            className={cn(
              "mt-6 flex flex-col gap-1 rounded-xl border px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4",
              v.border,
              v.bg,
              !done && "invisible",
              done && !instant && "animate-enter-up [animation-duration:450ms]",
            )}
          >
            <span className={cn("shrink-0 font-semibold uppercase tracking-[0.14em]", v.text)}>
              {v.mark} {v.label}
            </span>
            <span className="font-sans text-small text-fg">{sc.verdict.text}</span>
          </div>
          {done && !instant && (
            <p className="mt-4 text-fg-subtle">
              › <Cursor />
            </p>
          )}
        </div>

        <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-line/[0.07] px-5 py-3">
          <p className="flex flex-wrap items-center gap-x-2 text-caption text-fg-subtle">
            Rule from <ArrowLink href={sc.source.href} className="text-[13px]">{sc.source.label}</ArrowLink>
          </p>
          <p className="text-caption text-fg-subtle">The checks are real; the figures and addresses are examples.</p>
        </div>
      </div>
    </div>
  );
}
