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
      "Every Garden lives at your own address. Sign in with Google, no seed phrase, and only you can move your funds.",
    href: "https://docs.blokcapital.io/en/concepts/blok-c-overview",
  },
  {
    id: "upgradable",
    label: "Upgradable without migration",
    spec: "EIP-2535 Diamond",
    description:
      "New features and strategies plug into the Garden you already have, after a DAO vote. You never move to a new wallet.",
    href: "https://docs.blokcapital.io/en/smart-contracts/introduction",
  },
  {
    id: "reputation",
    label: "On-chain reputation",
    spec: "ERC-5484 soulbound",
    description:
      "Gardeners arrive in 2027. Each one's track record will be kept on-chain, on a badge that can't be transferred, for anyone to check.",
    href: "https://docs.blokcapital.io/en/builders/blok-capital-v1",
    // 2027: protocolStatus.gardeners, facts.ts ("Planned: manager (Gardener) track
    // records will be written to … ERC-5484 soulbound badges"), roadmap "Introduction
    // of Gardeners" (Q2 '27). Year only, so the roadmap stays the one place for quarters.
    planned: "Planned · 2027",
  },
  {
    id: "audited",
    label: "Audits in the open",
    spec: "Independent audits",
    description: "New independent audits are under way. Each report will be published in the docs, so anyone can read it.",
    href: "/security#audits",
  },
  {
    id: "dao",
    label: "DAO-governed",
    spec: "Aragon OSx",
    description:
      "Fees, indices and new features change only through on-chain votes. Core members vote today; $BLOKC holders after launch.",
    href: "/governance",
  },
  {
    id: "open-source",
    label: "Open-source",
    spec: "GitHub · Foundry",
    description:
      "The contracts and their tests are public, and every Garden, index and vote is on Arbitrum for anyone to check.",
    href: "https://github.com/BLOKCapital",
  },
];
