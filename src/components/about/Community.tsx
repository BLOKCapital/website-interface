"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { GardenEmblem } from "@/components/ui/GardenEmblem";
import { contributeCard, socials, type Social } from "@/lib/data/socials";

/**
 * Community — "Join the garden."
 *
 * A featured "How to contribute" plate followed by a six-tile grid of social
 * channels. Each tile carries its own brand-tinted glyph chip on cream paper,
 * a description, and a soft arrow CTA. The footer P.S. invites a live drop-in
 * via Discord.
 */

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const DISCORD = "https://discord.com/invite/blokc";

export function Community() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <Section
      id="community"
      eyebrow="Get involved"
      title={
        <>
          Join the{" "}
          <em className="font-serif italic text-moss">garden.</em>
        </>
      }
      description="A protocol is only as alive as the people tending it. Roll up your sleeves, code, write, govern, or just hang out."
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
          <span className="script text-[20px] leading-none">Plots</span>
          <span aria-hidden className="text-ink/20">·</span>
          <span className="text-[11.5px] font-medium uppercase tracking-wider text-ink-subtle">
            Open to all
          </span>
        </span>
        <span aria-hidden className="hidden h-px flex-1 bg-ink/15 sm:block" />
        <span className="inline-flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-wider text-moss-deep">
          <span className="relative inline-flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-clay/45" />
            <span className="relative inline-block size-1.5 rounded-full bg-clay" />
          </span>
          Garden is open
        </span>
      </m.div>

      {/* Featured: How to contribute */}
      <m.article
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
        }}
        className="paper-card relative overflow-hidden p-7 sm:p-9 lg:p-10"
      >
        {/* Warm corner halos */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `
              radial-gradient(45% 60% at 0% 0%, rgb(var(--moss) / 0.10), transparent 70%),
              radial-gradient(45% 55% at 100% 100%, rgb(var(--clay) / 0.10), transparent 70%)
            `,
          }}
        />

        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <m.div variants={fadeUp} className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-baseline gap-1.5 rounded-full border border-moss/35 bg-moss/[0.08] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-moss-deep">
                <span className="script text-[15px] leading-none">I</span>
                <span>Start here</span>
              </span>
              <span aria-hidden className="h-px w-8 bg-ink/15" />
              <span className="text-[11.5px] font-medium uppercase tracking-wider text-ink-subtle">
                For new contributors
              </span>
            </div>

            <h3 className="display mt-5 text-[28px] leading-[1.05] text-ink sm:text-[34px] lg:text-[40px]">
              {contributeCard.title}
              <span className="text-clay">.</span>
            </h3>

            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted sm:text-[16px]">
              {contributeCard.desc}
            </p>

            <div className="mt-7">
              <Button href={contributeCard.href} variant="primary" size="lg">
                {contributeCard.cta}
                <Arrow />
              </Button>
            </div>
          </m.div>

          {/* Right column, flower emblem */}
          <m.div
            variants={fadeUp}
            className="relative mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center lg:col-span-5 lg:max-w-[300px]"
            aria-hidden
          >
            <GardenEmblem variant="flower" />
          </m.div>
        </div>
      </m.article>

      {/* Channels grid */}
      <m.ul
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
        }}
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {socials.map((s) => (
          <m.li key={s.id} variants={fadeUp}>
            <SocialTile social={s} />
          </m.li>
        ))}
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
          The whole team, engineers and the BLOKC community, hangs out in{" "}
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
          . Drop in. We don&apos;t bite.
        </span>
      </m.p>
    </Section>
  );
}

