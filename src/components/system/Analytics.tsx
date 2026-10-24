"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/lib/consent";
import { announcement } from "@/lib/announce";
import {
  ERROR_EVENT,
  GA_DISABLE,
  GA_ID,
  TRACK_EVENT,
  cleanDescription,
  destinationOf,
  flushPending,
  isDiscordInvite,
  pagePlacement,
  placementOf,
  slug,
  track,
  type TrackParams,
} from "@/lib/analytics";

export { GA_ID };

/** Consent Mode v2 signals. The ad signals are never granted (consent v2). */
const signals = (analytics: boolean) => ({
  analytics_storage: analytics ? "granted" : "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
});

/** Drop the GA cookies on this host and its parent domain. */
function deleteGaCookies() {
  const host = location.hostname.replace(/^www\./, "");
  for (const c of document.cookie.split("; ")) {
    const name = c.split("=")[0];
    if (name === "_ga" || name.startsWith("_ga_")) {
      for (const domain of ["", `; domain=.${host}`]) document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
    }
  }
}

/** Sections whose reach is worth counting (I §3.1), by id. */
const KEY_SECTIONS = new Set([
  "how",
  "products",
  "indices",
  "explore",
  "rules",
  "now",
  "security",
  "ecosystem",
  "builders",
  "roadmap",
  "faq",
  "cta_band",
  "fees",
  "methodology",
  "data",
]);
/** At most this many exceptions per page view, so a loop can't flood GA. */
const MAX_EXCEPTIONS = 10;

/**
 * Google tag (gtag.js), loaded only after the visitor allows Analytics in the
 * cookie banner, so nothing reaches Google before a choice (the banner's
 * promise).
 *
 * Consent Mode: the first push is always `consent default` with every signal
 * denied, then a `consent update` grants analytics_storage only (SEC-22), so a
 * tag that ever loads earlier still starts from "denied". Ad signals stay
 * denied permanently: there are no ad tags, and the Marketing category is gone.
 *
 * Withdrawal (SEC-03): the kill switch `window["ga-disable-<ID>"]` is set
 * before the consent update, so the already-loaded gtag.js sends nothing
 * more (not even cookieless pings) until the visitor grants again, and the
 * _ga cookies are deleted. Page views on client-side navigation come from
 * GA4's enhanced measurement (history changes), which the switch also stops.
 *
 * Events (CRO-09, MISS-07; the table is in lib/analytics.ts): while consent
 * is granted, delegated listeners on the document turn Discord and
 * `[data-cta]` clicks, FAQ opens, key-section reach, the announcement-bar
 * dismissal, `blok:track` / `blok:error` CustomEvents and uncaught errors
 * into GA4 events. "Once per page view" resets on every route change.
 */
