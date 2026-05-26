"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Route-level error boundary. App Router renders this on any uncaught error
 * within the route segment; `reset()` re-attempts the render.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the console for now; wire to an error reporter (Sentry, etc.)
    // when one is added.
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="script text-[26px] text-clay">a stray gust</p>
      <h1 className="display mt-3 text-[40px] leading-tight text-ink sm:text-[52px]">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-muted">
        An unexpected error interrupted this page. You can try again, or head
        back to solid ground.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="outline">
          Back to the garden
        </Button>
      </div>
    </section>
  );
}
