"use client";

import { useId, useRef, type ReactNode } from "react";
import { AutoplayToggle } from "@/components/explore/AutoplayToggle";
import { useRovingTabs } from "@/lib/useRovingTabs";
import { cn } from "@/lib/utils";
import type { Rect } from "./geometry";
import { IsoScene } from "./Iso";
import { useFigureLoop } from "./useFigureLoop";

export type FigureStep = {
  /** The tab's label. */
  tab: string;
  /** What the drawing shows at this step, for screen readers. */
  scene: string;
  /** The readout under the drawing (mono): the machine's state, in a few words. */
  readout: ReactNode;
};

/**
 * The frame every machine figure shares, after the reference figures it's
 * modelled on: "Fig n" and the title across the top, the drawing, then the
 * step tabs, the Pause button and a live readout along the bottom, and a
 * caption under the card. It owns the loop (useFigureLoop) and the tab
 * keyboard model (useRovingTabs); the drawing is a render prop that gets the
 * current step and a key that changes on every step, to replay its motion.
 */
export function MachineFigure({
  n,
  title,
  steps,
  dwell,
  view,
  caption,
  className,
  children,
}: {
  n: number;
  title: string;
  steps: FigureStep[];
  /** How long step i stays up in the loop, in ms. Must be stable (define it outside the component). */
  dwell: (i: number) => number;
  view: Rect;
  caption: ReactNode;
  className?: string;
  children: (state: { step: number; k: string; uid: string }) => ReactNode;
}) {
  const uid = useId().replace(/:/g, "");
  const root = useRef<HTMLDivElement>(null);
  const loop = useFigureLoop(root, steps.length, dwell);
  const rt = useRovingTabs({ count: steps.length, selected: loop.step, onSelect: loop.go });
  const s = steps[loop.step];

  return (
    <figure className={className}>
      <div ref={root} className="overflow-hidden rounded-panel border border-subtle bg-canvas">
        <div className="flex items-center justify-between gap-4 px-5 pt-4 sm:px-6">
          <span className="font-mono text-label text-fg-subtle">Fig {n}</span>
          <span className="label-caps text-right">{title}</span>
        </div>

        <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${loop.step}`} className="px-2 pb-2 pt-1 sm:px-8">
          <IsoScene view={view} label={s.scene} className="mx-auto max-w-4xl">
            {children({ step: loop.step, k: loop.key, uid })}
          </IsoScene>
        </div>

        <div className="flex flex-col gap-3 border-t border-subtle px-4 py-3.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div {...rt.tablist} aria-label="Steps" className="flex flex-wrap gap-1.5">
              {steps.map((x, i) => (
                <button
                  key={x.tab}
                  {...rt.tab(i)}
                  id={`${uid}-tab-${i}`}
                  aria-controls={`${uid}-panel`}
                  onClick={() => loop.go(i)}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-small transition-colors duration-fast",
                    i === loop.step ? "border-leaf/40 bg-leaf/10 text-fg" : "border-subtle text-fg-muted can-hover:hover:text-fg",
                  )}
                >
                  <span className="font-mono text-label text-fg-subtle">{i + 1}</span>
                  {x.tab}
                </button>
              ))}
            </div>
            {loop.canPlay && <AutoplayToggle on={loop.playing} ended={false} onClick={loop.toggle} what={`figure ${n}`} />}
          </div>
          <p aria-live="polite" className="font-mono text-label text-fg-muted lg:text-right">
            {s.readout}
          </p>
        </div>
      </div>
      <figcaption className="mt-3 text-caption text-fg-muted">
        <span className="mr-2 font-mono text-label text-leaf">Fig {n}</span>
        {caption}
      </figcaption>
    </figure>
  );
}