export function Analytics() {
  const consent = useConsent();
  const analytics = consent?.analytics === true;
  const pathname = usePathname();

  useEffect(() => {
    if (!analytics) {
      // Kill switch first, then tell gtag (if it's loaded) and clean up.
      window[GA_DISABLE] = true;
      if (window.gtag) {
        window.gtag("consent", "update", signals(false));
        deleteGaCookies();
      }
      return;
    }

    window[GA_DISABLE] = false;
    if (window.gtag) {
      // A later grant in the same page view: gtag.js is already here.
      window.gtag("consent", "update", signals(true));
      flushPending();
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // gtag.js expects the `arguments` object itself, not an array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("consent", "default", { ...signals(false), wait_for_update: 500 });
    window.gtag("set", "ads_data_redaction", true);
    window.gtag("consent", "update", signals(true));
    window.gtag("js", new Date());
    // No Google signals and no ad personalisation, whatever the property says.
    window.gtag("config", GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    // Events that arrived (with consent) before the tag was set up.
    flushPending();

    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
  }, [analytics]);

  // Event listeners: only while consent is granted, and fresh for every page
  // view so "once per page view" means exactly that.
  useEffect(() => {
    if (!analytics) return;
    const seen = new Set<string>();
    const once = (key: string) => (seen.has(key) ? false : (seen.add(key), true));
    let exceptions = 0;
    const exception = (description: string, key = description) => {
      const d = cleanDescription(description);
      if (!d || exceptions >= MAX_EXCEPTIONS || !once(`exception:${key}`)) return;
      exceptions++;
      track("exception", { description: d, fatal: false });
    };
    const dismissed = () => {
      if (once("announcement_dismiss")) track("announcement_dismiss", { announcement_id: announcement.id });
    };

    // Discord invites → join_group; [data-cta] → cta_click; bar dismissal.
    // Capture phase, so a stopPropagation further down can't hide a click.
    const onClick = (e: MouseEvent) => {
      if (e.type === "auxclick" && e.button !== 1) return;
      const target = e.target instanceof Element ? e.target : null;
      if (!target) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (link && isDiscordInvite(link.href)) {
        track("join_group", { group_id: "discord", placement: placementOf(link) });
        return;
      }
      const cta = target.closest<HTMLElement>("[data-cta]");
      if (cta) {
        const href = cta instanceof HTMLAnchorElement ? cta.href : link?.href;
        track("cta_click", { cta_id: cta.dataset.cta ?? "", destination: destinationOf(href), placement: placementOf(cta) });
        return;
      }
      if (target.closest('#announce button[aria-label="Dismiss announcement"]')) dismissed();
    };

    // FAQ opens: `toggle` doesn't bubble, so listen in the capture phase.
    const onToggle = (e: Event) => {
      const d = e.target;
      if (!(d instanceof HTMLDetailsElement) || !d.open || !d.closest("#faq")) return;
      const question = (d.querySelector("summary")?.textContent ?? "").replace(/^\s*\d+\s*/, "");
      const id = slug(question);
      if (id && once(`faq:${id}`)) track("select_content", { content_type: "faq", content_id: id, placement: pagePlacement(pathname) });
    };

    // The decoupled contract for other components.
    const onTrack = (e: DocumentEventMap["blok:track"]) => {
      const { name, params } = e.detail ?? {};
      if (typeof name !== "string") return;
      if (name === "announcement_dismiss") return dismissed();
      track(name, (params ?? {}) as TrackParams);
    };
    const onLiveError = (e: DocumentEventMap["blok:error"]) => {
      const source = slug(String(e.detail?.source ?? "unknown"), 40);
      const state = slug(String(e.detail?.state ?? "error"), 20);
      exception(`live_data:${source}:${state}`);
    };

    // Uncaught errors. Third-party and extension scripts are skipped.
    const onError = (e: ErrorEvent) => {
      if (!e.message || e.message === "Script error." || /ResizeObserver loop/.test(e.message)) return;
      if (e.filename && !e.filename.startsWith(location.origin)) return;
      const file = e.filename ? new URL(e.filename).pathname.split("/").pop() : "";
      exception(file ? `${e.message} @ ${file}:${e.lineno}` : e.message);
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const r: unknown = e.reason;
      exception(r instanceof Error ? `${r.name}: ${r.message}` : typeof r === "string" ? r : "Unhandled rejection");
    };

    // Section reach: a key section counts once at least half of it (or, if
    // it's taller than the screen, half the screen) is in view. The observer
    // only tracks which sections are near; a rAF-throttled check measures.
    const near = new Set<Element>();
    let frame = 0;
    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of near) {
        const r = el.getBoundingClientRect();
        if (r.height <= 0) continue;
        const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        if (visible < Math.min(r.height, vh) * 0.5) continue;
        near.delete(el);
        io?.unobserve(el);
        const id = slug(el.id, 40);
        if (once(`section:${id}`)) track("section_view", { section_id: id });
      }
    };
    const schedule = () => {
      if (!frame && near.size) frame = requestAnimationFrame(measure);
    };
    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => {
            for (const en of entries) {
              if (en.isIntersecting) near.add(en.target);
              else near.delete(en.target);
            }
            schedule();
          })
        : null;
    const observed = new WeakSet<Element>();
    const scan = () => {
      for (const el of document.querySelectorAll("main section[id]")) {
        if (observed.has(el) || !KEY_SECTIONS.has(slug(el.id, 40))) continue;
        observed.add(el);
        io?.observe(el);
      }
    };
    scan();
    // Late content (streamed or hydrated sections) on this route.
    const rescan = window.setTimeout(scan, 1200);

    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    document.addEventListener("toggle", onToggle, true);
    document.addEventListener(TRACK_EVENT, onTrack);
    document.addEventListener(ERROR_EVENT, onLiveError);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
      document.removeEventListener("toggle", onToggle, true);
      document.removeEventListener(TRACK_EVENT, onTrack);
      document.removeEventListener(ERROR_EVENT, onLiveError);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.clearTimeout(rescan);
      if (frame) cancelAnimationFrame(frame);
      io?.disconnect();
    };
  }, [analytics, pathname]);

  return null;
}
