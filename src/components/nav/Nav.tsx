"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/lib/hooks";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "https://docs.blokcapital.io", label: "Docs", external: true },
  { href: "https://docsend.com/view/4j6qvvrudyr6izyb", label: "Whitepaper", external: true },
  { href: "/contact", label: "Contact" },
] as const;

function isCurrent(href: string, pathname: string | null) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();
  const scrolled = useScrolled(12);
  const [open, setOpen] = useState(false);

  // Close the mobile menu on route change by adjusting state during render
  // (the documented alternative to an effect) — also covers back/forward nav.
  // Previous path is tracked in a ref since it only gates the reset, never renders.
  const lastPathRef = useRef(pathname);
  if (pathname !== lastPathRef.current) {
    lastPathRef.current = pathname;
    setOpen(false);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-400 ease-in-soft",
        scrolled
          ? "border-b border-ink/8 bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:h-[68px] sm:px-8">
        <Link
          href="/"
          className="-m-1 inline-flex items-center rounded p-1 text-ink transition-opacity duration-200 hover:opacity-85 focus:outline-none"
          aria-label="BLOK Capital, Home"
        >
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6 lg:gap-8">
            {links.map((l) => {
              const external = "external" in l && l.external;
              const current = isCurrent(l.href, pathname);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "group/n relative inline-flex items-center gap-1.5 py-1 text-[14px] font-medium transition-colors duration-200",
                      current ? "text-ink" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    {l.label}
                    {external && (
                      <>
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          aria-hidden
                          className="opacity-60 transition-transform duration-200 group-hover/n:-translate-y-0.5"
                        >
                          <path
                            d="M2 8 L8 2 M3.5 2 L8 2 L8 6.5"
                            stroke="currentColor"
                            strokeWidth="1.1"
                            fill="none"
                          />
                        </svg>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </>
                    )}
                    {/* Active / hover underline, clay hairline that draws in */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px bg-clay transition-[width] duration-300 ease-in-soft",
                        current ? "w-full" : "w-0 group-hover/n:w-full",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="primary"
            size="sm"
            href="https://discord.com/invite/blokc"
          >
            Join Discord
            <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M2 7 H11 M7 3 L11 7 L7 11"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 bg-paper-warm text-ink transition active:scale-[0.97] md:hidden"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            {open ? (
              <path
                d="M2 2 L12 12 M12 2 L2 12"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M1.5 4 H12.5 M1.5 10 H12.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu, slides down with a soft fade */}
      <div
        className={cn(
          "overflow-hidden border-ink/10 bg-paper/95 backdrop-blur-md transition-[max-height,opacity,border-color] duration-400 ease-in-soft md:hidden",
          open
            ? "max-h-[640px] border-t opacity-100"
            : "max-h-0 border-transparent opacity-0",
        )}
        aria-hidden={!open}
      >
        <ul className="flex flex-col px-5 pb-5 pt-2">
          {links.map((l) => {
            const external = "external" in l && l.external;
            const current = isCurrent(l.href, pathname);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group/m flex items-center justify-between border-b border-ink/8 py-3.5 text-[15px] font-medium transition-colors last:border-b-0",
                    current ? "text-ink" : "text-ink-muted hover:text-ink",
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    {current && (
                      <span
                        aria-hidden
                        className="inline-block size-1.5 rounded-full bg-clay"
                      />
                    )}
                    {l.label}
                  </span>
                  {external ? (
                    <svg width="11" height="11" viewBox="0 0 10 10" aria-hidden>
                      <path
                        d="M2 8 L8 2 M3.5 2 L8 2 L8 6.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        fill="none"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      aria-hidden
                      className="opacity-50 transition-transform duration-200 group-hover/m:translate-x-0.5"
                    >
                      <path
                        d="M2 7 H11 M7 3 L11 7 L7 11"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </Link>
              </li>
            );
          })}
          <li className="mt-5">
            <Button
              variant="primary"
              size="md"
              href="https://discord.com/invite/blokc"
              className="w-full"
            >
              Join Discord
              <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden>
                <path
                  d="M2 7 H11 M7 3 L11 7 L7 11"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}
