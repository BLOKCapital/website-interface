"use client";

import { useMemo } from "react";
import { m, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { milestones } from "@/lib/data/milestones";
import { cn } from "@/lib/utils";

/**
 * Section 1.7 — Roadmap, editorial almanac.
 *
 * Milestones are grouped by year. Each year reads like a chapter in a magazine:
 * a huge outlined year watermark, a chapter eyebrow + tagline, and a tidy grid
 * of milestone cards. Status is told in garden language —
 * Planted (done), Sprouting (current), Seeded (future) — with a small SVG
 * glyph (bloom / sprout / seed) on each card to reinforce the metaphor.
 *
 * Motion choreography (all honor prefers-reduced-motion via Framer Motion):
 *   - The legend strip fades up first.
 *   - Each year chapter fades up when it enters the viewport.
 *   - Watermark fades in slow (1200ms) so the foreground commits first.
 *   - Milestone cards inside a year stagger 80ms each.
 *   - The sprout glyph on the *current* card breathes; a cyan ring pulses.
 *   - Vine connectors draw on with a stroke-dashoffset transition.
 *
 * Theme alignment: same display + mono fonts, same eyebrow tracking, same
 * soft-border + raised surface palette, same primary/secondary/cyan accents.
 */

const YEAR_META: Record<string, { tagline: string }> = {
  "23": { tagline: "The Seed" },
  "24": { tagline: "The Soil" },
  "25": { tagline: "Building the Garden" },
  "26": { tagline: "Opening the Gates" },
  "27": { tagline: "The Bloom" },
};

const STATUS_LABEL: Record<Milestone["status"], string> = {
  done: "Planted",
  current: "Sprouting",
  future: "Seeded",
};

const ease = [0.22, 1, 0.36, 1] as const;

type Milestone = (typeof milestones)[number];

function yearKey(quarter: string) {
  const m = quarter.match(/'(\d{2})/);
  return m?.[1] ?? "??";
}

function quarterKey(quarter: string) {
  const m = quarter.match(/Q(\d)/i);
  return Number(m?.[1] ?? 0);
}

export function RoadmapTrack() {
  const grouped = useMemo(() => {
    const map = new Map<string, Milestone[]>();
    for (const m of milestones) {
      const y = yearKey(m.quarter);
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(m);
    }
    for (const list of map.values()) {
      list.sort((a, b) => quarterKey(a.quarter) - quarterKey(b.quarter));
    }
    return Array.from(map.entries()).sort(([a], [b]) => Number(a) - Number(b));
  }, []);

  const totalDone = milestones.filter((m) => m.status === "done").length;
  const totalCurrent = milestones.filter((m) => m.status === "current").length;
  const totalFuture = milestones.filter((m) => m.status === "future").length;

  return (
    <Section
      id="roadmap"
      eyebrow="The Almanac · Roadmap"
      title={
        <>
          Five chapters.{" "}
          <em className="font-serif italic text-moss">One garden.</em>
        </>
      }
      description="Each year a chapter, each chapter a season. Past plantings glow softly; the season we're sprouting hums; what's still seed waits for soil."
    >
      {/* Almanac legend, fades up first, sets the rhythm */}
      <Reveal variant="fade-up" amount={0.4}>
        <div className="mb-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-ink/10 py-4 text-[12px] text-ink-muted">
          <LegendDot tone="done" />
          <span className="font-medium tracking-wide">Planted · {totalDone}</span>
          <LegendDot tone="current" />
          <span className="font-medium tracking-wide">Sprouting · {totalCurrent}</span>
          <LegendDot tone="future" />
          <span className="font-medium tracking-wide">Seeded · {totalFuture}</span>
          <span
            aria-hidden
            className="ml-auto hidden h-px flex-1 bg-ink/15 sm:block"
          />
          <span className="font-medium tracking-wide text-moss">
            {milestones.length} milestones · 5 chapters
          </span>
        </div>
      </Reveal>

      <ol className="relative space-y-24 sm:space-y-28 lg:space-y-32">
        {grouped.map(([year, items], yi) => (
          <YearChapter
            key={year}
            year={year}
            items={items}
            chapterIndex={yi + 1}
            isLast={yi === grouped.length - 1}
          />
        ))}
      </ol>
    </Section>
  );
}

function YearChapter({
  year,
  items,
  chapterIndex,
  isLast,
}: {
  year: string;
  items: Milestone[];
  chapterIndex: number;
  isLast: boolean;
}) {
  const meta = YEAR_META[year] ?? { tagline: ", " };
  const reduce = useReducedMotion();

  return (
    <li className="relative">
      {/* Chapter header, fades up + slides in */}
      <Reveal variant="fade-up" amount={0.25}>
        <header className="relative mb-10 flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="flex items-baseline gap-4">
            <span className="script text-[24px] leading-none text-clay">
              chapter {chapterIndex}
            </span>
            <m.span
              aria-hidden
              className="hidden h-px w-16 origin-left bg-ink/20 sm:block"
              initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.0, ease, delay: 0.15 }}
            />
          </div>

          <div className="sm:text-right">
            <p className="display text-[30px] leading-tight text-ink sm:text-[40px]">
              20{year} <span className="text-ink-subtle">·</span>{" "}
              <em className="font-serif italic text-moss">{meta.tagline}</em>
            </p>
            <p className="mt-1 text-[12px] font-medium tracking-wide text-ink-subtle">
              {items.length} {items.length === 1 ? "milestone" : "milestones"}
            </p>
          </div>
        </header>
      </Reveal>

      {/* Milestone grid, staggered cascade */}
      <Stagger
        amount={0.15}
        staggerChildren={0.08}
        delayChildren={0.1}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((m) => (
          <RevealItem key={m.id} variant="fade-up">
            <MilestoneCard m={m} />
          </RevealItem>
        ))}
      </Stagger>

      {/* Vine connector, draws on between chapters */}
      {!isLast && (
        <m.span
          aria-hidden
          className="pointer-events-none absolute bottom-[-3.5rem] left-1/2 hidden h-12 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-moss/40 to-transparent sm:block lg:bottom-[-4rem]"
          initial={reduce ? { scaleY: 1 } : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
        />
      )}
    </li>
  );
}

