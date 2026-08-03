"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
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
 * Cookie consent — a note slipped onto the desk, not a wall.
 *
 * Compliance shape (GDPR / ePrivacy / CPRA):
 *   - nothing beyond strictly-necessary storage runs before a choice is made
 *   - "Accept all" and "Reject all" are equally prominent, one click each
 *   - non-essential categories are unticked by default, never pre-consented
 *   - the choice is re-openable for life via the footer link
 *   - a Global Privacy Control signal is honoured as a reject-all
 *
 * Read the decision anywhere with `hasConsent("analytics")`, or subscribe to
 * the `blok:consentchange` window event to load a tag the moment it flips on.
 */

const ease = [0.22, 1, 0.36, 1] as const;

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
    detail:
      "Keeps the site secure and working, and remembers this cookie choice so we stop asking. These cannot be switched off.",
    locked: true,
  },
  {
    key: "analytics",
    label: "Analytics",
    summary: "Anonymous usage",
    detail:
      "Aggregated page views and referrers so we can see which pages help and which don't. Never sold, never used to identify you.",
  },
  {
    key: "marketing",
    label: "Marketing",
    summary: "Campaign attribution",
    detail:
      "Tells us whether a campaign, partner, or community link brought you here. Off unless you turn it on.",
  },
];

export function CookieConsent() {
  const isClient = useIsClient();
  const consent = useConsent();
  const reduce = useReducedMotion();

  const [panelOpen, setPanelOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentChoices>(DENY_ALL);
  const panelRef = useRef<HTMLDivElement>(null);

  const openPanel = useCallback(() => {
    const current = getConsent();
    setDraft({
      analytics: current?.analytics ?? false,
      marketing: current?.marketing ?? false,
    });
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => setPanelOpen(false), []);

  const decide = useCallback(
    (choices: ConsentChoices, source: "banner" | "preferences") => {
      setConsent(choices, source);
      setPanelOpen(false);
    },
    [],
  );

  // Global Privacy Control is a binding opt-out signal in several US states —
  // record it as an explicit reject so nothing non-essential ever loads and the
  // banner stays out of the way. The footer link still lets them change it.
  useEffect(() => {
    if (getConsent()) return;
    if (hasGlobalPrivacyControl()) setConsent(DENY_ALL, "gpc");
  }, []);

  // Reopen from the footer link (or anywhere via `openCookieSettings()`).
  useEffect(() => {
    window.addEventListener(CONSENT_OPEN_EVENT, openPanel);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, openPanel);
  }, [openPanel]);

  // Modal plumbing: scroll lock, Escape to close, focus trap, focus restore.
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
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
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

  // Rendered only after hydration: the server has no idea what was stored, so
  // painting the banner in the HTML would flash it at people who already chose.
  if (!isClient) return null;

  const showBanner = !consent && !panelOpen;

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <m.aside
            key="cookie-banner"
            role="region"
            aria-labelledby="cookie-banner-title"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: "100%" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: "100%" }}
            transition={{ duration: 0.5, ease, delay: reduce ? 0 : 0.4 }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/12 bg-paper/95 shadow-[0_-18px_50px_-32px_rgb(31_26_20/0.5)] backdrop-blur-md"
          >
            {/* pb clears the iOS home indicator without padding desktop out. */}
            <div className="paper mx-auto flex max-w-7xl flex-col gap-4 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:pt-6">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <SeedMark />
                  <h2
                    id="cookie-banner-title"
                    className="display text-[17px] leading-[1.25] text-ink sm:text-[19px]"
                  >
                    We keep the cookie jar{" "}
                    <em className="font-serif italic text-moss">small.</em>
                  </h2>
                </div>
                <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-ink-muted sm:text-[13.5px]">
                  Strictly necessary cookies keep this site working. Analytics
                  and marketing run only if you say so, and you can change your
                  mind any time. Details in the{" "}
                  <Link
                    href="/legal/cookie-policy"
                    className="font-medium text-ink underline decoration-clay/50 decoration-[1.5px] underline-offset-4 transition-colors hover:text-clay-deep hover:decoration-clay"
                  >
                    Cookie Policy
                  </Link>
                  .
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:gap-4 lg:shrink-0">
                <button
                  type="button"
                  onClick={openPanel}
                  className="self-start text-[12.5px] font-medium text-ink underline decoration-clay/50 decoration-[1.5px] underline-offset-4 transition-colors hover:text-clay-deep hover:decoration-clay sm:self-auto"
                >
                  Manage preferences
                </button>
                <div className="flex items-center gap-2.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 sm:flex-initial"
                    onClick={() => decide(DENY_ALL, "banner")}
                  >
                    Reject all
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 sm:flex-initial"
                    onClick={() => decide(ALLOW_ALL, "banner")}
                  >
                    Accept all
                  </Button>
                </div>
              </div>
            </div>
          </m.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {panelOpen && (
          <div key="cookie-panel" className="fixed inset-0 z-[60]">
            <m.div
              aria-hidden
              onClick={closePanel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              className="absolute inset-0 bg-ink/45 backdrop-blur-[3px]"
            />

            <div className="absolute inset-0 flex items-end justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-6">
              <m.div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cookie-panel-title"
                aria-describedby="cookie-panel-desc"
                tabIndex={-1}
                initial={
                  reduce ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.97 }
                }
                animate={
                  reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
                }
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
                transition={{ duration: 0.35, ease }}
                className="paper paper-card relative flex max-h-[86vh] w-full max-w-lg flex-col overflow-hidden shadow-[0_1px_0_rgb(255_255_255/0.5)_inset,0_36px_80px_-36px_rgb(31_26_20/0.6)] focus:outline-none"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-6 pb-5 pt-6">
                  <div>
                    <p className="eyebrow text-moss">Privacy</p>
                    <h2
                      id="cookie-panel-title"
                      className="display mt-2.5 text-[22px] leading-[1.2] text-ink sm:text-[24px]"
                    >
                      Cookie{" "}
                      <em className="font-serif italic text-moss">
                        preferences
                      </em>
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={closePanel}
                    aria-label="Close cookie preferences"
                    className="-mr-1 -mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-paper text-ink-subtle transition-colors duration-200 hover:border-clay/45 hover:bg-clay/[0.08] hover:text-clay-deep"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                      <path
                        d="M2 2 L10 10 M10 2 L2 10"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <p
                    id="cookie-panel-desc"
                    className="text-[13.5px] leading-relaxed text-ink-muted"
                  >
                    Choose what this site may store on your device. Your choice
                    is kept for six months and applies to{" "}
                    <span className="mono text-[12.5px] text-ink">
                      blokcapital.io
                    </span>{" "}
                    only. Full detail lives in the{" "}
                    <Link
                      href="/legal/cookie-policy"
                      className="font-medium text-ink underline decoration-clay decoration-[1.5px] underline-offset-4 transition-colors hover:text-clay-deep"
                    >
                      Cookie Policy
                    </Link>
                    .
                  </p>

                  <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
                    {CATEGORIES.map((c) => {
                      const locked = c.locked === true;
                      const checked = locked
                        ? true
                        : draft[c.key as ConsentCategory];
                      return (
                        <li key={c.key} className="py-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                                <p className="text-[14.5px] font-medium text-ink">
                                  {c.label}
                                </p>
                                <span
                                  className={cn(
                                    "rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider",
                                    locked
                                      ? "bg-moss/10 text-moss-deep"
                                      : "bg-paper-deep text-ink-subtle",
                                  )}
                                >
                                  {c.summary}
                                </span>
                              </div>
                              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-muted">
                                {c.detail}
                              </p>
                            </div>
                            <Toggle
                              checked={checked}
                              locked={locked}
                              label={c.label}
                              onChange={(next) =>
                                setDraft((d) => ({
                                  ...d,
                                  [c.key]: next,
                                }))
                              }
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="mt-4 text-[12px] leading-relaxed text-ink-subtle">
                    Connecting a wallet is separate: BLOK Capital never custodies
                    your assets and does not link on-chain activity to these
                    cookies.
                  </p>
                </div>

                {/* Footer actions */}
                <div className="flex flex-col gap-2.5 border-t border-ink/10 bg-paper-deep/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => decide(DENY_ALL, "preferences")}
                    >
                      Reject all
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => decide(ALLOW_ALL, "preferences")}
                    >
                      Accept all
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => decide(draft, "preferences")}
                    className="w-full sm:w-auto"
                  >
                    Save preferences
                  </Button>
                </div>
              </m.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Footer / legal-page entry point back into the dialog. Consent must stay
 * withdrawable for as long as it was given, so this link is permanent.
 */
export function CookieSettingsButton({
  className,
  children = "Cookie settings",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className={cn("transition-colors hover:text-ink", className)}
    >
      {children}
    </button>
  );
}

/* ---------- pieces --------------------------------------------------------- */

function Toggle({
  checked,
  locked,
  label,
  onChange,
}: {
  checked: boolean;
  locked?: boolean;
  label: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={`${label} cookies`}
      disabled={locked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative mt-0.5 inline-flex h-[26px] w-[46px] shrink-0 items-center rounded-full border transition-colors duration-200 ease-in-soft",
        checked
          ? "border-moss-deep/40 bg-moss"
          : "border-ink/15 bg-paper-deep hover:border-ink/30",
        locked && "cursor-not-allowed opacity-70",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-block size-[18px] rounded-full bg-paper shadow-[0_1px_2px_rgb(31_26_20/0.28)] transition-transform duration-200 ease-in-soft",
          checked ? "translate-x-[25px]" : "translate-x-[3px]",
        )}
      />
    </button>
  );
}

function SeedMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M8 14 C 4 14 2 11 2 7.5 C 5 7.5 7.6 9 8 14 Z"
        fill="rgb(var(--moss) / 0.55)"
      />
      <path
        d="M8 14 C 12 14 14 11 14 7.5 C 11 7.5 8.4 9 8 14 Z"
        fill="rgb(var(--moss))"
      />
    </svg>
  );
}
