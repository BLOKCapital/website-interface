"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { GardenAsset } from "@/components/ui/GardenAsset";
import { cn } from "@/lib/utils";

/**
 * Footer brand banner — the closing page of the journal.
 *
 * Hidden on legal documentation routes (`/legal/*`) so the heavy editorial
 * close doesn't intrude on long-form policy reading. The compact Footer
 * sitemap still renders there.
 */
export function FooterBanner() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // `revealed` is driven by viewport intersection (or reduced-motion), which is
    // only knowable on the client post-layout — it can't be a useState initializer.
    if (prefersReduced) {
      // react-doctor-disable-next-line react-doctor/no-initialize-state
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    // react-doctor-disable-next-line react-doctor/no-initialize-state
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Suppress the editorial banner on legal pages.
  if (pathname?.startsWith("/legal/")) return null;

  return (
    <div
      ref={ref}
      className="paper relative isolate overflow-hidden border-b border-ink/10"
    >
      {/* Warm horizon, moss rising from below + faint clay corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background: `
            radial-gradient(70% 90% at 50% 115%, rgb(var(--moss) / 0.18), transparent 70%),
            radial-gradient(40% 60% at 12% 0%, rgb(var(--clay) / 0.08), transparent 60%)
          `,
        }}
      />

      {/* Wax seal, moved to the top and intentionally allowed to overlap
          both the heading text on the left and the garden render on the
          right. Reads as a real stamp pressed at the top of the letter. */}
      <SealMark
        className={cn(
          "pointer-events-none absolute right-4 top-6 z-20 transition-all ease-in-soft sm:right-10 sm:top-10 lg:right-20 lg:top-12",
          revealed
            ? "translate-y-0 opacity-100 duration-[1000ms] delay-[420ms]"
            : "-translate-y-3 opacity-0 duration-[500ms]",
        )}
      />

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Heading column */}
          <div
            className={cn(
              "transition-all ease-in-soft lg:col-span-7",
              revealed
                ? "translate-y-0 opacity-100 duration-[900ms]"
                : "translate-y-4 opacity-0 duration-[500ms]",
            )}
          >
            <div className="relative mb-7 flex items-center gap-3 text-clay">
              {/* Oversized leaf, hangs into the margin and is allowed to
                  overlap the script text. Slight rotation gives it a
                  pressed-flower feel. */}
              <LeafMark
                size={68}
                className="pointer-events-none -ml-4 -mt-3 shrink-0 -rotate-12"
              />
              <p className="script text-[28px] leading-none">our promise</p>
            </div>

            <h2 className="display text-[44px] leading-[1.02] text-ink sm:text-[60px] lg:text-[80px]">
              Everyone deserves
              <br />
              <span className="text-ink-muted">a </span>
              <em className="font-serif italic text-moss">Garden</em>
              <span className="text-moss">.</span>
            </h2>

            <p
              className={cn(
                "mt-7 max-w-xl text-base leading-relaxed text-ink-muted transition-all ease-in-soft sm:text-[17px]",
                revealed
                  ? "translate-y-0 opacity-100 duration-[900ms] delay-[120ms]"
                  : "translate-y-3 opacity-0 duration-[500ms]",
              )}
            >
              Self-custody, real returns, on-chain receipts, accessible to
              anyone with a wallet, not only the people who already have a
              wealth manager.
            </p>

            {/* Closing P.S., a quiet, hand-set invitation in place of two
                hard CTAs. Reads like the last line of a letter. */}
            <p
              className={cn(
                "mt-10 flex flex-wrap items-baseline gap-x-3 text-[14.5px] leading-relaxed text-ink-muted transition-all ease-in-soft sm:text-[15.5px]",
                revealed
                  ? "translate-y-0 opacity-100 duration-[900ms] delay-[240ms]"
                  : "translate-y-3 opacity-0 duration-[500ms]",
              )}
            >
              <span className="script text-[22px] leading-none text-clay">
                P.S.
              </span>
              <span>
                Your Garden is one transaction away. You can{" "}
                <Link
                  href="https://docs.blokcapital.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative font-medium text-ink transition-colors hover:text-clay-deep"
                >
                  <span className="underline decoration-clay decoration-[1.5px] underline-offset-[6px]">
                    read the docs first
                  </span>
                  <span
                    aria-hidden
                    className="inline-block translate-x-1 transition-transform duration-400 ease-in-soft group-hover:translate-x-2"
                  >
                    {" "}
                    →
                  </span>
                </Link>
                .
              </span>
            </p>
          </div>

          {/* Garden render + sign-off */}
          <div
            className={cn(
              "flex flex-col items-center transition-all ease-in-soft lg:col-span-5 lg:items-end",
              revealed
                ? "translate-y-0 opacity-100 duration-[1000ms] delay-[300ms]"
                : "translate-y-4 opacity-0 duration-[500ms]",
            )}
          >
            <div className="relative size-[280px] animate-sway sm:size-[320px]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, rgb(var(--clay) / 0.18), transparent 70%), radial-gradient(60% 60% at 50% 80%, rgb(var(--moss) / 0.22), transparent 70%)",
                }}
              />
              <GardenAsset
                n={7}
                quality={94}
                sizes="(max-width: 1024px) 400px, 480px"
              />
            </div>

            <div className="mt-2 flex items-center gap-3 lg:flex-row-reverse">
              <span aria-hidden className="h-px w-12 bg-ink/20" />
              <span className="script text-[22px] leading-none text-clay">
                BLOKC Community
              </span>
            </div>

            <p className="mt-2 text-[12.5px] leading-relaxed text-ink-subtle lg:text-right">
              Founded 2023 · It&apos;s crypto, but different.
            </p>
          </div>
        </div>

        {/* Horizon hairline, draws on with the reveal */}
        <div className="relative mt-16 h-px w-full overflow-hidden">
          <div
            aria-hidden
            className={cn(
              "rule-hand absolute inset-0 origin-left transition-transform ease-in-soft",
              revealed
                ? "scale-x-100 duration-[1200ms] delay-[400ms]"
                : "scale-x-0 duration-[400ms]",
            )}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Botanical leaf mark — willow-almond silhouette with a real stem, a central
 * midrib, two pairs of lateral veins, and a half-tone shadow for a sense of
 * curl. Reads as a botanical illustration rather than a generic icon.
 *
 * Renders in `currentColor` so it inherits from the surrounding text color
 * (clay in the eyebrow). The veins use cream (--paper) so they pop against
 * the clay blade.
 */
