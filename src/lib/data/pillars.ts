export type Pillar = {
  id:
    | "non-custodial"
    | "upgradable"
    | "reputation"
    | "audited"
    | "dao"
    | "open-source";
  label: string;
  spec: string;
  description: string;
  href?: string;
  /**
   * Set when the property isn't live yet: a short badge label in the
   * Badge vocabulary, e.g. "Planned · 2027". Its description is written in
   * the future tense.
   */
  planned?: string;
};

export const pillars: Pillar[] = [
  {
    id: "non-custodial",
    label: "Non-custodial by design",
    spec: "Web3Auth · ERC-4337",
    description:
      "Every Garden lives at your address. Sign in with Google via Web3Auth's MPC, no seed phrase, no custody, no admin key.",
    href: "https://docs.blokcapital.io/en/concepts/blok-c-overview",
  },
  {
    id: "upgradable",
    label: "Upgradable without migration",
    spec: "EIP-2535 Diamond",
    description:
      "Add facets, swap strategies, integrate new DEXs, all without forcing users into new contracts. Storage stays put.",
    href: "https://docs.blokcapital.io/en/smart-contracts/introduction",
  },
  {
    id: "reputation",
    label: "On-chain reputation",
    spec: "ERC-5484 soulbound",
    description:
      "Gardeners arrive in 2027. Each one's track record will be written to a non-transferable badge in their wallet, verifiable from any dapp and owned by no platform.",
    href: "https://docs.blokcapital.io/en/builders/blok-capital-v1",
    // 2027: protocolStatus.gardeners, facts.ts ("Planned: manager (Gardener) track
    // records will be written to … ERC-5484 soulbound badges"), roadmap "Introduction
    // of Gardeners" (Q2 '27). Year only, so the roadmap stays the one place for quarters.
    planned: "Planned · 2027",
  },
  {
    id: "audited",
    label: "Audited in the open",
    spec: "CredShields · SolidityScan · Octane",
    description: "CredShields audited the Garden contracts: 26 findings, none critical, all fixed. The newer index code isn't covered yet, and the report says exactly what was.",
    href: "/security",
  },
  {
    id: "dao",
    label: "DAO-governed",
    spec: "Aragon OSx",
    description:
      "Every protocol change, fees, indices, new facets, routes through on-chain Aragon votes. Core DAO members vote today; $BLOKC holders after launch.",
    href: "/governance",
  },
  {
    id: "open-source",
    label: "Open-source",
    spec: "GitHub · Foundry",
    description:
      "Read the contracts and their test suite. Every Garden, index and vote is on Arbitrum for anyone to verify.",
    href: "https://github.com/BLOKCapital",
  },
];
