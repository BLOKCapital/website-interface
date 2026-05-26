"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Press kit — four request cards.
 *
 * Asset URLs aren't ready yet — every tile is honestly tagged "Soon" with a
 * mailto request for now. When direct downloads land, swap the
 * `available: false` flag and set the `href` to the real file.
 */

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

type Asset = {
  label: string;
  note: string;
  href: string;
  available: boolean;
};

// Logo pack + brand guidelines live together in one Figma deck.
const BRAND_KIT = "https://www.figma.com/slides/zTWeuy4nwdrmNp6K409cja";

const items: Asset[] = [
  {
    label: "Logo pack",
    note: "SVG + PNG · light + dark variants",
    href: BRAND_KIT,
    available: true,
  },
  {
    label: "Brand guidelines",
    note: "Figma · color, type, voice, usage rules",
    href: BRAND_KIT,
    available: true,
  },
];

export function PressKit() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <Section
      id="press"
      eyebrow="Press & media kit"
      title={
        <>
          Take what you{" "}
          <em className="font-serif italic text-moss">need.</em>
        </>
      }
      description="Press, partner and ecosystem teams: the brand kit is one click away. Need anything else? Ping us."
    >
      <m.ul
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        {items.map((item, idx) => (
          <m.li
            key={item.label}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.05 } },
            }}
            className={cn(
              // Layered y-offset — scrapbook-pinned feel
              idx === 1 && "sm:translate-y-3",
            )}
          >
            <m.article
              variants={fadeUp}
              className="paper-card group/p relative flex h-full flex-col p-5 transition-[transform,border-color,box-shadow] duration-400 ease-in-soft hover:-translate-y-1 hover:border-moss/35 hover:shadow-[0_22px_44px_-26px_rgba(31,26,20,0.20)] sm:p-5"
            >
              {/* Numeral stamp + Soon chip */}
              <div className="flex items-center justify-between gap-3">
                <m.span
                  variants={popStamp}
                  className="inline-flex items-baseline gap-1.5 rounded-full border border-moss/35 bg-moss/[0.08] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-moss-deep"
                >
                  <span className="script text-[15px] leading-none">
                    {ROMANS[idx] ?? `${idx + 1}`}
                  </span>
                  <span>Asset</span>
                </m.span>
                {!item.available && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-clay/35 bg-clay/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-clay-deep">
                    <span className="relative inline-flex size-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-clay/45" />
                      <span className="relative inline-block size-1.5 rounded-full bg-clay" />
                    </span>
                    Soon
                  </span>
                )}
              </div>

              {/* Label with hover underline */}
              <m.p
                variants={fadeUp}
                className="display relative mt-5 inline-block text-[19px] leading-tight text-ink"
              >
                <span>{item.label}</span>
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-px w-0 bg-clay transition-[width] duration-500 ease-in-soft group-hover/p:w-full"
                />
              </m.p>

              <m.p
                variants={fadeUp}
                className="mt-2 flex-1 text-[12.5px] leading-relaxed text-ink-muted"
              >
                {item.note}
              </m.p>

              <m.div variants={fadeUp} className="mt-5">
                <Button href={item.href} variant="outline" size="sm">
                  {item.available ? "Open the kit" : "Ping us on Discord"}
                </Button>
              </m.div>
            </m.article>
          </m.li>
        ))}
      </m.ul>

      {/* Closing P.S., Discord is the press channel */}
      <m.p
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
        className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[14.5px] leading-relaxed text-ink-muted sm:text-[15.5px]"
      >
        <span className="script text-[22px] leading-none text-clay">P.S.</span>
        <span>
          For anything press, partnerships, or urgent, find us in{" "}
          <a
            href="https://discord.com/invite/blokc"
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
          . We read everything.
        </span>
      </m.p>
    </Section>
  );
}