function MilestoneCard({ m }: { m: Milestone }) {
  const isCurrent = m.status === "current";
  const isFuture = m.status === "future";

  return (
    <article
      className={cn(
        "paper-card group relative h-full p-5 transition-[transform,border-color] duration-400 ease-in-soft hover:-translate-y-0.5 hover:border-ink/20",
        isCurrent && "border-moss/40 ring-1 ring-moss/20",
        isFuture && "border-dashed",
      )}
    >
      {/* Top row: quarter + status pill */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold tracking-wider text-ink-subtle">
          {m.quarter}
        </span>
        <StatusPill status={m.status} />
      </div>

      {/* Glyph + title, glyph nudges right on hover */}
      <div className="mt-5 flex items-start gap-3">
        <span
          className={cn(
            "transition-transform duration-400 ease-in-soft group-hover:-translate-y-0.5",
            isCurrent && "animate-breathe",
          )}
        >
          <SeasonGlyph status={m.status} />
        </span>
        <h3 className="display text-[20px] leading-[1.15] text-ink sm:text-[22px]">
          {m.label}
        </h3>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
        {m.description}
      </p>

      {/* Soft current marker */}
      {isCurrent && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-4 inline-flex size-2.5 items-center justify-center"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-clay/40" />
          <span className="relative size-1.5 rounded-full bg-clay" />
        </span>
      )}
    </article>
  );
}

function StatusPill({ status }: { status: Milestone["status"] }) {
  const tone =
    status === "current"
      ? "text-clay-deep border-clay/50 bg-clay/12"
      : status === "done"
        ? "text-moss-deep border-moss/30 bg-moss/10"
        : "text-ink-subtle border-ink/15 bg-paper";

  return (
    <span
      className={cn(
        "shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide",
        tone,
      )}
    >
      {status === "current" && (
        <span className="mr-1 inline-block animate-breathe">●</span>
      )}
      {STATUS_LABEL[status]}
    </span>
  );
}

function LegendDot({ tone }: { tone: Milestone["status"] }) {
  const cls =
    tone === "current"
      ? "bg-clay"
      : tone === "done"
        ? "bg-moss"
        : "border border-ink/20 bg-paper";
  return (
    <span
      aria-hidden
      className={cn("inline-block size-1.5 shrink-0 rounded-full", cls)}
    />
  );
}

/**
 * SeasonGlyph — inline SVG with stroke-draw + fade-in animations on mount.
 *   future  → seed (oval, fades in)
 *   current → sprout (stem strokes on, leaf fades in, gentle breathe)
 *   done    → bloom (4 petals stagger in)
 *
 * Pure SVG + Framer Motion. Honors prefers-reduced-motion (paints final state).
 */
function SeasonGlyph({ status }: { status: Milestone["status"] }) {
  const reduce = useReducedMotion();
  const color =
    status === "current"
      ? "text-clay"
      : status === "done"
        ? "text-moss-deep"
        : "text-ink-subtle";

  return (
    <span
      aria-hidden
      className={cn(
        "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-paper",
        color,
      )}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        {status === "future" && (
          <m.path
            d="M8 3 C 5 6, 5 10, 8 13 C 11 10, 11 6, 8 3 Z"
            fill="currentColor"
            initial={reduce ? { opacity: 0.65, scale: 1 } : { opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 0.65, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            style={{ transformOrigin: "center" }}
          />
        )}
        {status === "current" && (
          <>
            <m.path
              d="M8 14 V 8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease, delay: 0.05 }}
            />
            <m.path
              d="M8 8 C 5 8, 4 6, 4.5 4 C 7 4, 8.5 5.5, 8 8 Z"
              fill="currentColor"
              initial={reduce ? { opacity: 0.85, scale: 1 } : { opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 0.85, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease, delay: 0.55 }}
              style={{ transformOrigin: "8px 8px" }}
            />
          </>
        )}
        {status === "done" && (
          <>
            {[
              { cx: 8, cy: 4.5, delay: 0.05 },
              { cx: 11.5, cy: 8, delay: 0.15 },
              { cx: 8, cy: 11.5, delay: 0.25 },
              { cx: 4.5, cy: 8, delay: 0.35 },
            ].map((p) => (
              <m.circle
                key={`${p.cx}-${p.cy}`}
                cx={p.cx}
                cy={p.cy}
                r="2"
                fill="currentColor"
                initial={reduce ? { opacity: 0.85, scale: 1 } : { opacity: 0, scale: 0 }}
                whileInView={{ opacity: 0.85, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.45, ease, delay: p.delay }}
                style={{ transformOrigin: `${p.cx}px ${p.cy}px` }}
              />
            ))}
            <m.circle
              cx="8"
              cy="8"
              r="1.4"
              fill="currentColor"
              initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, ease, delay: 0.5 }}
              style={{ transformOrigin: "8px 8px" }}
            />
          </>
        )}
      </svg>
    </span>
  );
}
