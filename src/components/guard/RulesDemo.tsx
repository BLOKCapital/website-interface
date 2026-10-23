"use client";

import { useEffect, useId, useRef, useState } from "react";
import { RULES_PICK, scenarios, type Scenario, type TraceLine, type Verdict } from "@/lib/data/scenarios";
import { prefersReducedMotion, useMotionAllowed } from "@/lib/motion";
import { useIsClient } from "@/lib/hooks";
import { dwellMs, LG_QUERY, trackSelect, useAutoplay } from "@/lib/explainers";
import { useRovingTabs } from "@/lib/useRovingTabs";
import { Badge } from "@/components/ui/Badge";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { AutoplayToggle } from "@/components/explore/AutoplayToggle";
import { cn } from "@/lib/utils";

/** How long a finished trace stays up before autoplay moves on: time to read it. */
const holdMs = (s: Scenario) => dwellMs(s.caption, ...s.lines.flatMap((l) => [l.text, l.result]), s.verdict.text);

const look: Record<Verdict, { label: string; stamp: string; mark: string; text: string; border: string; bg: string }> = {
  allow: { label: "Allow", stamp: "Allowed", mark: "✓", text: "text-leaf", border: "border-leaf/45", bg: "bg-leaf/7" },
  block: { label: "Block", stamp: "Blocked", mark: "✕", text: "text-negative", border: "border-negative/45", bg: "bg-negative/7" },
  hold: { label: "Hold", stamp: "Held", mark: "‖", text: "text-caution", border: "border-caution/45", bg: "bg-caution/7" },
};

const toneText: Record<TraceLine["tone"], string> = {
  pass: "text-leaf",
  fail: "text-negative",
  warn: "text-caution",
  info: "text-fg-subtle",
};

/** A block cursor that blinks four times, then rests on (no endless loop). */
const Cursor = () => (
  <span className="ml-0.5 inline-block h-[1.05em] w-[0.5em] translate-y-[2px] animate-blink bg-leaf/80" style={{ animationIterationCount: 4 }} />
);

/**
 * Which scenario is up, and how far its trace has run. Modes: "still" shows
 * it complete; "type" is autoplay's typewriter; "fast" answers a pick: the
 * call is there at once and the checks follow ~90 ms apart, so the verdict
 * lands within 800 ms.
 */
type Run = { i: number; shown: number; typed: number; mode: "still" | "type" | "fast" };

/** A picked scenario's reveal step: about 90 ms, so the verdict is in by 480 ms and settled (240 ms fade) well inside 800 ms. */
const fastStep = (stages: number) => Math.min(90, Math.floor(480 / Math.max(1, stages - 1)));

/**
 * The rules, running: pick a situation and watch a Garden's checks trace out
 * line by line to a verdict. On wide screens with a mouse it autoplays
 * through the scenarios once while on screen, stopping on the last (a bar
 * under the active tab shows the wait; lib/explainers.ts has the rules every
 * explainer shares). Any pick takes over for the visit, and there's a
 * Pause/Resume control. Server HTML, no-JS, phones before a pick and reduced
 * motion all get the complete trace with no typing. The visual terminal is
 * aria-hidden; a plain transcript of the active scenario carries the same
 * content.
 */
