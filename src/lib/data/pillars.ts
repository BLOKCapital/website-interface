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
};

export const pillars: Pillar[] = [
  {
    id: "non-custodial",
    label: "Non-custodial by design",
    spec: "Web3Auth · ERC-4337",
    description:
      "Every Garden lives at your address. Sign in with Google via Web3Auth's MPC, no seed phrase, no custody, no admin key.",
    href: "https://docs.blokcapital.io/educ/blok-c-overview",
  },
  {
    id: "upgradable",
    label: "Upgradable without migration",
    spec: "EIP-2535 Diamond",
    description:
      "Add facets, swap strategies, integrate new DEXs, all without forcing users into new contracts. Storage stays put.",
    href: "https://docs.blokcapital.io/v1/introduction",
  },
  {
    id: "reputation",
    label: "On-chain reputation",
    spec: "ERC-5484 soulbound",
    description:
      "A Gardener's track record writes itself to a non-transferable badge in their wallet, verifiable from any dapp, owned by no platform.",
    href: "https://docs.blokcapital.io/builders/blok-capital-v1",
  },
  {
    id: "audited",
    label: "Audited in the open",
    spec: "CredShields · SolidityScan · Octane",
    description: "Audited by CredShields, with continuous automated review by SolidityScan and Octane. Every facet ships with receipts.",
    href: "/features#audits",
  },
  {
    id: "dao",
    label: "DAO-governed",
    spec: "Aragon OSX",
    description:
      "Every protocol change, fees, indices, new facets, routes through on-chain Aragon votes. BLOKC holders decide.",
    href: "/about#dao",
  },
  {
    id: "open-source",
    label: "Open-source",
    spec: "GitHub · The Graph",
    description:
      "Read the contracts. Run the front-end yourself. Data comes from a public subgraph, no centralized backend to trust.",
    href: "https://github.com/BLOKCapital",
  },
];
