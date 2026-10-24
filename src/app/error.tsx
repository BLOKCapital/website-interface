"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { DiscordIcon } from "@/components/ui/icons";
import { GardenAsset } from "@/components/ui/GardenAsset";
import { reportException } from "@/lib/analytics";
import { social } from "@/lib/data/socials";

/**
 * Route-level error boundary; `reset()` re-attempts the render. Only the
 * message is an alert (A11Y-38): focus moves to the heading, and the
 * message is announced once. The error is reported as a GA4 `exception`
 * when Analytics consent allows it (MISS-07).
 *
 * It looks like the 404: the notebook paper, a heavy headline with its
 * payoff by hand, a Garden sticker with a stamp on it, the two ways out,
 * and the Discord in its own colour for anyone it keeps happening to.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    console.error(error);
    reportException(`${error.name}: ${error.message}`, true);
  }, [error]);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section className="paper-ruled relative overflow-hidden">
      <div aria-hidden className="glow-leaf pointer-events-none absolute -right-40 top-10 h-[520px] w-[720px] opacity-50" />
      <div className="relative mx-auto grid min-h-[86vh] w-full max-w-page items-center gap-12 px-gutter pb-20 pt-32 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow">Error · something broke</p>
          <h1 ref={heading} tabIndex={-1} className="display mt-5 text-h1 text-balance text-fg focus:outline-none">
            This page <em>didn&apos;t load.</em>
          </h1>
          <p role="alert" className="mt-6 max-w-md text-lead text-fg-muted">
            An unexpected error interrupted it. Try again, or head back home.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button onClick={reset} size="lg" variant="solid">
              Try again
            </Button>
            <Button href="/" size="lg" variant="secondary">
              Back to home
            </Button>
          </div>

          <a
            href={social("discord").href}
            target="_blank"
            rel="noopener noreferrer"
            data-placement="error_page"
            className="mt-12 inline-flex items-center gap-3 rounded-full bg-[#5865F2] py-1.5 pl-1.5 pr-5 text-small font-semibold text-white shadow-e1 transition-shadow duration-fast can-hover:hover:shadow-e2"
          >
            <span aria-hidden className="grid size-8 place-items-center rounded-full bg-white text-[#5865F2]">
              <DiscordIcon size={16} />
            </span>
            Keeps happening? Tell us in the Discord
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>

        <div aria-hidden className="relative mx-auto hidden aspect-square w-full max-w-[440px] lg:col-span-5 lg:block">
          <div className="absolute inset-0 animate-float">
            <GardenAsset n={4} sizes="440px" className="sticker" />
          </div>
          <span className="stamp absolute left-2 top-10 bg-canvas/80 px-4 py-2 text-h4 text-danger backdrop-blur-sm">Oops</span>
          <span className="note absolute bottom-6 right-0 -rotate-6 text-h4">we&apos;re on it</span>
        </div>
      </div>
    </section>
  );
}
