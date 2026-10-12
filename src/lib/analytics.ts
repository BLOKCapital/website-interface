"use client";

import { hasConsent } from "@/lib/consent";

/**
 * Consent-gated GA4 events (D-16; docs/audit/findings/I-content-conversion.md
 * §3.1). Nothing is sent unless the visitor allowed Analytics, gtag.js is
 * loaded and the ga-disable kill switch is off. Parameter values are short
 * lowercase snake_case enums or slugs of site copy: never wallet addresses,
 * emails, free text typed by a visitor, or IDs.
 *
 * | Event                  | Fired when                                              | Parameters                                                 |
 * |------------------------|---------------------------------------------------------|------------------------------------------------------------|
 * | `join_group` (key)     | click on any Discord invite link (delegated)            | group_id: "discord", placement                             |
 * | `cta_click`            | click on a `[data-cta]` element (delegated)             | cta_id, destination, placement                             |
 * | `select_content` (FAQ) | a `<details>` inside `#faq` opens, once per item/view   | content_type: "faq", content_id (question slug), placement |
 * | `select_content`       | explorers etc. fire it via `blok:track`                 | content_type, content_id                                   |
 * | `section_view`         | a key `section[id]` is ≥ 50 % visible, once per view    | section_id                                                 |
 * | `announcement_dismiss` | the announcement bar is dismissed, once per view        | announcement_id                                            |
 * | `video_start`          | Play on the /about video facade                         | video_provider: "youtube", video_title                     |
 * | `exception`            | window error, unhandled rejection, error boundary       | description (trimmed, no URL queries), fatal               |
 * | `exception`            | a `blok:error` live-data failure, once per source/state | description: "live_data:<source>:<state>", fatal: false    |
 *
 * placement: the closest `[data-placement]`; otherwise announcement_bar,
 * mobile_menu, header, footer, or the closest `section[id]`'s id.
 * destination: docs | whitepaper | aragon | github | audit_report | arbiscan
 * | internal | other, from the link's host. A Discord link is only ever a
 * `join_group`, never also a `cta_click`.
 *
 * Contract for components (no import needed):
 *   document.dispatchEvent(new CustomEvent("blok:track", { detail: { name, params } }))
 *   document.dispatchEvent(new CustomEvent("blok:error", { detail: { source, state } }))
 * Analytics.tsx listens for both while Analytics consent is granted; before
 * that they are dropped. Client islands may also import `track()` directly.
 */

/** Google Analytics 4 property for blokcapital.io. */
export const GA_ID = "G-D3Q5JCYWJR";
/** Google's documented per-property kill switch for gtag.js. */
export const GA_DISABLE = "ga-disable-G-D3Q5JCYWJR";

export const TRACK_EVENT = "blok:track";
export const ERROR_EVENT = "blok:error";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    "ga-disable-G-D3Q5JCYWJR"?: boolean;
  }
  interface DocumentEventMap {
    "blok:track": CustomEvent<{ name: string; params?: TrackParams }>;
    "blok:error": CustomEvent<{ source: string; state: string }>;
  }
}

/** Every parameter an event may carry. Anything else is dropped. */
const PARAMS = [
  "group_id",
  "placement",
  "cta_id",
  "destination",
  "content_type",
  "content_id",
  "section_id",
  "announcement_id",
  "video_provider",
  "video_title",
  "index_id",
  "source",
  "state",
  "description",
  "fatal",
] as const;
export type TrackParam = (typeof PARAMS)[number];
export type TrackParams = Partial<Record<TrackParam, string | number | boolean | null | undefined>>;
const ALLOWED = new Set<string>(PARAMS);

const EVENT_NAME = /^[a-z][a-z0-9_]{0,39}$/;
const ADDRESS = /0x[0-9a-f]{20,}/i;
const EMAIL = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i;

/** Lowercase snake_case slug of site copy or an enum value. */
export function slug(text: string, max = 60) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, max)
    .replace(/_+$/, "");
}

/**
 * An error message made safe to send: URLs lose their query and hash,
 * addresses, emails and long numbers are masked, and it's cut to 150 chars.
 */
