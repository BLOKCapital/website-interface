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
 *   - "Accept all" and "Reject all" are equally prominent, one click each
 *   - non-essential categories are unticked by default
 *   - the choice is re-openable for life (footer "Cookie settings")
 *   - a Global Privacy Control signal is honoured as reject-all
 * Read the decision with `hasConsent("analytics")` or the `blok:consentchange`
 * window event. Motion is CSS only.
 */

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
    summary: "Anonymous usage",
    detail: "Aggregated page views and referrers, so we can see which pages help. Never sold, never used to identify you.",
  },
  {
    key: "marketing",
    label: "Marketing",
    summary: "Campaign attribution",
    detail: "Tells us whether a campaign, partner or community link brought you here. Off unless you turn it on.",
  },
];

export function CookieConsent() {
  const isClient = useIsClient();
  const consent = useConsent();

  const [panelOpen, setPanelOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentChoices>(DENY_ALL);
  const panelRef = useRef<HTMLDivElement>(null);

  const openPanel = useCallback(() => {
    const current = getConsent();
    setDraft({ analytics: current?.analytics ?? false, marketing: current?.marketing ?? false });
    setPanelOpen(true);
  }, []);
  const closePanel = useCallback(() => setPanelOpen(false), []);
  const decide = useCallback((choices: ConsentChoices, source: "banner" | "preferences") => {
    setConsent(choices, source);
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

  // Modal plumbing: scroll lock, Escape, focus trap, focus restore.
  useEffect(() => {
    if (!panelOpen) return;
    const node = panelRef.current;
    if (!node) return;
    const restoreTo = document.activeElement as HTMLElement | null;
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
      restoreTo?.focus?.();
    };
  }, [panelOpen, closePanel]);

  // Client-only: the server can't know the stored choice, so rendering the
  // banner in the HTML would flash it at people who already decided.
  if (!isClient) return null;

  return (
    <>
      {!consent && !panelOpen && (
        <aside
          role="region"
          aria-labelledby="cookie-banner-title"
          className="fixed inset-x-3 bottom-3 z-[55] animate-enter-up rounded-2xl border border-line/12 bg-card/95 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)] backdrop-blur-xl sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-md"
          style={{ animationDelay: "600ms" }}
        >
          <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <h2 id="cookie-banner-title" className="text-[15px] font-medium text-fg">
              Cookies, kept to a minimum
            </h2>
            <p className="mt-2 text-small text-fg-muted">
              Strictly necessary cookies keep the site working. Analytics and marketing run only if you say so. See the{" "}
              <Link href="/legal/cookie-policy" className="text-leaf underline underline-offset-2">
                Cookie Policy
              </Link>
              .
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => decide(DENY_ALL, "banner")}>
                Reject all
              </Button>
              <Button size="sm" onClick={() => decide(ALLOW_ALL, "banner")}>
                Accept all
              </Button>
              <button type="button" onClick={openPanel} className="ml-1 text-small text-fg-muted underline underline-offset-2 hover:text-fg">
                Manage
              </button>
            </div>
          </div>
        </aside>
      )}

      {panelOpen && (
        <div className="fixed inset-0 z-[60]">
          <div aria-hidden onClick={closePanel} className="absolute inset-0 animate-enter-fade bg-black/60 backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-end justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-6">
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-panel-title"
              aria-describedby="cookie-panel-desc"
              tabIndex={-1}
              className="relative flex max-h-[86vh] w-full max-w-lg animate-enter-up flex-col overflow-hidden rounded-2xl border border-line/12 bg-card shadow-[0_40px_90px_-30px_rgb(0_0_0/0.8)] focus:outline-none"
            >
              <div className="flex items-start justify-between gap-4 border-b border-line/[0.08] px-6 pb-5 pt-6">
                <div>
                  <p className="eyebrow">Privacy</p>
                  <h2 id="cookie-panel-title" className="display mt-2.5 text-h3 text-fg">
                    Cookie preferences
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Close cookie preferences"
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line/12 text-fg-muted transition-colors hover:text-fg"
                >
                  <CrossIcon />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <p id="cookie-panel-desc" className="text-small text-fg-muted">
                  Choose what this site may store on your device. Your choice is kept for six months and applies to{" "}
                  <span className="font-mono text-[13px] text-fg">blokcapital.io</span> only.
                </p>
                <ul className="mt-5 divide-y divide-line/[0.08] border-y border-line/[0.08]">
                  {CATEGORIES.map((c) => {
                    const locked = c.locked === true;
                    const checked = locked ? true : draft[c.key as ConsentCategory];
                    return (
                      <li key={c.key} className="flex items-start justify-between gap-4 py-4">
                        <div className="min-w-0">
                          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[15px] font-medium text-fg">
                            {c.label}
                            <span className="rounded-full bg-raised px-2 py-0.5 text-[11px] font-normal text-fg-muted">{c.summary}</span>
                          </p>
                          <p className="mt-1.5 text-small text-fg-muted">{c.detail}</p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={checked}
                          aria-label={`${c.label} cookies`}
                          disabled={locked}
                          onClick={() => setDraft((d) => ({ ...d, [c.key]: !checked }))}
                          className={cn(
                            "relative mt-0.5 inline-flex h-[26px] w-[46px] shrink-0 items-center rounded-full border transition-colors",
                            checked ? "border-leaf/50 bg-leaf-deep" : "border-line/20 bg-raised",
                            locked && "cursor-not-allowed opacity-60",
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "inline-block size-[18px] rounded-full bg-fg transition-transform",
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

              <div className="flex flex-col gap-2.5 border-t border-line/[0.08] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => decide(DENY_ALL, "preferences")}>
                    Reject all
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => decide(ALLOW_ALL, "preferences")}>
                    Accept all
                  </Button>
                </div>
                <Button size="sm" onClick={() => decide(draft, "preferences")}>
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