function SocialTile({ social }: { social: Social }) {
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${social.title}, ${social.desc}`}
      className="paper-card group/s relative flex h-full flex-col p-5 transition-[transform,border-color,box-shadow] duration-400 ease-in-soft hover:-translate-y-1 hover:border-moss/35 hover:shadow-[0_22px_44px_-26px_rgba(31,26,20,0.20)] sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className="inline-flex size-11 items-center justify-center rounded-full border transition-transform duration-300 group-hover/s:scale-105"
          style={{
            borderColor: `${social.tint} / 0.25`,
            background: `linear-gradient(135deg, ${withAlpha(social.tint, 0.12)}, ${withAlpha(social.tint, 0.04)})`,
            color: social.tint,
          }}
        >
          <SocialGlyph id={social.id} />
        </span>

        <span
          aria-hidden
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-paper text-ink-subtle transition-all duration-300 group-hover/s:border-clay/45 group-hover/s:bg-clay/[0.08] group-hover/s:text-clay-deep"
        >
          <svg width="11" height="11" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M2 7 H11 M7 3 L11 7 L7 11"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <p className="display relative mt-5 inline-block text-[20px] leading-tight text-ink sm:text-[22px]">
        <span>{social.title}</span>
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-0 bg-clay transition-[width] duration-500 ease-in-soft group-hover/s:w-full"
        />
      </p>

      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-muted sm:text-[13.5px]">
        {social.desc}
      </p>
    </a>
  );
}

/* ---------- glyphs --------------------------------------------------------- */

function SocialGlyph({ id }: { id: string }) {
  switch (id) {
    case "github":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.71 0-1.26.45-2.29 1.19-3.1-.12-.3-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.44-2.7 5.42-5.27 5.7.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.79.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
        </svg>
      );
    case "telegram":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.94 4.31 18.7 19.6c-.24 1.07-.87 1.34-1.77.83l-4.88-3.6-2.36 2.27c-.26.26-.48.48-.99.48l.35-5 9.1-8.22c.4-.35-.09-.55-.61-.2L6.21 13.3 1.4 11.8c-1.05-.33-1.07-1.05.22-1.56L20.6 2.84c.87-.31 1.63.2 1.34 1.47Z" />
        </svg>
      );
    case "x":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "farcaster":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 3h16v3.5h-1.6L17 21h-3l-1.6-7.5h-.8L10 21H7L5.6 6.5H4V3z" />
        </svg>
      );
    case "youtube":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.5 6.2a3.02 3.02 0 0 0-2.13-2.14C19.46 3.5 12 3.5 12 3.5s-7.46 0-9.37.56A3.02 3.02 0 0 0 .5 6.2C0 8.13 0 12 0 12s0 3.87.5 5.8c.27 1.05 1.08 1.86 2.13 2.14 1.91.56 9.37.56 9.37.56s7.46 0 9.37-.56a3.02 3.02 0 0 0 2.13-2.14C24 15.87 24 12 24 12s0-3.87-.5-5.8ZM9.6 15.6V8.4l6.24 3.6L9.6 15.6Z" />
        </svg>
      );
    case "discord":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.32 4.37a19.79 19.79 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.45.87-.61 1.25a18.27 18.27 0 0 0-5.49 0c-.16-.39-.4-.87-.62-1.25a.08.08 0 0 0-.08-.04A19.74 19.74 0 0 0 3.68 4.37a.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.09 18.06a.08.08 0 0 0 .03.05 19.9 19.9 0 0 0 6 3.04.08.08 0 0 0 .09-.03c.46-.63.87-1.3 1.22-2a.08.08 0 0 0-.04-.11 13.1 13.1 0 0 1-1.87-.89.08.08 0 0 1-.01-.13c.13-.1.25-.2.37-.3a.08.08 0 0 1 .08-.01c3.93 1.8 8.18 1.8 12.06 0a.08.08 0 0 1 .08.01l.37.3c.05.04.05.12-.01.13a12.3 12.3 0 0 1-1.87.89.08.08 0 0 0-.04.11c.36.7.78 1.36 1.22 2a.08.08 0 0 0 .09.03 19.84 19.84 0 0 0 6.01-3.04.08.08 0 0 0 .03-.05c.5-5.17-.84-9.66-3.55-13.66a.06.06 0 0 0-.03-.03ZM8.02 15.33c-1.18 0-2.16-1.09-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.33-.96 2.42-2.16 2.42Zm7.97 0c-1.18 0-2.16-1.09-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.33-.95 2.42-2.16 2.42Z" />
        </svg>
      );
    default:
      return null;
  }
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path
        d="M2 7 H11 M7 3 L11 7 L7 11"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- helpers -------------------------------------------------------- */

/**
 * Mix a small alpha into an "rgb(r g b)" string so the result is usable as a
 * CSS color. Avoids repeating gradient math at the call site.
 */
function withAlpha(rgb: string, alpha: number) {
  return rgb.replace(/^rgb\(([^)]+)\)$/, (_, body: string) => {
    const parts = body.trim().split(/[\s,]+/).slice(0, 3).join(" ");
    return `rgb(${parts} / ${alpha})`;
  });
}
