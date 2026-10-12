"use client";

import { type RefObject } from "react";
import { preconnect } from "react-dom";
import { useLive, type Live, type LiveState } from "./useLive";
import { readFeeds, type FeedReading } from "./feeds";
import { RPC_ORIGIN } from "./rpc";
import { components, type ComponentSymbol } from "@/lib/data/indices";

const ALL = Object.keys(components) as ComponentSymbol[];

export type ComponentPrices = Record<string, FeedReading>;

/**
 * Live Chainlink prices for every index component, one batched read. A feed
 * that fails on its own is simply missing from `data` (see `feedState`).
 *
 * `ref` is the widget's root: polling runs only while it's on screen.
 *
 * The explorer sits near the top of /indices and /indices/[id], so the RPC
 * origin is preconnected wherever this hook renders: React hoists the hint
 * into <head> in the static HTML, saving a round trip or two on the first
 * read (PERF-13).
 */
export function useComponentPrices(ref: RefObject<Element | null>) {
  preconnect(RPC_ORIGIN, { crossOrigin: "anonymous" });
  return useLive<ComponentPrices>(() => readFeeds(ALL), { interval: 30000, staleAfter: 120000, ref });
}

/**
 * One row's state. After a successful read, a symbol missing from the data
 * is a feed that failed on its own: that row reads "error" (LivePrice shows
 * "—") while the others stay live (UX-10). Otherwise it's the read's state.
 */
export function feedState(prices: Live<ComponentPrices>, symbol: string): LiveState {
  return prices.data && !prices.data[symbol] ? "error" : prices.state;
}

export function formatUsd(n: number) {
  const digits = n >= 1000 ? 0 : n >= 1 ? 2 : 4;
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits });
}
