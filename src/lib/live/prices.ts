"use client";

import { useRef, type RefObject } from "react";
import { useLive } from "./useLive";
import { readFeeds, type FeedReading } from "./feeds";
import { components, type ComponentSymbol } from "@/lib/data/indices";

const ALL = Object.keys(components) as ComponentSymbol[];

/** Live Chainlink prices for every index component, one batched read. */
export function useComponentPrices(ref?: RefObject<Element | null>) {
  const fallback = useRef<Element | null>(null);
  return useLive<Record<string, FeedReading>>(() => readFeeds(ALL), { interval: 30000, staleAfter: 120000, ref: ref ?? fallback });
}

export function formatUsd(n: number) {
  const digits = n >= 1000 ? 0 : n >= 1 ? 2 : 4;
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits });
}
