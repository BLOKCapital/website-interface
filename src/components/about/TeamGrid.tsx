"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { m, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { TiltCard } from "@/components/ui/TiltCard";
import { team, type TeamMember } from "@/lib/data/team";
import { cn } from "@/lib/utils";

// Link import is reused below by TeamCard wrapper.
// (Kept to avoid a churn diff while we wait on more team additions.)

/**
 * Team grid — polaroid-style cards.
 *
 * Each member sits inside a paper card with a square photo on top and a name
 * + social-link footer underneath. When the image file is missing, the card
 * gracefully falls back to a tinted initials avatar (uses the member's
 * ringColor). Cards lift on hover and the photo scales subtly.
 */

const ease = [0.22, 1, 0.36, 1] as const;

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease },
  },
};

export function TeamGrid() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <Section
      id="team"
      eyebrow="Team · Core DAO members"
      title={
        <>
          A garden takes{" "}
          <em className="font-serif italic text-moss">many hands.</em>
        </>
      }
      description="The core DAO members listed on-chain in our Aragon token-voting plugin, the people who tend the protocol day to day."
    >
      <m.ul
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
        }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5"
      >
        {team.map((member) => (
          <m.li key={member.name} variants={cardReveal}>
            <TeamCard member={member} />
          </m.li>
        ))}
      </m.ul>

      {/* Closing P.S., links to the on-chain Aragon members page */}
      <m.p
        initial={initial}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={cardReveal}
        className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[14.5px] leading-relaxed text-ink-muted sm:text-[15.5px]"
      >
        <span className="script text-[22px] leading-none text-clay">P.S.</span>
        <span>
          Every member is verifiable on-chain.{" "}
          <Link
            href="https://app.aragon.org/dao/arbitrum-mainnet/0x003a7E96B48Ee318DE5200Fcc9504480643237f3/members?members=0xbe40B1D2f9f64163Ab6F0030819E89d07045d3D1-tokenvoting&memberPanel=delegate"
            target="_blank"
            rel="noreferrer"
            className="group/m relative font-medium text-ink transition-colors hover:text-clay-deep"
          >
            <span className="underline decoration-clay decoration-[1.5px] underline-offset-[6px]">
              See the full membership on Aragon
            </span>
            <span
              aria-hidden
              className="inline-block translate-x-1 transition-transform duration-300 ease-in-soft group-hover/m:translate-x-2"
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

/* ---------- single card ---------------------------------------------------- */

function TeamCard({ member }: { member: TeamMember }) {
  // Polaroids get the strongest tilt on the site — they should feel like
  // physical photos picked up off the desk.
  const card = (
    <TiltCard maxTilt={7} className="h-full rounded-[14px]">
    <article className="paper-card group/m relative h-full overflow-hidden p-3 transition-[transform,border-color,box-shadow] duration-400 ease-in-soft hover:-translate-y-1 hover:border-moss/35 hover:shadow-[0_22px_44px_-26px_rgba(31,26,20,0.22)] sm:p-3.5">
      {/* Photo / fallback */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-paper-deep">
        <TeamPhoto member={member} />
        {/* Subtle warm vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/15 via-transparent to-transparent"
        />
      </div>

      {/* Name + social arrow */}
      <div className="mt-3 flex items-center justify-between gap-2 px-1">
        <p className="text-[13.5px] font-medium leading-tight text-ink">
          {member.name}
        </p>
        {member.href && <SocialArrow href={member.href} />}
      </div>

      {/* Optional role */}
      {member.role && (
        <p className="mt-0.5 px-1 text-[11.5px] leading-tight text-ink-muted">
          {member.role}
        </p>
      )}
    </article>
    </TiltCard>
  );

  if (!member.href) return card;

  return (
    <Link
      href={member.href}
      target="_blank"
      rel="noreferrer"
      aria-label={member.name}
      className="block h-full focus:outline-none"
    >
      {card}
    </Link>
  );
}

function TeamPhoto({ member }: { member: TeamMember }) {
  const [errored, setErrored] = useState(false);

  if (!member.image || errored) {
    return <PhotoFallback member={member} />;
  }

  return (
    <Image
      src={member.image}
      alt={member.name}
      fill
      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
      className="object-cover transition-transform duration-500 ease-in-soft group-hover/m:scale-105"
      onError={() => setErrored(true)}
      unoptimized
    />
  );
}

/**
 * Fallback when the photo is missing — a tinted gradient with the
 * member's initials. Uses ringColor to derive the tint.
 */
function PhotoFallback({ member }: { member: TeamMember }) {
  const ringColor = member.ringColor ?? "rgb(var(--moss))";
  return (
    <div
      className="flex size-full items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(135deg, ${ringColor.replace(")", " / 0.18)")} 0%, ${ringColor.replace(")", " / 0.06)")} 100%)`,
      }}
    >
      <span
        className="display text-[36px] leading-none sm:text-[42px]"
        style={{ color: ringColor }}
      >
        {member.initials}
      </span>
    </div>
  );
}

function SocialArrow({ href }: { href: string }) {
  const isLinkedIn = href.includes("linkedin.com");
  const isX = href.includes("x.com") || href.includes("twitter.com");
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-paper text-ink-subtle transition-colors duration-300",
        "group-hover/m:border-clay/45 group-hover/m:bg-clay/[0.08] group-hover/m:text-clay-deep",
      )}
    >
      {isX ? (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ) : isLinkedIn ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path
            d="M2 8 L8 2 M3.5 2 L8 2 L8 6.5"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
          />
        </svg>
      )}
    </span>
  );
}

