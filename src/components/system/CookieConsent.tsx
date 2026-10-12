"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CrossIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useIsClient } from "@/lib/hooks";
import {
  ALLOW_ALL,
  CONSENT_OPEN_EVENT,
  DENY_ALL,
  getConsent,
  hasGlobalPrivacyControl,
  openCookieSettings,
  setConsent,
  useConsent,
  type ConsentCategory,
  type ConsentChoices,
} from "@/lib/consent";

/**
 * Cookie consent (GDPR / ePrivacy / CPRA shape):
 *   - nothing beyond strictly-necessary storage runs before a choice
 *   - "Accept all" and "Reject all" look identical and sit side by side, one
 *     click each (ICO "equal prominence", D-15)
 *   - non-essential categories are unticked by default
 *   - the choice is re-openable for life (footer "Cookie settings")
 *   - a Global Privacy Control signal is honoured as reject-all
 * Read the decision with "hasConsent(\"analytics\")" or the "blok:consentchange"
 * window event. Motion is CSS only.
 *
 * Layout (MOB-01, MOB-14): on phones a compact card (about 120 px) with an
 * inline heading, one sentence and one row of three buttons; on short or
 * landscape screens (max-height 500 px) a full-width bottom bar; otherwise a
 * card at the bottom right. The banner is first in the DOM (layout.tsx), so
 * it is the first Tab stop, and while it shows, the page's scroll padding
 * keeps focused elements clear of it (A11Y-03).
 */

// Short or landscape screens use the arbitrary variant
// [@media(max-height:500px)]: the banner becomes a bar, the dialog compacts.
// Written out in full each time so Tailwind can find the class names.

const CATEGORIES: {
  key: ConsentCategory | "essential";
  label: string;
  summary: string;
  detail: string;
  locked?: boolean;
}[] = [
  {
    key: "essential",
    label: "Strictly necessary",
    summary: "Always on",
    detail: "Keeps the site secure and working, and remembers this choice so we stop asking.",
    locked: true,
  },
  {
    key: "analytics",
    label: "Analytics",
    summary: "Aggregated usage",
    detail: "Page views, referrers, and which buttons and sections get used, counted in aggregate by Google Analytics. No ads, never sold.",
  },
];

/** Focusable, still in the document and not hidden. */
const usable = (el: HTMLElement | null | undefined): el is HTMLElement =>
  !!el && el.isConnected && el !== document.body && el.getClientRects().length > 0;

/**
 * Park focus on <main> without scrolling (A11Y-12): the banner that held it
 * is gone. The temporary tabindex and outline go again on blur.
 */
function focusMain() {
  const main = document.getElementById("main");
  if (!main) return;
  if (!main.hasAttribute("tabindex")) {
    main.setAttribute("tabindex", "-1");
    main.style.outline = "none";
    main.addEventListener(
      "blur",
      () => {
        main.removeAttribute("tabindex");
        main.style.outline = "";
      },
      { once: true },
    );
  }
  main.focus({ preventScroll: true });
}

