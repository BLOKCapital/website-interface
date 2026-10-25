"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { Badge } from "@/components/ui/Badge";
import { AutoplayToggle } from "@/components/explore/AutoplayToggle";
import { useFigureLoop } from "@/components/iso/useFigureLoop";
import { useRovingTabs } from "@/lib/useRovingTabs";
import { cn } from "@/lib/utils";
import { GardenScreen, type ScreenFocus } from "./GardenScreen";
import { ScaledScreen } from "./ScaledScreen";

const STEPS: { focus: ScreenFocus; tab: string; title: string; body: string }[] = [
  {
    focus: "garden",
    tab: "Your Garden",
    title: "At your own address",
    body: "A smart wallet only you control. Its net worth and every token in it, on-chain.",
  },
  {
    focus: "drift",
    tab: "Drift",
    title: "Checked against the index",
    body: "Target weights beside the actual ones. Only a token more than 2% off its target gets traded.",
  },
  {
    focus: "rebalance",
    tab: "Rebalance",
    title: "Done for you",
    body: "Every Garden following the index is rebalanced together, in one batch, at most once a day.",
  },
];

const STEP_MS = 4800;
const dwell = () => STEP_MS;

/** An element's offset inside an ancestor, in layout units (transforms ignored). */
function offsetIn(el: HTMLElement, root: HTMLElement) {
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return y;
}

type Layout = { height?: number; scroll: number; noteX: number; noteY: number };

/**
 * The home "The app" tour, on the app screen itself (GardenScreen). Each
 * step points at its part of the screen: the rest dims, that part is ringed
 * and replays its motion, the page scrolls under the app's fixed sidebar and
 * top bar to bring it into view, and a paper note pinned to the frame beside
 * it says what it is (below the frame on phones and tablets). A step bar
 * under the frame shows the three steps and how long the current one has
 * left; the steps are tabs, so a click or the arrow keys pick one.
 *
 * It plays on its own while on screen (useFigureLoop: never with reduced
 * motion or Pause motion, off screen or in a hidden tab), with a Pause
 * button. The screen itself stays a described picture (role="img").
 */
