"use client";

import Link from "next/link";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";

/**
 * Direct channels — Discord-first contact layout.
 *
 * Discord is the primary channel, so it gets a bold full-height feature panel
 * on the left. The remaining channels (the other socials plus topic-specific
 * links for support / press / security) sit in a tidy grid beside it.
 */

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const DISCORD = "https://discord.com/invite/blokc";

type Channel = {
  id: string;
  label: string;
  sub: string;
  href: string;
  icon: React.ReactNode;
};

const channels: Channel[] = [
  { id: "telegram", label: "Telegram", sub: "Community chat", href: "https://t.me/BLOKCapital", icon: <TelegramIcon /> },
  { id: "x", label: "X · @blok_cap", sub: "News & updates", href: "https://x.com/blok_cap", icon: <XIcon /> },
  { id: "farcaster", label: "Farcaster", sub: "Follow /blokc", href: "https://warpcast.com/blokc", icon: <FarcasterIcon /> },
  { id: "support", label: "Support", sub: "FAQ & documentation", href: "https://docs.blokcapital.io/resources/FAQs/", icon: <LifebuoyIcon /> },
  { id: "press", label: "Press", sub: "Media kit & brand assets", href: "/about#press", icon: <PressIcon /> },
  { id: "security", label: "Security", sub: "Audits & disclosure", href: "/features#audits", icon: <ShieldIcon /> },
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
          <em className="font-serif italic text-clay">Everything starts in Discord.</em>
        </>
      }
      description="Discord is the front door: community, support, partnerships, press, and security all route through it. Prefer somewhere else? Pick a channel."
    >
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Primary: Discord feature panel */}
        <m.div
          initial={initial}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="lg:col-span-5"
        >
          <DiscordPanel />
        </m.div>

        {/* Secondary: other channels grid */}
        <m.ul
          initial={initial}
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
          className="grid gap-3 sm:grid-cols-2 lg:col-span-7 lg:auto-rows-fr"
        >
          {channels.map((c) => (
            <m.li key={c.id} variants={fadeUp}>
              <ChannelCard channel={c} />
            </m.li>
          ))}
        </m.ul>
      </div>

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

/* ---------- Discord feature panel ----------------------------------------- */

function DiscordPanel() {
  return (
    <a
      href={DISCORD}
      target="_blank"
      rel="noreferrer"
      aria-label="Join our Discord"
      className="group/p relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-[#5b6bf5] to-[#3a45c2] p-7 text-white shadow-[0_30px_60px_-30px_rgba(58,69,194,0.7)] transition-transform duration-400 ease-in-soft hover:-translate-y-1 sm:p-8"
    >
      {/* Oversized watermark logo */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-8 -right-6 text-white/10 transition-transform duration-500 ease-in-soft group-hover/p:scale-105"
      >
        <DiscordIcon size={190} />
      </span>

      {/* Eyebrow + live badge */}
      <div className="relative flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
          Primary channel
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-wider text-white">
          <span className="relative inline-flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-white/80" />
            <span className="relative inline-block size-1.5 rounded-full bg-white" />
          </span>
          Live
        </span>
      </div>

      <div className="relative mt-auto pt-12">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
          <DiscordIcon size={26} />
        </span>
        <h3 className="display mt-4 text-[26px] leading-tight sm:text-[30px]">
          Join our Discord
        </h3>
        <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-white/80">
          The whole community lives here. Ask anything; security reports and
          support get a reply in about an hour, weekends included.
        </p>

        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#3a45c2] transition-transform duration-300 ease-in-soft group-hover/p:gap-3">
          Open Discord
          <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden>
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
    </a>
  );
}

/* ---------- secondary channel card ---------------------------------------- */

function ChannelCard({ channel }: { channel: Channel }) {
  const external = channel.href.startsWith("http");
  return (
    <a
      href={channel.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group/c paper-card flex h-full items-center gap-4 p-4 transition-[transform,border-color,box-shadow] duration-300 ease-in-soft hover:-translate-y-0.5 hover:border-moss/35 hover:shadow-[0_20px_40px_-26px_rgba(31,26,20,0.22)] sm:p-5"
    >
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-paper-warm text-clay-deep transition-colors duration-300 group-hover/c:text-clay">
        {channel.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold leading-tight text-ink">
          {channel.label}
        </span>
        <span className="block text-[12.5px] leading-tight text-ink-subtle">
          {channel.sub}
        </span>
      </span>
      <span
        aria-hidden
        className="text-ink-subtle opacity-50 transition-[transform,opacity] duration-300 ease-in-soft group-hover/c:translate-x-1 group-hover/c:opacity-100"
      >
        →
      </span>
    </a>
  );
}

/* ---------- icons ---------------------------------------------------------- */

function DiscordIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.197.373.291a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.548-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.24 3.64 11.94c-.88-.25-.89-.86.2-1.3l15.97-6.15c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FarcasterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.5 2.5h15v3h-1.5l-1 7.5 1 8.5h.75v.5h-6.25v-.5h1.5l-1-7.5h-2l-1 7.5h1.5v.5H4.5v-.5h.75l1-8.5-1-7.5H3.75v-3z" />
    </svg>
  );
}

function LifebuoyIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M4.6 4.6l4.6 4.6M19.4 4.6l-4.6 4.6M4.6 19.4l4.6-4.6M19.4 19.4l-4.6-4.6" strokeLinecap="round" />
    </svg>
  );
}

function PressIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 5h11v14H5a2 2 0 0 1-2-2V6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 9h3a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 8.5h5M7 12h5M7 15h3" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M12 3l7 2.5v5.5c0 4.3-2.9 8-7 9.5-4.1-1.5-7-5.2-7-9.5V5.5L12 3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
