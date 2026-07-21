import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal, RevealItem, Stagger } from "@/components/ui/Reveal";

const DISCORD = "https://discord.com/invite/blokc";
const TWITTER = "https://x.com/blok_cap";

/**
 * Contact hero — warm correspondence.
 *
 * The contact form is intentionally absent right now — every channel routes
 * through Discord or the founder's X. The right column is a dedicated
 * "Drop into Discord" card with the response-window pledge sitting on the
 * left. Entrance choreography reuses the shared Reveal/Stagger primitives
 * so this server component stays server-rendered.
 */
export function ContactHero() {
  return (
    <section className="paper relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background: `
            radial-gradient(45% 65% at 18% 18%, rgb(var(--clay) / 0.12), transparent 65%),
            radial-gradient(60% 80% at 50% 110%, rgb(var(--moss) / 0.14), transparent 70%)
          `,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 pt-28 sm:px-8 sm:pt-36 lg:pt-40">
        {/* Letterhead, dated, quiet */}
        <Reveal variant="fade-in">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/10 pb-5">
            <p className="text-[12px] font-medium tracking-wide text-ink-subtle">
              BLOK Capital · Correspondence
            </p>
            <p className="script text-[20px] leading-none text-clay">
              April 2026
            </p>
          </div>
        </Reveal>

        <Stagger
          staggerChildren={0.12}
          delayChildren={0.1}
          className="mt-12 grid grid-cols-1 gap-10 pb-16 lg:grid-cols-12 lg:gap-12"
        >
          {/* Left column, title + response window */}
          <div className="lg:col-span-6">
            <RevealItem>
              <p className="eyebrow text-moss">Contact</p>

              <h1 className="display mt-5 text-[44px] leading-[1.02] text-ink sm:text-[60px] lg:text-[80px]">
                <em className="font-serif italic text-moss">Talk</em>
                <br />
                <span className="text-ink-muted">to</span> us
                <span className="text-moss">.</span>
              </h1>
            </RevealItem>

            <RevealItem>
              <p className="mt-7 max-w-md text-base leading-relaxed text-ink-muted sm:text-[17px]">
                Partnerships, support, press, security, whatever you need,
                there&apos;s a human at the other end.
              </p>
            </RevealItem>

            {/* Service-level commitment block */}
            <RevealItem>
              <div className="mt-10 max-w-md space-y-2 border-l-2 border-moss/40 pl-4">
                <p className="eyebrow text-moss">Response window</p>
                <p className="text-[13.5px] leading-relaxed text-ink-muted">
                  Most messages get a reply{" "}
                  <span className="font-medium text-ink">inside 24 hours</span>.
                  <br />
                  Security reports get a reply{" "}
                  <span className="font-medium text-ink">inside one</span>.
                </p>
              </div>
            </RevealItem>
          </div>

          {/* Right column, Discord-focused card */}
          <RevealItem variant="scale-up" className="lg:col-span-6">
            <DiscordPanel />
          </RevealItem>
        </Stagger>
      </div>
    </section>
  );
}

function DiscordPanel() {
  return (
    <article className="paper-card relative overflow-hidden p-7 sm:p-9 lg:p-10">
      {/* Warm corner halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 50% at 100% 0%, rgb(var(--clay) / 0.10), transparent 65%), radial-gradient(40% 40% at 0% 100%, rgb(var(--moss) / 0.08), transparent 65%)",
        }}
      />

      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow text-moss">Live channel</p>
        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wider text-clay-deep">
          <span className="relative inline-flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-clay/45" />
            <span className="relative inline-block size-1.5 rounded-full bg-clay" />
          </span>
          Active now
        </span>
      </div>

      <h2 className="display mt-5 text-[28px] leading-[1.06] text-ink sm:text-[32px] lg:text-[36px]">
        Drop into our{" "}
        <em className="font-serif italic text-moss">Discord.</em>
      </h2>

      <p className="mt-3 text-[14.5px] leading-relaxed text-ink-muted sm:text-[15px]">
        We don&apos;t run a ticket queue. The whole team is in there,
        engineers and the BLOKC community. Ask anything.
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Magnetic>
          <Button href={DISCORD} size="lg" variant="primary">
            Open Discord
            <Arrow />
          </Button>
        </Magnetic>
        <Magnetic>
          <Button href={TWITTER} size="lg" variant="outline">
            Follow us on X
          </Button>
        </Magnetic>
      </div>

      {/* Hand-drawn rule + footnote */}
      <div aria-hidden className="rule-hand mt-9" />
      <p className="mt-5 text-[12.5px] leading-relaxed text-ink-subtle">
        Find us on X:{" "}
        <a
          href={TWITTER}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-ink underline decoration-clay decoration-[1.5px] underline-offset-[4px] transition-colors hover:text-clay-deep"
        >
          @blok_cap
        </a>{" "}
        . For everything else, the entire team hangs out in{" "}
        <Link
          href={DISCORD}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-ink underline decoration-clay decoration-[1.5px] underline-offset-[4px] transition-colors hover:text-clay-deep"
        >
          Discord
        </Link>
        .
      </p>
    </article>
  );
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