export function AppTour() {
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const loop = useFigureLoop(root, STEPS.length, dwell);
  const rt = useRovingTabs({ count: STEPS.length, selected: loop.step, onSelect: loop.go });
  const step = STEPS[loop.step];

  const figure = useRef<HTMLElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const pinned = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout>({ scroll: 0, noteX: 0, noteY: 0 });

  // Size the app window to the frame, scroll its page so the step's part is
  // in view, and line the note up with that part: over the app's sidebar,
  // its right edge short of the content, inside the frame's height. Measured
  // in the screen's own (unscaled) units, then scaled back for the note.
  useLayoutEffect(() => {
    const measure = () => {
      const v = view.current;
      const app = v?.querySelector<HTMLElement>("[data-app]");
      const page = app?.querySelector<HTMLElement>("[data-app-scroll]");
      const el = page?.querySelector<HTMLElement>(`[data-zone="${step.focus}"]`);
      if (!v || !app || !page || !el || !app.offsetWidth || !figure.current) return;
      const scale = app.getBoundingClientRect().width / app.offsetWidth;
      const height = Math.round(v.clientHeight / scale);
      const pageTop = offsetIn(page, app);
      const top = offsetIn(el, page);
      const bottom = top + el.offsetHeight;
      const visible = height - pageTop;
      let scroll = Math.max(0, bottom + 32 - visible);
      if (top - scroll < 20) scroll = Math.max(0, top - 20);
      const vr = v.getBoundingClientRect();
      const fr = figure.current.getBoundingClientRect();
      const viewTop = vr.top - fr.top;
      const side = app.querySelector<HTMLElement>("aside")?.offsetWidth ?? 0;
      const noteW = pinned.current?.offsetWidth ?? 240;
      const noteH = pinned.current?.offsetHeight ?? 170;
      const noteX = vr.left - fr.left + side * scale - 16 - noteW;
      const want = viewTop + (pageTop + top - scroll) * scale;
      const noteY = Math.max(viewTop + 12, Math.min(want, viewTop + vr.height - noteH - 12));
      setLayout({ height, scroll: Math.round(scroll), noteX: Math.round(noteX), noteY: Math.round(noteY) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (view.current) ro.observe(view.current);
    return () => ro.disconnect();
  }, [step.focus]);

  const note = (
    <>
      <span className="font-mono text-label uppercase tracking-caps text-[#2563C4]">
        {String(loop.step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")} · {step.tab}
      </span>
      <span className="mt-2 block text-h4 font-extrabold leading-tight tracking-tight text-[#111A15]">{step.title}</span>
      <span className="mt-1.5 block text-small text-[#435049]">{step.body}</span>
    </>
  );

  return (
    <div ref={root}>
      <figure ref={figure} className="relative mx-auto max-w-5xl">
        <div aria-hidden className="glow-leaf pointer-events-none absolute inset-x-[-12%] -top-24 bottom-[-10%] opacity-70" />
        <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${loop.step}`} className="relative">
          <BrowserFrame url="blokc.app/index-gardens">
            {/* The app's Index Garden screen, rebuilt with example data, laid out at a real
                window width and scaled to the frame like a screenshot (ScaledScreen). */}
            <div ref={view} className="relative">
              <ScaledScreen className="aspect-[4/5] sm:aspect-[4/3]">
                <GardenScreen focus={step.focus} run={loop.key} height={layout.height} scroll={layout.scroll} />
              </ScaledScreen>
            </div>
          </BrowserFrame>
          <p aria-live="polite" className="sr-only">
            {`Step ${loop.step + 1} of ${STEPS.length}, ${step.tab}: ${step.title}. ${step.body}`}
          </p>
        </div>

        {/* lg: the note, pinned over the frame's (dimmed) sidebar, beside the step's part. */}
        <div
          ref={pinned}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-10 hidden w-[15rem] transition-transform duration-slow ease-expo lg:block"
          style={{ transform: `translate(${layout.noteX}px, ${layout.noteY}px)` }}
        >
          <div key={loop.key} className="relative animate-pop-in -rotate-2 rounded-md border-[1.5px] border-dashed border-[#111A15]/30 bg-[#FBFBF7] p-4 shadow-e3">
            {note}
            {/* A pin. */}
            <span className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full border-2 border-white bg-[#2563C4] shadow-e1" />
          </div>
        </div>
        <figcaption className="sr-only">The BLOKC app&apos;s Index Gardens screen: a Garden following BLOKC5, with example data.</figcaption>
      </figure>

      <div className="mx-auto mt-5 max-w-5xl">
        {/* Phones and tablets: the note under the frame. */}
        <div aria-hidden className="mb-4 rounded-md border-[1.5px] border-dashed border-[#111A15]/30 bg-[#FBFBF7] p-4 lg:hidden">
          {note}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div {...rt.tablist} aria-label="What the app shows" className="grid flex-1 grid-cols-3 gap-2">
            {STEPS.map((x, i) => {
              const on = i === loop.step;
              const done = i < loop.step;
              return (
                <button
                  key={x.focus}
                  {...rt.tab(i)}
                  id={`${uid}-tab-${i}`}
                  aria-controls={`${uid}-panel`}
                  onClick={() => loop.go(i)}
                  className="group/st flex min-h-11 min-w-0 flex-col justify-center gap-2 text-left"
                >
                  {/* The step's track: full once past, filling while it plays. */}
                  <span aria-hidden className="block h-1 overflow-hidden rounded-full bg-line/15">
                    <span
                      key={on ? loop.key : "idle"}
                      className={cn(
                        "block h-full origin-left rounded-full bg-leaf",
                        on ? (loop.playing ? "animate-progress" : "") : done ? "" : "scale-x-0",
                      )}
                      style={on ? { animationDuration: `${STEP_MS}ms` } : undefined}
                    />
                  </span>
                  <span className="flex items-baseline gap-2">
                    <span className={cn("font-mono text-label", on ? "text-leaf" : "text-fg-subtle")}>{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={cn(
                        "truncate text-small font-semibold transition-colors duration-fast",
                        on ? "text-fg" : "text-fg-muted can-hover:group-hover/st:text-fg",
                      )}
                    >
                      {x.tab}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 sm:pl-4">
            {loop.canPlay && <AutoplayToggle on={loop.playing} ended={false} onClick={loop.toggle} what="the app tour" />}
            <Badge status="example" />
          </div>
        </div>
      </div>
    </div>
  );
}
