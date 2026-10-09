import { sources } from "@/lib/data/indices";
import { links } from "@/lib/data/socials";

/**
 * Scenarios for the rules demo (components/guard/RulesDemo.tsx). Each one
 * walks a situation through checks the protocol really enforces, as stated
 * in the docs and contracts linked from `source`: the 2% drift trigger, the
 * 0.5% value-loss cap, the ±10% oracle sanity band, DAO-approved facets
 * only, and owner-only withdrawals. The figures, addresses and outcomes of
 * any single run are illustrative, and the demo says so.
 */

export type Verdict = "allow" | "block" | "hold";

export type TraceLine = {
  kind: "call" | "check";
  text: string;
  result: string;
  /** pass: a check in the Garden's favour · fail: a check that stops it · warn: suspicious · info: neutral. */
  tone: "pass" | "fail" | "warn" | "info";
};

export type Scenario = {
  id: string;
  label: string;
  caption: string;
  lines: TraceLine[];
  verdict: { kind: Verdict; text: string };
  source: { label: string; href: string };
};

export const scenarios: Scenario[] = [
  {
    id: "rebalance",
    label: "Index rebalance",
    caption: "BLOKC5 drifts off its target weights.",
    lines: [
      { kind: "call", text: "Rebalancer runs for BLOKC5", result: "anyone can trigger", tone: "info" },
      { kind: "check", text: "Chainlink feeds: LINK, UNI, AAVE, ARB, PENDLE", result: "fresh", tone: "pass" },
      { kind: "check", text: "Every price within ±10% of its average", result: "ok", tone: "pass" },
      { kind: "check", text: "AAVE 2.6% over target (trigger: 2%)", result: "trade", tone: "pass" },
      { kind: "check", text: "UNI 0.7% under target (trigger: 2%)", result: "skip", tone: "info" },
      { kind: "check", text: "Best quote: Uniswap V3 vs Camelot V3", result: "routed", tone: "pass" },
      { kind: "check", text: "Value loss 0.21% (cap: 0.5%)", result: "within cap", tone: "pass" },
    ],
    verdict: { kind: "allow", text: "One pooled trade brings every BLOKC5 Garden back to target." },
    source: { label: "Rebalancer.sol", href: sources.rebalancer },
  },
  {
    id: "withdraw",
    label: "Strategy moves funds out",
    caption: "A strategy tries to send USDC elsewhere.",
    lines: [
      { kind: "call", text: "Strategy sends 5,000 USDC to 0x3f9c…a71c", result: "transfer out", tone: "warn" },
      { kind: "check", text: "Signed by the Garden's owner?", result: "no", tone: "fail" },
      { kind: "check", text: "Strategies may only rebalance inside the Garden", result: "outside scope", tone: "fail" },
    ],
    verdict: { kind: "block", text: "Funds stay put. Only the owner's signature moves them out." },
    source: { label: "Non-custodial design, in the docs", href: links.docsOverview },
  },
  {
    id: "upgrade",
    label: "Unapproved upgrade",
    caption: "Someone installs code the DAO never voted on.",
    lines: [
      { kind: "call", text: "Install facet 0x7a2e…e91b in a Garden", result: "upgrade", tone: "warn" },
      { kind: "check", text: "Direct diamondCut()", result: "disabled", tone: "info" },
      { kind: "check", text: "Code hash in the DAO's Facet Registry?", result: "not found", tone: "fail" },
    ],
    verdict: { kind: "block", text: "Only facets approved by a DAO vote can be installed." },
    source: { label: "Facets and upgrades, in the docs", href: links.docsContracts },
  },
  {
    id: "price",
    label: "Bad oracle price",
    caption: "A feed reports a price far from its average.",
    lines: [
      { kind: "call", text: "Registry reads ARB / USD from Chainlink", result: "price read", tone: "info" },
      { kind: "check", text: "Updated within the feed's heartbeat", result: "fresh", tone: "pass" },
      { kind: "check", text: "13.8% from its moving average (band: ±10%)", result: "distrusted", tone: "warn" },
    ],
    verdict: { kind: "hold", text: "The outlier is ignored; the last good price is used instead." },
    source: { label: "IndexComponentRegistry.sol", href: sources.componentRegistry },
  },
  {
    id: "slippage",
    label: "Too much slippage",
    caption: "The best route would lose too much value.",
    lines: [
      { kind: "call", text: "Rebalancer runs for BLOKC10", result: "anyone can trigger", tone: "info" },
      { kind: "check", text: "GRT 3.1% over target (trigger: 2%)", result: "trade", tone: "pass" },
      { kind: "check", text: "Best quote: Uniswap V3 vs Camelot V3", result: "routed", tone: "pass" },
      { kind: "check", text: "Value loss 0.74% (cap: 0.5%)", result: "over cap", tone: "fail" },
    ],
    verdict: { kind: "block", text: "The trade reverts, so nothing moves." },
    source: { label: "Rebalancer.sol", href: sources.rebalancer },
  },
];
