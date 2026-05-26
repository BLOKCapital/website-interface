"use client";

import Link from "next/link";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { ProposalFeed } from "@/components/home/ProposalFeed";
import type { ProposalView } from "@/lib/data/proposals";
import { cn } from "@/lib/utils";

/**
 * Governance flow — four numbered stages beside the live proposals card.
 *
 * Voting goes through Aragon OSX (per docs.blokcapital.io). Specific
 * thresholds (token amounts, discussion windows, timelocks) are intentionally
 * omitted because they aren't documented yet.
 */

const ease = [0.22, 1, 0.36, 1] as const;

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

const stages = [
  {
    id: "propose",
    roman: "I",
    label: "Propose",
    body: "Any BLOKC holder can submit a proposal, protocol upgrade, new index, fee parameter, or treasury allocation.",
  },
  {
    id: "discuss",
    roman: "II",
    label: "Discuss",
    body: "Open community discussion on Telegram, Discord and the forum. Refine the proposal in public before a vote.",
  },
  {
    id: "vote",
    roman: "III",
    label: "Vote",
    body: "On-chain vote via Aragon OSX, weighted by held BLOKC. Every vote is a public, verifiable transaction.",
  },
  {
    id: "execute",
    roman: "IV",
    label: "Execute",
    body: "Passed proposals execute directly through Aragon OSX. Decisions become contract state, no admin override.",
  },
] as const;

export function GovernanceFlow({
  proposals,
}: {
  proposals: ProposalView[];
}) {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <Section
      id="dao"
      eyebrow="DAO governance"
      title={
        <>
          Every change goes{" "}
          <em className="font-serif italic text-moss">through the same door.</em>
        </>
      }
      description="No back-room upgrades. No admin keys with quiet superpowers. Aragon OSX, on-chain, public."
    >
      <m.div
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
        }}
        className="grid gap-6 lg:grid-cols-12 lg:gap-8"
      >
        {/* Stage flow, left column */}
        <ol className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-2">
          {stages.map((s, i) => (
            <m.li
              key={s.id}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
              className={cn(
                // Subtle vertical offsets for a layered scrapbook feel
                i === 1 && "lg:translate-y-4",
                i === 2 && "lg:translate-y-2",
                i === 3 && "lg:translate-y-6",
              )}
            >
              <m.article
                variants={fadeUp}
                className="paper-card group/g relative flex h-full flex-col p-5 transition-[transform,border-color,box-shadow] duration-400 ease-in-soft hover:-translate-y-1 hover:border-moss/35 hover:shadow-[0_22px_44px_-26px_rgba(31,26,20,0.20)] sm:p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <m.span
                    variants={popStamp}
                    className="inline-flex items-baseline gap-1.5 rounded-full border border-moss/35 bg-moss/[0.08] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-moss-deep"
                  >
                    <span className="script text-[15px] leading-none">
                      {s.roman}
                    </span>
                    <span>Step</span>
                  </m.span>
                  <StageGlyph kind={s.id} />
                </div>

                <m.p
                  variants={fadeUp}
                  className="display relative mt-4 inline-block text-[22px] leading-tight text-ink"
                >
                  <span>{s.label}</span>
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-px w-0 bg-clay transition-[width] duration-500 ease-in-soft group-hover/g:w-full"
                  />
                </m.p>

                <m.p
                  variants={fadeUp}
                  className="mt-2 text-[13.5px] leading-relaxed text-ink-muted"
                >
                  {s.body}
                </m.p>
              </m.article>
            </m.li>
          ))}
        </ol>

        {/* Live proposals, right column, sticky on lg */}
        <m.aside variants={fadeUp} className="relative lg:col-span-5">
          <div className="paper-card sticky top-24 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow text-moss">Live · Aragon OSX</p>
              <span className="inline-flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wider text-clay-deep">
                <span className="relative inline-flex size-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-clay/45" />
                  <span className="relative inline-block size-1.5 rounded-full bg-clay" />
                </span>
                Watching
              </span>
            </div>
            <ProposalFeed proposals={proposals} />
          </div>
        </m.aside>
      </m.div>

      {/* Closing P.S. */}
      <m.p
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
        className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[14.5px] leading-relaxed text-ink-muted sm:text-[15.5px]"
      >
        <span className="script text-[22px] leading-none text-clay">P.S.</span>
        <span>
          Every vote is a public on-chain transaction.{" "}
          <Link
            href="https://app.aragon.org/dao/arbitrum-mainnet/0x003a7E96B48Ee318DE5200Fcc9504480643237f3/dashboard?members=0xbe40B1D2f9f64163Ab6F0030819E89d07045d3D1-tokenvoting&proposals=0xbe40B1D2f9f64163Ab6F0030819E89d07045d3D1-tokenvoting"
            target="_blank"
            rel="noreferrer"
            className="group/a relative font-medium text-ink transition-colors hover:text-clay-deep"
          >
            <span className="underline decoration-clay decoration-[1.5px] underline-offset-[6px]">
              Read the proposals on Aragon
            </span>
            <span
              aria-hidden
              className="inline-block translate-x-1 transition-transform duration-300 ease-in-soft group-hover/a:translate-x-2"
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

function StageGlyph({ kind }: { kind: string }) {
  return (
    <span
      aria-hidden
      className="inline-flex size-8 items-center justify-center rounded-full border border-ink/15 bg-paper text-moss-deep transition-transform duration-300 group-hover/g:scale-110"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        {kind === "propose" && (
          <>
            <path
              d="M3 13 L3 3 L11 3 L13 5 L13 13 Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M5.5 7 H10.5 M5.5 9.5 H9"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </>
        )}
        {kind === "discuss" && (
          <>
            <path
              d="M3 4 H11 V10 H7 L4.5 12 V10 H3 Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="6" cy="7" r="0.6" fill="currentColor" />
            <circle cx="8" cy="7" r="0.6" fill="currentColor" />
            <circle cx="10" cy="7" r="0.6" fill="currentColor" />
          </>
        )}
        {kind === "vote" && (
          <path
            d="M3 8 L7 12 L13 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )}
        {kind === "execute" && (
          <>
            <circle
              cx="8"
              cy="8"
              r="5"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M5.5 8 L7.5 10 L11 6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        )}
      </svg>
    </span>
  );
}
