"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { reportException } from "@/lib/analytics";
import { social } from "@/lib/data/socials";

/**
 * Route-level error boundary; `reset()` re-attempts the render. Only the
 * message is an alert (A11Y-38): focus moves to the heading, and the
 * message is announced once. The error is reported as a GA4 `exception`
 * when Analytics consent allows it (MISS-07).
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
    <section className="mx-auto flex min-h-[70vh] w-full max-w-page flex-col justify-center px-gutter pb-16 pt-32">
      <p className="eyebrow">Something went wrong</p>
      <h1 ref={heading} tabIndex={-1} className="display mt-4 text-h2 text-fg focus:outline-none">
        This page didn&apos;t load.
      </h1>
      <p role="alert" className="mt-5 max-w-md text-lead text-fg-muted">
        An unexpected error interrupted it. Try again, or head back home.
      </p>
      <p className="mt-3 max-w-md text-small text-fg-muted" data-placement="error_page">
        If it keeps happening, tell us in the{" "}
        <a href={social("discord").href} target="_blank" rel="noopener noreferrer" className="text-leaf underline underline-offset-2">
          Discord
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        .
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="secondary">
          Back to home
        </Button>
      </div>
    </section>
  );
}
