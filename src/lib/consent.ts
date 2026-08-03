"use client";

import { useSyncExternalStore } from "react";

/**
 * Cookie consent store.
 *
 * The decision is persisted twice on purpose:
 *   - localStorage — the source of truth the UI reads/writes
 *   - a first-party `blok_consent` cookie — so middleware / edge / server
 *     components can read the same decision without shipping it in JS, and so
 *     the choice survives a localStorage wipe by privacy extensions
 *
 * Either store alone is enough to suppress the banner; whichever is readable
 * wins. Bump CONSENT_VERSION whenever the categories change — stored records
 * from an older version are treated as "not decided" and the banner returns.
 */

export const CONSENT_COOKIE = "blok_consent";
export const CONSENT_STORAGE_KEY = "blok:consent";
export const CONSENT_VERSION = 1;

/** Re-ask twice a year, the interval most EU regulators treat as reasonable. */
const MAX_AGE_DAYS = 182;
const MAX_AGE_SECONDS = MAX_AGE_DAYS * 24 * 60 * 60;

/** Categories the visitor can actually toggle. "essential" is not opt-out. */
export type ConsentCategory = "analytics" | "marketing";

export type ConsentChoices = Record<ConsentCategory, boolean>;

export type ConsentRecord = ConsentChoices & {
  /** Schema version the record was written under. */
  v: number;
  /** ISO timestamp of the decision — proof-of-consent, and drives expiry. */
  ts: string;
  /** Where the decision came from. */
  source: "banner" | "preferences" | "gpc";
};

export const DENY_ALL: ConsentChoices = { analytics: false, marketing: false };
export const ALLOW_ALL: ConsentChoices = { analytics: true, marketing: true };

/** Fired on window whenever the decision changes — the hook for tag loaders. */
export const CONSENT_CHANGE_EVENT = "blok:consentchange";
/** Fired on window to reopen the preferences dialog from anywhere. */
export const CONSENT_OPEN_EVENT = "blok:opencookiesettings";

/* ---------- persistence ---------------------------------------------------- */

function isRecord(value: unknown): value is ConsentRecord {
  if (typeof value !== "object" || value === null) return false;
  const r = value as Partial<ConsentRecord>;
  return (
    typeof r.v === "number" &&
    typeof r.ts === "string" &&
    typeof r.analytics === "boolean" &&
    typeof r.marketing === "boolean"
  );
}

function isFresh(record: ConsentRecord) {
  const at = Date.parse(record.ts);
  if (Number.isNaN(at)) return false;
  return Date.now() - at < MAX_AGE_SECONDS * 1000;
}

function parse(raw: string | null): ConsentRecord | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;
    if (parsed.v !== CONSENT_VERSION) return null;
    if (!isFresh(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function readCookie(): string | null {
  const hit = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`));
  if (!hit) return null;
  try {
    return decodeURIComponent(hit.slice(CONSENT_COOKIE.length + 1));
  } catch {
    return null;
  }
}

function persist(record: ConsentRecord) {
  const raw = JSON.stringify(record);
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, raw);
  } catch {
    // Safari private mode / storage disabled — the cookie below still carries it.
  }
  // `Secure` only on https so localhost dev still writes the cookie.
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(raw)}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

/* ---------- store ---------------------------------------------------------- */

// `undefined` means "not read from storage yet"; `null` means "no decision".
let snapshot: ConsentRecord | null | undefined = undefined;
const listeners = new Set<() => void>();

function load(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    // ignore — fall through to the cookie
  }
  return parse(stored) ?? parse(readCookie());
}

/** Current decision, or null if the visitor has not chosen yet. */
export function getConsent(): ConsentRecord | null {
  if (snapshot === undefined) snapshot = load();
  return snapshot;
}

function emit() {
  for (const listener of listeners) listener();
}

/** Persist a decision and notify subscribers (and any listening tag loader). */
export function setConsent(
  choices: ConsentChoices,
  source: ConsentRecord["source"] = "banner",
): ConsentRecord {
  const record: ConsentRecord = {
    ...choices,
    v: CONSENT_VERSION,
    ts: new Date().toISOString(),
    source,
  };
  persist(record);
  snapshot = record;
  emit();
  window.dispatchEvent(
    new CustomEvent<ConsentRecord>(CONSENT_CHANGE_EVENT, { detail: record }),
  );
  return record;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Cross-tab sync: another tab writing the decision updates this one.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== null && e.key !== CONSENT_STORAGE_KEY) return;
    snapshot = load();
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * The stored decision, or null when undecided. Returns null during SSR and the
 * first client render, so gate banner rendering on `useIsClient()` rather than
 * treating null as "show the banner" on the server.
 */
export function useConsent() {
  return useSyncExternalStore(subscribe, getConsent, () => null);
}

/** True when the visitor has actively allowed `category`. */
export function hasConsent(category: ConsentCategory) {
  return getConsent()?.[category] === true;
}

/** Opens the preferences dialog from anywhere (footer link, legal page…). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

/**
 * Global Privacy Control — a browser/extension signal that is a legally binding
 * opt-out in several US states. Honoured as a reject-all when the visitor has
 * not made an explicit choice yet.
 */
export function hasGlobalPrivacyControl() {
  return (
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl === true
  );
}
