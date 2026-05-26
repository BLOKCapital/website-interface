"use client";

import { useState } from "react";
import {
  AnimatePresence,
  m,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Section } from "@/components/ui/Section";
import { faqs } from "@/lib/data/faqs";
import { cn } from "@/lib/utils";

const DISCORD = "https://discord.com/invite/blokc";
const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export function Faq() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <Section
      id="faq"
      eyebrow="Frequently asked"
      title={
        <>
          Common <em className="font-serif italic text-moss">questions.</em>
        </>
      }
      description="The ones we hear most often. Anything else, drop into Discord and ask."
    >
      <m.div
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
        className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-ink/10 py-4 text-[12px]"
      >
        <span className="inline-flex items-center gap-2 text-clay">
          <span className="script text-[20px] leading-none">Index</span>
          <span aria-hidden className="text-ink/20">·</span>
          <span className="text-[11.5px] font-medium uppercase tracking-wider text-ink-subtle">
            Questions
          </span>
        </span>
        <span aria-hidden className="hidden h-px flex-1 bg-ink/15 sm:block" />
        <span className="text-[11.5px] font-medium uppercase tracking-wider text-moss-deep">
          {String(faqs.length).padStart(2, "0")} entries · Most recent answers
        </span>
      </m.div>

      <m.ul
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={{
          show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
        }}
        className="paper-card divide-y divide-ink/10 overflow-hidden p-0"
      >
        {faqs.map((f, i) => {
          const open = openIdx === i;
          return (
            <m.li key={f.question} variants={fadeUp}>
              <FaqRow
                index={i}
                question={f.question}
                answer={f.answer}
                open={open}
                onToggle={() => setOpenIdx(open ? null : i)}
              />
            </m.li>
          );
        })}
      </m.ul>

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
          Didn&apos;t find your answer? Ask us live in{" "}
          <a
            href={DISCORD}
            target="_blank"
            rel="noreferrer"
            className="group/d relative font-medium text-ink transition-colors hover:text-clay-deep"
          >
            <span className="underline decoration-clay decoration-[1.5px] underline-offset-[6px]">
              our Discord
            </span>
            <span
              aria-hidden
              className="inline-block translate-x-1 transition-transform duration-300 ease-in-soft group-hover/d:translate-x-2"
            >
              {" "}
              →
            </span>
          </a>
          . There&apos;s always someone around.
        </span>
      </m.p>
    </Section>
  );
}

function FaqRow({
  index,
  question,
  answer,
  open,
  onToggle,
}: {
  index: number;
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className="group/q">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-panel-${index}`}
        className="flex w-full items-start gap-4 p-5 text-left transition-colors duration-200 hover:bg-paper-deep/50 sm:gap-6 sm:p-6"
      >
        <span
          aria-hidden
          className={cn(
            "mt-1 inline-flex shrink-0 items-baseline gap-1 text-[10.5px] font-medium uppercase tracking-wider text-moss-deep transition-opacity",
            "min-w-[34px] sm:min-w-[42px]",
          )}
        >
          <span className="script text-[15px] leading-none text-clay">Q</span>
          <span>·</span>
          <span>{num}</span>
        </span>

        <span className="display flex-1 text-[16.5px] leading-[1.35] text-ink sm:text-[19px]">
          {question}
        </span>

        <Toggle open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={`faq-panel-${index}`}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 pt-1 sm:px-6 sm:pb-7">
              <div className="ml-0 sm:ml-[66px]">
                <FaqAnswer text={answer} />
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FaqAnswer({ text }: { text: string }) {
  const parts = text.split("\n").filter(Boolean);
  if (parts.length <= 1) {
    return (
      <p className="text-[14.5px] leading-relaxed text-ink-muted sm:text-[15px]">
        {text}
      </p>
    );
  }
  return (
    <ul className="space-y-2.5">
      {parts.map((line) => {
        const colonIdx = line.indexOf(":");
        const label = colonIdx > 0 ? line.slice(0, colonIdx) : null;
        const rest = colonIdx > 0 ? line.slice(colonIdx + 1).trim() : line;
        return (
          <li
            key={line}
            className="flex gap-3 text-[14.5px] leading-relaxed text-ink-muted sm:text-[15px]"
          >
            <span
              aria-hidden
              className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-clay/70"
            />
            <span>
              {label && (
                <span className="font-medium text-ink">{label}: </span>
              )}
              {rest}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function Toggle({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-paper text-ink-subtle transition-all duration-300",
        "group-hover/q:border-clay/45 group-hover/q:bg-clay/[0.08] group-hover/q:text-clay-deep",
        open && "rotate-45 border-clay/45 bg-clay/[0.08] text-clay-deep",
      )}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M6 1.5 V10.5 M1.5 6 H10.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
