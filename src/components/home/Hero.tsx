import type { CSSProperties } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GardenAsset } from "@/components/ui/GardenAsset";
import { Icon } from "@/components/ui/Icon";
import { StatusLine } from "@/components/ui/StatusLine";
import { RiskNote } from "@/components/ui/RiskNote";
import { CheckIcon, DiscordIcon } from "@/components/ui/icons";
import { protocolStatus } from "@/lib/data/status";
import { audits } from "@/lib/data/audits";
import { social } from "@/lib/data/socials";
import { SplitText } from "@/components/motion/SplitText";

const d = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

const credShields = audits.find((a) => a.partner === "CredShields");

/**
 * Three facts a first-time visitor should leave with. All sourced
 * (facts.ts). The audit claim names its scope where it's made (INS-01,
 * CRO-05): the review covered the Garden contracts, not the index code.
 */
const facts: { text: string; href?: string }[] = [
  { text: "Your assets never leave your wallet" },
  { text: "No seed phrase with Google sign-in" },
  { text: `${credShields?.coverage?.covered ?? "Garden contracts"} audited by CredShields`, href: "/security#audits" },
];

/** The three properties that make a Garden different, pinned around the render. */
const chips = [
  { label: "Assets stay at your address", pos: "left-0 top-[18%]", delay: 60 },
  { label: "Every move written on-chain", pos: "right-0 top-[46%]", delay: 100 },
  { label: "Upgrades approved by the DAO", pos: "left-[6%] bottom-[12%]", delay: 150 },
];

/**
 * Dashed currents running into and out of the Garden render: value in from
 * the left, positions out to the right. Drawn under the render, so the
 * island itself appears to take them in.
 */
const flows = {
  inA: "M0 150 C 100 150, 150 232, 260 262",
  inB: "M0 404 C 104 404, 162 318, 260 282",
  outA: "M260 250 C 360 218, 418 118, 520 118",
  outB: "M260 292 C 368 322, 410 428, 520 432",
};
const lines = [
  { d: flows.inA, tone: "rgb(var(--leaf) / var(--fx-line))" },
  { d: flows.inB, tone: "rgb(var(--leaf) / calc(var(--fx-line) * 0.75))" },
  { d: flows.outA, tone: "rgb(var(--cobalt) / var(--fx-line))" },
  { d: flows.outB, tone: "rgb(var(--sand) / calc(var(--fx-line) * 0.85))" },
];
const ends: [number, number, string][] = [
  [6, 150, "--leaf"],
  [6, 404, "--leaf"],
  [514, 118, "--cobalt"],
  [514, 432, "--sand"],
];

/**
 * One light per current, sweeping along its dashes: in from the left
 * first, then out to the right. A gradient band translating under a mask
 * of the dashes, so the motion is a composited transform (MOT-03); it plays
 * twice and rests off the art. The masks (the same paths as `flows`) and
 * the colours are in globals.css, "Hero and product art".
 */
const sweeps = [
  { mask: "art-mask-in", delay: 150 },
  { mask: "art-mask-up", delay: 950 },
  { mask: "art-mask-down", delay: 1100 },
];

