"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { navGroups, docsLink, isCurrent, type NavGroup } from "@/lib/nav";
import { ExternalIcon } from "@/components/ui/icons";
import { NavIcon, ChevronIcon } from "./NavIcons";
import { NavFeature } from "./NavFeature";
import { cn } from "@/lib/utils";

type Id = NavGroup["id"];

/** One menu's contents: its links with a line each, and a featured card. */
function Panel({ group, pathname, onPick }: { group: NavGroup; pathname: string | null; onPick: () => void }) {
  return (
    <div className="grid w-[720px] grid-cols-[1fr_272px] gap-3 p-3">
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
                className="group/nl flex items-start gap-4 rounded-2xl p-4 transition-colors duration-fast hover:bg-line/[0.05] focus-visible:bg-line/[0.05]"
              >
                <span
                  className={cn(
                    "grid size-11 shrink-0 place-items-center rounded-xl border transition-colors duration-fast",
                    current ? "border-leaf/40 bg-leaf/10 text-leaf" : "border-line/10 bg-canvas text-fg-muted group-hover/nl:text-leaf",
                  )}
                >
                  <NavIcon href={l.href} size={20} />
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="flex items-center gap-1.5 text-[16px] font-medium text-fg">
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
 * Desktop navigation: three menus and Docs. One shared panel serves every
 * menu: it slides under whichever trigger is open and resizes to its
 * contents, while the contents crossfade, so moving between menus feels like
 * one surface changing shape. A soft highlight glides under the item you're
 * pointing at.
 *
 * Disclosure-menu semantics: each trigger is a button with aria-expanded.
 * Opens on hover (mouse only) or click; ArrowDown moves into the menu;
 * Escape closes it and returns focus; focus or pointer leaving closes it.
 */
export function DesktopNav({ pathname }: { pathname: string | null }) {
  const [open, setOpen] = useState<Id | null>(null);
  const [hover, setHover] = useState<{ left: number; width: number } | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 720, h: 0 });
  const [left, setLeft] = useState(0);
  const triggers = useRef<Partial<Record<string, HTMLElement | null>>>({});
  const nav = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  // The last menu shown, so its contents stay put while the panel fades out.
  const [shown, setShown] = useState<Id>("protocol");

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

  // Size and place the panel for the menu being shown.
  useLayoutEffect(() => {
    const c = content.current;
    const t = triggers.current[shown];
    const n = nav.current;
    if (!c || !t || !n) return;
    // Layout size, not getBoundingClientRect: the panel is scaled to 0.96
    // while closed, which would shrink the measurement.
    const r = { width: c.offsetWidth, height: c.offsetHeight };
    setSize({ w: r.width, h: r.height });
    // Centre it under the trigger, kept inside the viewport.
    const navLeft = n.getBoundingClientRect().left;
    const want = offsetOf(t) + t.offsetWidth / 2 - r.width / 2;
    const min = 16 - navLeft;
    const max = window.innerWidth - 16 - navLeft - r.width;
    setLeft(Math.max(min, Math.min(max, want)));
  }, [shown]);

  const focusFirst = () => requestAnimationFrame(() => content.current?.querySelector<HTMLElement>("a")?.focus());

  const onTriggerKey = (e: KeyboardEvent, id: Id) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openMenu(id);
      focusFirst();
    }
  };
  const onNavKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      const id = open;
      close();
      triggers.current[id]?.focus();
    }
  };

  const group = navGroups.find((g) => g.id === shown)!;

  return (
    <nav
      ref={nav}
      aria-label="Primary"
      onKeyDown={onNavKey}
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
            "pointer-events-none absolute inset-y-0 rounded-full bg-line/[0.07] transition-[transform,width,opacity] duration-base ease-expo",
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
                onPointerEnter={(e) => e.pointerType === "mouse" && openMenu(g.id)}
                onClick={() => (on ? close() : openMenu(g.id))}
                onKeyDown={(e) => onTriggerKey(e, g.id)}
                className={cn(
                  "relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[14.5px] transition-colors duration-fast",
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
            className="relative inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[14.5px] text-fg-muted transition-colors duration-fast hover:text-fg"
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
        inert={!open}
        className={cn(
          "absolute top-full mt-3 origin-top overflow-hidden rounded-3xl border border-line/12 bg-card shadow-[0_32px_80px_-24px_rgb(var(--shadow))]",
          "transition-[transform,width,height,opacity,filter] duration-base ease-expo",
          open ? "opacity-100 blur-0" : "pointer-events-none opacity-0 blur-[2px]",
        )}
        // Slide and scale in one transform: the morph opens at 0.96.
        style={{ width: size.w, height: size.h || undefined, transform: `translateX(${left}px) scale(${open ? 1 : 0.96})` }}
      >
        <div ref={content} key={shown} className="absolute left-0 top-0 w-max animate-enter-fade [animation-duration:250ms]">
          <Panel group={group} pathname={pathname} onPick={close} />
        </div>
      </div>
    </nav>
  );
}
