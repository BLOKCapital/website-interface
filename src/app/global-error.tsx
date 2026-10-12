"use client";

import "./globals.css";
import { useEffect, useRef } from "react";
import { reportException } from "@/lib/analytics";
import { social } from "@/lib/data/socials";

/**
 * Last-resort boundary for errors in the root layout itself (the header,
 * the cookie banner…). It replaces the whole document, so it brings its own
 * <html> and <body>, and the site's tokens with system fonts in place of
 * the layout's web fonts. Same message, help line and reporting as
 * app/error.tsx (MISS-07, A11Y-38, CRO-28).
 */

const fonts = {
  "--font-body": 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  "--font-display": 'Georgia, "Times New Roman", serif',
  "--font-mono": "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
} as React.CSSProperties;

const pill =
  "inline-flex h-11 items-center justify-center rounded-full px-5 text-[14.5px] font-medium transition-colors duration-fast";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    console.error(error);
    reportException(`${error.name}: ${error.message}`, true);
  }, [error]);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);

  return (
    <html lang="en-GB" style={fonts}>
      <body className="min-h-screen bg-canvas text-fg antialiased">
        <title>Something went wrong · BLOK Capital</title>
        <main className="mx-auto flex min-h-screen w-full max-w-page flex-col justify-center px-5 py-16 sm:px-8">
          <p className="eyebrow">Something went wrong</p>
          <h1 ref={heading} tabIndex={-1} className="display mt-4 text-h2 text-fg focus:outline-none">
            BLOK Capital didn&apos;t load.
          </h1>
          <p role="alert" className="mt-5 max-w-md text-lead text-fg-muted">
            An unexpected error stopped the site. Try again, or reload the home page.
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
            <button type="button" onClick={reset} className={`${pill} bg-leaf text-canvas hover:bg-leaf-hover`}>
              Try again
            </button>
            {/* A full page load, not client navigation: the layout is what failed. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className={`${pill} border border-line/15 bg-card text-fg hover:border-line/30 hover:bg-raised`}>
              Back to home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
