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
import { DISCORD_LABEL } from "@/lib/nav";
import { useScrolled } from "@/lib/hooks";
import { useOverDarkBand } from "@/lib/dark-band";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const FOCUSABLE = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";
/** The desktop nav takes over here; the sheet and its button are hidden. */
const DESKTOP = "(min-width: 1024px)";
/** Landscape phones: compact 52 px header that hides on scroll-down. */
const SHORT = "(max-height: 500px)";

/**
 * The header. At the top of a page it's a bar sitting on the hero; once you
 * scroll, a floating frosted pill fades in behind it and the announcement
 * bar folds away. The row's height never changes (MOT-10): only the pill's
 * opacity and scale and the logo's scale animate. It sits on the page's
 * container, so the logo and the Discord button line up with the content
 * below. Clicking the logo on the home page glides back to the top. Over a
 * dark band it turns dark with it. Desktop menus live in DesktopNav.
 *
 * Phones (< 640 px) get no announcement bar; an icon-only Discord button
 * (44 px) sits beside the menu button instead, at every scroll position
 * (D-05). Short viewports get a 52 px row that hides on scroll-down.
 *
 * Below lg the menu button opens MobileMenu, a modal sheet (A11Y-02):
 * - focus moves to its first link, and Tab cycles between the sheet and the
 *   menu button (which stays visible above it as the close control);
 * - #main and the footer are inert and page scroll is locked meanwhile (the
 *   announcement bar is already inert while folded);
 * - Escape or either close button closes it and returns focus to the menu
 *   button; a link tap or navigation closes it;
 * - it also closes when the viewport reaches lg (a tablet rotated to
 *   landscape), which releases the scroll lock (MOB-03).
 */
export function Nav() {
  const pathname = usePathname();
  const scrolled = useScrolled(8);
  // Over a dark band, the header turns dark with it (closed menu only).
  const overDark = useOverDarkBand(40);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  // Short viewports (a phone in landscape): the header slides away on
  // scroll-down and back on any scroll-up (MOB-13, C-motion §4.4). A
  // rAF-throttled passive listener sets html[data-header="hidden"] after
  // more than 8 px of downward travel past 120 px; CSS moves the header with
  // a transform only, and instantly under motion-off. It never hides while
  // a menu is open or focus is inside the header.
  useEffect(() => {
    const root = document.documentElement;
    const header = headerRef.current;
    const short = window.matchMedia(SHORT);
    let anchor = window.scrollY;
    let frame = 0;
    const show = () => root.removeAttribute("data-header");
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const pinned = !short.matches || !!header?.querySelector('[aria-expanded="true"]') || !!header?.contains(document.activeElement);
      if (pinned || y < anchor) {
        show();
        anchor = y;
      } else if (y - anchor > 8) {
        if (y > 120) root.setAttribute("data-header", "hidden");
        anchor = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    short.addEventListener("change", update);
    header?.addEventListener("focusin", show);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      short.removeEventListener("change", update);
      header?.removeEventListener("focusin", show);
      show();
    };
  }, []);

  // Opening a menu always brings the header back.
  useEffect(() => {
    if (open) document.documentElement.removeAttribute("data-header");
  }, [open]);

  // Close on navigation (adjusting state during render, not in an effect).
  const last = useRef(pathname);
  if (last.current !== pathname) {
    last.current = pathname;
    setOpen(false);
  }

  const dismiss = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    const toggle = buttonRef.current;

    // The page behind the sheet: out of the tab order and the accessibility tree.
    const behind = [...document.querySelectorAll<HTMLElement>("#main, body > footer")].filter((el) => !el.inert);
    for (const el of behind) el.inert = true;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // The trap's stops: the menu button, then everything in the sheet.
    const stops = () =>
      [toggle, ...(sheet?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])].filter(
        (el): el is HTMLElement => !!el && el.getClientRects().length > 0,
      );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = stops();
      if (!items.length) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey
        ? i <= 0
          ? items[items.length - 1]
          : null
        : i === -1
          ? (items[1] ?? items[0])
          : i === items.length - 1
            ? items[0]
            : null;
      if (next) {
        e.preventDefault();
        next.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    const desktop = window.matchMedia(DESKTOP);
    const onDesktop = () => desktop.matches && setOpen(false);
    desktop.addEventListener("change", onDesktop);

    // Into the sheet: it stops being inert in this same commit.
    const raf = requestAnimationFrame(() => sheet?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true }));

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
      document.body.style.overflow = prevOverflow;
      for (const el of behind) el.inert = false;
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
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-nav transition-transform duration-base ease-out",
          // Short viewports only (see the effect above): slide away on scroll-down.
          "[html[data-header=hidden]_&]:-translate-y-full [html[data-header=hidden]_&]:duration-fast [html[data-header=hidden]_&]:ease-in",
          overDark && !open && "theme-dark",
        )}
      >
        <AnnouncementBar collapsed={scrolled || open} onDismiss={() => logoRef.current?.focus()} />

        <div className="mx-auto w-full max-w-page px-5 sm:px-8">
          {/* A fixed-height row: scrolling never changes the layout, only the
              pill surface behind it fades and scales in (MOT-10). */}
          <div className="relative flex h-16 items-center justify-between gap-4 sm:h-[72px] [@media(max-height:500px)]:h-[52px]">
            {/* The pill reaches past the content edges, so the logo and the
                buttons stay exactly on them. */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute -inset-x-3 inset-y-1 rounded-lg border border-line/10 bg-canvas/[0.92] shadow-[0_14px_40px_-24px_rgb(var(--shadow))] backdrop-blur-xl sm:-inset-x-5 sm:inset-y-2 [@media(max-height:500px)]:inset-y-0",
                "transition-[opacity,transform] duration-base ease-out",
                scrolled ? "scale-100 opacity-100" : "scale-[0.98] opacity-0",
              )}
            />

            <Link ref={logoRef} href="/" aria-label="BLOK Capital, home" onClick={onLogo} className="relative shrink-0 rounded-md">
              <span className={cn("block origin-left transition-transform duration-base ease-out", scrolled && "scale-[0.85]")}>
                <Logo />
              </span>
            </Link>

            <DesktopNav pathname={pathname} />

            {/* While the sheet is open its pinned bar carries Discord; these
                stay in place (invisible) so the close button doesn't move. */}
            <div className="relative flex items-center gap-2">
              <Button href={social("discord").href} data-placement="header" size="sm" className={cn("hidden sm:inline-flex", open && "invisible")}>
                <DiscordIcon size={15} /> {DISCORD_LABEL}
              </Button>
              {/* Phones: the primary action in reach at every scroll position (D-05). */}
              <a
                href={social("discord").href}
                data-placement="header"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={DISCORD_LABEL}
                aria-describedby="nav-new-tab"
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-full bg-leaf text-canvas transition-[background-color,transform] duration-fast ease-out hover:bg-leaf-hover active:scale-[0.98] sm:hidden",
                  open && "invisible",
                )}
              >
                <DiscordIcon size={20} />
              </a>
              <span id="nav-new-tab" hidden>
                Opens in a new tab
              </span>
              <button
                ref={buttonRef}
                type="button"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-haspopup="dialog"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((o) => !o)}
                className="relative inline-flex size-11 items-center justify-center rounded-full border border-line/12 bg-card/60 text-fg lg:hidden"
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
      {/* After the header, so it follows the menu button in reading order;
          z-[49] keeps the header row (logo, close button) above it. */}
      <MobileMenu ref={sheetRef} open={open} pathname={pathname} onClose={() => setOpen(false)} onDismiss={dismiss} />
    </>
  );
}
