"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

/** Route-level error boundary; `reset()` re-attempts the render. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface to the console until an error reporter is wired up.
    console.error(error);
  }, [error]);

  return (
    <section role="alert" className="mx-auto flex min-h-[70vh] w-full max-w-page flex-col justify-center px-5 pb-16 pt-32 sm:px-8">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="display mt-4 text-h2 text-fg">This page didn&apos;t load.</h1>
      <p className="mt-5 max-w-md text-lead text-fg-muted">An unexpected error interrupted it. Try again, or head back home.</p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="secondary">
          Back to home
        </Button>
      </div>
    </section>
  );
}