export function cleanDescription(text: string) {
  return text
    .replace(/\b(https?:\/\/[^\s?#'"]+)[?#][^\s'"]*/gi, "$1")
    .replace(/0x[0-9a-f]{8,}/gi, "0x…")
    .replace(new RegExp(EMAIL, "gi"), "[email]")
    .replace(/\d{6,}/g, "#")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 150);
}

function clean(params: TrackParams) {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (!ALLOWED.has(key) || value === null || value === undefined) continue;
    if (typeof value === "boolean") out[key] = value;
    else if (typeof value === "number") {
      if (Number.isFinite(value)) out[key] = value;
    } else if (key === "description") {
      const d = cleanDescription(value);
      if (d) out[key] = d;
    } else {
      if (ADDRESS.test(value) || EMAIL.test(value)) continue;
      const s = slug(value, 100);
      if (s) out[key] = s;
    }
  }
  return out;
}

/** True when an event may be sent right now. */
export function canTrack() {
  return (
    typeof window !== "undefined" &&
    hasConsent("analytics") &&
    typeof window.gtag === "function" &&
    window[GA_DISABLE] !== true
  );
}

/** Events sent with consent before gtag was set up; see flushPending(). */
const pending: [string, Record<string, string | number | boolean>][] = [];

/** Send a GA4 event, or do nothing without Analytics consent. */
export function track(name: string, params: TrackParams = {}) {
  if (!EVENT_NAME.test(name)) return;
  if (canTrack()) {
    window.gtag!("event", name, clean(params));
  } else if (typeof window !== "undefined" && !window.gtag && hasConsent("analytics") && pending.length < 20) {
    // Consent is given but the tag isn't set up yet: on a first page load
    // a child's effect (an error boundary, say) runs before Analytics'.
    pending.push([name, clean(params)]);
  }
}

/** Analytics.tsx calls this once gtag is set up. Drops everything without consent. */
export function flushPending() {
  const queued = pending.splice(0);
  if (!canTrack()) return;
  for (const [name, params] of queued) window.gtag!("event", name, params);
}

/** GA4 `exception` (MISS-07). Consent-gated like every other event. */
export function reportException(description: string, fatal = false) {
  track("exception", { description, fatal });
}

/* ---------- helpers for the delegated listeners (Analytics.tsx) ---------- */

/** A Discord invite link (discord.gg/…, discord.com/invite/…). */
export function isDiscordInvite(href: string) {
  try {
    const u = new URL(href, window.location.href);
    const host = u.hostname.replace(/^www\./, "");
    return host === "discord.gg" || ((host === "discord.com" || host === "discordapp.com") && u.pathname.startsWith("/invite/"));
  } catch {
    return false;
  }
}

export type Destination = "docs" | "whitepaper" | "aragon" | "github" | "audit_report" | "arbiscan" | "internal" | "other";

/** Where a link goes, as an enum. */
export function destinationOf(href: string | null | undefined): Destination {
  if (!href) return "internal";
  try {
    const u = new URL(href, window.location.href);
    if (u.origin === window.location.origin) return "internal";
    const host = u.hostname.replace(/^www\./, "");
    if (host === "blokcapital.io") return "internal";
    if (host === "docs.blokcapital.io") return "docs";
    if (host === "docsend.com") return "whitepaper";
    if (host === "aragon.org" || host.endsWith(".aragon.org")) return "aragon";
    if (host === "arbiscan.io" || host.endsWith(".arbiscan.io")) return "arbiscan";
    if (host === "github.com") return /\/audits(\/|$)/i.test(u.pathname) || /\.pdf$/i.test(u.pathname) ? "audit_report" : "github";
    return "other";
  } catch {
    return "other";
  }
}

/** Where on the page an element sits, as a placement enum or a section id. */
export function placementOf(el: Element) {
  const tagged = el.closest("[data-placement]")?.getAttribute("data-placement");
  if (tagged) return slug(tagged, 40);
  if (el.closest("#announce")) return "announcement_bar";
  if (el.closest("#mobile-menu")) return "mobile_menu";
  if (el.closest("body > header")) return "header";
  if (el.closest("body > footer")) return "footer";
  const section = el.closest("section[id]");
  return section ? slug(section.id, 40) : "other";
}

/** The page as a short placement value: "/" is home, "/contact" is contact. */
export function pagePlacement(pathname: string) {
  const first = pathname.split("/").filter(Boolean)[0];
  return first ? slug(first, 40) : "home";
}
