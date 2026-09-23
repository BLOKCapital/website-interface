"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { CrossIcon, DiscordIcon, ExternalIcon, MenuIcon } from "@/components/ui/icons";
import { primaryNav } from "@/lib/nav";
import { CommandMenu } from "./CommandMenu";
import { social } from "@/lib/data/socials";
import { useScrolled } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const isCurrent = (href: string, path: string | null) =>
  !!path && (path === href || path.startsWith(`${href}/`));

/**
 * Sticky header. Transparent over the hero, solid once scrolled. Below lg
 * the links move into a sheet that is `inert` while closed (so it's out of
 * the tab order), closes on Escape and on navigation, and locks page scroll.
 */
export function Nav() {
  const pathname = usePathname();
  const scrolled = useScrolled(8);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on navigation (adjusting state during render, not in an effect).
  const last = useRef(pathname);
  if (last.current !== pathname) {
    last.current = pathname;
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300",
        solid ? "border-line/[0.08] bg-canvas/85 backdrop-blur-xl" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-page items-center justify-between gap-6 px-5 sm:h-[72px] sm:px-8">
        <Link href="/" aria-label="BLOK Capital, home" className="shrink-0 rounded-md">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((l) => {
              const external = "external" in l;
              const current = !external && isCurrent(l.href, pathname);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[14.5px] transition-colors",
                      current ? "bg-line/[0.07] text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {l.label}
                    {external && (
                      <>
                        <ExternalIcon size={11} className="opacity-60" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <CommandMenu />
          <Button href={social("discord").href} size="sm" className="hidden sm:inline-flex">
            <DiscordIcon size={15} /> Join Discord
          </Button>
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line/12 text-fg lg:hidden"
          >
            {open ? <CrossIcon size={18} /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        inert={!open}
        className={cn(
          "grid overflow-hidden border-t border-line/[0.08] bg-canvas transition-[grid-template-rows,opacity] duration-300 lg:hidden",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] border-transparent opacity-0",
        )}
      >
        <div className="min-h-0">
          <nav aria-label="Mobile" className="mx-auto max-w-page px-5 pb-8 pt-3 sm:px-8">
            <ul>
              {primaryNav.map((l) => {
                const external = "external" in l;
                const current = !external && isCurrent(l.href, pathname);
                return (
                  <li key={l.href} className="border-b border-line/[0.07]">
                    <Link
                      href={l.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between py-4 text-[20px] display",
                        current ? "text-leaf" : "text-fg",
                      )}
                    >
                      {l.label}
                      {external && <ExternalIcon size={14} className="text-fg-subtle" />}
                    </Link>
                  </li>
                );
              })}
              <li className="border-b border-line/[0.07]">
                <Link href="/contact" className="flex py-4 text-[20px] display text-fg">
                  Contact
                </Link>
              </li>
            </ul>
            <Button href={social("discord").href} size="lg" className="mt-7 w-full">
              <DiscordIcon /> Join the Discord
            </Button>
            <SocialLinks only={["x", "telegram", "farcaster", "github", "youtube"]} className="mt-6 justify-center" />
          </nav>
        </div>
      </div>
    </header>
  );
}
