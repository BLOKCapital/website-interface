"use client";

import Link from "next/link";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

/**
 * Direct channels — the contact page's grid of ways to reach the team.
 *
 * All email addresses removed — every channel routes through Discord, with
 * a dedicated card for the founder (0xSheetal) linking to her X/Twitter.
 * Each card has a "primary" link (Discord / Twitter) styled as a clay chip
 * and one or two secondary fallbacks.
 */

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const DISCORD = "https://discord.com/invite/blokc";
const TWITTER = "https://x.com/blok_cap";

type ChannelItem = {
  label: string;
  href: string;
  /** Whether this link is the headline action (gets the chip treatment). */
  primary?: boolean;
  /** Show the live ping halo (Discord). */
  live?: boolean;
};

type Channel = {
  id: string;
  eyebrow: string;
  title: string;
  items: ChannelItem[];
};

const channels: Channel[] = [
  {
    id: "community",
    eyebrow: "Community",
    title: "Hang out with the people who use this thing.",
    items: [
      { label: "Discord", href: DISCORD, primary: true, live: true },
      { label: "Telegram", href: "https://t.me/BLOKCapital" },
      { label: "X (Twitter)", href: "https://x.com/blok_cap" },
      { label: "Farcaster", href: "https://warpcast.com/blokc" },
    ],
  },
  {
    id: "x",
    eyebrow: "On X · @blok_cap",
    title: "Follow BLOK Capital on X.",
    items: [
      { label: "BLOK Capital on X", href: TWITTER, primary: true },
    ],
  },
  {
    id: "support",
    eyebrow: "Support",
    title: "Stuck on something? We'll un-stick it.",
    items: [
      { label: "Ask in Discord", href: DISCORD, primary: true, live: true },
      { label: "FAQ", href: "https://docs.blokcapital.io/resources/FAQs/" },
    ],
  },
  {
    id: "partnerships",
    eyebrow: "Partnerships",
    title: "Build with us, integrate with us.",
    items: [
      { label: "DM us in Discord", href: DISCORD, primary: true, live: true },
      { label: "BLOK Capital on X", href: TWITTER },
    ],
  },
  {
    id: "press",
    eyebrow: "Press",
    title: "Quotes, interviews, brand assets.",
    items: [
      { label: "Ping us in Discord", href: DISCORD, primary: true, live: true },
      { label: "Media kit", href: "/about#press" },
    ],
  },
  {
    id: "security",
    eyebrow: "Security",
    title: "Found a bug? Tell us first, profit second.",
    items: [
      { label: "Report on Discord", href: DISCORD, primary: true, live: true },
      { label: "Read the audits", href: "/features#audits" },
    ],
  },
];

export function Channels() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <Section
      eyebrow="Direct channels"
      title={
        <>
          Skip the form.{" "}
          <em className="font-serif italic text-clay">Pick a channel.</em>
        </>
      }
      description="Every channel below opens straight into our Discord, or follow BLOK Capital on X."
    >
      <m.ul
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
        }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {channels.map((c) => (
          <m.li key={c.id} variants={fadeUp}>
            <ChannelCard channel={c} />
          </m.li>
        ))}
      </m.ul>

      {/* Closing P.S., overall fallback */}
      <m.p
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
        className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[14.5px] leading-relaxed text-ink-muted sm:text-[15.5px]"
      >
        <span className="script text-[22px] leading-none text-clay">P.S.</span>
        <span>
          When in doubt, drop into{" "}
          <Link
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
          </Link>
          . We read everything.
        </span>
      </m.p>
    </Section>
  );
}

function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <article className="paper-card group/c relative flex h-full flex-col p-5 transition-[transform,border-color,box-shadow] duration-400 ease-in-soft hover:-translate-y-1 hover:border-moss/35 hover:shadow-[0_22px_44px_-26px_rgba(31,26,20,0.20)] sm:p-6">
      <p className="eyebrow text-moss">{channel.eyebrow}</p>
      <p className="display relative mt-3 inline-block text-[18px] leading-tight text-ink sm:text-[19px]">
        <span>{channel.title}</span>
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-0 bg-clay transition-[width] duration-500 ease-in-soft group-hover/c:w-full"
        />
      </p>

      <div className="flex-1" />

      <ul className="mt-5 space-y-2">
        {channel.items.map((i) => (
          <li key={i.label}>
            <ChannelLink item={i} />
          </li>
        ))}
      </ul>
    </article>
  );
}

function ChannelLink({ item }: { item: ChannelItem }) {
  const external = item.href.startsWith("http");
  const className = item.primary
    ? "group/i inline-flex items-center gap-2 rounded-full border border-moss/35 bg-moss/[0.08] px-3 py-1.5 text-[12.5px] font-medium text-moss-deep transition-colors duration-200 hover:border-moss/55 hover:bg-moss/[0.12]"
    : "group/i inline-flex items-center gap-1.5 text-[12.5px] text-ink-muted transition-colors duration-200 hover:text-ink";

  return (
    <a
      href={item.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={className}
    >
      {item.live && (
        <span aria-hidden className="relative inline-flex size-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-clay/45" />
          <span className="relative inline-block size-1.5 rounded-full bg-clay" />
        </span>
      )}
      <span>{item.label}</span>
      <span
        aria-hidden
        className={cn(
          "inline-block translate-x-0 transition-transform duration-300 ease-in-soft group-hover/i:translate-x-1",
          item.primary ? "text-clay" : "opacity-60",
        )}
      >
        →
      </span>
    </a>
  );
}
