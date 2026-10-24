"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { LiveSource } from "./rpc";

/**
 * Honest live-data states, shared by every live widget:
 *   loading  – first request in flight, nothing to show yet
 *   live     – last request succeeded within `staleAfter`
 *   updating – showing data while a refresh is in flight
 *   delayed  – data exists but the last success is older than `staleAfter`
 *   offline  – the browser reports no connection
 *   error    – requests are failing and there's no data to show
 *   paused   – off-screen or tab hidden; polling stopped to save battery
 */
export type LiveState = "loading" | "live" | "updating" | "delayed" | "offline" | "error" | "paused";

export type Live<T> = {
  data: T | null;
  state: LiveState;
  /** When our last successful read completed (ms), or null. */
  updatedAt: number | null;
  error: string | null;
  retry: () => void;
};

export type LiveOptions = {
  /** Poll period while on screen (ms). */
  interval?: number;
  /** A read older than this is "delayed" (ms). */
  staleAfter?: number;
  /**
   * The widget's root. Polling runs only while it's within 120 px of the
   * viewport and the tab is visible. Required: an element that isn't
   * mounted (a null ref) counts as off-screen, so nothing polls unseen.
   */
  ref: RefObject<Element | null>;
};

/**
 * Tells Analytics a live read failed, once per source per mount (a page
 * view): the `blok:error` contract in src/lib/analytics.ts, which Analytics
 * drops unless the visitor allowed analytics.
 */
function report(seen: Set<LiveSource>, source: LiveSource) {
  if (seen.has(source)) return;
  seen.add(source);
  document.dispatchEvent(new CustomEvent("blok:error", { detail: { source, state: "error" } }));
}

/**
 * Polls `fetcher` every `interval` ms, but only while `ref` is on screen and
 * the tab is visible. Failures back off (×2, capped at 60s) instead of
 * hammering a public endpoint. Nothing here ever fabricates a value: if a
 * read fails, the last real reading stays, marked delayed.
 *
 * Re-renders only when something changes: a read lands, a refresh turns
 * slow, visibility or connectivity flips, or the reading goes stale (one
 * timer at `updatedAt + staleAfter`, not a ticking clock).
 *
 * A read that ends in `error` dispatches one `blok:error` event per source
 * while the widget is mounted, i.e. once per page view (src/lib/analytics.ts).
 * A batch where only some feeds fail is still a live read: those rows show
 * "—" (prices.ts, feedState) and nothing is reported.
 */
export function useLive<T>(
  fetcher: () => Promise<T>,
  { interval = 15000, staleAfter = interval * 2.5, ref }: LiveOptions,
): Live<T> {
  const [data, setData] = useState<T | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inFlight, setInFlight] = useState(false);
  const [visible, setVisible] = useState(false);
  const [online, setOnline] = useState(true);
  // The `updatedAt` whose reading has gone stale; a newer read un-stales it.
  const [expired, setExpired] = useState<number | null>(null);
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);
  const failures = useRef(0);
  const hasData = useRef(false);
  // Sources already reported in this mount (a page view).
  const reported = useRef(new Set<LiveSource>());
  const [kick, setKick] = useState(0);

  // On-screen + tab-visible gate. No element yet means off-screen.
  useEffect(() => {
    const el = ref.current;
    let onScreen = !!el && !("IntersectionObserver" in window);
    const update = () => setVisible(onScreen && document.visibilityState === "visible");
    const io =
      el && "IntersectionObserver" in window
        ? new IntersectionObserver(([e]) => {
            onScreen = e.isIntersecting;
            update();
          }, { rootMargin: "120px" })
        : null;
    if (io && el) io.observe(el);
    update();
    document.addEventListener("visibilitychange", update);
    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [ref]);

  useEffect(() => {
    const on = () => setOnline(navigator.onLine);
    on();
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", on);
    };
  }, []);

  // Poll loop.
  useEffect(() => {
    if (!visible || !online) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const run = async () => {
      // Only surface "updating" for slow reads; a routine 200 ms poll
      // shouldn't make the status flicker.
      const slow = setTimeout(() => !cancelled && setInFlight(true), 1500);
      try {
        const d = await fetcherRef.current();
        if (cancelled) return;
        setData(d);
        setUpdatedAt(Date.now());
        setError(null);
        hasData.current = true;
        failures.current = 0;
      } catch (e) {
        if (cancelled) return;
        failures.current += 1;
        setError(e instanceof Error ? e.message : "Request failed");
        // Nothing to show and still online: the widget now reads "error".
        if (!hasData.current && navigator.onLine) report(reported.current, (e as { source?: LiveSource }).source ?? "arbitrum-rpc");
      } finally {
        clearTimeout(slow);
        if (!cancelled) {
          setInFlight(false);
          const wait = failures.current ? Math.min(interval * 2 ** failures.current, 60000) : interval;
          timer = setTimeout(run, wait);
        }
      }
    };
    run();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [visible, online, interval, kick]);

  // Staleness: one timer for the moment this reading turns stale, only
  // while visible (off-screen the state is "paused" anyway).
  useEffect(() => {
    if (!visible || updatedAt === null) return;
    const t = setTimeout(() => setExpired(updatedAt), Math.max(0, updatedAt + staleAfter - Date.now()));
    return () => clearTimeout(t);
  }, [visible, updatedAt, staleAfter]);

  const retry = useCallback(() => {
    failures.current = 0;
    setKick((k) => k + 1);
  }, []);

  let state: LiveState;
  if (!online) state = "offline";
  else if (data === null) state = error ? "error" : "loading";
  else if (!visible) state = "paused";
  else if (updatedAt !== null && expired === updatedAt) state = "delayed";
  else if (inFlight) state = "updating";
  else state = "live";

  return { data, state, updatedAt, error, retry };
}

/** "8s ago", "3 min ago". */
export function ago(ms: number, now = Date.now()) {
  const s = Math.max(0, Math.round((now - ms) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return h < 48 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
}
