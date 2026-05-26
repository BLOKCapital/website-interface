"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GardenAsset } from "@/components/ui/GardenAsset";

/**
 * GardenMetaphor — three-stage seed → sprout → bloom story, scrubbed by
 * scroll. Real garden renders crossfade as the reader moves through the
 * section; copy speaks in a gardener's letter voice; the closing isn't a
 * CTA but a quiet reflection signed by the gardeners. Total scroll length
 * is 280vh to keep the section from dragging.
 */

const stages = [
  {
    label: "Seed",
    when: "First",
    title: "You plant.",
    body: "Bring your wallet, we never hold the keys. A minimal amount is enough soil to start a Garden.",
    asset: 3,
  },
  {
    label: "Sprout",
    when: "Then",
    title: "You tend it.",
    body: "Follow a curated index that rebalances itself, or hire a gardener, a verified manager whose record lives on-chain.",
    asset: 9,
  },
  {
    label: "Bloom",
    when: "And finally",
    title: "It grows.",
    body: "Returns settle on-chain. Your Garden compounds. The protocol pays attention to what's working, and so do you.",
    asset: 12,
  },
] as const;

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

// One cohesive scroll-scrub sequence: the stage math, crossfades and the three
// pinned panels are tightly coupled to `progress`, so splitting would just
// scatter shared state across props for no real gain.
// react-doctor-disable-next-line react-doctor/no-giant-component
export function GardenMetaphor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0..3
  const reduce = useReducedMotion();

  // The setProgress calls below are a single scroll-driven value set in
  // mutually-exclusive branches (reduced-motion / non-desktop / scroll frame),
  // not a cascade — a reducer wouldn't simplify this.
  // react-doctor-disable-next-line react-doctor/no-cascading-set-state
  useEffect(() => {
    if (reduce) {
      setProgress(3);
      return;
    }

    // Only scroll-scrub on lg+ screens. On phones / tablets the sticky-scroll
    // story is too tall and the layout cramped — render the end-state
    // (fully-bloomed garden + all stages visible) instead.
    const mql = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    let detach: (() => void) | null = null;

    const setup = () => {
      detach?.();
      detach = null;

      if (!mql.matches) {
        setProgress(3);
        return;
      }
      const el = wrapRef.current;
      if (!el) return;

      const onScroll = () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const r = el.getBoundingClientRect();
          const vh = window.innerHeight;
          const total = el.offsetHeight - vh;
          const passed = Math.min(total, Math.max(0, -r.top));
          const t = total > 0 ? (passed / total) * 3 : 0; // 0..3
          setProgress(t);
        });
      };

      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      detach = () => {
        window.removeEventListener("scroll", onScroll);
        if (raf) cancelAnimationFrame(raf);
      };
    };

    setup();
    const onChange = () => setup();
    mql.addEventListener("change", onChange);

    return () => {
      detach?.();
      mql.removeEventListener("change", onChange);
    };
  }, [reduce]);

  const stageIndex = Math.min(2, Math.floor(progress));
  const inStageProgress = clamp01(progress - stageIndex);
  const overallProgress = progress / 3;
  // The closing reflection reveals once we're solidly in the bloom stage.
  const closingOpacity = clamp01((progress - 2.6) / 0.3);

  // Dwell-style crossfades — each garden render holds at full opacity for a
  // long stretch of scroll, then crossfades quickly. This stops the visual
  // from feeling rushed when the reader scrolls slowly.
  //
  //  progress  0 ───────── 0.85 ──── 1.10  hold seed, quick fade out
  //  progress              0.90 ──── 1.10 ───── 1.90 ──── 2.10  sprout up, hold, down
  //  progress                                          1.90 ──── 2.10 ───── 3.0  bloom up, hold
  const seedOpacity = clamp01((1.1 - progress) / 0.25);
  const sproutOpacity =
    clamp01((progress - 0.9) / 0.2) * clamp01((2.1 - progress) / 0.2);
  const bloomOpacity = clamp01((progress - 1.9) / 0.2);

  return (
    <section
      id="garden"
      ref={wrapRef}
      className={cn(
        "paper relative",
        reduce ? "h-auto" : "h-auto lg:h-[360vh]",
      )}
    >
      <div
        className={cn(
          "flex items-center overflow-hidden",
          reduce
            ? "py-24"
            : "py-16 sm:py-20 lg:sticky lg:top-0 lg:h-screen lg:py-0",
        )}
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-12">
          {/* Visual, three real garden renders crossfading */}
          <div className="relative flex h-[44vh] items-center justify-center sm:h-[52vh] lg:col-span-7 lg:h-[70vh]">
            {/* Quiet margin sprigs around the render, give the panel a
                botanical-frame feel without competing with the photo. */}
            <Sprig className="absolute left-2 top-6 -rotate-12 text-clay/60 sm:left-6" />
            <Sprig className="absolute right-3 top-10 rotate-[18deg] text-moss/50 sm:right-8" />
            <Sprig className="absolute bottom-12 left-6 rotate-[-30deg] text-moss/45 sm:left-10 sm:bottom-16" />
            <Sprig className="absolute bottom-8 right-8 rotate-[10deg] text-clay/50 sm:right-14" />

            <div className="relative size-full max-w-[680px]">
              {/* Warm halo, intensifies as the garden grows */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 blur-3xl transition-opacity duration-300"
                style={{
                  opacity: 0.4 + overallProgress * 0.5,
                  background:
                    "radial-gradient(55% 55% at 50% 55%, rgb(var(--clay) / 0.18), transparent 70%), radial-gradient(60% 60% at 50% 80%, rgb(var(--moss) / 0.18), transparent 70%)",
                }}
              />

              {stages.map((s, i) => {
                const op =
                  i === 0 ? seedOpacity : i === 1 ? sproutOpacity : bloomOpacity;
                return (
                  <div
                    key={s.label}
                    aria-hidden={op < 0.05}
                    className="absolute inset-0 transition-opacity duration-300 ease-out"
                    style={{ opacity: op }}
                  >
                    <div
                      className={cn(
                        "absolute inset-0",
                        i === 2 && "animate-sway",
                      )}
                    >
                      <GardenAsset
                        n={s.asset}
                        // Preload the seed so the section's first frame is
                        // crisp the moment a reader scrolls in.
                        priority={i === 0}
                        quality={94}
                        sizes="(max-width: 1024px) 90vw, 800px"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Specimen caption, handwritten, changes with stage */}
            <p className="script pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[18px] leading-none text-clay sm:text-[20px]">
              {stages[stageIndex].label.toLowerCase()}, stage {stageIndex + 1}
            </p>
          </div>

          {/* Copy */}
          <div className="lg:col-span-5">
            {/* Salutation + eyebrow */}
            <p className="flex items-center gap-2 text-clay">
              <Sprig />
              <span className="script text-[22px] leading-none">
                A short story
              </span>
            </p>
            <p className="eyebrow mt-3 text-moss">The Garden</p>
            <h2 className="display mt-3 text-[34px] leading-[1.05] text-ink sm:text-[44px] lg:text-[52px]">
              A garden, told in{" "}
              <em className="font-serif italic text-clay">three breaths.</em>
            </h2>

            <ol className="mt-10 space-y-7">
              {stages.map((s, i) => {
                const isActive = i === stageIndex;
                const isPast = i < stageIndex;
                const stageFill = isPast ? 1 : isActive ? inStageProgress : 0;
                // Soft fade-in for the active stage copy.
                const copyOpacity = isPast || isActive ? 1 : 0.45;
                const copyTranslate = isActive ? 0 : isPast ? 0 : 6;

                return (
                  <li
                    key={s.label}
                    className="grid grid-cols-[28px_1fr] gap-4 transition-opacity duration-500 ease-in-soft"
                    style={{ opacity: copyOpacity }}
                  >
                    {/* Stage timeline marker */}
                    <div className="relative">
                      <span
                        aria-hidden
                        className="absolute left-1/2 top-3 h-[calc(100%+0.75rem)] w-px -translate-x-1/2 bg-ink/15"
                      />
                      <span
                        aria-hidden
                        className="absolute left-1/2 top-3 h-[calc(100%+0.75rem)] w-px origin-top -translate-x-1/2 bg-moss transition-transform duration-300 ease-out"
                        style={{ transform: `scaleY(${stageFill})` }}
                      />
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-1/2 top-1 inline-flex size-5 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-paper transition-colors duration-300",
                          isActive || isPast
                            ? "border-moss text-moss"
                            : "border-ink/20 text-ink-subtle",
                        )}
                      >
                        {isPast ? (
                          <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden>
                            <path
                              d="M3 7.4 L 6 10 L 11 4"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <span className="size-1.5 rounded-full bg-current" />
                        )}
                      </span>
                    </div>

                    {/* Stage copy, slides up subtly when it becomes active */}
                    <div
                      className="pb-2 transition-transform duration-500 ease-in-soft"
                      style={{ transform: `translateY(${copyTranslate}px)` }}
                    >
                      <p className="text-[12px] font-medium tracking-wide text-ink-subtle">
                        <span className="script mr-1 text-[18px] leading-none text-clay">
                          {s.when}
                        </span>
                        · {s.label}
                      </p>
                      <p
                        className={cn(
                          "display mt-1.5 text-[22px] leading-tight text-ink sm:text-[24px]",
                          isActive &&
                            "after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-clay after:transition-[width] after:duration-700 relative",
                        )}
                      >
                        {s.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                        {s.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Closing reflection, fades in once the bloom holds */}
            <div
              aria-hidden={closingOpacity < 0.1}
              className="mt-12 transition-opacity duration-500 ease-in-soft"
              style={{ opacity: closingOpacity }}
            >
              <span aria-hidden className="block h-px w-16 bg-ink/20" />
              <p className="mt-4 font-serif text-[17px] italic leading-relaxed text-moss-deep sm:text-[18px]">
                And that&apos;s a garden, a wallet you held the whole time,
                a record you can read, and a little more soil to grow in.
              </p>
              <div className="mt-5 flex items-center gap-3 text-clay">
                <Sprig />
                <span className="script text-[20px] leading-none">
                  the gardeners
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botanical timeline at the bottom, only meaningful when the
            section is sticky-scrolling, so hide it on phones/tablets. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 mx-auto hidden max-w-7xl items-center gap-4 px-5 sm:px-8 lg:flex">
          <div className="relative flex-1">
            <span aria-hidden className="block h-px bg-ink/15" />
            <span
              aria-hidden
              className="absolute left-0 top-0 h-px origin-left bg-moss transition-transform duration-300 ease-out"
              style={{ transform: `scaleX(${overallProgress})` }}
            />
            <div className="absolute inset-0 flex items-center justify-between">
              {stages.map((s, i) => {
                const reached = stageIndex >= i;
                return (
                  <span
                    key={s.label}
                    className={cn(
                      "relative -my-2 inline-flex size-4 items-center justify-center rounded-full border bg-paper transition-colors duration-300",
                      reached
                        ? "border-moss text-moss"
                        : "border-ink/20 text-ink-subtle",
                    )}
                  >
                    <span className="size-1.5 rounded-full bg-current" />
                  </span>
                );
              })}
            </div>
          </div>
          <span className="text-[11px] font-medium tracking-wider text-ink-subtle">
            {stages[stageIndex].label}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------- inline ornament ------------------------------------------------- */

function Sprig({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <path
        d="M12 3 C 18 5 20 12 14 20 C 8 18 5 12 12 3 Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M12 5 C 12 9 13 14 14 19"
        stroke="rgb(var(--paper))"
        strokeWidth="0.7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
