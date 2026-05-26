export type Milestone = {
  id: string;
  label: string;
  quarter: string;
  status: "done" | "current" | "future";
  pin: "yellow" | "green" | "red" | "blue";
  description: string;
};

export const milestones: Milestone[] = [
  // 2023 — The Seed
  { id: "angel", label: "Angel Round", quarter: "Q3 '23", status: "done", pin: "yellow",
    description: "Initial round closed. Built the team and the thesis." },

  // 2024 — The Soil
  { id: "private", label: "Private Sale", quarter: "Q2 '24", status: "done", pin: "green",
    description: "Strategic partners on board. Treasury established." },

  // 2025 — Building the Garden
  { id: "build", label: "Building the Garden", quarter: "Q1 '25", status: "done", pin: "blue",
    description: "Diamond proxy architecture, soulbound rep contracts shipped to testnet." },
  { id: "dexs", label: "Multiple DEXs", quarter: "Q3 '25", status: "done", pin: "red",
    description: "Liquidity expansion across Camelot, Uniswap, and partner venues." },
  { id: "abstraction", label: "Full Chain Abstraction", quarter: "Q4 '25", status: "done", pin: "blue",
    description: "Smart-wallet UX via ERC-4337 + EIP-7702. Pay gas in any token, sign once for batched actions." },

  // 2026 — Opening the Gates (indices launch, DAO live, gardeners open)
  { id: "first-launch", label: "First Public Launch", quarter: "Q1 '26", status: "current", pin: "green",
    description: "Mainnet open to everyone. First 100 Gardens planted on Arbitrum." },
  { id: "indices", label: "Curated Index Gardens", quarter: "Q2 '26", status: "future", pin: "blue",
    description: "Three curated indices go live, BLOKC2, BLOKC5, and BLOKC10. Auto-rebalancing, on-chain receipts." },
  { id: "dao-vote", label: "DAO Voting Live", quarter: "Q3 '26", status: "future", pin: "yellow",
    description: "Aragon OSX module activated. BLOKC holders steer every protocol change, fees, indices, new facets." },
  { id: "index-expansion", label: "Index Expansion", quarter: "Q3 '26", status: "future", pin: "green",
    description: "Sector indices added, RWAs, gaming, AI/compute, perpetuals. Each one a community-curated basket." },
  { id: "staking", label: "Staking & Fee Switch", quarter: "Q4 '26", status: "future", pin: "red",
    description: "Stake BLOKC to earn protocol fees. The fee switch flips by DAO vote." },

  // 2027 — The Bloom
  { id: "ido", label: "IDO", quarter: "Q1 '27", status: "future", pin: "yellow",
    description: "Initial DEX offering. DAO treasury opens." },
  { id: "gardeners", label: "Introduction of Gardeners", quarter: "Q2 '27", status: "future", pin: "green",
    description: "Verified manager onboarding live. ERC-5484 soulbound reputation badges activated." },
  { id: "ai-gardener", label: "AI Gardener", quarter: "Q3 '27", status: "future", pin: "yellow",
    description: "AI-assisted strategy authoring. A new path for non-expert managers to publish indices and earn reputation." },
  { id: "cross-chain", label: "Cross-chain Gardens", quarter: "Q4 '27", status: "future", pin: "red",
    description: "Gardens span Arbitrum, Base, and beyond. Single-wallet UX, multi-chain yield, one reputation record." },
  { id: "full-bloom", label: "Full Bloom", quarter: "Q4 '27", status: "future", pin: "green",
    description: "All features mature: AI, indices, DAO, staking. The garden tends itself; the gardeners tend the protocol." },
];