export function CookieConsent() {
  const isClient = useIsClient();
  const consent = useConsent();

  const [panelOpen, setPanelOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentChoices>(DENY_ALL);
  const panelRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLElement>(null);
  /** What opened the dialog, captured before any state changes. */
  const openerRef = useRef<HTMLElement | null>(null);
  /** The last page element (outside the banner) that had focus. */
  const lastFocusRef = useRef<HTMLElement | null>(null);

  const bannerVisible = isClient && !consent && !panelOpen;

  const openPanel = useCallback(() => {
    const active = document.activeElement;
    openerRef.current = active instanceof HTMLElement && active !== document.body ? active : null;
    const current = getConsent();
    setDraft({ analytics: current?.analytics ?? false });
    setPanelOpen(true);
  }, []);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  /** A decision from the banner: the banner unmounts, so focus moves on. */
  const decideFromBanner = useCallback((choices: ConsentChoices) => {
    const active = document.activeElement;
    const hadFocus = !active || active === document.body || !!bannerRef.current?.contains(active);
    setConsent(choices, "banner");
    if (!hadFocus) return;
    requestAnimationFrame(() => {
      const back = lastFocusRef.current;
      if (usable(back)) back.focus({ preventScroll: true });
      else focusMain();
    });
  }, []);

  const decideFromPanel = useCallback((choices: ConsentChoices) => {
    setConsent(choices, "preferences");
    setPanelOpen(false);
  }, []);

  // Global Privacy Control is a binding opt-out signal in several US states.
  useEffect(() => {
    if (getConsent()) return;
    if (hasGlobalPrivacyControl()) setConsent(DENY_ALL, "gpc");
  }, []);

  useEffect(() => {
    window.addEventListener(CONSENT_OPEN_EVENT, openPanel);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, openPanel);
  }, [openPanel]);

  // While the banner shows: keep focused elements scrolled clear of it, and
  // remember where focus was on the page so a decision can return it there.
  useEffect(() => {
    if (!bannerVisible) return;
    const node = bannerRef.current;
    if (!node) return;
    const root = document.documentElement;
    // Layout box, not getBoundingClientRect: the entrance animation moves
    // the banner with a transform, and the padding is for where it settles.
    const fit = () => {
      const fromBottom = node.offsetHeight + (parseFloat(getComputedStyle(node).bottom) || 0);
      root.style.scrollPaddingBottom = `${Math.ceil(fromBottom) + 12}px`;
    };
    fit();
    const ro = "ResizeObserver" in window ? new ResizeObserver(fit) : null;
    ro?.observe(node);
    window.addEventListener("resize", fit);
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target;
      // The skip link is only a way in, not a place to come back to.
      if (t instanceof HTMLElement && !node.contains(t) && !t.matches('a[href="#main"]')) lastFocusRef.current = t;
    };
    document.addEventListener("focusin", onFocusIn);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", fit);
      document.removeEventListener("focusin", onFocusIn);
      root.style.removeProperty("scroll-padding-bottom");
    };
  }, [bannerVisible]);

  // Modal plumbing: scroll lock, Escape, focus trap, focus restore.
  useEffect(() => {
    if (!panelOpen) return;
    const node = panelRef.current;
    if (!node) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    node.focus();

    const focusable = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      ).filter((el) => el.offsetParent !== null);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closePanel();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !node.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      // This runs after the commit that closed the dialog, so a banner that
      // came back is already in the DOM. Back to the opener if it's still
      // there (footer "Cookie settings"); else the banner's Manage button
      // (closed without choosing); else where focus was before the banner.
      const manage = document.querySelector<HTMLElement>("[data-cookie-manage]");
      const target = [openerRef.current, manage, lastFocusRef.current].find(usable);
      if (target) target.focus({ preventScroll: true });
      else focusMain();
      openerRef.current = null;
    };
  }, [panelOpen, closePanel]);

  // Client-only: the server can't know the stored choice, so rendering the
  // banner in the HTML would flash it at people who already decided.
  if (!isClient) return null;

  // Reject and Accept share one look (D-15, SEC-23); Manage is a ghost of
  // the same height. 44 px everywhere: consent is a key flow.
  const choice = "h-11 px-2 sm:px-5";

  return (
    <>
      {bannerVisible && (
        <aside
          ref={bannerRef}
          role="region"
          aria-labelledby="cookie-banner-title"
          className={cn(
            "fixed inset-x-2 bottom-2 z-banner animate-reveal rounded-2xl border border-line/12 bg-card/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-e2 backdrop-blur-xl",
            "sm:inset-x-auto sm:bottom-5 sm:right-5 sm:max-w-md sm:p-5",
            "[@media(max-height:500px)]:inset-x-0 [@media(max-height:500px)]:bottom-0 [@media(max-height:500px)]:right-0 [@media(max-height:500px)]:max-w-none [@media(max-height:500px)]:rounded-none [@media(max-height:500px)]:border-x-0 [@media(max-height:500px)]:border-b-0 [@media(max-height:500px)]:px-5 [@media(max-height:500px)]:py-2.5 [@media(max-height:500px)]:pb-[max(0.625rem,env(safe-area-inset-bottom))]",
          )}
          style={{ animationDelay: "600ms" }}
        >
          <div className={cn("flex flex-col gap-3 sm:gap-4", "[@media(max-height:500px)]:mx-auto [@media(max-height:500px)]:max-w-page [@media(max-height:500px)]:flex-row [@media(max-height:500px)]:items-center [@media(max-height:500px)]:gap-5")}>
            <div className={cn("text-caption text-fg-muted sm:text-small", "[@media(max-height:500px)]:min-w-0 [@media(max-height:500px)]:flex-1 [@media(max-height:500px)]:text-caption")}>
              <h2 id="cookie-banner-title" className="inline font-medium text-fg">
                Cookies, kept to a minimum.
              </h2>{" "}
              <p className="inline">
                <span className={cn("hidden sm:inline", "[@media(max-height:500px)]:hidden")}>Strictly necessary cookies keep the site working. </span>
                Analytics runs only if you say so.{" "}
                <Link href="/legal/cookie-policy" className="whitespace-nowrap text-leaf underline underline-offset-2">
                  Cookie Policy
                </Link>
              </p>
            </div>
            <div className={cn("grid grid-cols-3 gap-2 sm:flex sm:flex-wrap", "[@media(max-height:500px)]:flex [@media(max-height:500px)]:shrink-0 [@media(max-height:500px)]:flex-nowrap")}>
              <Button size="md" className={choice} onClick={() => decideFromBanner(DENY_ALL)}>
                Reject all
              </Button>
              <Button size="md" className={choice} onClick={() => decideFromBanner(ALLOW_ALL)}>
                Accept all
              </Button>
              <Button
                data-cookie-manage=""
                size="md"
                variant="ghost"
                onClick={openPanel}
                className={cn(choice, "text-fg underline decoration-line/30 underline-offset-4 can-hover:hover:decoration-leaf")}
              >
                Manage
              </Button>
            </div>
          </div>
        </aside>
      )}

      {panelOpen && (
        <div className="fixed inset-0 z-overlay">
          <div aria-hidden onClick={closePanel} className="absolute inset-0 animate-enter-fade bg-black/60 backdrop-blur-sm" />
          <div
            className={cn(
              "absolute inset-0 flex items-end justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-6",
              "[@media(max-height:500px)]:items-center [@media(max-height:500px)]:p-2",
            )}
          >
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-panel-title"
              aria-describedby="cookie-panel-desc"
              tabIndex={-1}
              className={cn(
                "relative flex max-h-[86dvh] w-full max-w-lg animate-enter-up flex-col overflow-hidden rounded-2xl border border-line/12 bg-card shadow-e3 focus:outline-none",
                "[@media(max-height:500px)]:max-h-[94dvh] [@media(max-height:500px)]:max-w-2xl",
              )}
            >
              <div
                className={cn(
                  "flex items-start justify-between gap-4 border-b border-line/[0.08] px-6 pb-5 pt-6",
                  "[@media(max-height:500px)]:items-center [@media(max-height:500px)]:px-5 [@media(max-height:500px)]:py-2",
                )}
              >
                <div>
                  <p className={cn("eyebrow", "[@media(max-height:500px)]:hidden")}>Privacy</p>
                  <h2 id="cookie-panel-title" className={cn("display mt-2.5 text-h3 text-fg", "[@media(max-height:500px)]:mt-0 [@media(max-height:500px)]:text-h4")}>
                    Cookie preferences
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Close cookie preferences"
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line/12 text-fg-muted transition-colors duration-fast can-hover:hover:text-fg"
                >
                  <CrossIcon />
                </button>
              </div>

              <div className={cn("flex-1 overflow-y-auto overscroll-contain px-6 py-5", "[@media(max-height:500px)]:px-5 [@media(max-height:500px)]:py-3")}>
                <p id="cookie-panel-desc" className="text-small text-fg-muted">
                  Choose what this site may store on your device. Your choice is kept for six months and applies to{" "}
                  <span className="font-mono text-[13px] text-fg">blokcapital.io</span> only.
                </p>
                <ul
                  className={cn(
                    "mt-5 divide-y divide-line/[0.08] border-y border-line/[0.08]",
                    "[@media(max-height:500px)]:mt-3 [@media(max-height:500px)]:grid [@media(max-height:500px)]:grid-cols-2 [@media(max-height:500px)]:gap-x-6 [@media(max-height:500px)]:divide-y-0",
                  )}
                >
                  {CATEGORIES.map((c) => {
                    const locked = c.locked === true;
                    const checked = locked ? true : draft[c.key as ConsentCategory];
                    const descId = `cookie-cat-${c.key}-desc`;
                    return (
                      <li key={c.key} className={cn("flex items-start justify-between gap-4 py-4", "[@media(max-height:500px)]:py-3")}>
                        <div className="min-w-0">
                          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[15px] font-medium text-fg">
                            {c.label}
                            <span className="rounded-full bg-raised px-2 py-0.5 text-[11px] font-normal text-fg-muted">{c.summary}</span>
                          </p>
                          <p id={descId} className="mt-1.5 text-small text-fg-muted">
                            {c.detail}
                          </p>
                        </div>
                        {/* A11Y-18: white thumb in both states; the off track's
                            border is >= 3:1 against the card. */}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={checked}
                          aria-label={`${c.label} cookies`}
                          aria-describedby={descId}
                          disabled={locked}
                          onClick={() => setDraft((d) => ({ ...d, [c.key]: !checked }))}
                          className={cn(
                            "relative mt-0.5 inline-flex h-[26px] w-[46px] shrink-0 items-center rounded-full border transition-colors duration-fast",
                            checked ? "border-leaf-deep bg-leaf-deep" : "border-strong bg-raised",
                            locked && "cursor-not-allowed opacity-60",
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "inline-block size-[18px] rounded-full bg-card shadow-[0_1px_3px_rgb(var(--shadow))] ring-1 ring-line/20 transition-transform duration-fast",
                              checked ? "translate-x-[23px]" : "translate-x-[3px]",
                            )}
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 text-caption text-fg-subtle">
                  Connecting a wallet is separate: BLOK Capital never custodies your assets and doesn&apos;t link on-chain activity to
                  these cookies.
                </p>
              </div>

              <div
                className={cn(
                  "flex flex-col gap-2.5 border-t border-line/[0.08] px-6 py-5 sm:flex-row sm:items-center sm:justify-between",
                  "[@media(max-height:500px)]:flex-row [@media(max-height:500px)]:items-center [@media(max-height:500px)]:justify-between [@media(max-height:500px)]:px-5 [@media(max-height:500px)]:py-2.5",
                )}
              >
                <div className="flex gap-2">
                  <Button size="md" variant="secondary" className="flex-1 sm:flex-none" onClick={() => decideFromPanel(DENY_ALL)}>
                    Reject all
                  </Button>
                  <Button size="md" variant="secondary" className="flex-1 sm:flex-none" onClick={() => decideFromPanel(ALLOW_ALL)}>
                    Accept all
                  </Button>
                </div>
                <Button size="md" onClick={() => decideFromPanel(draft)}>
                  Save preferences
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Permanent way back into the dialog (footer, cookie policy). */
export function CookieSettingsButton({
  className,
  children = "Cookie settings",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button type="button" onClick={openCookieSettings} className={cn("transition-colors hover:text-fg", className)}>
      {children}
    </button>
  );
}
