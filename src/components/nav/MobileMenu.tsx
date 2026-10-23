"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type Ref } from "react";
import { IntentLink } from "@/components/ui/IntentLink";
import { navGroups, docsLink, isCurrent, appLink, type NavLink } from "@/lib/nav";
import { indices } from "@/lib/data/indices";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { CrossIcon, ExternalIcon } from "@/components/ui/icons";
import { MotionToggle } from "@/components/system/MotionToggle";
import { NavIcon } from "./NavIcons";
import { cn } from "@/lib/utils";

/** Stagger position for a sheet group (globals.css, "Mobile menu"). */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * One row: icon, label and hint. Internal links close the sheet when tapped.
 * IntentLink: opening the sheet would otherwise prefetch every route at once,
 * and on a slow connection the one you tap waits behind the rest.
 */
function Row({ link, pathname, onPick }: { link: NavLink; pathname: string | null; onPick: () => void }) {
  const current = !link.href.includes("#") && isCurrent(link.href, pathname);
  return (
    <IntentLink
      href={link.href}
      onClick={link.external ? undefined : onPick}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
      aria-current={current ? "page" : undefined}
      className="flex items-center gap-3 rounded-control py-2"
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-tag",
          current ? "bg-leaf text-accent-fg" : "bg-cobalt/10 text-cobalt",
        )}
      >
        <NavIcon href={link.href} size={17} />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-ui font-semibold leading-snug tracking-tight text-fg">
          {/* Where you are: underlined by hand, as on the desktop row. */}
          <span className={cn(current && "hand-underline")}>{link.label}</span>
          {link.external && <ExternalIcon size={11} className="text-fg-subtle" />}
        </span>
        {link.hint && <span className="block text-caption text-fg-subtle [@media(max-height:500px)]:hidden">{link.hint}</span>}
      </span>
      {link.external && <span className="sr-only"> (opens in a new tab)</span>}
    </IntentLink>
  );
}

/**
 * The phone and tablet menu (below lg): a modal dialog sheet that opens as a
 * circle growing from the menu button (globals.css, "Mobile menu"), with each
 * group easing in just after it. Nav owns the modal behaviour (focus in on
 * open, Tab kept between the sheet and the menu button, the page behind made
 * inert, Escape, scroll lock); this renders the sheet.
 *
 * - The links scroll in their own region, starting under the header row, and
 *   overscroll stays inside it.
 * - "Launch your fund" is pinned to the bottom edge, in the thumb zone, with
 *   a second close button beside it: the menu button sits outside the dialog,
 *   where aria-modal hides it from some screen readers.
 * - Internal links close the sheet as well as navigating, so a same-page or
 *   #hash link (Roadmap on /about) doesn't leave it covering the page.
 * - `inert` while closed, so nothing in it can be focused or read.
 * - Its contents render on the first open, not in every page's HTML
 *   (PERF-08); the dialog element, which the menu button's aria-controls
 *   names, is always there. The footer and page bodies still link every
 *   destination, so nothing is lost to crawlers.
 */
export function MobileMenu({
  open,
  pathname,
  onClose,
  onDismiss,
  ref,
}: {
  open: boolean;
  pathname: string | null;
  /** Close after a link tap; focus goes wherever the link takes it. */
  onClose: () => void;
  /** Close from the close button; focus returns to the menu button. */
  onDismiss: () => void;
  ref?: Ref<HTMLDivElement>;
}) {
  // Contents mount on the first open and then stay (adjusted during render).
  const [mounted, setMounted] = useState(false);
  if (open && !mounted) setMounted(true);
  // On that first open, the contents arrive in the same commit as the open
  // state. `armed` holds `is-open` back for one commit: the layout effect
  // makes the browser compute the closed styles first, so the circle and the
  // group stagger still transition in, all before the first paint (so focus,
  // moved in a later effect, lands on a visible link).
  const [armed, setArmed] = useState(false);
  const inner = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!mounted || armed) return;
    void inner.current?.offsetHeight;
    setArmed(true);
  }, [mounted, armed]);

  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      className={cn("mobile-sheet fixed inset-0 z-sheet flex flex-col bg-canvas lg:hidden", open && armed && "is-open")}
    >
      {mounted && (
        <>
          <div ref={inner} className="mt-16 min-h-0 flex-1 overflow-y-auto overscroll-contain sm:mt-[72px] [@media(max-height:500px)]:mt-[52px]">
            <nav aria-label="Mobile" className="mx-auto max-w-page px-gutter pb-8 pt-2 sm:grid sm:grid-cols-2 sm:gap-x-10">
              {navGroups.map((g, gi) => (
                <div key={g.id} className="sheet-item border-t border-subtle py-4" style={at(gi)}>
                  <p id={`sheet-${g.id}`} className="eyebrow">
                    {g.label}
                  </p>
                  <ul aria-labelledby={`sheet-${g.id}`} className="mt-2">
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <Row link={l} pathname={pathname} onPick={onClose} />
                        {l.href === "/indices" && (
                          // The three index pages, one tap from anywhere (UX-23).
                          <ul aria-label="Index pages" className="mb-1 ml-12 flex flex-wrap gap-1.5">
                            {indices.map((x) => {
                              const href = `/indices/${x.id}`;
                              const current = pathname === href;
                              return (
                                <li key={x.id}>
                                  <IntentLink
                                    href={href}
                                    onClick={onClose}
                                    aria-current={current ? "page" : undefined}
                                    className={cn(
                                      "inline-flex h-8 items-center rounded-full border px-2.5 font-mono text-label transition-colors duration-fast",
                                      current ? "border-leaf/40 bg-leaf/10 text-leaf" : "border-line/12 bg-card text-fg-muted hover:text-fg",
                                    )}
                                  >
                                    {x.name}
                                  </IntentLink>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <ul className="sheet-item border-t border-subtle py-4" style={at(navGroups.length)}>
                {[docsLink].map((l) => (
                  <li key={l.href}>
                    <Row link={l} pathname={pathname} onPick={onClose} />
                  </li>
                ))}
              </ul>
              <div className="sheet-item flex flex-wrap items-center justify-between gap-4 border-t border-subtle pt-6 sm:col-span-2" style={at(navGroups.length + 1)}>
                <SocialLinks only={["discord", "x", "instagram", "telegram", "farcaster", "github", "youtube"]} />
                <MotionToggle className="inline-flex h-10 items-center gap-2.5 rounded-full border border-line/12 px-4 text-small text-fg-muted transition-colors duration-fast before:size-2 before:rounded-full before:bg-line/30 hover:text-fg aria-pressed:border-leaf/40 aria-pressed:bg-leaf/10 aria-pressed:text-fg aria-pressed:before:bg-leaf" />
              </div>
            </nav>
          </div>

          {/* Pinned: the primary action stays in reach however far the links scroll. */}
          <div className="shrink-0 border-t border-subtle bg-canvas px-5 py-3 sm:px-8">
            <div className="mx-auto flex max-w-page items-center gap-3">
              <Button href={appLink.href} variant="solid" data-cta="nav_launch_app" data-placement="mobile_menu" size="lg" className="flex-1">
                {appLink.label}
              </Button>
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Close menu"
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-line/12 bg-card text-fg transition-colors duration-fast hover:border-line/30"
              >
                <CrossIcon size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
