"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { DiscordIcon } from "@/components/ui/icons";
import { AnnouncementBar } from "./AnnouncementBar";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { social } from "@/lib/data/socials";
import { useOverDarkBand, useScrolled } from "@/lib/hooks";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The header. At the top of a page it's a bar sitting on the hero; once you
 * scroll it becomes a floating frosted pill and the announcement bar folds
 * away. Either way it sits on the page's container, so the logo and the
 * Discord button line up with the content below. Clicking the logo on the
 * home page glides back to the top. Over a dark band it turns
 * dark with it. Desktop menus live in DesktopNav; below lg a full-screen
 * sheet (MobileMenu) that closes on Escape and on navigation and locks
 * page scroll while open.
 */
export function Nav() {
  const pathname = usePathname();
  const scrolled = useScrolled(8);
  // Over a dark band, the header turns dark with it (closed menu only).
  const overDark = useOverDarkBand(40);
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

  // Already home: glide to the top instead of re-navigating to the same page.
  const onLogo = (e: React.MouseEvent) => {
    if (pathname !== "/" || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    setOpen(false);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50", overDark && !open && "theme-dark")}>
      <AnnouncementBar collapsed={scrolled || open} />
      <MobileMenu open={open} pathname={pathname} />

      <div className={cn("relative mx-auto w-full max-w-page px-5 transition-[padding] duration-slow ease-expo sm:px-8", scrolled && "pt-3")}>
        {/* Negative margins let the pill surface reach past the content
            edges while the logo and buttons stay exactly on them. */}
        <div
          className={cn(
            "-mx-3 flex items-center justify-between gap-4 border px-3 transition-[height,border-radius,background-color,border-color,box-shadow] duration-slow ease-expo sm:-mx-5 sm:px-5",
            scrolled
              ? "h-14 rounded-lg border-line/10 bg-canvas/[0.92] shadow-[0_14px_40px_-24px_rgb(var(--shadow))] backdrop-blur-xl"
              : "h-16 rounded-[28px] border-transparent sm:h-[72px]",
          )}
        >
          <Link href="/" aria-label="BLOK Capital, home" onClick={onLogo} className="shrink-0 rounded-md">
            <Logo className={cn("transition-[height] duration-slow ease-expo", scrolled && "h-7 sm:h-7")} />
          </Link>

          <DesktopNav pathname={pathname} />

          <div className="flex items-center gap-2">
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
              className="relative inline-flex size-10 items-center justify-center rounded-full border border-line/12 bg-card/60 text-fg lg:hidden"
            >
              {/* Two lines that fold into a cross */}
              <span aria-hidden className="relative block h-3 w-4">
                <span className={cn("absolute left-0 block h-px w-4 bg-current transition-transform duration-base ease-expo", open ? "top-1.5 rotate-45" : "top-0.5")} />
                <span className={cn("absolute left-0 block h-px w-4 bg-current transition-transform duration-base ease-expo", open ? "top-1.5 -rotate-45" : "top-2.5")} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
