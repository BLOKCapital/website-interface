"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { navGroups, docsLink, isCurrent, type NavGroup } from "@/lib/nav";
import { ExternalIcon } from "@/components/ui/icons";
import { NavIcon, ChevronIcon } from "./NavIcons";
import { NavFeature } from "./NavFeature";
import { cn } from "@/lib/utils";

type Id = NavGroup["id"];

/** Every top-level stop in the row, in tab order: the four menus, then Docs. */
const ORDER: string[] = [...navGroups.map((g) => g.id), "docs"];

/** A click this soon after a hover opened the menu is the same gesture, not a toggle (A11Y-24). */
const HOVER_CLICK_MS = 400;

const FOCUSABLE = "a[href], button:not([disabled])";

/** Every panel is this wide (Panel's grid), so it can be placed before its contents exist. */
const PANEL_W = 720;

/** One menu's contents: its links with a line each, and a featured card. */
function Panel({ group, pathname, onPick }: { group: NavGroup; pathname: string | null; onPick: () => void }) {
  return (
    <div className="grid grid-cols-[1fr_272px] gap-3 p-3" style={{ width: PANEL_W }}>
      <ul className="py-1">
        {group.links.map((l) => {
          const current = !l.href.includes("#") && isCurrent(l.href, pathname);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={onPick}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                aria-current={current ? "page" : undefined}
                className="group/nl flex items-start gap-4 rounded-card p-4 transition-colors duration-fast hover:bg-line/5 focus-visible:bg-line/5"
              >
                <span
                  className={cn(
                    "grid size-11 shrink-0 place-items-center rounded-control border transition-colors duration-fast",
                    current ? "border-leaf/40 bg-leaf/10 text-leaf" : "border-line/10 bg-canvas text-fg-muted group-hover/nl:text-leaf",
                  )}
                >
                  <NavIcon href={l.href} size={20} />
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="flex items-center gap-1.5 text-body font-medium text-fg">
                    {l.label}
                    {l.external && <ExternalIcon size={10} className="text-fg-subtle" />}
                    {current && <span className="size-1.5 rounded-full bg-leaf" aria-hidden />}
                  </span>
                  <span className="mt-1 block text-small text-fg-subtle">{l.hint}</span>
                  {l.external && <span className="sr-only"> (opens in a new tab)</span>}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <NavFeature id={group.id} />
    </div>
  );
}

/**
 * Desktop navigation: three menus, then Security and Docs as plain links.
 * One shared panel serves every menu: it slides under whichever trigger is
 * open and resizes to its contents, while the contents crossfade, so moving
 * between menus feels like one surface changing shape. A soft highlight
 * glides under the item you're pointing at.
 *
 * Disclosure-menu semantics: each trigger is a button with aria-expanded.
 * - Opens on hover (mouse only) or click. A click that follows a hover-open
 *   within 400 ms keeps it open rather than toggling it shut.
 * - Keyboard: the panel sits after the whole row in the DOM, so focus is
 *   steered to keep it next to its trigger: Tab (or ArrowDown) from an open
 *   trigger enters the panel, Shift+Tab from its first link returns to the
 *   trigger, and Tab from its last link closes it and moves on to the next
 *   item in the row. Focusing another item closes the open menu.
 * - Escape closes it from anywhere on the page, and returns focus to the
 *   trigger only if focus was inside the nav. A pointer press outside the
 *   nav (a tap on iPad) closes it, as do focus or the mouse leaving.
 *
 * The panel's contents (links and featured card) render on the first open,
 * not in every page's HTML (PERF-08); the panel element itself, which the
 * triggers' aria-controls names, is always there. Every destination is also
 * linked from the footer or the page body, so nothing is lost to crawlers.
 */
export function DesktopNav({ pathname }: { pathname: string | null }) {
  const [open, setOpen] = useState<Id | null>(null);
  const [hover, setHover] = useState<{ left: number; width: number } | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: PANEL_W, h: 0 });
  const [left, setLeft] = useState(0);
  const triggers = useRef<Partial<Record<string, HTMLElement | null>>>({});
  const nav = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const hoverOpened = useRef<{ id: Id; at: number } | null>(null);
  // The last menu shown, so its contents stay put while the panel fades out.
  const [shown, setShown] = useState<Id>("protocol");
  // Contents mount on the first open and then stay (adjusted during render).
  const [mounted, setMounted] = useState(false);
  if (open && !mounted) setMounted(true);

  // Each trigger sits in its own positioned <li>, so measure the <li> against the row.
  const offsetOf = (el: HTMLElement) => (el.closest("li") ?? el).offsetLeft;
  const highlight = (id: string) => {
    const el = triggers.current[id];
    if (el) setHover({ left: offsetOf(el), width: el.offsetWidth });
  };
  const openMenu = (id: Id) => {
    window.clearTimeout(closeTimer.current);
    setOpen(id);
    setShown(id);
    highlight(id);
  };
  const close = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(null);
    setHover(null);
  };
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(close, 160);
  };

  // Close on navigation (adjusting state during render, not in an effect).
  const lastPath = useRef(pathname);
  if (lastPath.current !== pathname) {
    lastPath.current = pathname;
    setOpen(null);
    setHover(null);
  }
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // While a menu is open: Escape from anywhere (A11Y-06), and a press
  // outside the nav (MOB-16: iPadOS doesn't focus a tapped button, so blur
  // alone never fires there).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const inside = !!nav.current?.contains(document.activeElement);
      setOpen(null);
      setHover(null);
      if (inside) {
        e.preventDefault();
        triggers.current[open]?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!nav.current?.contains(e.target as Node)) {
        setOpen(null);
        setHover(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  // Size and place the panel for the menu being shown. Before the first
  // open there are no contents yet: place it by the known width, so it
  // doesn't slide across on first open, and size it once they mount.
  useLayoutEffect(() => {
    const c = content.current;
    const t = triggers.current[shown];
    const n = nav.current;
    if (!t || !n) return;
    // Layout size, not getBoundingClientRect: the panel is scaled to 0.96
    // while closed, which would shrink the measurement.
    const r = c ? { width: c.offsetWidth, height: c.offsetHeight } : { width: PANEL_W, height: 0 };
    if (c) setSize({ w: r.width, h: r.height });
    // Centre it under the trigger, kept inside the viewport.
    const navLeft = n.getBoundingClientRect().left;
    const want = offsetOf(t) + t.offsetWidth / 2 - r.width / 2;
    const min = 16 - navLeft;
    const max = window.innerWidth - 16 - navLeft - r.width;
    setLeft(Math.max(min, Math.min(max, want)));
  }, [shown, mounted]);

  const panelItems = () => [...(content.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])];
  // Just opened: the panel stops being inert on the next render, so wait a frame.
  const focusFirst = () => requestAnimationFrame(() => panelItems()[0]?.focus());

  const onTriggerKey = (e: KeyboardEvent, id: Id) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openMenu(id);
      focusFirst();
    } else if (e.key === "Tab" && !e.shiftKey && open === id) {
      // Into the open panel, not on to the next trigger (A11Y-01).
      const first = panelItems()[0];
      if (first) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const onPanelKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab" || !open) return;
    const items = panelItems();
    const at = items.indexOf(document.activeElement as HTMLElement);
    if (e.shiftKey && at === 0) {
      e.preventDefault();
      triggers.current[open]?.focus();
    } else if (!e.shiftKey && at === items.length - 1) {
      const next = triggers.current[ORDER[ORDER.indexOf(open) + 1]];
      close();
      if (next) {
        e.preventDefault();
        next.focus();
      }
    }
  };

  // Focus arriving on another item in the row closes the menu that's open,
  // so a collapsed trigger never sits beside someone else's open panel.
  const onItemFocus = (id: string) => {
    if (open && open !== id) close();
  };

  const onTriggerClick = (id: Id) => {
    const h = hoverOpened.current;
    if (open === id && h?.id === id && performance.now() - h.at < HOVER_CLICK_MS) return;
    if (open === id) close();
    else openMenu(id);
  };

  const group = navGroups.find((g) => g.id === shown)!;

  return (
    <nav
      ref={nav}
      aria-label="Primary"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) close();
      }}
      onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
      className="relative hidden lg:block"
    >
      <ul className="relative flex items-center gap-0.5">
        {/* Gliding highlight */}
        <li
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 rounded-full bg-line/7 transition-[transform,width,opacity] duration-base ease-expo",
            hover ? "opacity-100" : "opacity-0",
          )}
          style={{ width: hover?.width ?? 0, transform: `translateX(${hover?.left ?? 0}px)` }}
        />
        {navGroups.map((g) => {
          const on = open === g.id;
          const here = g.links.some((l) => isCurrent(l.href, pathname));
          return (
            <li key={g.id} className="relative">
              <button
                ref={(el) => {
                  triggers.current[g.id] = el;
                }}
                type="button"
                aria-expanded={on}
                aria-controls="nav-panel"
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  if (!on) hoverOpened.current = { id: g.id, at: performance.now() };
                  openMenu(g.id);
                }}
                onClick={() => onTriggerClick(g.id)}
                onKeyDown={(e) => onTriggerKey(e, g.id)}
                onFocus={() => onItemFocus(g.id)}
                className={cn(
                  "relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-small transition-colors duration-fast",
                  on || here ? "text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                {g.label}
                <ChevronIcon className={cn("transition-transform duration-base ease-expo", on && "rotate-180")} />
                {here && <span aria-hidden className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-leaf" />}
              </button>
            </li>
          );
        })}
        <li className="relative">
          <a
            ref={(el) => {
              triggers.current.docs = el;
            }}
            href={docsLink.href}
            target="_blank"
            rel="noopener noreferrer"
            onPointerEnter={(e) => {
              if (e.pointerType !== "mouse") return;
              close();
              highlight("docs");
            }}
            onPointerLeave={() => !open && setHover(null)}
            onFocus={() => onItemFocus("docs")}
            className="relative inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-small text-fg-muted transition-colors duration-fast hover:text-fg"
          >
            {docsLink.label}
            <ExternalIcon size={11} className="opacity-60" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      </ul>

      {/* The shared, shape-shifting panel */}
      <div
        id="nav-panel"
        onPointerEnter={() => window.clearTimeout(closeTimer.current)}
        onKeyDown={onPanelKey}
        inert={!open}
        className={cn(
          "absolute top-full mt-3 origin-top overflow-hidden rounded-panel border border-line/12 bg-card shadow-e3",
          "transition-[transform,width,height,opacity,filter] duration-base ease-expo",
          open ? "opacity-100 blur-0" : "pointer-events-none opacity-0 blur-[2px]",
        )}
        // Slide and scale in one transform: the morph opens at 0.96.
        style={{ width: size.w, height: size.h || undefined, transform: `translateX(${left}px) scale(${open ? 1 : 0.96})` }}
      >
        {mounted && (
          <div ref={content} key={shown} className="absolute left-0 top-0 w-max animate-enter-fade [animation-duration:250ms]">
            <Panel group={group} pathname={pathname} onPick={close} />
          </div>
        )}
      </div>
    </nav>
  );
}
