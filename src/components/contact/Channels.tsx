import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { DiscordIcon, ExternalIcon, SOCIAL_ICONS } from "@/components/ui/icons";
import { SafetyNotice } from "@/components/security/SafetyNotice";
import { social, socials } from "@/lib/data/socials";

/** A URL as people type it: no scheme, no www, no trailing slash. */
const bare = (href: string) => href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/** The handle in a profile URL: "@blok_cap"; a GitHub organisation stays bare. */
/** The external-link arrow, nudging up and out on hover. */
const ArrowUpRight = () => (
  <ExternalIcon
    size={14}
    className="text-fg-subtle transition-[transform,color] duration-fast can-hover:group-hover/ch:-translate-y-0.5 can-hover:group-hover/ch:translate-x-0.5 can-hover:group-hover/ch:text-fg"
  />
);

const handleOf = (href: string) => {
  const path = bare(href).split("/").slice(1).join("/");
  if (!path) return bare(href);
  if (/github\.com/.test(href)) return path;
  return path.startsWith("@") ? path : `@${path}`;
};

/**
 * Contact, "Where to find us". The Discord first, as a banner in its own
 * colour: support, partnerships, press and security reports all start
 * there, with its two promises (a reply within 24 hours; security in a
 * private ticket) and, beside it, the rule for spotting a fake "support" DM.
 * Then every other official channel as a plain list: its name, what it's
 * for and its handle (the full address is in its tooltip and on the
 * official list, SEC-09). The channels come from socials.ts, so a new one
 * gets a line here.
 */
export function Channels() {
  const discord = social("discord");
  const others = socials.filter((s) => s.id !== "discord");
  return (
    <Section
      id="channels"
      eyebrow="Channels"
      title={
        <>
          Where to <em>find us.</em>
        </>
      }
      description="The Discord is where the team answers. Everywhere else, follow along. Check any address against the official list."
    >
      <div className="grid gap-5 lg:grid-cols-12">
        {/* The Discord, in its own colour. */}
        <Reveal className="lg:col-span-8">
          <article className="relative h-full overflow-hidden rounded-panel bg-[#5865F2] p-6 text-white shadow-e2 sm:p-8">
            {/* Faint ruled lines and a soft light, on the brand's blue. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent 0 31px, rgb(255 255 255 / 0.08) 31px 32px)" }}
            />
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-28 size-96 rounded-full bg-white/10 blur-3xl" />
            <div className="relative grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <div className="flex items-center gap-4">
                  <span aria-hidden className="sticker grid size-16 -rotate-6 place-items-center rounded-card bg-white text-[#5865F2]">
                    <DiscordIcon size={34} />
                  </span>
                  <span className="font-mono text-label uppercase tracking-caps text-white">Support · partners · press · security</span>
                </div>
                <h3 className="mt-6 text-h1 font-extrabold leading-none tracking-tight text-white">Discord</h3>
                <p className="note mt-2 text-h4 text-white">the whole team works here, in the open</p>
                <p className="mt-4 max-w-md text-ui text-white">
                  Ask anything in the server. Security issues go in a private ticket, never a public channel.
                </p>
                <p className="mt-2 font-mono text-label text-white">{bare(discord.href)}</p>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <dl className="flex flex-wrap gap-2 md:justify-end">
                  {[
                    ["Reply", "within 24 hours"],
                    ["Security", "private ticket"],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-tag border border-dashed border-white/50 px-3 py-2">
                      <dt className="font-mono text-label lowercase text-white">{k}</dt>
                      <dd className="text-small font-bold text-white">{v}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  href={discord.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-placement="contact_card"
                  className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-full bg-white px-6 text-ui font-semibold text-[#3C45A5] shadow-e1 transition-[transform,box-shadow] duration-fast ease-out active:scale-[var(--scale-press)] can-hover:hover:shadow-e2 md:self-end"
                >
                  <DiscordIcon /> Join the Discord
                  <ExternalIcon size={13} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
          </article>
        </Reveal>

        {/* How to spot a fake "support" DM, next to the one place support happens. */}
        <Reveal delay={0.06} className="lg:col-span-4">
          <SafetyNotice stacked className="h-full" />
        </Reveal>
      </div>

      {/* Every other channel, as a plain list: its name, what it's for, its handle and an arrow. */}
      <Reveal className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h3 className="display text-h3 text-fg">
            Follow <em>along.</em>
          </h3>
          <p className="hidden text-small text-fg-muted sm:block">News, chat, talks and the code.</p>
        </div>
        <ul className="mt-5 border-t border-line/20">
          {others.map((s) => {
            const Glyph = SOCIAL_ICONS[s.id];
            return (
              <li key={s.id} className="border-b border-line/20">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={bare(s.href)}
                  data-placement="contact_channels"
                  className="group/ch focus-inset grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-x-4 py-4 sm:grid-cols-[1.5rem_10rem_minmax(0,1fr)_auto] sm:gap-x-6 sm:py-5"
                >
                  <Glyph size={20} className="text-fg-muted transition-colors duration-fast can-hover:group-hover/ch:text-fg" />
                  <span className="text-h4 font-extrabold tracking-tight text-fg transition-colors duration-fast can-hover:group-hover/ch:text-leaf">
                    {s.label}
                  </span>
                  <span className="hidden truncate text-small text-fg-muted sm:block">{s.desc}</span>
                  <span className="flex items-center gap-3">
                    <span className="truncate font-mono text-label text-fg-subtle">{handleOf(s.href)}</span>
                    <ArrowUpRight />
                  </span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}
