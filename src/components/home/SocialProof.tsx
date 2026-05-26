"use client";

import Image from "next/image";
import Link from "next/link";
import {
  m,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Section } from "@/components/ui/Section";
import { partnerGroups, type Partner } from "@/lib/data/partners";
import { cn } from "@/lib/utils";

/**
 * Social proof — patron board.
 *
 * Two named groups of real partners (smart-wallet infra + on-chain
 * composability). Each partner is a small patron tile: logo above, name
 * below. Default state is greyscale + faded so the row reads as a quiet
 * masthead; hover restores colour. Stagger-fade on viewport entry.
 */

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const tileReveal: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease },
  },
};

export function SocialProof() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <Section
      id="proof"
      eyebrow="Patrons · Social proof"
      title={
        <>
          Standing on{" "}
          <em className="font-serif italic text-moss">these shoulders.</em>
        </>
      }
      description="The smart-wallet infrastructure that lets the keys stay with you, and the on-chain venues every Garden composes with."
    >
      <m.div
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          show: { transition: { staggerChildren: 0.18 } },
        }}
        className="space-y-12 sm:space-y-16"
      >
        {partnerGroups.map((group, gi) => (
          <PatronGroup
            key={group.label}
            label={group.label}
            intro={group.intro}
            partners={group.partners}
            roman={gi === 0 ? "I" : "II"}
          />
        ))}
      </m.div>

      {/* Closing P.S. */}
      <m.p
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
        className="mt-12 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[14.5px] leading-relaxed text-ink-muted sm:text-[15.5px]"
      >
        <span className="script text-[22px] leading-none text-clay">P.S.</span>
        <span>
          All wired through the Facet Registry, open-source, on-chain,
          composable by anyone.
        </span>
      </m.p>
    </Section>
  );
}

/* ---------- group ---------------------------------------------------------- */

function PatronGroup({
  label,
  intro,
  partners,
  roman,
}: {
  label: string;
  intro: string;
  partners: Partner[];
  roman: string;
}) {
  return (
    <m.section
      variants={{
        show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
      }}
    >
      {/* Group header, roman + label + hand-drawn rule + intro */}
      <m.header
        variants={fadeUp}
        className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="flex items-baseline gap-3">
          <span className="display text-[26px] leading-none text-clay/55 sm:text-[32px]">
            {roman}
          </span>
          <p className="display text-[20px] leading-tight text-ink sm:text-[24px]">
            {label}
          </p>
        </div>
        <p className="max-w-md text-[13.5px] leading-snug text-ink-muted sm:text-right sm:text-[14px]">
          {intro}
        </p>
      </m.header>

      <m.div variants={fadeUp} aria-hidden className="rule-hand mb-5" />

      {/* Grid of patron tiles, responsive: 2 / 3 / 4 / partners.length on lg.
          Caps each group at 6 columns on lg so a single row holds all tiles. */}
      <div
        className={cn(
          "grid gap-3 sm:gap-4",
          "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
          partners.length === 6
            ? "lg:grid-cols-6"
            : partners.length === 5
              ? "lg:grid-cols-5"
              : "lg:grid-cols-4",
        )}
      >
        {partners.map((p) => (
          <m.div key={p.name} variants={tileReveal}>
            <PatronTile {...p} />
          </m.div>
        ))}
      </div>
    </m.section>
  );
}

/* ---------- single tile ---------------------------------------------------- */

function PatronTile({ image, name, href, scale = 1 }: Partner) {
  const inner = (
    <article className="paper-card group/p flex h-full flex-col items-center justify-center gap-3 px-4 py-6 transition-[transform,border-color,box-shadow] duration-300 ease-in-soft hover:-translate-y-1 hover:border-moss/30 hover:shadow-[0_22px_44px_-26px_rgba(31,26,20,0.22)] sm:px-5 sm:py-7">
      {/* Logo, uniform height across all tiles. mix-blend-mode multiply
          drops any white PNG/JPEG background into the cream paper. Per-logo
          `scale` compensates for sources that ship with built-in padding. */}
      <span className="relative flex h-14 w-full items-center justify-center overflow-hidden sm:h-16">
        {/* scale is applied on the <Image> itself (not a wrapper) so it doesn't
            create an intermediate stacking context that would isolate the
            mix-blend-multiply and leave white logo backgrounds visible. */}
        <Image
          src={image}
          alt={`${name} logo`}
          fill
          sizes="(max-width: 640px) 40vw, 200px"
          className="object-contain [mix-blend-mode:multiply]"
          style={{ transform: `scale(${scale})` }}
          unoptimized
        />
      </span>
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle transition-colors duration-300 group-hover/p:text-ink">
        {name}
      </p>
    </article>
  );

  if (!href) return inner;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={name}
      className="block h-full focus:outline-none"
    >
      {inner}
    </Link>
  );
}