export function RulesDemo() {
  const root = useRef<HTMLDivElement>(null);
  const ap = useAutoplay(root, { rootMargin: "0px 0px -25% 0px" });
  const client = useIsClient();
  const motion = useMotionAllowed();
  const base = useId();
  const tabs = useRef<(HTMLElement | null)[]>([]);
  // Until autoplay starts or the visitor picks, the first scenario shows complete.
  const [run, setRun] = useState<Run>({ i: 0, shown: 0, typed: 0, mode: "still" });
  const [started, setStarted] = useState(false);
  const last = scenarios.length - 1;

  const sc = scenarios[run.i];
  const stages = sc.lines.length + 1; // every line, then the verdict
  const instant = !client || !motion || run.mode === "still";
  const done = instant || run.shown >= stages;
  const typing = !instant && run.shown === 0;
  const hold = holdMs(sc);
  const holding = ap.running && started && done && run.i < last;
  const { on: autoOn, running: autoRunning, end: endAuto } = ap;

  // Autoplay begins the first time the demo is on screen with nothing holding it.
  useEffect(() => {
    if (started || !autoRunning) return;
    const f = requestAnimationFrame(() => {
      setStarted(true);
      setRun({ i: 0, shown: 0, typed: 0, mode: "type" });
    });
    return () => cancelAnimationFrame(f);
  }, [started, autoRunning]);

  // The clock: type the call, reveal each check, land the verdict, then
  // (autoplay) hold and move to the next scenario, stopping after the last.
  useEffect(() => {
    if (instant) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    if (run.shown === 0) {
      t =
        run.typed < sc.lines[0].text.length
          ? setTimeout(() => setRun((r) => ({ ...r, typed: r.typed + 2 })), 24)
          : setTimeout(() => setRun((r) => ({ ...r, shown: 1 })), 260);
    } else if (run.shown < stages) {
      const landing = run.shown === stages - 1;
      t = setTimeout(
        () => {
          setRun((r) => ({ ...r, shown: r.shown + 1 }));
          if (landing && autoOn && run.i === last) endAuto();
        },
        run.mode === "fast" ? fastStep(stages) : landing ? 560 : 380,
      );
    } else if (autoRunning && run.i < last) {
      t = setTimeout(() => setRun({ i: run.i + 1, shown: 0, typed: 0, mode: "type" }), hold);
    }
    return () => clearTimeout(t);
  }, [instant, run, sc, stages, hold, last, autoOn, autoRunning, endAuto]);

  // Keep the active scenario in view in the small-screen strip (horizontal
  // scroll only, so the page itself never jumps).
  const strip = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const s = strip.current;
    const el = tabs.current[run.i];
    if (!s || !el || s.scrollWidth <= s.clientWidth) return;
    s.scrollTo({ left: el.offsetLeft - 20, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [run.i]);

  /** The visitor picked a scenario: run it, and stop autoplay for the visit. */
  const select = (i: number) => {
    trackSelect("rules_scenario", scenarios[i].id);
    ap.stop();
    setStarted(true);
    setRun({ i, shown: 1, typed: scenarios[i].lines[0].text.length, mode: "fast" });
  };
  // A pick from elsewhere on the page (the moments' "Watch it" links, which
  // also scroll here): run it exactly as a pick in the list would.
  const pick = useRef(select);
  pick.current = select;
  useEffect(() => {
    const onPick = (e: Event) => {
      const i = scenarios.findIndex((s) => s.id === (e as CustomEvent<string>).detail);
      if (i >= 0) pick.current(i);
    };
    window.addEventListener(RULES_PICK, onPick);
    return () => window.removeEventListener(RULES_PICK, onPick);
  }, []);

  const onToggle = () => {
    // Resuming from the last scenario starts again from the first.
    if (!ap.on && run.i === last) {
      setStarted(true);
      setRun({ i: 0, shown: 0, typed: 0, mode: "type" });
    }
    ap.toggle();
  };

  // A row of tabs on phones, a column beside the trace from lg.
  const rt = useRovingTabs({ count: scenarios.length, selected: run.i, onSelect: select, verticalFrom: LG_QUERY, refs: tabs });

  const v = look[sc.verdict.kind];

  return (
    <div ref={root} {...ap.rootProps} className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      {/* Scenarios */}
      <div className="min-w-0 lg:col-span-4">
        {/* A swipeable strip on small screens, a list beside the trace from lg. */}
        <div
          ref={strip}
          {...rt.tablist}
          aria-label="Scenarios"
          // A swipe along the strip is the visitor taking over, too.
          onTouchStart={ap.stop}
          onWheel={(e) => Math.abs(e.deltaX) > Math.abs(e.deltaY) && ap.stop()}
          // focus-inset: the phone strip scrolls, and would clip an outside ring.
          className="focus-inset relative -mx-gutter flex gap-2 overflow-x-auto px-gutter py-1.5 [scrollbar-width:none] lg:mx-0 lg:block lg:space-y-2 lg:overflow-visible lg:p-0"
        >
          {scenarios.map((s, i) => {
            const on = i === run.i;
            const sv = look[s.verdict.kind];
            return (
              <button
                key={s.id}
                {...rt.tab(i)}
                type="button"
                id={`${base}-tab-${s.id}`}
                aria-controls={`${base}-panel`}
                onClick={() => select(i)}
                className={cn(
                  "group/sc relative block shrink-0 overflow-hidden rounded-card border px-4 py-3 text-left transition-[background-color,border-color] duration-fast lg:w-full lg:py-3.5",
                  on ? "border-leaf/30 bg-card" : "border-subtle hover:border-line/20 hover:bg-card/60",
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className={cn("font-mono text-label tabular", on ? "text-leaf" : "text-fg-subtle")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={cn("whitespace-nowrap text-small font-medium lg:truncate", on ? "text-fg" : "text-fg-muted group-hover/sc:text-fg")}>
                      {s.label}
                    </span>
                  </span>
                  <span className={cn("shrink-0 rounded-full border px-2 py-0.5 font-mono text-label uppercase tracking-caps", sv.border, sv.text)}>
                    {sv.label}
                  </span>
                </span>
                <span className="mt-1 hidden pl-[30px] text-caption text-fg-subtle lg:block">{s.caption}</span>
                {on && holding && (
                  <span
                    aria-hidden
                    key={`hold-${run.i}`}
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left animate-progress bg-leaf/70"
                    style={{ animationDuration: `${hold}ms` }}
                  />
                )}
              </button>
            );
          })}
        </div>
        {/* Its space is held from lg (the only place autoplay runs), so the
            toggle appearing after hydration moves nothing. */}
        <div className="mt-4 hidden h-8 lg:block">
          {ap.eligible && <AutoplayToggle on={ap.on} ended={ap.ended} onClick={onToggle} what="autoplay of the scenarios" />}
        </div>
      </div>

      {/* Trace */}
      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${sc.id}`}
        tabIndex={0}
        className="relative min-w-0 overflow-hidden rounded-panel border border-subtle bg-surface lg:col-span-8 shadow-soft"
      >
        {/* One sweep of light per scenario (re-keyed), then still. */}
        <div key={`scan-${run.i}`} aria-hidden data-loop className="scanlines pointer-events-none absolute inset-0 overflow-hidden" />

        <div className="relative flex items-center justify-between gap-3 border-b border-subtle px-5 py-3">
          <p className="flex min-w-0 items-center gap-2 font-mono text-label text-fg-muted">
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-leaf" />
            <span className="truncate">
              garden.trace <span className="text-fg-subtle">/ {sc.id}</span>
            </span>
          </p>
          <div className="flex shrink-0 items-center gap-2">
            {/* Always laid out (hidden until the verdict) and sized for the longest
                verdict, so the bar keeps its height and nothing beside it moves. */}
            <span
              key={`stamp-${run.i}-${done}`}
              aria-hidden
              className={cn(
                "hidden rounded-md border-2 px-2 py-0.5 text-center font-mono text-label font-semibold uppercase tracking-[0.2em] sm:inline-grid",
                v.border,
                v.text,
                done ? !instant && "animate-stamp" : "invisible",
              )}
            >
              {Object.values(look).map((x) => (
                <span key={x.stamp} className={cn("col-start-1 row-start-1", x.stamp !== v.stamp && "invisible")}>
                  {x.stamp}
                </span>
              ))}
            </span>
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

        {/* Every scenario's trace is laid out complete in the same grid cell, so
            the terminal is as tall as the longest trace at every width and
            never changes height between scenarios or while one types out;
            only the active one is visible. */}
        <div aria-hidden className="relative grid px-5 py-5 font-mono text-label leading-relaxed sm:text-caption">
          {scenarios.map((x, i) => {
            const on = i === run.i;
            const xv = look[x.verdict.kind];
            return (
              <div key={x.id} className={cn("col-start-1 row-start-1", !on && "invisible")}>
                <ol className="space-y-2">
                  {x.lines.map((l, k) => {
                    const typingHere = on && k === 0 && typing;
                    const visible = !on || instant || k < run.shown || typingHere;
                    const result = !on || instant || k < run.shown;
                    return (
                      <li key={k} className={cn("grid grid-cols-[14px_1fr_auto] gap-x-3 sm:grid-cols-[68px_1fr_auto]", !visible && "invisible")}>
                        {/* Phones get just the symbol, leaving room for the trace itself. */}
                        <span className={l.kind === "call" ? "text-cobalt" : "text-fg-subtle"}>
                          {l.kind === "call" ? "→" : "·"}
                          <span className="hidden sm:inline">{l.kind === "call" ? " call" : " check"}</span>
                        </span>
                        {typingHere ? (
                          // The full line holds the space while it types over it.
                          <span className="grid min-w-0 text-fg">
                            <span className="invisible col-start-1 row-start-1">{l.text}</span>
                            <span className="col-start-1 row-start-1">
                              {l.text.slice(0, run.typed)}
                              <Cursor />
                            </span>
                          </span>
                        ) : (
                          <span className={cn("min-w-0", l.kind === "call" ? "text-fg" : "text-fg-muted")}>{l.text}</span>
                        )}
                        <span className={cn("max-w-[7.5rem] text-right transition-opacity duration-base sm:max-w-none", toneText[l.tone], result ? "opacity-100" : "opacity-0")}>
                          {l.result}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                <div
                  className={cn(
                    "mt-6 flex flex-col gap-1 rounded-control border px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4",
                    xv.border,
                    xv.bg,
                    on && !done && "invisible",
                    on && done && !instant && "animate-swap",
                  )}
                >
                  <span className={cn("shrink-0 font-semibold uppercase tracking-eyebrow", xv.text)}>
                    {xv.mark} {xv.label}
                  </span>
                  <span className="font-sans text-small text-fg">{x.verdict.text}</span>
                </div>
                {/* The prompt line is always laid out, and shows once the verdict is in. */}
                <p className={cn("mt-4 text-fg-subtle", on && !done && "invisible")}>
                  › <Cursor />
                </p>
              </div>
            );
          })}
        </div>

        <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-subtle px-5 py-3">
          <p className="flex flex-wrap items-center gap-x-2 text-caption text-fg-subtle">
            Rule from{" "}
            {/* Every scenario's source in one cell, so the row wraps the same way for all. */}
            <span className="inline-grid">
              {scenarios.map((x, i) => (
                <span key={x.id} inert={i !== run.i} className={cn("col-start-1 row-start-1", i !== run.i && "invisible")}>
                  <ArrowLink href={x.source.href} className="text-caption">
                    {x.source.label}
                  </ArrowLink>
                </span>
              ))}
            </span>
          </p>
          <p className="text-caption text-fg-subtle">The checks are real; the figures and addresses are examples.</p>
        </div>
      </div>
    </div>
  );
}
