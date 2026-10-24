import { sources } from "@/lib/data/indices";
import { links } from "@/lib/data/socials";

/**
 * Who can do what (INS-05): actors × actions.
 *
 * A cell is filled only with a claim the site already makes, linked to the
 * source the site already cites for it. Everything else stays empty ("—",
 * "not stated yet"); fill it only after checking the contracts. No delays or
 * timelocks: none are published (D-25).
 */

export type Source = { label: string; href: string };

const src = {
  custody: { label: "Non-custodial design, in the docs", href: links.docsOverview },
  architecture: { label: "Architecture docs", href: links.docsArchitecture },
  facets: { label: "Facets, in the docs", href: links.docsContracts },
  aragon: { label: "The DAO on Aragon", href: links.aragon },
  rebalancer: { label: "Rebalancer.sol", href: sources.rebalancer },
  yieldGardens: { label: "Yield Gardens", href: "/protocol#yield" },
  gardeners: { label: "Gardeners", href: "/protocol#gardeners" },
  fees: { label: "Fees & risks", href: "/protocol#fees" },
  governance: { label: "How the DAO decides", href: "/governance#process" },
} satisfies Record<string, Source>;

export type ActionId = "withdraw" | "trade" | "facets" | "pause" | "fees";

export const actions: { id: ActionId; label: string }[] = [
  { id: "withdraw", label: "Move funds out" },
  { id: "trade", label: "Trade or rebalance" },
  { id: "facets", label: "Install or upgrade facets" },
  { id: "pause", label: "Pause new Gardens" },
  { id: "fees", label: "Change fees" },
];

/** yes / no, or a qualified answer in words. */
export type Answer = "yes" | "no" | "limited";
export type Cell = { answer: Answer; text: string; source: Source };

export type Actor = {
  id: string;
  name: string;
  /** Who this is, in words already on the site. */
  note: string;
  cells: Partial<Record<ActionId, Cell>>;
};

export const actors: Actor[] = [
  {
    id: "you",
    name: "You",
    note: "The Garden's owner, signed in with Google or your own wallet.",
    cells: {
      withdraw: { answer: "yes", text: "Yes, and only you", source: src.custody },
      trade: { answer: "yes", text: "Yes, in a Yield Garden", source: src.yieldGardens },
      facets: { answer: "limited", text: "DAO-approved ones only", source: src.facets },
    },
  },
  {
    id: "rebalancer",
    name: "Index rebalancer",
    note: "One pooled trade for every Garden on an index. Anyone can trigger it, once a day.",
    cells: {
      // TODO(owner): CRO-08a. Whether a pooled rebalance moves tokens out of
      // a Garden during the batch is the open FAQ question; leave it empty
      // until you answer it.
      trade: { answer: "limited", text: "Rebalance only: past 2% drift, at most daily, ≤ 0.5% value loss", source: src.rebalancer },
    },
  },
  {
    id: "gardener",
    name: "Gardener (2027)",
    note: "A manager you authorise from your Garden, and revoke the same way.",
    cells: {
      withdraw: { answer: "no", text: "No", source: src.custody },
      trade: { answer: "limited", text: "Within the permissions you grant", source: src.gardeners },
      fees: { answer: "limited", text: "Its own fee, under DAO-set ceilings", source: src.fees },
    },
  },
  {
    id: "dao",
    name: "DAO vote",
    note: "On-chain through Aragon OSx. Until the token launches, only the core members listed on Aragon vote.",
    cells: {
      facets: { answer: "yes", text: "Yes: approves them in the Facet Registry", source: src.architecture },
      fees: { answer: "yes", text: "Yes: fee parameters are voted on", source: src.aragon },
    },
  },
  {
    id: "council",
    name: "Security council",
    note: "Tracked through ENS domains, not a list of hot wallets. Authorises protocol state changes.",
    cells: {
      pause: { answer: "yes", text: "Yes: the Garden Factory then refuses new Gardens", source: src.architecture },
    },
  },
  {
    id: "team",
    name: "BLOK Capital team",
    note: "No admin key over your funds, and no back-room upgrades.",
    cells: {
      withdraw: { answer: "no", text: "No: it doesn't hold your funds", source: src.custody },
      facets: { answer: "limited", text: "Only through a DAO vote", source: src.governance },
      fees: { answer: "limited", text: "Only through a DAO vote", source: src.fees },
    },
  },
];

/** The headline control, shown above the matrix. */
export const custody = {
  label: "Your funds",
  by: "Your keys",
  body: "Each Garden is a smart-contract wallet at your own address. You hold the keys; BLOK Capital doesn't hold your funds.",
  source: src.custody,
};

/**
 * The same five actions as moments a Garden guards (/security#controls,
 * between the custody card and the matrix): who can act, and the rule that
 * limits it. Each line restates a cell above or a check in the rules demo
 * (lib/data/scenarios.ts); `watch` names the demo scenarios that show the
 * rule running. Add a claim here only once a cell or a scenario makes it.
 */
export type Moment = { id: ActionId; label: string; who: string; rule: string; watch: string[] };

export const moments: Moment[] = [
  {
    id: "withdraw",
    label: "Funds move out",
    who: "Only you",
    rule: "Only the owner's signature moves funds out: not a strategy, a Gardener or the team.",
    watch: ["withdraw"],
  },
  {
    id: "trade",
    label: "A trade runs",
    who: "The index rebalancer, or you in a Yield Garden",
    rule: "Index trades only past 2% drift, at most daily, at ≤ 0.5% value loss. A price over 10% off its average is ignored.",
    watch: ["rebalance", "slippage", "price"],
  },
  {
    id: "facets",
    label: "Code changes",
    who: "Only code the DAO approved",
    rule: "A facet installs only if its code hash is in the DAO's Facet Registry. Direct diamondCut() is disabled.",
    watch: ["upgrade"],
  },
  {
    id: "pause",
    label: "New Gardens pause",
    who: "The security council",
    rule: "While paused, the Garden Factory refuses new Gardens.",
    watch: [],
  },
  {
    id: "fees",
    label: "Fees change",
    who: "A DAO vote",
    rule: "Fee parameters are voted on. A Gardener (2027) sets its own fee, under DAO-set ceilings.",
    watch: [],
  },
];
