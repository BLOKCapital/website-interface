"use client";

import Link from "next/link";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { PillarIcon } from "@/components/ui/PillarIcons";
import { pillars } from "@/lib/data/pillars";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;
const ROMANS = ["I", "II", "III", "IV", "V", "VI"];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const popStamp: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -8 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.7, ease, type: "spring", bounce: 0.35 },
  },
};

/**
 * WhyItsSafe — six promises, each rendered as a postcard pinned to the page.
 *
 * Each card has a roman-numeral "Promise" stamp, a pillar icon, a small
 * spec tag (Web3Auth · ERC-4337 etc.), a serif label, prose, and a hover
 * "read the proof →" affordance if the card links somewhere. A closing
 * receipts line sits below the grid.
 */
export function WhyItsSafe() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <Section
      id="safety"
      eyebrow="Why it's safe"
      title={
        <>
          Six promises we{" "}
          <em className="font-serif italic text-moss">won&apos;t break.</em>
        </>
      }
      description="Not marketing. Each one maps to a specific contract, audit, or open-source line of code, receipts at the end."
    >
      <m.ul
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
        }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {pillars.map((p, i) => (
          <PromiseCard key={p.id} pillar={p} index={i} />
        ))}
      </m.ul>

      {/* Closing receipts line */}
      <m.p
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeUp}
        className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[14.5px] leading-relaxed text-ink-muted sm:text-[15.5px]"
      >
        <span className="script text-[22px] leading-none text-clay">
          P.S.
        </span>
        <span>
          All six are wired into the protocol.{" "}
          <Link
            href="/features#audits"
            className="group/r relative font-medium text-ink transition-colors hover:text-clay-deep"
          >
            <span className="underline decoration-clay decoration-[1.5px] underline-offset-[6px]">
              Read the receipts
            </span>
            <span
              aria-hidden
              className="inline-block translate-x-1 transition-transform duration-300 ease-in-soft group-hover/r:translate-x-2"
            >
              {" "}
              →
            </span>
          </Link>
          .
        </span>
      </m.p>
    </Section>
  );
}

/* ---------- per-card ------------------------------------------------------- */

type Pillar = (typeof pillars)[number];

function PromiseCard({ pillar, index }: { pillar: Pillar; index: number }) {
  const roman = ROMANS[index] ?? `${index + 1}`;
  // Subtle alternating tilt — barely-perceptible postcard feel, not a circus.
  const tilt =
    index % 3 === 0
      ? "lg:-rotate-[0.4deg]"
      : index % 3 === 2
        ? "lg:rotate-[0.4deg]"
        : "";

  const cardInner = (
    <m.article
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.05 } },
      }}
      className={cn(
        "paper-card group/p relative flex h-full flex-col p-5 transition-[transform,border-color,box-shadow] duration-400 ease-in-soft sm:p-6",
        tilt,
        // hover: subtle lift + warmer border + small clay shadow tint
        pillar.href &&
          "hover:-translate-y-1 hover:rotate-0 hover:border-moss/35 hover:shadow-[0_24px_50px_-30px_rgba(79,111,79,0.40)]",
      )}
    >
      {/* Top row, Promise stamp + spec tag */}
      <m.div
        variants={fadeUp}
        className="flex items-center justify-between gap-3"
      >
        <span className="inline-flex items-baseline gap-1.5">
          <span className="text-[10.5px] font-medium uppercase tracking-wider text-ink-subtle">
            Promise
          </span>
          <m.span
            variants={popStamp}
            className="display text-[18px] leading-none text-clay"
          >
            {roman}
          </m.span>
        </span>
        <span className="text-[10.5px] font-medium tracking-wider text-ink-subtle">
          {pillar.spec}
        </span>
      </m.div>

      {/* Icon */}
      <m.div
        variants={fadeUp}
        className="mt-5 transition-transform duration-400 ease-in-soft group-hover/p:scale-[1.08]"
      >
        <PillarIcon id={pillar.id} />
      </m.div>

      {/* Label with hover underline */}
      <m.p
        variants={fadeUp}
        className="display relative mt-4 inline-block text-[22px] leading-tight text-ink"
      >
        <span>{pillar.label}</span>
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-0 bg-clay transition-[width] duration-500 ease-in-soft group-hover/p:w-full"
        />
      </m.p>

      {/* Description */}
      <m.p
        variants={fadeUp}
        className="mt-2 text-[14px] leading-relaxed text-ink-muted"
      >
        {pillar.description}
      </m.p>

      {/* Bottom: "read the proof →" affordance for linkable cards */}
      {pillar.href && (
        <m.span
          variants={fadeUp}
          className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-moss-deep opacity-70 transition-opacity duration-300 group-hover/p:opacity-100"
        >
          read the proof
          <span
            aria-hidden
            className="inline-block translate-x-0 transition-transform duration-300 ease-in-soft group-hover/p:translate-x-1"
          >
            →
          </span>
        </m.span>
      )}
    </m.article>
  );

  if (!pillar.href) {
    return <li className="h-full">{cardInner}</li>;
  }

  const external = pillar.href.startsWith("http");
  return (
    <li className="h-full">
      <Link
        href={pillar.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="block h-full rounded-2xl focus:outline-none"
      >
        {cardInner}
      </Link>
    </li>
  );
}
