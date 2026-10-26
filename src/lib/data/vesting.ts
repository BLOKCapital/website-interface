/**
 * $BLOKC vesting, per allocation share. DESIGN PREVIEW ONLY: the shares are
 * the real allocation (/token), but every term here (TGE unlock, cliff,
 * duration, revocability) is an EXAMPLE. The real terms are in the
 * whitepaper and must replace these before anything ships (honest data,
 * DESIGN_SYSTEM §1.4).
 *
 * Months count from the TGE, because the TGE has a quarter, not a date.
 */
export type Vesting = {
  label: string;
  /** Share of the 10B supply, in percent. */
  pct: number;
  /** Fraction of this share unlocked at the TGE, 0–1. */
  tge: number;
  /** Months after the TGE before linear release starts. */
  cliff: number;
  /** Months of linear release after the cliff (0: nothing left after the TGE). */
  duration: number;
  revocable: boolean;
};

export const VESTING_IS_EXAMPLE = true;

/** The horizon the chart draws: the longest schedule's end. */
export const VESTING_MONTHS = 48;

export const vesting: Vesting[] = [
  { label: "IDO", pct: 20, tge: 0.25, cliff: 0, duration: 6, revocable: false },
  { label: "Product development", pct: 15, tge: 0, cliff: 6, duration: 36, revocable: false },
  { label: "Team", pct: 12.5, tge: 0, cliff: 12, duration: 36, revocable: false },
  { label: "Treasury", pct: 12.5, tge: 0.1, cliff: 0, duration: 48, revocable: false },
  { label: "Marketing & PR", pct: 10, tge: 0.1, cliff: 0, duration: 24, revocable: false },
  { label: "Liquidity", pct: 10, tge: 1, cliff: 0, duration: 0, revocable: false },
  { label: "Seed", pct: 5, tge: 0, cliff: 6, duration: 18, revocable: false },
  { label: "Influencers", pct: 3, tge: 0, cliff: 3, duration: 12, revocable: true },
  { label: "Bug bounty", pct: 3, tge: 0, cliff: 0, duration: 36, revocable: false },
  { label: "Presale", pct: 3, tge: 0.1, cliff: 3, duration: 12, revocable: false },
  { label: "Advisors", pct: 3, tge: 0, cliff: 12, duration: 24, revocable: true },
  { label: "Community", pct: 2, tge: 0.2, cliff: 0, duration: 24, revocable: false },
  { label: "Airdrop", pct: 1, tge: 1, cliff: 0, duration: 0, revocable: false },
];

/** Fraction of one share unlocked `month` months after the TGE, 0–1. */
export function unlockedFraction(v: Vesting, month: number) {
  if (month < v.cliff || v.duration === 0) return v.tge;
  const t = Math.min(1, (month - v.cliff) / v.duration);
  return v.tge + (1 - v.tge) * t;
}

/** Percent of the whole supply unlocked at `month`, across every share. */
export function unlockedOfSupply(items: Vesting[], month: number) {
  return items.reduce((sum, v) => sum + v.pct * unlockedFraction(v, month), 0);
}

/** The month a share is fully unlocked (0 when it all unlocks at the TGE). */
export const fullyUnlockedAt = (v: Vesting) => (v.duration === 0 ? 0 : v.cliff + v.duration);

export const fmtPct = (n: number) => `${n.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