function LeafMark({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
    >
      {/* Stem, curves out from the base */}
      <path
        d="M11.4 18.8 C 11.7 20.3 11.4 21.6 10.5 22.4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* Blade, pointed tip top, curve meets at the stem base */}
      <path
        d="M11.4 18.8
           C 4.2 15.4 4.5 8.4 11 2
           C 18.5 8.4 18.8 15.4 11.4 18.8 Z"
        fill="currentColor"
      />

      {/* Half-tone shadow on the left lobe, gives the leaf a sense of curl */}
      <path
        d="M11.4 18.8
           C 4.2 15.4 4.5 8.4 11 2
           L 11.1 18.85 Z"
        fill="rgb(0 0 0 / 0.12)"
      />

      {/* Central midrib */}
      <path
        d="M11 2.6 C 11.2 8.4 11.3 13.8 11.4 18.6"
        stroke="rgb(var(--paper))"
        strokeWidth="0.7"
        strokeLinecap="round"
        fill="none"
        opacity="0.92"
      />

      {/* Lateral veins, left lobe */}
      <path
        d="M11.2 7.4 Q 9 8.6 6.9 9.6"
        stroke="rgb(var(--paper))"
        strokeWidth="0.55"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M11.3 12.4 Q 8.8 13.6 7 14.7"
        stroke="rgb(var(--paper))"
        strokeWidth="0.55"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* Lateral veins, right lobe */}
      <path
        d="M11.3 7.4 Q 13.6 8.6 15.4 9.6"
        stroke="rgb(var(--paper))"
        strokeWidth="0.55"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M11.4 12.4 Q 13.8 13.6 15.3 14.7"
        stroke="rgb(var(--paper))"
        strokeWidth="0.55"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

/**
 * Wax-seal-style stamp. A small circular mark to close the letter visually,
 * in lieu of a CTA button row. Pure SVG, low-key, sits at the bottom-right.
 *
 * Design notes:
 *  - Subtle drop shadow underneath gives a "pressed onto paper" feel.
 *  - Radial wax gradient (lighter centre, darker edge) suggests a pressed
 *    blob of wax rather than a flat decal.
 *  - Two text arcs: BLOK · CAPITAL along the top, "est · MMXXIII" along
 *    the bottom (reading right-side-up on both arcs).
 *  - Centre imprint is a refined botanical leaf with stem, midrib and
 *    lateral veins — mirrors the eyebrow LeafMark for a coherent motif.
 *  - Two side-dot ornaments flank the central monogram inside the dashed
 *    periphery ring, mimicking the dot separators on real coin engravings.
 */
function SealMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex size-[140px] items-center justify-center -rotate-[10deg] sm:size-[168px] lg:size-[184px]",
        className,
      )}
    >
      <svg
        viewBox="0 0 112 112"
        aria-hidden
        className="size-full"
      >
        <defs>
          {/* Wax depth gradient, lighter pressed centre, darker edge */}
          <radialGradient id="seal-wax-fill" cx="48%" cy="38%" r="62%">
            <stop offset="0%" stopColor="rgb(var(--clay) / 0.24)" />
            <stop offset="60%" stopColor="rgb(var(--clay) / 0.14)" />
            <stop offset="100%" stopColor="rgb(var(--clay) / 0.06)" />
          </radialGradient>
          {/* Top arc, text reads left→right along the upper edge */}
          <path
            id="seal-top-arc"
            d="M 20 56 A 36 36 0 0 1 92 56"
            fill="none"
          />
          {/* Bottom arc, text reads left→right along the lower edge.
              Note: drawn right→left so glyph tops face outward (down) and
              render right-side-up. */}
          <path
            id="seal-bottom-arc"
            d="M 92 56 A 36 36 0 0 1 20 56"
            fill="none"
          />
        </defs>

        {/* Drop shadow, offset slightly so the seal looks pressed on paper */}
        <circle cx="57" cy="58" r="51" fill="rgb(var(--clay-deep) / 0.06)" />

        {/* Main wax body, radial-tone fill with a subtle deep-clay border */}
        <circle
          cx="56"
          cy="56"
          r="51"
          fill="url(#seal-wax-fill)"
          stroke="rgb(var(--clay-deep) / 0.42)"
          strokeWidth="0.8"
        />

        {/* Dashed inner periphery, the text guide ring */}
        <circle
          cx="56"
          cy="56"
          r="45"
          fill="none"
          stroke="rgb(var(--clay) / 0.55)"
          strokeWidth="0.5"
          strokeDasharray="1 3"
        />

        {/* Solid monogram ring, encloses the central imprint */}
        <circle
          cx="56"
          cy="56"
          r="24"
          fill="rgb(var(--paper) / 0.45)"
          stroke="rgb(var(--clay-deep) / 0.45)"
          strokeWidth="0.6"
        />

        {/* Side ornaments, small star-like dots flanking the centre */}
        <g fill="rgb(var(--clay-deep) / 0.6)">
          <circle cx="26" cy="56" r="1.5" />
          <circle cx="86" cy="56" r="1.5" />
        </g>

        {/* Top arc text */}
        <text
          fontSize="7.5"
          fontFamily="var(--font-display)"
          fontStyle="italic"
          letterSpacing="2.4"
          fontWeight="500"
          fill="rgb(var(--clay-deep))"
        >
          <textPath href="#seal-top-arc" startOffset="50%" textAnchor="middle">
            BLOK · CAPITAL
          </textPath>
        </text>

        {/* Bottom arc text */}
        <text
          fontSize="6.5"
          fontFamily="var(--font-display)"
          fontStyle="italic"
          letterSpacing="2.2"
          fill="rgb(var(--clay-deep) / 0.85)"
        >
          <textPath href="#seal-bottom-arc" startOffset="50%" textAnchor="middle">
            est · MMXXIII
          </textPath>
        </text>

        {/* Central botanical imprint, refined leaf with stem, midrib + veins */}
        <g transform="translate(44.5 44)">
          {/* Stem */}
          <path
            d="M11.4 18.8 C 11.7 20.3 11.4 21.6 10.5 22.4"
            stroke="rgb(var(--clay-deep))"
            strokeWidth="1.1"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          {/* Blade */}
          <path
            d="M11.4 18.8 C 4.2 15.4 4.5 8.4 11 2 C 18.5 8.4 18.8 15.4 11.4 18.8 Z"
            fill="rgb(var(--clay-deep))"
            opacity="0.88"
          />
          {/* Half-tone shadow on the left lobe, sense of curl */}
          <path
            d="M11.4 18.8 C 4.2 15.4 4.5 8.4 11 2 L 11.1 18.85 Z"
            fill="rgb(0 0 0 / 0.15)"
          />
          {/* Midrib */}
          <path
            d="M11 2.6 C 11.2 8.4 11.3 13.8 11.4 18.6"
            stroke="rgb(var(--paper))"
            strokeWidth="0.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          {/* Lateral veins, left lobe */}
          <path
            d="M11.2 7.4 Q 9 8.6 6.9 9.6 M 11.3 12.4 Q 8.8 13.6 7 14.7"
            stroke="rgb(var(--paper))"
            strokeWidth="0.45"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
          />
          {/* Lateral veins, right lobe */}
          <path
            d="M11.3 7.4 Q 13.6 8.6 15.4 9.6 M 11.4 12.4 Q 13.8 13.6 15.3 14.7"
            stroke="rgb(var(--paper))"
            strokeWidth="0.45"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
          />
        </g>
      </svg>
    </span>
  );
}
