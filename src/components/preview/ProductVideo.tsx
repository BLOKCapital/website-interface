"use client";

import Image from "next/image";
import { useState } from "react";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";

/**
 * Product video — click-to-play YouTube embed.
 *
 * Loads a static thumbnail (poster) first; the iframe only mounts after the
 * visitor clicks play, so the initial page is lean. Framed as a "reel"
 * specimen card with a hand-drawn frame.
 */

const VIDEO_ID = "O2xUopTuFWs";
const VIDEO_HREF = `https://youtu.be/${VIDEO_ID}`;
const THUMB = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export function ProductVideo() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";
  const [playing, setPlaying] = useState(false);

  return (
    <Section
      eyebrow="Introduction"
      title={
        <>
          Meet BLOK Capital,{" "}
          <em className="font-serif italic text-moss">in a few minutes.</em>
        </>
      }
      description="A short introduction to the protocol and the idea behind it. Press play and let it run."
    >
      {/* Ledger header */}
      <m.div
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
        className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-ink/10 py-4 text-[12px]"
      >
        <span className="inline-flex items-center gap-2 text-clay">
          <span className="script text-[20px] leading-none">Reel</span>
          <span aria-hidden className="text-ink/20">·</span>
          <span className="text-[11.5px] font-medium uppercase tracking-wider text-ink-subtle">
            Specimen
          </span>
        </span>
        <span aria-hidden className="hidden h-px flex-1 bg-ink/15 sm:block" />
        <span className="inline-flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-wider text-moss-deep">
          <span className="relative inline-flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-clay/45" />
            <span className="relative inline-block size-1.5 rounded-full bg-clay" />
          </span>
          Now playing on YouTube
        </span>
      </m.div>

      <m.figure
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
        className="paper-card relative overflow-hidden p-3 sm:p-4"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-ink/[0.04]">
          {!playing ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="Play the BLOK Capital introduction"
              className="group/play absolute inset-0 block focus:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              {/* Poster */}
              <Image
                src={THUMB}
                alt="BLOK Capital introduction"
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-cover transition-transform duration-700 ease-in-soft group-hover/play:scale-[1.02]"
                unoptimized
                priority={false}
              />

              {/* Warm wash so the poster lives on the paper */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 55%, rgb(var(--clay) / 0.10), transparent 70%), linear-gradient(180deg, rgb(var(--ink) / 0.05), rgb(var(--ink) / 0.22))",
                }}
              />

              {/* Big play disc */}
              <span className="absolute inset-0 m-auto flex size-20 items-center justify-center rounded-full bg-paper/95 text-clay-deep shadow-[0_22px_50px_-18px_rgba(31,26,20,0.45)] backdrop-blur-sm transition-transform duration-300 ease-in-soft group-hover/play:scale-110 sm:size-24">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 22 22"
                  aria-hidden
                  className="ml-1"
                >
                  <polygon points="6,3 19,11 6,19" fill="currentColor" />
                </svg>
              </span>

              {/* Lower badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 sm:bottom-4 sm:left-4 sm:right-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-paper/30 bg-ink/45 px-3 py-1.5 text-[11.5px] font-medium uppercase tracking-wider text-paper backdrop-blur-sm">
                  <span className="script text-[15px] leading-none text-clay">
                    I
                  </span>
                  <span>Walk the garden</span>
                </span>
                <span className="hidden rounded-full border border-paper/30 bg-ink/45 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-paper backdrop-blur-sm sm:inline-flex">
                  Press play
                </span>
              </div>
            </button>
          ) : (
            // allow-scripts + allow-same-origin is the standard YouTube embed
            // sandbox: the iframe is cross-origin, so allow-same-origin scopes to
            // youtube.com (needed by the player), not our origin — it can't escape
            // into this app's context.
            // react-doctor-disable-next-line react-doctor/iframe-missing-sandbox
            <iframe
              src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="BLOK Capital introduction"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          )}
        </div>

        {/* Caption */}
        <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-3 px-1 pb-1 sm:px-2">
          <p className="script text-[18px] leading-none text-clay">
            Specimen · Walkthrough
          </p>
          <a
            href={VIDEO_HREF}
            target="_blank"
            rel="noreferrer"
            className="group/y inline-flex items-center gap-1.5 text-[12.5px] text-ink-muted transition-colors hover:text-ink"
          >
            <span className="underline decoration-clay/40 decoration-[1.5px] underline-offset-[4px] transition-colors group-hover/y:decoration-clay">
              Watch on YouTube
            </span>
            <span
              aria-hidden
              className="inline-block translate-x-0 text-clay opacity-60 transition-transform duration-300 ease-in-soft group-hover/y:translate-x-1 group-hover/y:opacity-100"
            >
              →
            </span>
          </a>
        </figcaption>
      </m.figure>
    </Section>
  );
}