function FlowLines() {
  return (
    <>
      <svg viewBox="0 0 520 520" aria-hidden className="absolute inset-0 size-full animate-fade-in" style={d(150)} fill="none">
        {lines.map((f) => (
          <path key={f.d} d={f.d} stroke={f.tone} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 6" />
        ))}
        {ends.map(([x, y, c]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill={`rgb(var(${c}))`} />
        ))}
      </svg>
      {sweeps.map((s) => (
        <div key={s.mask} aria-hidden className={`art-mask ${s.mask} absolute inset-0 overflow-hidden`}>
          <div className="art-sweep absolute inset-y-0 left-0 w-1/2" style={d(s.delay)} />
        </div>
      ))}
      {/* Pulse rings at the ends: HTML over the SVG, so they composite. */}
      {ends.map(([x, y, c], i) => (
        <span
          key={`ring-${x}-${y}`}
          aria-hidden
          className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(x / 520) * 100}%`, top: `${(y / 520) * 100}%` }}
        >
          <span className="art-ping block size-full rounded-full" style={{ ...d(i < 2 ? 150 : 1000), backgroundColor: `rgb(var(${c}))` }} />
        </span>
      ))}
    </>
  );
}

/**
 * Home hero: what BLOK is, in one line; its status; where to go next.
 * Server component, pure CSS, painted with the HTML.
 *
 * Entrance (D-32, PERF-01, MOT-01): the LCP group (h1, lead, CTAs, render)
 * is at full opacity on the first frame. It only rises 8px (`animate-rise`)
 * and the h1 words ink in from a readable grey, with no delay. Secondary
 * items (badge, status, facts, risk line, chips, currents) fade in within
 * 150ms. The illustration's loops (the light along the currents, the end
 * rings, the float) are composited, pause off screen (data-loop) and settle
 * on a still frame within 5s (D-33, MOT-02/03).
 */
export function Hero() {
  const discord = social("discord").href;
  return (
    <section data-placement="hero" className="relative overflow-hidden">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_65%_40%,black,transparent)]" />
      <div className="relative mx-auto grid w-full max-w-page items-center gap-12 px-5 pb-20 pt-24 sm:px-8 sm:pt-32 lg:grid-cols-12 lg:gap-8 lg:pb-28 lg:pt-44">
        <div className="lg:col-span-7">
          <div className="animate-fade-in">
            <Badge tone="current">{protocolStatus.label} on Arbitrum</Badge>
          </div>
          <SplitText as="h1" reveal="load" delay={0} className="display mt-5 text-h1 text-balance text-fg sm:mt-7">
            Grow your crypto. <em className="text-sand">Keep the keys.</em>
          </SplitText>
          <p className="mt-5 max-w-xl animate-rise text-lead text-fg-muted sm:mt-7">
            An exchange holds your crypto for you. A wallet leaves you doing all the work. BLOK Capital is the third
            option: a smart wallet at your own address that follows an on-chain index and rebalances itself, with every
            trade a transaction you can read.
          </p>
          <div className="mt-7 flex animate-rise flex-wrap items-center gap-3 sm:mt-10">
            <Button href="/indices" size="lg" data-cta="hero_explore_indices">
              Explore the indices
            </Button>
            <Button href={discord} size="lg" variant="secondary" data-placement="hero">
              <DiscordIcon /> Hear first on Discord
            </Button>
            <a
              href="#how"
              data-cta="hero_how_it_works"
              className="group/how inline-flex h-12 items-center gap-1.5 rounded-full px-2 text-ui font-medium text-fg-muted transition-colors duration-fast can-hover:hover:text-fg"
            >
              How it works
              <Icon name="arrow-down" size="sm" className="transition-transform duration-fast can-hover:group-hover/how:translate-y-0.5" />
            </a>
          </div>
          <StatusLine className="mt-5 animate-fade-in" />
          <ul
            className="mt-8 flex animate-fade-in flex-col gap-3 text-small text-fg-muted sm:flex-row sm:flex-wrap sm:gap-x-6"
            style={d(100)}
          >
            {facts.map((f) => (
              <li key={f.text} className="flex items-center gap-2">
                <CheckIcon className="shrink-0 text-leaf" />
                {f.href ? (
                  <Link
                    href={f.href}
                    prefetch={false}
                    data-cta="hero_audit_scope"
                    className="rounded-xs underline decoration-line/30 underline-offset-[3px] transition-colors duration-fast can-hover:hover:text-fg can-hover:hover:decoration-leaf"
                  >
                    {f.text}
                  </Link>
                ) : (
                  f.text
                )}
              </li>
            ))}
          </ul>
          <RiskNote className="mt-4 animate-fade-in [animation-delay:150ms]" />
        </div>

        <div data-loop className="relative mx-auto aspect-square w-full max-w-[520px] animate-rise lg:col-span-5">
          <div aria-hidden className="glow-leaf absolute inset-[-10%] opacity-90" />
          <FlowLines />
          <div className="absolute inset-[6%]">
            <div className="art-float absolute inset-0">
              <GardenAsset n={11} priority quality={95} sizes="(max-width: 640px) 80vw, 460px" />
            </div>
          </div>
          {chips.map((c) => (
            <p
              key={c.label}
              className={`absolute ${c.pos} hidden animate-fade-in items-center gap-2 rounded-full border border-subtle bg-card/80 px-3.5 py-2 text-caption text-fg shadow-e1 backdrop-blur-md sm:inline-flex`}
              style={d(c.delay)}
            >
              <span aria-hidden className="size-1.5 rounded-full bg-leaf" />
              {c.label}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
